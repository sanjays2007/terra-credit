
import type { WaterQuality, Pond } from "./types";

// In a real application, these would be your API endpoints.
// We are using mock data here for demonstration.
const MOCK_POND_DATA: Pond[] = [
    { id: 'P001', name: 'Pond A', fishSpecies: 'Tilapia', status: 'Optimal', temperature: 28, oxygen: 6.5, ph: 7.2 },
    { id: 'P002', name: 'Pond B', fishSpecies: 'Catla', status: 'Warning', temperature: 30, oxygen: 5.2, ph: 6.8 },
    { id: 'P003', name: 'Pond C', fishSpecies: 'Rohu', status: 'Alert', temperature: 31, oxygen: 4.5, ph: 7.9 },
    { id: 'P004', name: 'Pond D', fishSpecies: 'Tilapia', status: 'Optimal', temperature: 28.5, oxygen: 7.0, ph: 7.5 },
];

const MOCK_WATER_QUALITY_DATA: WaterQuality[] = [
    { date: "Jul 1", ph: 7.2, oxygen: 6.8, temperature: 26, turbidity: 12 },
    { date: "Jul 2", ph: 7.1, oxygen: 6.9, temperature: 26.5, turbidity: 11 },
    { date: "Jul 3", ph: 7.3, oxygen: 7.0, temperature: 27, turbidity: 10 },
    { date: "Jul 4", ph: 7.2, oxygen: 6.8, temperature: 27.2, turbidity: 13 },
    { date: "Jul 5", ph: 7.4, oxygen: 7.1, temperature: 26.8, turbidity: 9 },
    { date: "Jul 6", ph: 7.3, oxygen: 7.2, temperature: 26.5, turbidity: 10 },
    { date: "Jul 7", ph: 7.2, oxygen: 6.9, temperature: 27.5, turbidity: 12 },
];


async function mockApiCall<T>(data: T): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return data;
}

/**
 * Fetches the list of all aquaculture ponds.
 * In a real app, this would fetch from an API endpoint.
 * Example: `await fetch('https://api.example.com/ponds', { headers: ... });`
 */
export async function getPonds(): Promise<Pond[]> {
    console.log("Fetching pond data from API...");
    // This is where you would use the API key
    const apiKey = process.env.AQUACULTURE_API_KEY;
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        console.warn("API Key not found or is a placeholder. Using mock data.");
        return mockApiCall(MOCK_POND_DATA);
    }
    // const response = await fetch('https://api.example.com/aquaculture/ponds', {
    //     headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // if (!response.ok) {
    //     throw new Error('Failed to fetch pond data');
    // }
    // return response.json();

    return mockApiCall(MOCK_POND_DATA);
}

/**
 * Fetches the 7-day water quality history.
 * In a real app, this would fetch from an API endpoint.
 * Example: `await fetch('https://api.example.com/water-quality/history', { headers: ... });`
 */
export async function getWaterQualityHistory(): Promise<WaterQuality[]> {
    console.log("Fetching water quality history from API...");
    const apiKey = process.env.AQUACULTURE_API_KEY;
     if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        console.warn("API Key not found or is a placeholder. Using mock data.");
        return mockApiCall(MOCK_WATER_QUALITY_DATA);
    }
    // const response = await fetch('https://api.example.com/aquaculture/water-quality-history', {
    //     headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // if (!response.ok) {
    //     throw new Error('Failed to fetch water quality history');
    // }
    // return response.json();
    return mockApiCall(MOCK_WATER_QUALITY_DATA);
}
