import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Shield, Lock, Users, Activity, Fingerprint, QrCode } from 'lucide-react'

const HeroSection: React.FC = () => {
    // 3D Card Effect Logic
    const cardRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 50, damping: 20 })
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 })

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseXVal = e.clientX - rect.left
        const mouseYVal = e.clientY - rect.top
        const xPct = mouseXVal / width - 0.5
        const yPct = mouseYVal / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <section className="relative flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-12 lg:py-24 max-w-7xl mx-auto overflow-visible">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    MEDBLOCK Patient Portal
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 tracking-tight"
                >
                    Your Health Identity. <br />
                    <span className="text-blue-600">
                        Secure & Portable.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                >
                    Own your medical history with a blockchain-secured passport. Share access instantly with doctors, labs, and HMOs—only when you say so.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                >
                    <Link
                        to="/register"
                        className="group relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-slate-900/20 hover:-translate-y-1"
                    >
                        Create My Account
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                    >
                        Log in to existing account
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                >
                    {/* Trust indicators could go here */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        <Shield size={16} /> NDPR Compliant
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        <Lock size={16} /> AES-256 Encryption
                    </div>
                </motion.div>
            </div>

            {/* Right Visual - 3D Card */}
            <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative perspective-1000 flex items-center justify-center">

                {/* Decorative Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full -z-10"></div>

                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full max-w-md aspect-[1.586/1] rounded-[2rem] bg-slate-900 p-8 shadow-2xl shadow-slate-900/20 cursor-pointer group"
                >
                    {/* Card Shine Effect */}
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>

                    {/* Card Content Layer 1 (Base) */}
                    <div className="relative z-10 h-full flex flex-col justify-between text-white/90">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md border border-blue-500/30">
                                    <Activity className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight tracking-wide">MEDBLOCK</h3>
                                    <p className="text-xs text-blue-300 font-mono tracking-wider uppercase">Universal Health ID</p>
                                </div>
                            </div>
                            <QrCode className="text-white/20" size={32} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-end gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg border border-white/10">
                                    <Users size={28} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Patient Name</p>
                                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">ID Number</p>
                                    <p className="font-mono text-blue-200 tracking-widest text-sm">•••• •••• •••• 8842</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valid Thru</p>
                                    <p className="font-mono text-white text-sm">12/29</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements (Parallax) */}
                    <motion.div
                        style={{ x: useTransform(mouseX, [-0.5, 0.5], [-10, 10]), y: useTransform(mouseY, [-0.5, 0.5], [-10, 10]) }}
                        className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-30 flex items-center gap-3"
                    >
                        <div className="bg-emerald-100 p-2 rounded-full">
                            <Shield className="text-emerald-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Verified</p>
                            <p className="text-xs text-slate-500">Identity Confirmed</p>
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ x: useTransform(mouseX, [-0.5, 0.5], [15, -15]), y: useTransform(mouseY, [-0.5, 0.5], [15, -15]) }}
                        className="absolute -bottom-4 -left-8 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 z-30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Fingerprint className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">Biometric</p>
                                <p className="text-xs text-slate-500">Access Enabled</p>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection
