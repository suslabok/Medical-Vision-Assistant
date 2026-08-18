"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/models/comparison`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data || data.error) {
    return <div className="p-8 text-center text-gray-500">{data?.error || "Loading..."}</div>;
  }

  const chartData = ["accuracy", "precision", "recall", "f1", "roc_auc"].map((metric) => ({
    metric: metric.toUpperCase(),
    DenseNet121: +(data.densenet121[metric] * 100).toFixed(1),
    ViT: +(data.vit[metric] * 100).toFixed(1),
  }));

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Model Comparison: DenseNet121 vs Vision Transformer</h1>

      <div className="border rounded-xl p-4 dark:border-gray-700 mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" fontSize={12} />
            <YAxis domain={[0, 100]} fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="DenseNet121" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ViT" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <h3 className="font-semibold mb-2">DenseNet121</h3>
          <p>Params: {data.densenet121.params_millions}M</p>
          <p>Inference: {data.densenet121.inference_ms_cpu}ms (CPU)</p>
        </div>
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Vision Transformer</h3>
          <p>Params: {data.vit.params_millions}M</p>
          <p>Inference: {data.vit.inference_ms_cpu}ms (CPU)</p>
        </div>
      </div>
    </main>
  );
}