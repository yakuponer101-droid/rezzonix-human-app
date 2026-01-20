from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import random


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Organ list
ORGANS = [
    "Beyin", "Kalp", "Akciğer", "Karaciğer", "Böbrek", "Mide", 
    "Pankreas", "Bağırsak", "Tiroid", "Omurga", "Bağışıklık", "Dolaşım"
]

# Define Models
class Patient(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PatientCreate(BaseModel):
    name: str
    age: Optional[int] = None

class OrganResult(BaseModel):
    organ: str
    score: int  # 0-100
    stress: int  # 0-10
    note: str

class Analysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    patient_age: Optional[int] = None
    selected_organs: List[str]
    overall_score: int
    band: str  # "Dengeli", "Takip", "Yüksek takip"
    results: List[OrganResult]
    sensor_type: str  # "BLE" or "USB"
    sensor_name: Optional[str] = None
    frequency: int = 528  # Default frequency in Hz
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnalysisCreate(BaseModel):
    patient_name: str
    patient_age: Optional[int] = None
    selected_organs: List[str]
    sensor_type: str
    sensor_name: Optional[str] = None

def generate_analysis_results(patient_name: str, patient_age: Optional[int], 
                              selected_organs: List[str], sensor_type: str) -> dict:
    """Generate simulated analysis results"""
    # Use deterministic seed for consistency
    seed = f"{patient_name}|{patient_age}|{','.join(selected_organs)}|{datetime.now().date().isoformat()}"
    rnd = random.Random(seed)
    
    results = []
    for organ in selected_organs:
        # Score: 0-100 (higher = better balance)
        score = int(rnd.gauss(78, 10))
        score = max(35, min(98, score))
        
        # Stress level: 0-10 (higher = more stress)
        stress = int(round((100 - score) / 10))
        stress = max(0, min(10, stress))
        
        # Generate note based on stress level
        if stress <= 3:
            note = "Destekleyici gözlem: denge takibi önerilir."
        elif stress <= 6:
            note = "Destekleyici gözlem: yaşam tarzı/uyku/su dengesi izlenebilir."
        else:
            note = "Destekleyici gözlem: profesyonel değerlendirme ile birlikte takip önerilir."
        
        results.append(OrganResult(
            organ=organ,
            score=score,
            stress=stress,
            note=note
        ))
    
    # Calculate overall score
    overall = int(sum(r.score for r in results) / max(1, len(results)))
    
    # Determine band
    if overall >= 80:
        band = "Dengeli"
    elif overall >= 70:
        band = "Takip"
    else:
        band = "Yüksek takip"
    
    # Sort by stress level (descending)
    results.sort(key=lambda x: x.stress, reverse=True)
    
    return {
        "overall_score": overall,
        "band": band,
        "results": results
    }

# Routes
@api_router.get("/")
async def root():
    return {"message": "RezzoniX Analyzer API", "version": "1.0.0"}

# Patient endpoints
@api_router.post("/patients", response_model=Patient)
async def create_patient(input: PatientCreate):
    patient = Patient(**input.dict())
    await db.patients.insert_one(patient.dict())
    return patient

@api_router.get("/patients", response_model=List[Patient])
async def get_patients():
    patients = await db.patients.find().sort("created_at", -1).to_list(100)
    return [Patient(**p) for p in patients]

# Analysis endpoints
@api_router.post("/analysis", response_model=Analysis)
async def create_analysis(input: AnalysisCreate):
    # Generate analysis results
    analysis_data = generate_analysis_results(
        input.patient_name,
        input.patient_age,
        input.selected_organs,
        input.sensor_type
    )
    
    # Create analysis object
    analysis = Analysis(
        patient_id=str(uuid.uuid4()),  # In real app, would link to actual patient
        patient_name=input.patient_name,
        patient_age=input.patient_age,
        selected_organs=input.selected_organs,
        sensor_type=input.sensor_type,
        sensor_name=input.sensor_name,
        **analysis_data
    )
    
    await db.analyses.insert_one(analysis.dict())
    return analysis

@api_router.get("/analysis", response_model=List[Analysis])
async def get_analyses(limit: int = 50):
    analyses = await db.analyses.find().sort("created_at", -1).to_list(limit)
    return [Analysis(**a) for a in analyses]

@api_router.get("/analysis/{analysis_id}", response_model=Analysis)
async def get_analysis(analysis_id: str):
    analysis = await db.analyses.find_one({"id": analysis_id})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return Analysis(**analysis)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
