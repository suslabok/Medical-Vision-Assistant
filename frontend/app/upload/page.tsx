"use client";

import { useState, useCallback } from "react";
import { UploadCloud, ImageIcon, X, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    setResult(null);

    if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
      setError("Please upload a JPEG or PNG image.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File too large. Max size is 10MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };
    const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

 const onUpload = async () => {
  if (!file) return;
  setUploading(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/upload`,
      { method: "POST", body: formData }
    );
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.detail || "Upload failed");

    const analyzeRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/analyze`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: uploadData.filename,
      original_filename: uploadData.original_filename,
    }),
  }
);
    const analyzeData = await analyzeRes.json();
    if (!analyzeRes.ok) throw new Error(analyzeData.detail || "Analysis failed");

    setResult({ ...uploadData, ...analyzeData });
  } catch (err: any) {
    setError(err.message);
  } finally {
    setUploading(false);
  }
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">Upload Chest X-Ray</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Research demo only — not for clinical use.
      </p>

      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`w-full max-w-md h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <UploadCloud className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">
            Drag & drop an X-ray here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-1">JPEG or PNG, max 10MB</p>
          <input
            id="fileInput"
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="relative rounded-xl overflow-hidden border">
            <img src={preview} alt="X-ray preview" className="w-full object-contain" />
            <button
              onClick={reset}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!result && (
            <button
              onClick={onUpload}
              disabled={uploading}
              className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" /> Upload X-Ray
                </>
              )}
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

     {result && (
  <div className="mt-4 w-full max-w-md rounded-lg bg-green-50 border border-green-200 p-4 text-sm">
    <p className="font-medium text-green-800">✅ Analysis complete</p>
    <p className="text-green-700 mt-1">
      Prediction: <strong>{result.disease}</strong>
    </p>
    <p className="text-green-700">Confidence: {result.confidence}%</p>

    {result.heatmap && (
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-1">Grad-CAM — regions influencing the prediction:</p>
        <img
          src={result.heatmap}
          alt="Grad-CAM heatmap"
          className="w-full rounded-lg border"
        />
      </div>
    )}

    <p className="text-xs text-gray-500 mt-2">{result.disclaimer}</p>
  </div>
)}
{result?.report && (
  <div className="mt-4 border-t pt-3">
    <p className="text-xs font-medium text-gray-600 mb-2">AI-Generated Report</p>

    <div className="space-y-2 text-xs text-gray-700">
      <div>
        <span className="font-semibold">Findings: </span>
        {result.report.findings}
      </div>
      <div>
        <span className="font-semibold">Risk Level: </span>
        <span
          className={
            result.report.risk_level === "High"
              ? "text-red-600 font-medium"
              : result.report.risk_level === "Moderate"
              ? "text-amber-600 font-medium"
              : "text-green-600 font-medium"
          }
        >
          {result.report.risk_level}
        </span>
      </div>
      <div>
        <span className="font-semibold">Recommendation: </span>
        {result.report.recommendation}
      </div>
    </div>

    <pre className="mt-3 whitespace-pre-wrap bg-gray-50 border rounded-lg p-3 text-[11px] text-gray-600 max-h-64 overflow-y-auto">
      {result.report.full_report_text}
    </pre>
  </div>
)}
    </main>
  );
}