import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PatientCreate {
  name: string;
  age?: number;
}

export interface AnalysisCreate {
  patient_name: string;
  patient_age?: number;
  selected_organs: string[];
  sensor_type: string;
  sensor_name?: string;
}

export interface OrganResult {
  organ: string;
  score: number;
  stress: number;
  note: string;
}

export interface Analysis {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age?: number;
  selected_organs: string[];
  overall_score: number;
  band: string;
  results: OrganResult[];
  sensor_type: string;
  sensor_name?: string;
  frequency: number;
  created_at: string;
}

export const apiService = {
  // Create patient
  createPatient: async (data: PatientCreate) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  // Get patients
  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  // Create analysis
  createAnalysis: async (data: AnalysisCreate): Promise<Analysis> => {
    const response = await api.post('/analysis', data);
    return response.data;
  },

  // Get analyses
  getAnalyses: async (limit: number = 50): Promise<Analysis[]> => {
    const response = await api.get('/analysis', { params: { limit } });
    return response.data;
  },

  // Get single analysis
  getAnalysis: async (id: string): Promise<Analysis> => {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  },
};

export default api;
