import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from decouple import config 
import os 

async def import_news_data():
    # Read Excel file
    file_path = os.path.join(os.path.dirname(__file__), "news.xlsx")
    df = pd.read_excel(file_path)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(config("MONGO_URI"))
    
    collection = client.optimizer_db.news 
    
    # Group by Company Name and create news array for each
    grouped = df.groupby("company_name").apply(
        lambda x: x[["headline", "source", "link", "summary"]].to_dict('records')
    ).reset_index(name='news')
    
    # Convert to list of documents
    companies_data = grouped.to_dict('records')
    
    # Insert/update each company in MongoDB
    for company in companies_data:
        await collection.update_one(
            {"company_name": company["company_name"]},
            {"$set": {"news": company["news"]}},
            upsert=True
        )
    
    print(f"Successfully imported data for {len(companies_data)} companies")

# Run the async function
asyncio.run(import_news_data())