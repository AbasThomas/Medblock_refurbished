import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../shared/logo.png';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';

const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'Use Cases', id: 'use-cases' },
    { name: 'Security', id: 'security' },
    { name: 'Impact', id: 'impact' },
    { name: 'Contact', id: 'contact' },
];

const Navbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const handleAuthAction = (action: 'login' | 'register') => {
        navigate(`/user-selection?mode=${action}`);
    };

    useEffect(() => {
        const onRouteChange = () => setMobileMenuOpen(false);
        window.addEventListener('resize', onRouteChange);
        return () => window.removeEventListener('resize', onRouteChange);
    }, []);

    return (
        <nav className="fixed inset-x-0 top-0 z-50 px-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-[36px] border border-white/40 bg-white/10 px-6 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-3xl">
                <button
                    className="flex items-center gap-3 text-left"
                    onClick={() => scrollToSection('home')}
                >
                    <img src={logo} alt="MEDBLOCK" className="h-16 w-16 object-contain" />
                    <div>
                        <div className="text-lg font-extrabold tracking-[0.3em] text-slate-900">MEDBLOCK</div>
                        <div className="text-xs uppercase text-slate-500">Patient Portal</div>
                    </div>
                </button>

                <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="transition-colors duration-200 hover:text-blue-600"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleAuthAction('login')}
                        className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
                    >
                        <LogIn size={16} />
                        Login
                    </button>
                    <button
                        onClick={() => handleAuthAction('register')}
                        className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
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
                <div className="mt-3 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-3xl lg:hidden">
                    <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
                        {navLinks.map((link) => (
                            <button
                                key={`mobile-${link.id}`}
                                onClick={() => scrollToSection(link.id)}
                                className="text-left transition-colors duration-150 hover:text-blue-600"
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="mt-3 flex flex-col gap-2">
                            <button
                                onClick={() => handleAuthAction('login')}
                                className="w-full rounded-2xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleAuthAction('register')}
                                className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar

