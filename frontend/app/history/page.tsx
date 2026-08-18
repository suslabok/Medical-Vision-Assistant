"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Loader2, Download } from "lucide-react";

interface HistoryItem {
  id: string;
  filename: string;
  original_filename: string;
  image_url: string;
  disease: string;
  confidence: number;
  report_risk_level: string | null;
  created_at: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (diseaseFilter) params.set("disease", diseaseFilter);

      const res = await fetch(
        `${API_URL}/api/v1/history?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/api/v1/analysis/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete analysis");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting analysis:", error);
      alert("Failed to delete analysis.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Analysis History
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && fetchHistory()
            }
            placeholder="Search by filename..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <select
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Diseases</option>
          <option value="NORMAL">Normal</option>
          <option value="PNEUMONIA">Pneumonia</option>
        </select>

        <button
          onClick={fetchHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Filter
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No analyses found. Upload an X-ray to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border rounded-xl p-4 hover:bg-gray-50 transition"
            >
              {/* Image */}
              <img
                src={`${API_URL}${item.image_url}`}
                alt={item.original_filename}
                className="h-16 w-16 rounded-lg border object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <p className="font-medium">
                  {item.original_filename}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </p>
              </div>

              {/* Prediction */}
              <div className="text-right">
                <p className="font-semibold">
                  {item.disease}
                </p>

                <p className="text-xs text-gray-500">
                  {item.confidence}% confidence
                </p>
              </div>

              {/* Risk Badge */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  item.report_risk_level === "High"
                    ? "bg-red-100 text-red-700"
                    : item.report_risk_level === "Moderate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.report_risk_level || "N/A"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <a
                  href={`${API_URL}/api/v1/analysis/${item.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download PDF Report"
                  className="p-2 text-gray-400 hover:text-blue-600 transition"
                >
                  <Download className="h-4 w-4" />
                </a>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete Analysis"
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}