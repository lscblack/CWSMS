import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Emp from './Emp';
import Sal from './Sal';
import Dep from './Dep';
import SalaryManagementApp from './add-sal';

const Dashboard = () => {
    const [viewPage, setViewPage] = useState("dash")
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove uname from localStorage
        localStorage.removeItem('uname');
        // Redirect to login page or home page
        navigate('/'); // Change this to your login route
    };

    return (
        <>
            <nav className="bg-amber-800 border-gray-200 shadow-md">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Employee Portal</span>
                    </a>

                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg bg-amber-700 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
                            <li>
                                <a
                                    onClick={() => setViewPage("dash")}
                                    className="block py-2 px-3 text-white rounded hover:bg-amber-600 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0"
                                >
                                    Report
                                </a>
                            </li>      
                            <li>
                                <a
                                    onClick={() => setViewPage("emp")}
                                    className="block py-2 px-3 text-white rounded hover:bg-amber-600 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0"
                                >
                                    Manage Employee
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => setViewPage("dep")}
                                    className="block py-2 px-3 text-white rounded hover:bg-amber-600 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0"
                                >
                                    Manage Department
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => setViewPage("sal")}
                                    className="block py-2 px-3 text-white rounded hover:bg-amber-600 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0"
                                >
                                    Manage Salary
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block py-2 px-3 text-white bg-amber-900 rounded hover:bg-amber-950 md:hover:bg-transparent md:border-0 md:hover:text-amber-200 md:p-0 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main>
                {viewPage == "dash" &&
                    <main className="max-w-screen-xl mx-auto p-6">
                        <h1 className="text-3xl font-bold text-amber-900 mb-8">Dashboard Overview</h1>


                        {/* Recent Activity Section */}
                        <Sal/>
                     
                    </main>
                }
                {viewPage == "emp" && <Emp />}
                {viewPage == "dep" && <Dep />}
                {viewPage == "sal" && <SalaryManagementApp />}
            </main>
        </>
    );
};

export default Dashboard;