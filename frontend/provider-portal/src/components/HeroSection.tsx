import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Activity,
    ArrowRight,
    Database,
    PlayCircle,
    Shield,
    Users,
} from 'lucide-react'

const HeroSection: React.FC = () => {
    const stats = [
        { icon: Shield, label: 'Security Layer', value: 'Audit-ready controls' },
        { icon: Database, label: 'FHIR Exchange', value: 'Interoperable records' },
        { icon: Users, label: 'Care Teams', value: 'Cross-facility collaboration' },
        { icon: Activity, label: 'Live Access', value: 'Faster clinical context' },
    ]

    return (
        <section className="relative flex flex-col items-center pt-[130px] mb-20 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-200"
                >
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs font-bold text-blue-700 border border-blue-200">
                        <Activity size={14} />
                        Live
                    </span>
                    Provider operations on trusted shared records
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 max-w-5xl leading-tight"
                >
                    Empowering Providers with
                    <span className="block text-blue-700">
                        Trusted Care Intelligence
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-10 leading-relaxed font-medium"
                >
                    Coordinate care, claims, and diagnostics with secure interoperable records built for real provider workflows.
                </motion.p>

                <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + idx * 0.08, duration: 0.45 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur-sm text-left"
                        >
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                <stat.icon size={34} />
                            </div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                            <div className="text-sm font-semibold text-gray-900 mt-1">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.45 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                    <Link
                        to="/signup"
                        className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-700 flex items-center gap-2"
                    >
                        Join as Provider
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                    >
                        <PlayCircle size={24} />
                        Explore Features
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection
