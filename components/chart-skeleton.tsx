"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ChartSkeletonProps {
  title: string;
  height?: number;
}

export function ChartSkeleton({ title, height = 300 }: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="flex items-center justify-center bg-gray-50 rounded-lg"
          style={{ height: `${height}px` }}
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Carregando gráfico...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
