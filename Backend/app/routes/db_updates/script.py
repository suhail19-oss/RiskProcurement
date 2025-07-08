import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config
import asyncio
import os

async def import_products():
    # File in same directory
    excel_path = os.path.join(os.path.dirname(__file__), "products.xlsx")
    
    # Read and transform data
    df = pd.read_excel(excel_path)
    products = [{
        "id": int(row['id']),
        "product": row['product'],
        "scores": {
            "Operational_Risk": row['Operational_Risk_score'],
            "Compliance_legal_risk": row['Compliance_legal_risk_score'],
            "Quality_Risk": row['Quality_Risk_Score'],
            "ESG_Risk": row['ESG_Risk_Score'],
            "GeoPolitical_Risk": row['GeoPolitical_Risk_Score'],
            "Logistics_Risk": row['Logistics_Risk_Score'],
            "Overall_Risk": row['Overall_Risk_Score']
        },
        "Product_Risk_Level": row['Product_Risk_Level']
    } for _, row in df.iterrows()]

    # MongoDB connection
    client = AsyncIOMotorClient(config("MONGO_URI"))
    try:
        # Insert with progress feedback
        collection = client.optimizer_db.products
        result = await collection.insert_many(products)
        print(f"✅ Successfully inserted {len(result.inserted_ids)} products")
        
        # Verify count
        count = await collection.count_documents({})
        print(f"📊 Total products in collection: {count}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("🚀 Starting product import...")
    asyncio.run(import_products())
    print("🏁 Import completed")