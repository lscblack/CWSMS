import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ServiceRecords from './ServiceRecords';
import { Paperclip } from 'lucide-react';
import { Car } from 'lucide-react';
import { Coins } from 'lucide-react';
import { FileArchiveIcon } from 'lucide-react';
import { PawPrint } from 'lucide-react';
import CarRegistrationForm from './Cars';
import ServiceManagement from './Service';
import PaymentForm from './Moneny';
import ServiceDashboard from './REport';

const Dashboard = () => {
    const [viewPage, setViewPage] = useState("dash");
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove uname from localStorage
        localStorage.removeItem('uname');
        // Redirect to login page or home page
        window.location.href="/"
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Modern sidebar navigation */}
            <div className="flex">
                <aside className="fixed inset-y-0 left-0 w-64 bg-slate-800 text-white shadow-lg z-10">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-white">CRPMS Portal</h1>
                    </div>
                    <nav className="mt-6">
                        <ul className="space-y-2 px-4">
                            <li>
                                <button
                                    onClick={() => setViewPage("dash")}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${viewPage === "dash"
                                        ? "bg-slate-700 text-white"
                                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                                        }`}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setViewPage("car")}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${viewPage === "car"
                                        ? "bg-slate-700 text-white"
                                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                                        }`}
                                >
                                    <Car />
                                    Cars
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setViewPage("serv")}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${viewPage === "serv"
                                        ? "bg-slate-700 text-white"
                                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                                        }`}
                                >
                                    <PawPrint />
                                    Services
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setViewPage("reco")}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${viewPage === "reco"
                                        ? "bg-slate-700 text-white"
                                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                                        }`}
                                >
                                    <Paperclip />
                                    Service Records
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => setViewPage("pay")}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${viewPage === "pay"
                                        ? "bg-slate-700 text-white"
                                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                                        }`}
                                >
                                    <Coins />
                                    manage payments
                                </button>
                            </li>

                          
                        </ul>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center px-4 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Logout
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main content area */}
                <main className="ml-64 flex-1 p-0">
                    {/* Top header */}
                    <header className="flex justify-between items-center mb-1 bg-white p-4">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {viewPage === "dash" ? "Dashboard Overview" : "Dashboard CRPMS"}
                        </h1>

                    </header>

                    {/* Page content */}
                    <div className="bg-white rounded-lg  p-6">
                        {viewPage === "dash" && <ServiceDashboard />}
                        {viewPage === "reco" && <ServiceRecords />}
                        {viewPage === "car" && <CarRegistrationForm />}
                        {viewPage === "serv" && <ServiceManagement/>}
                        {viewPage === "pay" && <PaymentForm/>}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;