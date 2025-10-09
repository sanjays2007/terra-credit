import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { livestockData } from "@/lib/data";
import { PlusCircle, Droplet, HeartPulse, Activity } from "lucide-react";

const getStatusVariant = (
  status: "Healthy" | "Sick" | "Monitoring"
): "default" | "destructive" | "secondary" => {
  switch (status) {
    case "Healthy":
      return "default";
    case "Sick":
      return "destructive";
    case "Monitoring":
      return "secondary";
  }
};

export default function LivestockPage() {
  const totalAnimals = livestockData.length;
  const healthyAnimals = livestockData.filter(
    (l) => l.healthStatus === "Healthy"
  ).length;
  const avgProduction =
    livestockData
      .map((l) => parseFloat(l.productionRate))
      .filter(Boolean)
      .reduce((acc, cur) => acc + cur, 0) / totalAnimals;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Livestock"
          value={totalAnimals.toString()}
          icon={Activity}
          description="Total animals on farm"
        />
        <StatCard
          title="Healthy Animals"
          value={`${healthyAnimals} / ${totalAnimals}`}
          icon={HeartPulse}
          description={`${((healthyAnimals / totalAnimals) * 100).toFixed(
            0
          )}% health rate`}
          iconClass="text-green-500"
        />
        <StatCard
          title="Avg. Production"
          value={`${avgProduction.toFixed(1)} L/day`}
          icon={Droplet}
          description="Average daily milk yield"
          iconClass="text-blue-500"
        />
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Animal
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">
            Livestock Registry
          </CardTitle>
          <CardDescription>
            Detailed records of all animals on the farm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Last Checkup</TableHead>
                <TableHead>Production</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livestockData.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.id}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(animal.healthStatus)}>
                      {animal.healthStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{animal.birthDate}</TableCell>
                  <TableCell>{animal.lastCheckup}</TableCell>
                  <TableCell>{animal.productionRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
