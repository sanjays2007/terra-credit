import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Beef,
  Cloud,
  Droplets,
  Feather,
  Fish,
  Landmark,
  Map,
  MoreVertical,
  Sprout,
  Sun,
  Cloudy,
  CloudRain,
  TreePine,
  Wind,
  Bot,
  TrafficCone,
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { getWeather } from "@/ai/flows/get-weather";
import type { WeatherData } from "@/ai/flows/get-weather";

const domainModules = [
  {
    title: "Agriculture",
    description: "Crops & Horticulture",
    icon: Sprout,
    href: "/agriculture",
    stats: "AI Insights",
    color: "bg-green-100 dark:bg-green-900/50",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    title: "Livestock",
    description: "Animal Husbandry",
    icon: Beef,
    href: "/livestock",
    stats: "125 Animals",
    color: "bg-orange-100 dark:bg-orange-900/50",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  {
    title: "Aquaculture",
    description: "Fisheries",
    icon: Fish,
    href: "/aquaculture",
    stats: "AI Optimal",
    color: "bg-blue-100 dark:bg-blue-900/50",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    title: "Forestry",
    description: "Agroforestry",
    icon: TreePine,
    href: "/forestry",
    stats: "AI Assessed",
    color: "bg-emerald-100 dark:bg-emerald-900/50",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    title: "Credit Scoring",
    description: "Loan & Risk Analysis",
    icon: Landmark,
    href: "/credit-scoring",
    stats: "AI-Powered",
    color: "bg-indigo-100 dark:bg-indigo-900/50",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    title: "Traffic Monitoring",
    description: "Signal Analysis",
    icon: TrafficCone,
    href: "/traffic-monitoring",
    stats: "AI Vision",
    color: "bg-red-100 dark:bg-red-900/50",
    textColor: "text-red-700 dark:text-red-300",
  },
];

const WeatherIcon = ({ condition }: { condition: WeatherData['conditionIcon'] }) => {
  switch (condition) {
    case 'Sun':
      return <Sun className="w-12 h-12 text-yellow-400" />;
    case 'Cloudy':
      return <Cloudy className="w-12 h-12 text-gray-400" />;
    case 'CloudRain':
      return <CloudRain className="w-12 h-12 text-blue-400" />;
    case 'Wind':
      return <Wind className="w-12 h-12 text-gray-500" />;
    default:
      return <Cloud className="w-12 h-12 text-gray-400" />;
  }
};


export default async function DashboardPage() {
  const farmMapImage = PlaceHolderImages.find((img) => img.id === "farm-map");
  const weatherData = await getWeather("Anand, Gujarat");

  return (
    <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            {/* Weather Widget */}
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-headline text-lg">
                    Localized Weather
                </CardTitle>
                <CardDescription>{weatherData.location}</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-around text-center p-4 rounded-lg bg-secondary/50">
                    <div className="flex flex-col items-center gap-1">
                    <WeatherIcon condition={weatherData.conditionIcon} />
                    <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
                    <p className="text-muted-foreground">{weatherData.condition}</p>
                    </div>
                    <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-400" />
                        <span>Humidity: {weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-400" />
                        <span>Wind: {weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-gray-400" />
                        <span>Precipitation: {weatherData.precipitation}%</span>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* Farm Map Widget */}
            <Card className="col-span-1 lg:col-span-3 overflow-hidden">
                <CardHeader>
                <CardTitle className="font-headline text-lg">
                    Interactive Farm Map
                </CardTitle>
                <CardDescription>
                    GPS coordinates and field boundaries overview.
                </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                {farmMapImage && (
                    <div className="relative w-full h-52">
                    <Image
                        src={farmMapImage.imageUrl}
                        alt={farmMapImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={farmMapImage.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <Button>
                        <Map className="mr-2" /> View Full Map
                        </Button>
                    </div>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>

        {/* Domain Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainModules.map((mod) => (
                <Card key={mod.title} className="flex flex-col">
                <CardHeader className="flex-grow">
                    <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-md ${mod.color}`}>
                        <mod.icon className={`w-6 h-6 ${mod.textColor}`} />
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <h3 className="font-headline text-lg">{mod.title}</h3>
                    <p className="text-muted-foreground text-sm">{mod.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Badge variant="secondary" className="flex items-center gap-1">
                    {mod.title !== 'Livestock' && <Bot size={14}/>}
                    {mod.stats}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                    <Link href={mod.href}>
                        Manage <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    </Button>
                </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
