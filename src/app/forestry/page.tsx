import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { forestryData } from "@/lib/data";
import { TreePine, Leaf, Bot, CircleDollarSign, Satellite } from "lucide-react";
import Link from "next/link";

export default function ForestryPage() {
    const totalTrees = forestryData.length;
    const totalCarbonSeq = forestryData.reduce((acc, tree) => acc + tree.carbonSeq, 0);
    const estimatedValue = forestryData.reduce((acc, tree) => acc + (tree.biomass * 2.5), 0); // Example valuation

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Trees"
          value={totalTrees.toLocaleString()}
          icon={TreePine}
          description="Across all sectors"
        />
        <StatCard
          title="Carbon Sequestration"
          value={`${(totalCarbonSeq / 1000).toFixed(2)} tCO₂e`}
          icon={Leaf}
          description="Total sequestered carbon"
          iconClass="text-green-500"
        />
        <StatCard
          title="Estimated Timber Value"
          value={`$${(estimatedValue / 1000).toFixed(1)}k`}
          icon={CircleDollarSign}
          description="Based on current biomass"
          iconClass="text-yellow-600"
        />
         <StatCard
          title="Fire Risk"
          value="Low"
          icon={Bot}
          description="AI-assessed risk level"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Bot className="text-primary" />
                AI Forestry Analysis
              </CardTitle>
              <CardDescription>
                Get AI-powered recommendations based on your tree inventory data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Analyze your current inventory to receive suggestions for improving timber value, carbon sequestration, and overall forest health.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forestry/analysis">Analyze Inventory</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Satellite className="text-primary" />
                AI Satellite Imagery Analysis
              </CardTitle>
              <CardDescription>
                Interpret simulated satellite data to monitor forest health remotely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Assess vegetation health (NDVI), detect stress, and identify potential issues like pests or water deficiency before they become critical.
              </p>
            </CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/forestry/satellite-analysis">Analyze Satellite Data</Link>
                </Button>
            </CardFooter>
          </Card>
       </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">
            Tree Inventory
          </CardTitle>
          <CardDescription>
            Inventory and growth monitoring for all forestry plots.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forestryData.map((tree) => (
            <Card key={tree.id} className="bg-secondary/30">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">{tree.species}</CardTitle>
                <span className="text-sm font-mono text-muted-foreground">{tree.id}</span>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Location:</strong> {tree.location}</p>
                <p><strong>Planted:</strong> {tree.datePlanted}</p>
                <div className="flex justify-between pt-2">
                    <p><strong>Biomass:</strong> {tree.biomass} kg</p>
                    <p><strong>Carbon:</strong> {tree.carbonSeq} kgCO₂e</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
