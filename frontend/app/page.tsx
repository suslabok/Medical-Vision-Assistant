"use client";

import { motion } from "framer-motion";
import { Activity, ScanLine, FileText, History, ShieldAlert } from "lucide-react";

const features = [
  {
    icon: ScanLine,
    title: "AI Disease Detection",
    description:
      "Upload a chest X-ray and get a predicted classification across common findings with confidence scores.",
  },
  {
    icon: Activity,
    title: "Explainable AI",
    description:
      "Grad-CAM heatmaps highlight exactly which regions of the image influenced the model's prediction.",
  },
  {
    icon: FileText,
    title: "AI Report Generation",
    description:
      "Structured findings, risk assessment, and recommendations generated automatically from each analysis.",
  },
  {
    icon: History,
    title: "Patient History",
    description:
      "Every scan, prediction, and report is stored and searchable in a dashboard built for research review.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="container flex flex-col items-center py-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-accent" />
          Research & educational project not a medical device
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
        >
          AI-assisted chest X-ray analysis,{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            explained visually
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Upload a chest X-ray, get a model prediction with confidence scores,
          see a Grad-CAM heatmap of the regions the model focused on, and
          generate a structured research-style report all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/upload"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90"
          >
            Try an Analysis
          </a>
          <a
            href="#disclaimer"
            className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-secondary"
          >
            Read the Disclaimer
          </a>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <feature.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section id="disclaimer" className="container pb-24">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h3 className="mb-1 font-semibold text-destructive">
                Not a Medical Diagnosis Tool
              </h3>
              <p className="text-sm text-muted-foreground">
                Medical Vision Assistant is a research and educational
                portfolio project. It is <strong>not</strong> a certified
                medical device, has <strong>not</strong> been validated for
                clinical use, and must never be used to diagnose, treat, or
                make decisions about real patients. Predictions are generated
                by machine learning models trained on public research
                datasets and may be inaccurate. Always consult a qualified
                healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
