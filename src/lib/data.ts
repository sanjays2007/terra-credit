import type { Livestock, WaterQuality, Tree } from "./types";

export const initialLivestockData: Livestock[] = [
  {
    id: "L001",
    breed: "Gir",
    birthDate: "2021-04-12",
    healthStatus: "Healthy",
    lastCheckup: "2024-07-01",
    productionRate: "12L/day",
  },
  {
    id: "L002",
    breed: "Sahiwal",
    birthDate: "2020-08-20",
    healthStatus: "Healthy",
    lastCheckup: "2024-07-02",
    productionRate: "15L/day",
  },
  {
    id: "L003",
    breed: "Red Sindhi",
    birthDate: "2022-01-05",
    healthStatus: "Monitoring",
    lastCheckup: "2024-07-15",
    productionRate: "8L/day",
  },
  {
    id: "L004",
    breed: "Jersey",
    birthDate: "2019-11-30",
    healthStatus: "Healthy",
    lastCheckup: "2024-06-28",
    productionRate: "20L/day",
  },
  {
    id: "L005",
    breed: "Holstein Friesian",
    birthDate: "2023-03-18",
    healthStatus: "Sick",
    lastCheckup: "2024-07-18",
    productionRate: "5L/day",
  },
];

export const waterQualityData: WaterQuality[] = [
    { date: "Jul 1", ph: 7.2, oxygen: 6.8, temperature: 26, turbidity: 12 },
    { date: "Jul 2", ph: 7.1, oxygen: 6.9, temperature: 26.5, turbidity: 11 },
    { date: "Jul 3", ph: 7.3, oxygen: 7.0, temperature: 27, turbidity: 10 },
    { date: "Jul 4", ph: 7.2, oxygen: 6.8, temperature: 27.2, turbidity: 13 },
    { date: "Jul 5", ph: 7.4, oxygen: 7.1, temperature: 26.8, turbidity: 9 },
    { date: "Jul 6", ph: 7.3, oxygen: 7.2, temperature: 26.5, turbidity: 10 },
    { date: "Jul 7", ph: 7.2, oxygen: 6.9, temperature: 27.5, turbidity: 12 },
];

export const forestryData: Tree[] = [
    { id: "T001", species: "Teak", datePlanted: "2018-06-15", location: "Sector 1A", biomass: 250, carbonSeq: 460 },
    { id: "T002", species: "Eucalyptus", datePlanted: "2019-07-20", location: "Sector 2C", biomass: 180, carbonSeq: 330 },
    { id: "T003", species: "Mango", datePlanted: "2017-08-01", location: "Orchard A", biomass: 320, carbonSeq: 590 },
    { id: "T004", species: "Neem", datePlanted: "2020-09-10", location: "Boundary West", biomass: 120, carbonSeq: 220 },
    { id: "T005", species: "Bamboo", datePlanted: "2021-05-25", location: "Water Canal", biomass: 90, carbonSeq: 165 },
    { id: "T006", species: "Sandalwood", datePlanted: "2018-11-02", location: "Sector 3B", biomass: 150, carbonSeq: 275 },
];
