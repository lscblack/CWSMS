import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paperclip,
  Car,
  Coins,
  PawPrint,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

import ServiceRecords from './ServiceRecords';
import CarRegistrationForm from './Cars';
import ServiceManagement from './Service';
import PaymentForm from './Moneny';
import ServiceDashboard from './REport';

const Dashboard = () => {
  const [viewPage, setViewPage] = useState("dash");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('uname');
    window.location.href = "/";
  };

  const tabs = [
    { id: "dash", label: "Dashboard", icon: ""},
    { id: "car", label: "Cars", icon: "" },
    { id: "serv", label: "Services", icon: "" },
    { id: "reco", label: "Packages", icon: "" },
    { id: "pay", label: "Payments", icon: "" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-green-800 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">CRPMS Portal</div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewPage(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewPage === tab.id
                  ? "bg-white text-green-800 font-semibold"
                  : "hover:bg-green-700"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-green-800 hover:bg-slate-100 transition-all font-semibold"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6">
          {viewPage === "dash" && <ServiceDashboard />}
          {viewPage === "reco" && <ServiceRecords />}
          {viewPage === "car" && <CarRegistrationForm />}
          {viewPage === "serv" && <ServiceManagement />}
          {viewPage === "pay" && <PaymentForm />}
      </main>
    </div>
  );
};

export default Dashboard;
