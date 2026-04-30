"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface ActivityChartProps {
  data: any[];
}

const COLORS = ["#5865F2", "#3ba55c", "#faa61a", "#ed4245", "#eb459e"];

export default function ActivityChart({ data }: ActivityChartProps) {
  const processData = () => {
    const counts: Record<string, number> = {};
    
    data.forEach((entry) => {
      const type = entry.action_type;
      let category = "Inne";
      
      if (type >= 10 && type <= 15) category = "Kanały";
      if (type >= 20 && type <= 22) category = "Moderacja";
      if (type >= 30 && type <= 32) category = "Role";
      if (type >= 80) category = "Integracje";

      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.keys(counts).map((key, index) => ({
      name: key,
      value: counts[key],
      fill: COLORS[index % COLORS.length],
    }));
  };

  const chartData = processData();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Rozkład aktywności" description="Podział ostatnich zdarzeń na kategorie" />
      <CardContent className="flex-1 w-full pb-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#2b2d31", border: "none", borderRadius: "8px", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Brak danych do wyświetlenia
          </div>
        )}
      </CardContent>
    </Card>
  );
}