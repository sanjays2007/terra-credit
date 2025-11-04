# Traffic Signal Monitoring System

## Overview

The Traffic Signal Monitoring System is an AI-powered application that analyzes live camera feeds from traffic signals to optimize signal timing and detect violations. The system uses computer vision and machine learning to provide real-time insights into traffic patterns.

## Features

### 1. Real-Time Traffic Analysis
- **Pedestrian Detection**: Counts the number of people in the camera's field of view
- **2-Wheeler Detection**: Identifies and counts motorcycles, scooters, and bikes
- **4-Wheeler Detection**: Identifies and counts cars, trucks, buses, and other four-wheeled vehicles
- **Traffic Density Analysis**: Provides real-time assessment of overall traffic density

### 2. Traffic Violation Detection
The system automatically detects various types of traffic violations:
- **Red Light Violations**: Vehicles crossing intersections on red signals
- **Speed Limit Violations**: Vehicles exceeding designated speed limits
- **Wrong Lane Usage**: Vehicles in incorrect lanes
- **Helmet Violations**: Two-wheeler riders without helmets
- **Illegal Parking**: Vehicles parked in no-parking zones

Each violation is categorized by severity:
- **High**: Critical violations requiring immediate attention
- **Medium**: Moderate violations
- **Low**: Minor infractions

### 3. Adaptive Signal Timing
The system automatically recommends signal timing based on traffic density:
- **Low Traffic** (<10 vehicles): 45 seconds
- **Medium Traffic** (10-30 vehicles): 60 seconds
- **High Traffic** (30-50 vehicles): 75 seconds
- **Very High Traffic** (>50 vehicles): 90 seconds

### 4. Analytics Dashboard
- **Real-time Statistics**: Live counts of pedestrians, 2-wheelers, and 4-wheelers
- **Violation Tracking**: Historical record of detected violations
- **Density Visualization**: Visual representation of traffic density
- **Signal Timing Control**: Manual override and automated timing recommendations

## Technical Architecture

### Components

#### Frontend (`/src/app/traffic-monitoring/page.tsx`)
- React-based user interface with real-time updates
- Interactive dashboard showing live camera feed
- Statistical displays and analytics visualizations
- Control panel for starting/stopping analysis and adjusting signal timing

#### AI Flow (`/src/ai/flows/analyze-traffic.ts`)
- Genkit-based AI flow for traffic analysis
- Simulated traffic detection (ready for integration with computer vision models)
- Violation detection logic
- Traffic density calculation

#### Server Actions (`/src/app/traffic-monitoring/actions.ts`)
- Server-side handlers for AI flow invocation
- Error handling and data validation

### Data Flow

1. **Camera Feed Input**: Live video feed from traffic signal cameras
2. **AI Analysis**: Frame-by-frame analysis using computer vision models
3. **Data Processing**: Counting vehicles, pedestrians, and detecting violations
4. **Signal Optimization**: Calculating recommended signal timing based on traffic density
5. **Real-time Updates**: Pushing analysis results to the dashboard every 3 seconds

## Usage

### Starting Analysis

1. Navigate to the Traffic Monitoring page from the main dashboard
2. Click the "Start Analysis" button
3. The system will begin analyzing the camera feed in real-time
4. View live statistics on the dashboard

### Adjusting Signal Timing

1. Review the recommended signal timing shown in the control panel
2. Click "Apply Recommended Timing" to update the signal
3. The current timing will be adjusted based on AI recommendations

### Viewing Violations

1. Check the "Recent Violations" panel on the right side
2. Each violation shows:
   - Type of violation
   - Time of detection
   - Severity level
3. Violations are color-coded by severity

### Analyzing Traffic Patterns

1. Navigate to the "Traffic Analytics" section
2. Use the tabs to view:
   - **Summary**: Overall traffic statistics
   - **Density Analysis**: Detailed breakdown of pedestrian and vehicle density
   - **Configuration**: Signal timing rules and settings

## Integration Points

### For Real Camera Feed Integration

To integrate with actual camera feeds:

