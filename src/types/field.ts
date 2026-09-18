// Field and Farm Types

export interface FieldInfo {
  id: string;
  name: string;
  farmId: string;
  cropType: string;
  stage: string;        // e.g. "Vegetative Growth", "Grain Filling", "Ripening"
  areaAcres: number;
  soilType: string;     // e.g. "Clay Loam", "Sandy Loam", "Black Cotton Soil"
  deviceId: string;
  healthScore: number;  // 0-100
  moistureThresholdMin: number;
  moistureThresholdMax: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface FarmInfo {
  id: string;
  name: string;
  location: string;
  ownerName: string;
  totalAcres: number;
  fieldCount: number;
  deviceCount: number;
}
