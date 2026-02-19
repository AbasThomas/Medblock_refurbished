import { motion, Variants } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { apiService } from '../services/api'
import favicon from '../../../shared/logo.png'
import {
    UserGroupIcon,
    File01Icon,
    Clock01Icon,
    ActivityIcon,
    AlertCircleIcon,
    ArrowRight01Icon,
    Search01Icon,
    Upload01Icon,
    Shield01Icon,
    TrendingUpIcon,
} from 'hugeicons-react'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
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
            stiffness: 100
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
                        // Ensure systemStatus is preserved or merged if partial data comes back
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

    // Real-time stats fetched from API
    const stats = [
        {
            title: 'Active Patients',
            value: dashboardStats.activePatients.toString(),
            change: 'Total patients in system',
            icon: UserGroupIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Records Uploaded',
            value: dashboardStats.recordsUploaded.toString(),
            change: 'Medical records stored',
            icon: File01Icon,
            color: 'bg-emerald-500'
        },
        {
            title: 'Pending Requests',
            value: dashboardStats.pendingRequests.toString(),
            change: 'Consent requests pending',
            icon: Clock01Icon,
            color: 'bg-amber-500'
        },
        {
            title: 'Interoperability',
            value: dashboardStats.interoperabilityCount.toString(),
            change: 'Connected systems',
            icon: ActivityIcon,
            color: 'bg-indigo-500'
        },
    ]

    const handleSearchPatients = () => {
        navigate('/patients/search')
    }

    const handleUploadRecords = () => {
        // Navigate to first patient or show message
        navigate('/patients/search')
    }

    const handleRequestConsent = () => {
        navigate('/patients/search')
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[#20305B]">MEDBLOCK</h1>
                    <img src={favicon} alt="MEDBLOCK" className="h-20 w-20 object-contain" />
                </div>
                <span className="hidden md:block text-xs text-gray-500 font-medium tracking-wider">
                    NIGERIA'S BLOCKCHAIN EMR INFRASTRUCTURE
                </span>
            </div>
            {/* Welcome Section */}
            <motion.div
                variants={itemVariants}
                className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white shadow-xl relative overflow-hidden"
            >
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">
                        <ActivityIcon size={16} />
                        Command Center Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Welcome back, {providerName || 'Doctor'}.</h1>
                    <p className="text-slate-400 text-xl leading-relaxed font-medium">Access clinical insights and manage patient data with blockchain security.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600/10 -skew-x-12 transform origin-bottom-left" />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="h-full w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-xl ${stat.color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                                <stat.icon size={28} className={stat.color.replace('bg-', 'text-')} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Getting Started */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Getting Started</h2>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
                        >
                            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-600">
                                <Search01Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1">Search for Patients</h3>
                                <p className="text-sm text-slate-500 mb-4">Find patients by their DID or wallet address to access their medical records.</p>
                                <button
                                    onClick={handleSearchPatients}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 group"
                                >
                                    Start Searching <ArrowRight01Icon size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
                        >
                            <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-600">
                                <File01Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1">Upload Medical Records</h3>
                                <p className="text-sm text-slate-500 mb-4">Add new observations, diagnoses, and medical records to the blockchain.</p>
                                <button
                                    onClick={handleUploadRecords}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 group"
                                >
                                    Upload Records <ArrowRight01Icon size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
                        >
                            <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-600">
                                <Shield01Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1">Request Patient Consent</h3>
                                <p className="text-sm text-slate-500 mb-4">Request access to patient records with blockchain-verified consent.</p>
                                <button
                                    onClick={handleRequestConsent}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group"
                                >
                                    Request Access <ArrowRight01Icon size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    variants={itemVariants}
                    className="h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <motion.button
                            onClick={handleSearchPatients}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-blue-600 rounded-xl hover:bg-slate-100 transition-colors group border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <Search01Icon size={22} />
                                <span className="font-bold">Search Patients</span>
                            </div>
                            <ArrowRight01Icon size={18} className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                        </motion.button>

                        <motion.button
                            onClick={handleUploadRecords}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-emerald-600 rounded-xl hover:bg-slate-100 transition-colors group border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <Upload01Icon size={22} />
                                <span className="font-bold">Upload Records</span>
                            </div>
                            <ArrowRight01Icon size={18} className="text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
                        </motion.button>

                        <motion.button
                            onClick={handleRequestConsent}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-indigo-600 rounded-xl hover:bg-slate-100 transition-colors group border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <Shield01Icon size={22} />
                                <span className="font-bold">Request Consent</span>
                            </div>
                            <ArrowRight01Icon size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                        </motion.button>

                        <motion.button
                            onClick={() => navigate('/interoperability')}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors group border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <ActivityIcon size={22} />
                                <span className="font-bold">Interoperability</span>
                            </div>
                            <ArrowRight01Icon size={18} className="text-slate-300 group-hover:text-slate-700 transition-all group-hover:translate-x-1" />
                        </motion.button>
                    </div>

                    {/* System Status */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Blockchain</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${dashboardStats?.systemStatus?.blockchain === 'Connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span className={`text-xs font-medium ${dashboardStats?.systemStatus?.blockchain === 'Connected' ? 'text-green-600' : 'text-yellow-600'}`}>{dashboardStats?.systemStatus?.blockchain || 'Unknown'}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">FHIR API</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${dashboardStats?.systemStatus?.fhirApi === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span className={`text-xs font-medium ${dashboardStats?.systemStatus?.fhirApi === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{dashboardStats?.systemStatus?.fhirApi || 'Unknown'}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">DID Service</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${dashboardStats?.systemStatus?.didService === 'Online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span className={`text-xs font-medium ${dashboardStats?.systemStatus?.didService === 'Online' ? 'text-green-600' : 'text-yellow-600'}`}>{dashboardStats?.systemStatus?.didService || 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Info Banner */}
            <motion.div
                variants={itemVariants}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4"
            >
                <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                    <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Blockchain-Secured Healthcare</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        All patient records are secured on the Cardano blockchain with FHIR R4 compliance.
                        Every action is immutable, transparent, and verifiable.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

