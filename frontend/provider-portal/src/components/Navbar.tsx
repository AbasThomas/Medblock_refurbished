import React, { useState, useEffect } from 'react';
import logo from '../../../shared/logo.png';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';

const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Workflow', id: 'workflow' },
    { name: 'Use Cases', id: 'use-cases' },
    { name: 'Security', id: 'security' },
    { name: 'Contact', id: 'contact' },
];

const Navbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleAuthAction = (action: 'login' | 'register') => {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const PRODUCTION_PATIENT_URL = (import.meta as any).env?.VITE_PATIENT_PORTAL_URL || 'https://medblock-app.web.app';
        const PATIENT_BASE_URL = isLocal ? 'http://localhost:3000' : PRODUCTION_PATIENT_URL;
        window.location.href = `${PATIENT_BASE_URL}/user-selection?mode=${action}`;
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const resetMenu = () => setMobileMenuOpen(false);
        window.addEventListener('resize', resetMenu);
        return () => window.removeEventListener('resize', resetMenu);
    }, []);

    return (
        <nav className="fixed inset-x-0 top-0 z-50 px-4">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 border border-white/30 bg-white/10 backdrop-blur-xl shadow-lg shadow-slate-900/10">
                <button
                    className="flex items-center gap-3 text-left"
                    onClick={() => scrollToSection('home')}
                >
                    <img src={logo} alt="MEDBLOCK" className="h-16 w-16 object-contain" />
                    <div>
                        <div className="text-lg font-extrabold tracking-[0.3em] text-slate-900">MEDBLOCK</div>
                        <div className="text-xs uppercase text-slate-600">Provider Portal</div>
                    </div>
                </button>

                <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="transition-colors duration-200 hover:text-blue-600 uppercase"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleAuthAction('login')}
                        className="flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:border-blue-400"
                    >
                        <LogIn size={16} />
                        Login
                    </button>
                    <button
                        onClick={() => handleAuthAction('register')}
                        className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <UserPlus size={16} />
                        Sign Up
                    </button>
                    <button
                        className="lg:hidden p-2 text-slate-600"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="mt-3 px-4 lg:hidden">
                    <div className="rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl p-4 space-y-2 shadow-lg">
                        {navLinks.map((link) => (
                            <button
                                key={`mobile-${link.id}`}
                                onClick={() => scrollToSection(link.id)}
                                className="w-full text-left text-sm font-semibold text-slate-700 hover:text-blue-600 uppercase"
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="pt-2 border-t border-slate-200/60" />
                        <button
                            onClick={() => handleAuthAction('login')}
                            className="w-full rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => handleAuthAction('register')}
                            className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar

