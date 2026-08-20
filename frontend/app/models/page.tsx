"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ModelData = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
};

type ComparisonData = {
  densenet121: ModelData;
  vit: ModelData;
};

export default function ModelsPage() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/models/comparison`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);
      })
      .catch((err) => {
        console.error("Failed to load model comparison:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500">
            Failed to load model comparison: {error}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center text-gray-500">
          Loading model comparison...
        </div>
      </main>
    );
  }

  const chartData = [
    "accuracy",
    "precision",
    "recall",
    "f1",
    "roc_auc",
  ].map((metric) => ({
    metric:
      metric === "roc_auc"
        ? "ROC-AUC"
        : metric.charAt(0).toUpperCase() + metric.slice(1),

    DenseNet121: Number(
      (data.densenet121[metric as keyof ModelData] as number * 100).toFixed(1)
    ),

    ViT: Number(
      (data.vit[metric as keyof ModelData] as number * 100).toFixed(1)
    ),
  }));

  return (
    <main className="max-w-5xl mx-auto p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Model Comparison
        </h1>

        <p className="text-gray-500 mt-2">
          DenseNet121 vs Vision Transformer (ViT)
        </p>
      </div>

      {/* Chart */}
      <div className="border rounded-xl p-6 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-6">
          Performance Comparison
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="metric"
              fontSize={12}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
            />

            <Tooltip
              formatter={(value) => `${value}%`}
            />

            <Legend />

            <Bar
              dataKey="DenseNet121"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="ViT"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DenseNet */}
        <div className="border rounded-xl p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-5">
            DenseNet121
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Accuracy</span>
              <strong>
                {(data.densenet121.accuracy * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Precision</span>
              <strong>
                {(data.densenet121.precision * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Recall</span>
              <strong>
                {(data.densenet121.recall * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>F1 Score</span>
              <strong>
                {(data.densenet121.f1 * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>ROC-AUC</span>
              <strong>
                {(data.densenet121.roc_auc * 100).toFixed(2)}%
              </strong>
            </div>

          </div>
        </div>

        {/* ViT */}
        <div className="border rounded-xl p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-5">
            Vision Transformer (ViT)
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Accuracy</span>
              <strong>
                {(data.vit.accuracy * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Precision</span>
              <strong>
                {(data.vit.precision * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Recall</span>
              <strong>
                {(data.vit.recall * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>F1 Score</span>
              <strong>
                {(data.vit.f1 * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="flex justify-between">
              <span>ROC-AUC</span>
              <strong>
                {(data.vit.roc_auc * 100).toFixed(2)}%
              </strong>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}