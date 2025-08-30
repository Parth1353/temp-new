"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Modal component
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdmitPage() {
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState(1);
  const [requestedBeds, setRequestedBeds] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:5001/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, severity, requestedBeds }),
      });

      if (res.ok) {
        // Check for HTML response
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Server error or not running. Received non-JSON response."
          );
        }
        setResult("Patient admitted and waiting for allocation.");
        setModalOpen(true);
        setName("");
        setSeverity(1);
        setRequestedBeds(1);
      } else {
        // Check for HTML error response
        const text = await res.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(text);
        } catch {
          setError("Server error or not running. Received non-JSON response.");
          return;
        }
        setError(
          `Failed to admit patient: ${errorData.error || res.statusText}`
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      setError(
        "Cannot connect to server. Please make sure the backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-xl bg-white/90 p-10 rounded-2xl shadow-xl border border-blue-200 mt-8">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center tracking-tight">
          Admit Patient
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Severity (1-10)
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              required
              className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Requested Beds
            </label>
            <Input
              type="number"
              min={1}
              value={requestedBeds}
              onChange={(e) => setRequestedBeds(Number(e.target.value))}
              required
              className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg shadow-md transition"
          >
            {loading ? "Submitting..." : "Admit"}
          </Button>
        </form>
        {error && (
          <div className="mt-6 text-center text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center gap-4">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#22c55e" fillOpacity="0.15" />
            <path
              d="M7 13l3 3 7-7"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-xl font-semibold text-green-700 text-center">
            Patient admitted and waiting for allocation.
          </div>
          <Button
            onClick={() => setModalOpen(false)}
            className="bg-blue-700 hover:bg-blue-800 text-white w-full mt-2"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
