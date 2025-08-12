"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "../context/AuthContext";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
}

export default function PatientsPage() {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatients = async () => {
    const res = await api.get("/patients");
    console.log("Fetched patients:", res.data);
    
    setPatients(res.data.data);
  };

  const deletePatient = async (id: number) => {
    if (!confirm("Delete this patient?")) return;
    await api.delete(`/patients/${id}`);
    fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">Patients</h1>
        <div>
          <span className="mr-4">Role: {user?.role}</span>
          <button onClick={logout} className="bg-gray-300 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </div>

      <table className="table-auto border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">DOB</th>
            {user?.role === "admin" && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.firstName} {p.lastName}</td>
              <td className="border p-2">{p.email}</td>
              <td className="border p-2">{p.phoneNumber}</td>
              <td className="border p-2">{p.dob}</td>
              {user?.role === "admin" && (
                <td className="border p-2">
                  <button
                    onClick={() => deletePatient(p.id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
