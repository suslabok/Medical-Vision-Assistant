"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

interface Analytics {
  total_analyses: number;
  disease_distribution: { disease: string; count: number }[];
  avg_confidence: number;
  risk_distribution: { risk_level: string; count: number }[];
  volume_last_7_days: { date: string; count: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/admin/analytics`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  if (!data || data.total_analyses === 0) {
    return <div className="p-8 text-center text-gray-500">No analyses yet. Upload some X-rays first.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <p className="text-xs text-gray-500">Total Analyses</p>
          <p className="text-3xl font-bold mt-1">{data.total_analyses}</p>
        </div>
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <p className="text-xs text-gray-500">Avg Confidence</p>
          <p className="text-3xl font-bold mt-1">{data.avg_confidence}%</p>
        </div>
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <p className="text-xs text-gray-500">Diseases Tracked</p>
          <p className="text-3xl font-bold mt-1">{data.disease_distribution.length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Disease distribution — pie chart */}
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-4">Disease Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.disease_distribution}
                dataKey="count"
                nameKey="disease"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.disease_distribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk level distribution — bar chart */}
        <div className="border rounded-xl p-4 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-4">Risk Level Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.risk_distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="risk_level" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volume over last 7 days — line chart */}
        <div className="border rounded-xl p-4 dark:border-gray-700 md:col-span-2">
          <h2 className="text-sm font-semibold mb-4">Analysis Volume (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.volume_last_7_days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}