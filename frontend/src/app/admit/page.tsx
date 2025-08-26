"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdmitPage() {
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState(1);
  const [requestedBeds, setRequestedBeds] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, severity, requestedBeds }),
      });
      if (res.ok) {
        setResult("Patient admitted and waiting for allocation.");
        setName("");
        setSeverity(1);
        setRequestedBeds(1);
      } else {
        setResult("Failed to admit patient.");
      }
    } catch {
      setResult("Server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admit Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Severity (1-10)</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Requested Beds</label>
          <Input
            type="number"
            min={1}
            value={requestedBeds}
            onChange={(e) => setRequestedBeds(Number(e.target.value))}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Admit"}
        </Button>
      </form>
      {result && <div className="mt-4 text-center text-blue-700">{result}</div>}
    </div>
  );
}
