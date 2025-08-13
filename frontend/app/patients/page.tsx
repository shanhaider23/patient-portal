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
    Menu,
    ChevronLeft
} from "lucide-react";

interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: string;
    photoUrl?: string;
}

export default function PatientsPage() {
    const { user, logout } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [formPatient, setFormPatient] = useState<Partial<Patient> | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);


    const router = useRouter();


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);


        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await api.get("/patients");
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
            if (selectedPatient?.id === id) setSelectedPatient(null);
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
                console.log("Saving new patient:", formPatient);
                await api.post("/patients", formPatient);
            }

            setFormPatient(null);
            fetchPatients();
        } catch (error) {
            console.error("Failed to save patient", error);
        }
    };

    const editPatient = (patient: Patient) => {
        if (formPatient?.id === patient.id) {
            setFormPatient(null);
        } else {
            setFormPatient(patient);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPatients();
        } else {
            setPatients([]);
        }
    }, [user]);

    return (
        <div className="flex min-h-screen ">
            {/* Sidebar */}
            <aside
                className={`bg-zinc-900 text-white flex flex-col shadow-xl transition-all duration-300 h-screen fixed lg:static z-50 ${sidebarOpen ? "w-72" : "w-20"
                    }`}
            >
                {/* Top bar */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    {sidebarOpen && (
                        <h2 className="text-lg font-semibold transition-opacity duration-300">
                            Patient Details
                        </h2>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-zinc-800 transition"
                    >
                        {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Selected Patient Info */}
                {selectedPatient && (
                    <div
                        className={`bg-zinc-800 rounded-lg animate-fadeIn transition-all duration-300
            ${sidebarOpen ? "mt-6 p-4 m-4" : "mt-2 p-1 m-1"}
        `}
                    >
                        <div className="flex flex-col items-center">
                            <img
                                src={
                                    selectedPatient.photoUrl ||
                                    `https://ui-avatars.com/api/?name=${selectedPatient.firstName}+${selectedPatient.lastName}&background=random`
                                }
                                alt="Profile"
                                className={`${sidebarOpen ? "w-32 h-32" : "w-12 h-12"} rounded-full object-cover transition-all duration-300`}
                            />
                            {sidebarOpen && (
                                <>
                                    <h3 className="mt-3 font-semibold">
                                        {selectedPatient.firstName} {selectedPatient.lastName}
                                    </h3>
                                    <p className="text-sm text-zinc-400">{selectedPatient.email}</p>
                                    <div className="mt-3 space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} /> {selectedPatient.phoneNumber}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} /> {selectedPatient.dob}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Logout */}
                <div className="mt-auto p-4 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full p-2 rounded bg-red-600 hover:bg-red-700 transition"
                    >
                        <LogOut size={18} /> {sidebarOpen && "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-6 transition-all duration-300     ${sidebarOpen ? "ml-72" : "ml-20"}
    lg:ml-0
  `}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-zinc-800">Patients</h1>
                    {user?.role === "admin" && (
                        <button
                            onClick={() => {

                                if (formPatient && !formPatient.id) {
                                    setFormPatient(null);
                                } else {
                                    setFormPatient({});
                                }
                            }}
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
                                onClick={() => {
                                    setFormPatient(null);
                                }}
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
                        <table className="min-w-full table-auto">
                            <thead className="bg-zinc-100 text-zinc-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Phone</th>

                                    {user?.role === "admin" && (
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="border-b hover:bg-blue-50 cursor-pointer transition"
                                        onClick={() => setSelectedPatient(patient)}
                                    >
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <User size={16} /> {patient.firstName} {patient.lastName}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} /> {patient.email}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} /> {patient.phoneNumber}
                                            </div>
                                        </td>

                                        {user?.role === "admin" && (
                                            <td className="px-4 py-2 flex gap-2 justify-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editPatient(patient);
                                                    }}
                                                    className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 transition"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deletePatient(patient.id);
                                                    }}
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
