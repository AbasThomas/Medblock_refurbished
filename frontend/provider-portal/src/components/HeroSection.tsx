import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Activity,
    ArrowRight,
    PlayCircle,
    UserCheck,
    FileText,
    BarChart3,
    Search,
    Bell,
    CheckCircle2
} from 'lucide-react'

const HeroSection: React.FC = () => {
    return (
        <section className="relative flex flex-col lg:flex-row items-center pt-32 pb-20 overflow-visible max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-y-1/4 translate-x-1/4"></div>

            {/* Left Content */}
            <div className="w-full lg:w-1/2 z-10 text-center lg:text-left mb-16 lg:mb-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-sm font-semibold text-blue-700 mb-8"
                >
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live Provider Operations
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]"
                >
                    Command your <br className="hidden lg:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Clinical data flow.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
                >
                    A unified dashboard to coordinate care, verify claims, and access trusted patient history in real-time. No silos, just clarity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                    <Link
                        to="/signup"
                        className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        Access Dashboard
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <PlayCircle size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        See how it works
                    </button>
                </motion.div>
            </div>

            {/* Right Visual - Interactive Dashboard Mockup */}
            <div className="w-full lg:w-1/2 relative perspective-1000">
                <motion.div
                    initial={{ opacity: 0, rotateX: 10, y: 40 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-4 max-w-lg mx-auto lg:mr-0 transform-gpu lg:rotate-y-[-5deg] lg:rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700"
                >
                    {/* Mock Browser Header */}
                    <div className="flex items-center gap-2 mb-4 px-2 border-b border-slate-100 pb-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="flex-1 bg-slate-100 h-6 rounded-md ml-4 max-w-[200px] flex items-center px-2 text-[10px] text-slate-400">
                            provider.medblock.app/dashboard
                        </div>
                    </div>

                    {/* Mock Dashboard Body */}
                    <div className="grid grid-cols-12 gap-3 h-[300px]">

                        {/* Sidebar */}
                        <div className="col-span-2 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                                    {i === 0 && <Activity size={16} />}
                                    {i === 1 && <UserCheck size={16} />}
                                    {i === 2 && <FileText size={16} />}
                                    {i === 3 && <BarChart3 size={16} />}
                                </div>
                            ))}
                        </div>

                        {/* Main Content */}
                        <div className="col-span-10 space-y-4">
                            {/* Header Bar */}
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <div className="space-y-1">
                                    <div className="h-2 w-20 bg-slate-300 rounded"></div>
                                    <div className="h-4 w-32 bg-slate-800 rounded"></div>
                                </div>
                                <div className="flex gap-2">
                                    <Search size={16} className="text-slate-400" />
                                    <Bell size={16} className="text-slate-400" />
                                    <div className="w-6 h-6 rounded-full bg-blue-200"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="col-span-2 bg-blue-600 rounded-xl p-4 text-white relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-white/20 rounded-lg"><Activity size={16} /></div>
                                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white/80">+12%</span>
                                        </div>
                                        <div className="h-8 w-1/2 bg-white rounded mb-1"></div>
                                        <div className="h-3 w-1/3 bg-white/50 rounded"></div>
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-10">
                                        <BarChart3 size={80} />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-white border border-slate-100 shadow-sm rounded-xl p-3"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Active Patients
                                    </div>
                                    <div className="h-6 w-12 bg-slate-800 rounded"></div>
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-white border border-slate-100 shadow-sm rounded-xl p-3"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                        Pending Claims
                                    </div>
                                    <div className="h-6 w-12 bg-slate-800 rounded"></div>
                                </motion.div>
                            </div>

                            {/* List Items Animation */}
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        className="bg-white border border-slate-100 p-2 rounded-lg flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100"></div>
                                            <div className="space-y-1">
                                                <div className="h-2 w-24 bg-slate-200 rounded"></div>
                                                <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 1.2 }}
                        className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
                    >
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <div className="bg-slate-900 text-white p-2 rounded-lg">
                                <Activity size={20} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">System Status</p>
                            <p className="text-[10px] text-emerald-600 font-semibold">100% Operational</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection
