"use client";

import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Car,
  Bike,
  Users,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrafficData {
  people: number;
  twoWheelers: number;
  fourWheelers: number;
  violations: number;
  recommendedTiming: number;
  timestamp: Date;
}

interface ViolationData {
  id: string;
  type: string;
  time: string;
  severity: "low" | "medium" | "high";
}

export default function TrafficMonitoringPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trafficData, setTrafficData] = useState<TrafficData>({
    people: 0,
    twoWheelers: 0,
    fourWheelers: 0,
    violations: 0,
    recommendedTiming: 60,
    timestamp: new Date(),
  });
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [currentSignalTiming, setCurrentSignalTiming] = useState(60);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate traffic analysis
  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      // Simulate AI analysis with random data
      const people = Math.floor(Math.random() * 50);
      const twoWheelers = Math.floor(Math.random() * 30);
      const fourWheelers = Math.floor(Math.random() * 40);
      const totalVehicles = twoWheelers + fourWheelers;
      
      // Calculate recommended timing based on traffic density
      let recommendedTiming = 60;
      if (totalVehicles > 50) {
        recommendedTiming = 90;
      } else if (totalVehicles > 30) {
        recommendedTiming = 75;
      } else if (totalVehicles < 10) {
        recommendedTiming = 45;
      }

      // Random violation detection
      if (Math.random() > 0.7) {
        const violationTypes = [
          "Red Light Violation",
          "Speed Limit Exceeded",
          "Wrong Lane",
          "No Helmet",
        ];
        const newViolation: ViolationData = {
          id: Date.now().toString(),
          type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
          time: new Date().toLocaleTimeString(),
          severity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        };
        setViolations((prev) => [newViolation, ...prev].slice(0, 10));
      }

      setTrafficData({
        people,
        twoWheelers,
        fourWheelers,
        violations: violations.length,
        recommendedTiming,
        timestamp: new Date(),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnalyzing, violations.length]);

  const handleStartStop = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  const handleApplyTiming = () => {
    setCurrentSignalTiming(trafficData.recommendedTiming);
  };

  const totalTraffic = trafficData.people + trafficData.twoWheelers + trafficData.fourWheelers;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Traffic Signal Monitoring</h1>
          <p className="text-muted-foreground">
            AI-powered traffic analysis and signal optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartStop}
            variant={isAnalyzing ? "destructive" : "default"}
          >
            {isAnalyzing ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Stop Analysis
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Camera Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Live Camera Feed
          </CardTitle>
          <CardDescription>Traffic signal camera at Main Junction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Camera feed simulation</p>
              <p className="text-sm mt-2">
                {isAnalyzing ? "Analyzing traffic..." : "Click Start Analysis to begin"}
              </p>
            </div>
            {isAnalyzing && (
              <div className="absolute top-4 right-4">
                <Badge variant="destructive" className="animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedestrians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.people}</div>
            <p className="text-xs text-muted-foreground">People detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2-Wheelers</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.twoWheelers}</div>
            <p className="text-xs text-muted-foreground">Bikes/Scooters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">4-Wheelers</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.fourWheelers}</div>
            <p className="text-xs text-muted-foreground">Cars/Trucks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{violations.length}</div>
            <p className="text-xs text-muted-foreground">Detected violations</p>
          </CardContent>
        </Card>
      </div>

      {/* Signal Timing Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Signal Timing Control
            </CardTitle>
            <CardDescription>
              AI-recommended timing based on traffic density
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Current Signal Timing</span>
                <span className="text-sm font-bold">{currentSignalTiming}s</span>
              </div>
              <Progress value={(currentSignalTiming / 120) * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Recommended Timing</span>
                <span className="text-sm font-bold text-blue-600">
                  {trafficData.recommendedTiming}s
                </span>
              </div>
              <Progress
                value={(trafficData.recommendedTiming / 120) * 100}
                className="[&>div]:bg-blue-600"
              />
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-3">
                Traffic Density: {totalTraffic} entities detected
              </p>
              <Button
                onClick={handleApplyTiming}
                disabled={!isAnalyzing}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Apply Recommended Timing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Violations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Violations
            </CardTitle>
            <CardDescription>Traffic violations detected by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {violations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No violations detected yet
                </p>
              ) : (
                violations.map((violation) => (
                  <div
                    key={violation.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{violation.type}</p>
                      <p className="text-xs text-muted-foreground">{violation.time}</p>
                    </div>
                    <Badge
                      variant={
                        violation.severity === "high"
                          ? "destructive"
                          : violation.severity === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {violation.severity}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Traffic Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="density">Density Analysis</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Traffic</p>
                  <p className="text-2xl font-bold">{totalTraffic}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">
                    {trafficData.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="density" className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Pedestrian Density</span>
                    <span className="text-sm font-medium">
                      {((trafficData.people / 50) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={(trafficData.people / 50) * 100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Vehicle Density</span>
                    <span className="text-sm font-medium">
                      {(((trafficData.twoWheelers + trafficData.fourWheelers) / 70) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={((trafficData.twoWheelers + trafficData.fourWheelers) / 70) * 100}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="config" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Signal Timing Rules</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Low traffic (&lt;10 vehicles): 45 seconds</li>
                    <li>• Medium traffic (10-30 vehicles): 60 seconds</li>
                    <li>• High traffic (30-50 vehicles): 75 seconds</li>
                    <li>• Very high traffic (&gt;50 vehicles): 90 seconds</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
