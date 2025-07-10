from fastapi import APIRouter , HTTPException
from pydantic import BaseModel
import requests
import os
import re

class GeminiRecommendationRequest(BaseModel):
    prompt: str

router = APIRouter( )

@router.post("/api/gemini-recommendations-esgScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt (should include esg_category_scores in the text), sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert ESG consultant. "
            f"Given the following ESG category scores, suggest actionable techniques to improve these scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give response in three different points, Environmental, Social, Governance. In these points, make subpoints which suggest improvements."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
    
   
class GeminiRecommendationRequest(BaseModel):
    prompt: str

@router.post("/api/gemini-recommendations-eScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt (should include esg_category_scores in the text), sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert ESG consultant. "
            f"Given the following Current Environmental score that supplier want to reach, suggest actionable techniques to improve scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
    

@router.post("/api/gemini-recommendations-sScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt (should include cost_efficiency_score in the text), sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert cost Efficiency score consultant. "
            f"Given the following Current cost_score  that supplier want to reach, suggest actionable techniques to improve scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
    

@router.post("/api/gemini-recommendations-gScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt (should include risk_score in the text), sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert risk consultant. "
            f"Given the following Current risk_score that supplier want to reach, suggest actionable techniques to improve scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
    

    
@router.post("/api/gemini-recommendations-cScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt, sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert reliability score consultant. "
            f"Given the following Current reliability_score that supplier want to reach, suggest actionable techniques to improve scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
    
@router.post("/api/gemini-recommendations-riScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt (should include esg_category_scores in the text), sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert ESG consultant. "
            f"Given the following Current Risk score that supplier want to reach, suggest actionable techniques to improve scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")

@router.post("/api/gemini-recommendations-reScore")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt (should include esg_category_scores in the text), sends to Gemini, and returns improvement suggestions as points.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert ESG consultant. "
            f"Given the following Current Reliability score that supplier want to reach, suggest actionable techniques to improve scores. "
            f"Respond as a concise list of improvement points, each as a separate bullet:\n\n. Response everything in normal text, no bold or italic test."
            f"Give only normal text with no bold words, no special characters."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
    

    
@router.post("/api/calculate-RemainingScores")
async def gemini_recommendations(request: GeminiRecommendationRequest):
    """
    Accepts a prompt, sends to Gemini, and returns required scores for a company for a paritcular year.
    """
    import re

    try:
        # Compose the prompt for Gemini
        full_prompt = (
            f"You are an expert Cost Efficiency score, Risk Score, Reliability Score teller out of 100 for a sustainable Procurement Optimizer Platform. "
            f"Given the following company name and year for a supplier, give me just the Cost Efficiency score, Risk Score, Reliability Score for that company for a particular year out of 100."
            f"Give only numerical scores with no explanation out of 100."
            f"{request.prompt}"
        )

        # Use Gemini 1.5 Flash API (as in your other endpoints)
        response = requests.post(
            url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            params={"key": os.getenv("GEMINI_API_KEY")},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"role": "user", "parts": [{"text": full_prompt}]}]
            }
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API failed: " + response.text)

        gemini_output = response.json()
        reply_content = gemini_output["candidates"][0]["content"]["parts"][0]["text"]

        # Split the response into points (handles bullets, numbers, or newlines)
        points = [
            p.strip("•- \n\r\t")
            for p in re.split(r"(?:\n|^)[•\-–\d.]+\s*", reply_content)
            if p.strip()
        ]

        return {"recommendations": points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini: {str(e)}")
 