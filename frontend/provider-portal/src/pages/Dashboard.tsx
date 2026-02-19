import { motion, Variants } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { apiService } from '../services/api'
import {
    UserGroupIcon,
    File01Icon,
    Clock01Icon,
    Activity01Icon,
    AlertCircleIcon,
    ArrowRight01Icon,
    Search01Icon,
    Upload01Icon,
    Shield01Icon,
    ChartLineData01Icon,
    ArtificialIntelligence01Icon
} from 'hugeicons-react'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
}

export default function Dashboard() {
    const { providerName } = useContext(AuthContext)
    const navigate = useNavigate()

    const [dashboardStats, setDashboardStats] = useState<{
        activePatients: number;
        recordsUploaded: number;
        pendingRequests: number;
        interoperabilityCount: number;
        systemStatus: {
            blockchain: string;
            fhirApi: string;
            didService: string;
        }
    }>({
        activePatients: 0,
        recordsUploaded: 0,
        pendingRequests: 0,
        interoperabilityCount: 0,
        systemStatus: {
            blockchain: 'Checking...',
            fhirApi: 'Checking...',
            didService: 'Checking...'
        }
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiService.getDashboardStats()
                if (data) {
                    setDashboardStats(prev => ({
                        ...prev,
                        ...data,
                        systemStatus: {
                            ...prev.systemStatus,
                            ...(data.systemStatus || {})
                        }
                    }))
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error)
            }
        }
        fetchStats()
    }, [])

    const stats = [
        {
            title: 'Active Patients',
            value: dashboardStats.activePatients.toString(),
            icon: UserGroupIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Records Uploaded',
            value: dashboardStats.recordsUploaded.toString(),
            icon: File01Icon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Pending Requests',
            value: dashboardStats.pendingRequests.toString(),
            icon: Clock01Icon,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            title: 'Interoperability',
            value: dashboardStats.interoperabilityCount.toString(),
            icon: Activity01Icon,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
    ]

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3"
                    >
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                        Live Network Status: Synchronized
                    </motion.div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Command Overview
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <div className="pr-4 py-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Practitioners</p>
                        <p className="text-xs font-bold text-slate-900">12 Online in Network</p>
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 transition-transform group-hover:scale-105">
                        <ArtificialIntelligence01Icon size={18} />
                        Blockchain EMR Activated
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
                        Welcome back, <br />
                        <span className="text-blue-500">{providerName || 'Physician'}</span>.
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium max-w-lg">
                        Your clinical workspace is secured by <span className="text-white font-bold">End-to-End Cryptography</span>. Access real-time patient insights now.
                    </p>
                </div>

                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute right-20 bottom-10 p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 hidden lg:block"
                >
                    <Activity01Icon size={80} className="text-blue-500/40" />
                </motion.div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon size={28} />
                            </div>
                            <ChartLineData01Icon size={20} className="text-slate-200" />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Operations */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Operations</h2>
                        <div className="h-px flex-1 bg-slate-100 mx-6 hidden sm:block" />
                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">View All Tasks</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            {
                                title: 'Search for Patients',
                                desc: 'Find patients by DID or wallet address for record access.',
                                icon: Search01Icon,
                                color: 'text-blue-600',
                                bg: 'bg-blue-50',
                                action: () => navigate('/patients/search'),
                                btn: 'Execute Search'
                            },
                            {
                                title: 'Upload Medical Records',
                                desc: 'Commit new clinical observations to the blockchain.',
                                icon: Upload01Icon,
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-50',
                                action: () => navigate('/patients/search'),
                                btn: 'Push to Chain'
                            },
                            {
                                title: 'Request Patient Consent',
                                desc: 'Establish verifiable consent bridges for data access.',
                                icon: Shield01Icon,
                                color: 'text-indigo-600',
                                bg: 'bg-indigo-50',
                                action: () => navigate('/patients/search'),
                                btn: 'Bridge Consent'
                            }
                        ].map((op, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                className="flex flex-col sm:flex-row sm:items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className={`p-5 rounded-[1.5rem] ${op.bg} ${op.color} group-hover:scale-110 transition-transform`}>
                                    <op.icon size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{op.title}</h3>
                                    <p className="text-sm font-medium text-slate-500">{op.desc}</p>
                                </div>
                                <button
                                    onClick={op.action}
                                    className={`px-6 py-3 rounded-xl ${op.bg} ${op.color} font-black text-[10px] uppercase tracking-widest hover:brightness-95 transition-all active:scale-95`}
                                >
                                    {op.btn}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* System & Actions Side */}
                <motion.div
                    variants={itemVariants}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Infrastructure</h2>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8">
                        {/* Status List */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Systems</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Cardano Node', status: dashboardStats?.systemStatus?.blockchain, active: 'Connected' },
                                    { name: 'FHIR API', status: dashboardStats?.systemStatus?.fhirApi, active: 'Active' },
                                    { name: 'Identity Service', status: dashboardStats?.systemStatus?.didService, active: 'Online' }
                                ].map((sys, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${sys.status === sys.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className="text-xs font-bold text-slate-700">{sys.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${sys.status === sys.active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {sys.status || 'Offline'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Nav */}
                        <div className="space-y-4 pt-8 border-t border-slate-50">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interoperability</h3>
                            <button
                                onClick={() => navigate('/interoperability')}
                                className="w-full flex items-center justify-between p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <Activity01Icon size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Cross-Chain Sync</span>
                                </div>
                                <ArrowRight01Icon size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 flex gap-5">
                        <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm h-fit">
                            <Shield01Icon size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 tracking-tight mb-2">Immutable Protocol</h4>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                Authorized by Cardano blockchain. Your clinical actions are audit-compliant and cryptographically signed.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
