export type Livestock = {
    id: string;
    breed: string;
    birthDate: string;
    healthStatus: 'Healthy' | 'Sick' | 'Monitoring';
    lastCheckup: string;
    productionRate: string; // e.g., "15L/day" or "N/A"
  };
  
  export type WaterQuality = {
    date: string;
    ph: number;
    oxygen: number;
    temperature: number;
    turbidity: number;
  };
  
  export type Tree = {
    id: string;
    species: string;
    datePlanted: string;
    location: string; // e.g., "Sector 4B"
    biomass: number; // in kg
    carbonSeq: number; // in kg CO2e
  };
  
  export type Pond = {
    id: string;
    name: string;
    fishSpecies: string;
    status: 'Optimal' | 'Warning' | 'Alert';
    temperature: number;
    oxygen: number;
    ph: number;
  };
  