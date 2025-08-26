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

  async function fetchAll() {
    const [p, r, l] = await Promise.all([
      fetch("http://localhost:5000/api/patients").then((r) => r.json()),
      fetch("http://localhost:5000/api/resources").then((r) => r.json()),
      fetch("http://localhost:5000/api/logs").then((r) => r.json()),
    ]);
    setPatients(p);
    setIcu(r);
    setLogs(l);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleAllocate() {
    setAllocating(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/allocate", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Allocation failed");
      await fetchAll();
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Unknown error");
    } finally {
      setAllocating(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button onClick={handleAllocate} disabled={allocating}>
          {allocating ? "Allocating..." : "Run Allocation"}
        </Button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <section>
        <h3 className="font-semibold mb-2">ICU Bed Availability</h3>
        {icu && (
          <div className="mb-2">
            <Progress
              value={(icu.allocatedUnits / icu.totalUnits) * 100}
              className="h-4"
            />
            <div className="text-sm mt-1">
              {icu.allocatedUnits} / {icu.totalUnits} beds allocated
            </div>
          </div>
        )}
      </section>
      <section>
        <h3 className="font-semibold mb-2">Patients</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Requested Beds</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.severity}</TableCell>
                  <TableCell>{p.requestedBeds}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>
                    {new Date(p.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-2">System Logs</h3>
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
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.patientName}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