1. Replace the simulated camera feed component with a video stream component
2. Implement WebRTC or RTSP streaming for live video
3. Integrate with computer vision models (e.g., YOLO, TensorFlow Object Detection)
4. Update the AI flow to process actual video frames

### Example Integration Code

```typescript
// Uncomment in /src/app/traffic-monitoring/page.tsx
import { getTrafficAnalysis } from "./actions";

// Replace simulated data fetch with:
const analysis = await getTrafficAnalysis("camera-001");
if (analysis.success) {
  setTrafficData({
    people: analysis.data.people,
    twoWheelers: analysis.data.twoWheelers,
    fourWheelers: analysis.data.fourWheelers,
    violations: analysis.data.violations.length,
    recommendedTiming: analysis.data.recommendedSignalTiming,
    timestamp: new Date(analysis.data.timestamp),
  });
}
```

### Computer Vision Model Integration

For production deployment, integrate with:
- **Object Detection Models**: YOLO v8, Detectron2, or TensorFlow Object Detection API
- **Person Detection**: OpenPose, MediaPipe, or custom trained models
- **Vehicle Classification**: ResNet, EfficientNet for vehicle type classification
- **Violation Detection**: Custom trained models for specific traffic violations

## Configuration

### Signal Timing Rules

Default rules can be modified in the configuration:

```typescript
// Low traffic threshold
const LOW_TRAFFIC_THRESHOLD = 10;
const LOW_TRAFFIC_TIMING = 45;

// Medium traffic threshold
const MEDIUM_TRAFFIC_THRESHOLD = 30;
const MEDIUM_TRAFFIC_TIMING = 60;

// High traffic threshold
const HIGH_TRAFFIC_THRESHOLD = 50;
const HIGH_TRAFFIC_TIMING = 75;

// Very high traffic timing
const VERY_HIGH_TRAFFIC_TIMING = 90;
```

### Update Frequency

The analysis update frequency can be adjusted:

```typescript
// Current: 3000ms (3 seconds)
const UPDATE_INTERVAL = 3000;
```

## API Reference

### `analyzeTraffic(cameraId?: string)`

Analyzes traffic from a camera feed and returns detection results.

**Parameters:**
- `cameraId` (optional): Identifier for the specific camera

**Returns:**
```typescript
{
  people: number;
  twoWheelers: number;
  fourWheelers: number;
  violations: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  trafficDensity: 'low' | 'medium' | 'high' | 'very_high';
  recommendedSignalTiming: number;
  timestamp: string;
}
```

### `getTrafficAnalysis(cameraId?: string)`

Server action wrapper for the analyzeTraffic flow.

**Parameters:**
- `cameraId` (optional): Identifier for the specific camera

**Returns:**
```typescript
{
  success: boolean;
  data?: TrafficAnalysisData;
  error?: string;
}
```

## Future Enhancements

1. **Multi-Camera Support**: Monitor multiple intersections simultaneously
2. **Historical Analytics**: Store and analyze long-term traffic patterns
3. **Predictive Analysis**: Forecast traffic patterns based on historical data
4. **Integration with Traffic Control Systems**: Direct integration with signal control hardware
5. **Mobile App**: Remote monitoring and control capabilities
6. **Alert System**: Notifications for critical violations or unusual traffic patterns
7. **Video Recording**: Automatic recording of violations for evidence
8. **License Plate Recognition**: Identify specific vehicles involved in violations
9. **Weather Integration**: Adjust signal timing based on weather conditions
10. **Emergency Vehicle Priority**: Detect and prioritize emergency vehicles

## Performance Considerations

- **Real-time Processing**: Current simulation runs every 3 seconds; adjust based on hardware capabilities
- **Video Quality**: Higher resolution requires more processing power
- **Model Size**: Balance between accuracy and processing speed
- **Network Bandwidth**: Consider bandwidth requirements for live streaming
- **Storage**: Video recording and historical data storage requirements

## Security and Privacy

- Ensure compliance with local privacy laws regarding video surveillance
- Implement data encryption for video streams
- Access control for monitoring dashboard
- Anonymous data collection where possible
- Regular security audits

## Support

For issues or questions regarding the Traffic Signal Monitoring System, please refer to the main project documentation or contact the development team.
