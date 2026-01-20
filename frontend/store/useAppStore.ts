import { create } from 'zustand';

interface Patient {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'child';
}

interface OrganResult {
  organ: string;
  score: number;
  stress: number;
  note: string;
}

interface Analysis {
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

interface AppState {
  // Patient info
  patient: Patient;
  setPatient: (patient: Patient) => void;

  // Selected organs
  selectedOrgans: string[];
  setSelectedOrgans: (organs: string[]) => void;

  // Sensor
  sensorType: 'BLE' | 'USB' | null;
  sensorName: string | null;
  setSensor: (type: 'BLE' | 'USB', name?: string) => void;

  // Current analysis
  currentAnalysis: Analysis | null;
  setCurrentAnalysis: (analysis: Analysis | null) => void;

  // System status
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;

  // Reset state
  reset: () => void;
}

const initialState = {
  patient: { name: '', age: undefined },
  selectedOrgans: [],
  sensorType: null,
  sensorName: null,
  currentAnalysis: null,
  isOnline: true,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setPatient: (patient) => set({ patient }),

  setSelectedOrgans: (selectedOrgans) => set({ selectedOrgans }),

  setSensor: (sensorType, sensorName) => set({ sensorType, sensorName }),

  setCurrentAnalysis: (currentAnalysis) => set({ currentAnalysis }),

  setIsOnline: (isOnline) => set({ isOnline }),

  reset: () => set(initialState),
}));
