import React, { useState, useEffect } from 'react';
import logo from '../../../shared/logo.png';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', id: 'home' },
        { name: 'Problem', id: 'problem' },
        { name: 'Solution', id: 'solution' },
        { name: 'Features', id: 'features' },
        { name: 'Use Cases', id: 'use-cases' },
        { name: 'Security', id: 'security' },
        { name: 'Contact', id: 'contact' },
    ];

    const handleAuthAction = (action: 'login' | 'register') => {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const PRODUCTION_PATIENT_URL = (import.meta as any).env?.VITE_PATIENT_PORTAL_URL || 'https://medblock-app.web.app';
        const PATIENT_BASE_URL = isLocal ? 'http://localhost:3000' : PRODUCTION_PATIENT_URL;

        // Redirect to UserSelection page in Patient Portal
        window.location.href = `${PATIENT_BASE_URL}/user-selection?mode=${action}`;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
            <div
                className={`w-full max-w-7xl rounded-2xl transition-all duration-300 ${isScrolled
                    ? 'bg-white/45 backdrop-blur-2xl py-3'
                    : 'bg-white/30 backdrop-blur-2xl py-4'
                    }`}
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => scrollToSection('home')}
                        >
                            <img src={logo} alt="MEDBLOCK" className="h-14 w-14 object-contain mr-3" />
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold text-[#20305B] leading-none">
                                    MEDBLOCK
                                </h1>
                                <span className="hidden lg:block text-[10px] text-slate-500 font-bold tracking-tight mt-1">
                                    PROVIDER CARE NETWORK
                                </span>
                            </div>
                        </div>

                        <div className="hidden xl:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium hover:text-blue-700 hover:bg-white/50 transition-all ${isScrolled ? 'text-slate-700' : 'text-slate-800'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={() => handleAuthAction('login')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all inline-flex items-center gap-2 ${isScrolled
                                    ? 'text-blue-700 hover:bg-white/70'
                                    : 'text-blue-700 hover:bg-white/50'
                                    }`}
                            >
                                <LogIn size={16} />
                                Login
                            </button>

                            <button
                                onClick={() => handleAuthAction('register')}
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
                            >
                                <UserPlus size={16} />
                                Sign Up
                            </button>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`p-2 rounded-lg ${isScrolled ? 'text-slate-700' : 'text-slate-800'
                                    }`}
                            >
                                <span className="sr-only">Open menu</span>
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 border-t border-slate-200/60 pt-4 pb-2">
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => scrollToSection(link.id)}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-700 hover:bg-white/70 rounded-lg"
                                    >
                                        {link.name}
                                    </button>
                                ))}
                                <div className="pt-4 border-t border-slate-200/60 mt-2 space-y-3">
                                    <button
                                        onClick={() => handleAuthAction('login')}
                                        className="block w-full text-center px-4 py-2 text-base font-medium text-blue-700 border border-blue-600/60 rounded-lg hover:bg-white/70"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleAuthAction('register')}
                                        className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

