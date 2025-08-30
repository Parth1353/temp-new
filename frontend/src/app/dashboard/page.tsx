"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Patient {
  _id: string;
  name: string;
  severity: number;
  requestedBeds: number;
  status: string;
  createdAt: string;
}

interface Resource {
  name: string;
  totalUnits: number;
  allocatedUnits: number;
}

interface Log {
  _id: string;
  action: string;
  patientName: string;
  details: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [icu, setIcu] = useState<Resource | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchAll() {
    try {
      const [pRes, rRes, lRes] = await Promise.all([
        fetch("http://localhost:5001/api/patients"),
        fetch("http://localhost:5001/api/resources"),
        fetch("http://localhost:5001/api/logs"),
      ]);
      // Check for HTML response (backend down or error)
      const checkJson = async (res: Response) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(
            "Server error or not running. Received non-JSON response."
          );
        }
      };
      let [p, r, l] = await Promise.all([
        checkJson(pRes),
        checkJson(rRes),
        checkJson(lRes),
      ]);
      // Defensive: ensure arrays
      if (!Array.isArray(p)) p = [];
      if (!Array.isArray(l)) l = [];
      setPatients(p);
      setIcu(r && typeof r === "object" ? r : null);
      setLogs(l);
      setError(null);
    } catch (e: any) {
      setPatients([]);
      setIcu(null);
      setLogs([]);
      setError(e.message || "Unknown error fetching data");
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleAllocate() {
    setAllocating(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5001/api/allocate", {
        method: "POST",
      });
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
      if (!res.ok) throw new Error(data.error || "Allocation failed");
      await fetchAll();
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Unknown error");
    } finally {
      setAllocating(false);
    }
  }

  async function handleDelete(patientId: string) {
    setDeletingId(patientId);
    try {
      const res = await fetch(
        `http://localhost:5001/api/patient/${patientId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete patient");
      await fetchAll();
    } catch (e: any) {
      setError(e.message || "Unknown error deleting patient");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto p-6 bg-white/90 rounded-2xl shadow-xl border border-blue-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
            Dashboard
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={fetchAll}
              variant="outline"
              className="border-blue-400 text-blue-700"
            >
              Refresh
            </Button>
            <Button
              onClick={handleAllocate}
              disabled={allocating}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              {allocating ? "Allocating..." : "Run Allocation"}
            </Button>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <section className="mb-8">
          <h3 className="font-semibold mb-2 text-lg text-blue-800">
            ICU Bed Availability
          </h3>
          {icu && (
            <>
              <div className="mb-2">
                <Progress
                  value={(icu.allocatedUnits / icu.totalUnits) * 100}
                  className="h-4 bg-blue-100"
                />
                <div className="text-sm mt-1 text-blue-700">
                  {icu.allocatedUnits} / {icu.totalUnits} beds allocated
                </div>
              </div>
              {/* Bed visualization */}
              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: icu.totalUnits }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-md flex items-center justify-center shadow-sm border transition-all ${
                      i < icu.allocatedUnits
                        ? "bg-blue-600 border-blue-700 text-white"
                        : "bg-white border-blue-200 text-blue-400"
                    }`}
                    title={i < icu.allocatedUnits ? "Allocated" : "Available"}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect
                        x="3"
                        y="6"
                        width="14"
                        height="8"
                        rx="2"
                        fill="currentColor"
                      />
                      <rect
                        x="1"
                        y="8"
                        width="18"
                        height="4"
                        rx="1"
                        fill="currentColor"
                        opacity=".2"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
        <section className="mb-8">
          <h3 className="font-semibold mb-2 text-lg text-blue-800">Patients</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Requested Beds</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admitted At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(patients) && patients.length > 0 ? (
                  patients.map((p) => (
                    <TableRow
                      key={p._id}
                      className={
                        p.status === "admitted"
                          ? "bg-green-50"
                          : p.status === "rolled_back"
                          ? "bg-red-50"
                          : undefined
                      }
                    >
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.severity}</TableCell>
                      <TableCell>{p.requestedBeds}</TableCell>
                      <TableCell
                        className={
                          p.status === "admitted"
                            ? "text-green-700 font-semibold"
                            : p.status === "rolled_back"
                            ? "text-red-700 font-semibold"
                            : undefined
                        }
                      >
                        {p.status}
                      </TableCell>
                      <TableCell>
                        {new Date(p.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {p.status === "admitted" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                          >
                            {deletingId === p._id ? "Deleting..." : "Delete"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-400"
                    >
                      No patients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
        <section>
          <h3 className="font-semibold mb-2 text-lg text-blue-800">
            System Logs
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(logs) && logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.patientName}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-400"
                    >
                      No logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
