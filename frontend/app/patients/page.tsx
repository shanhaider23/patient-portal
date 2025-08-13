"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "../context/AuthContext";
import {
    Calendar,
    User,
    Phone,
    Mail,
    LogOut,
    Edit,
    Trash2,
    PlusCircle,
} from "lucide-react";

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
    const [loading, setLoading] = useState(false);
    const [formPatient, setFormPatient] = useState<Partial<Patient> | null>(null);

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await api.get("/patients");
            console.log("Fetched patients:", res.data.data);
            setPatients(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePatient = async (id: number) => {
        if (!confirm("Delete this patient?")) return;
        try {
            await api.delete(`/patients/${id}`);
            fetchPatients();
        } catch (error) {
            console.error("Failed to delete patient", error);
        }
    };

    const savePatient = async () => {
        if (!formPatient) return;

        if (!formPatient.firstName || !formPatient.lastName || !formPatient.email) {
            alert("First name, last name, and email are required.");
            return;
        }

        try {
            if (formPatient.id) {
                await api.put(`/patients/${formPatient.id}`, formPatient);
            } else {
                await api.post("/patients", formPatient);
            }
            setFormPatient(null);
            fetchPatients();
        } catch (error) {
            console.error("Failed to save patient", error);
        }
    };

    const editPatient = (patient: Patient) => {
        setFormPatient(patient);
    };

    const cancelForm = () => {
        setFormPatient(null);
    };

    useEffect(() => {
        if (user) {
            console.log("User role:", user);
            fetchPatients();
        } else {
            setPatients([]);
        }
    }, [user]);

    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col shadow-lg">
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center text-2xl">
                            {user?.name?.[0]}
                        </div>
                        <h2 className="mt-3 font-semibold">{user?.name}</h2>
                        <p className="text-sm text-zinc-400">{user?.email}</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-3">
                    <button className="flex items-center gap-2 p-2 rounded hover:bg-zinc-800 w-full transition">
                        🏥 Patients
                    </button>
                </nav>
                <div className="p-4 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full p-2 rounded bg-red-600 hover:bg-red-700 transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-zinc-800">Patients</h1>
                    {user?.role === "admin" && (
                        <button
                            onClick={() => setFormPatient({})}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            <PlusCircle size={18} /> Add Patient
                        </button>
                    )}
                </div>

                {formPatient && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
                        <h2 className="text-lg font-semibold mb-4">
                            {formPatient.id ? "Edit Patient" : "Add Patient"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
                                placeholder="First Name"
                                value={formPatient.firstName || ""}
                                onChange={(e) =>
                                    setFormPatient({ ...formPatient, firstName: e.target.value })
                                }
                            />
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
                                placeholder="Last Name"
                                value={formPatient.lastName || ""}
                                onChange={(e) =>
                                    setFormPatient({ ...formPatient, lastName: e.target.value })
                                }
                            />
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
                                placeholder="Email"
                                value={formPatient.email || ""}
                                onChange={(e) =>
                                    setFormPatient({ ...formPatient, email: e.target.value })
                                }
                            />
                            <input
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
                                placeholder="Phone"
                                value={formPatient.phoneNumber || ""}
                                onChange={(e) =>
                                    setFormPatient({
                                        ...formPatient,
                                        phoneNumber: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="date"
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
                                value={formPatient.dob || ""}
                                onChange={(e) =>
                                    setFormPatient({ ...formPatient, dob: e.target.value })
                                }
                            />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={savePatient}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                {formPatient.id ? "Update" : "Add"}
                            </button>
                            <button
                                onClick={cancelForm}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p>Loading patients...</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full">
                            <thead className="bg-zinc-100 text-zinc-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Phone</th>
                                    <th className="px-4 py-2 text-left">Date of Birth</th>
                                    {user?.role === "admin" && (
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="border-b">
                                        <td className="px-4 py-2"><div className="flex items-center gap-2"><User size={16} />{patient.firstName} {patient.lastName}</div></td>
                                        <td className="px-4 py-2"><div className="flex items-center gap-2"><Mail size={16} /> {patient.email}</div></td>
                                        <td className="px-4 py-2"><div className="flex items-center gap-2"> <Phone size={16} />  {patient.phoneNumber}</div></td>
                                        <td className="px-4 py-2"><div className="flex items-center gap-2"> <Calendar size={16} />{patient.dob}</div></td>
                                        {user?.role === "admin" && (
                                            <td className="px-4 py-2 flex gap-2 justify-center">
                                                <button
                                                    onClick={() => editPatient(patient)}
                                                    className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 transition"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deletePatient(patient.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                )}
            </main>
        </div>
    );
}
