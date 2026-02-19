import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'
import { PORTAL_URLS } from '@medblock/shared'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Shield, CheckCircle, LogIn, ChevronRight } from 'lucide-react'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '@/components/BackgroundLayer'
import { apiService } from '../services/api'
import Swal from 'sweetalert2'
import { getRecentProviders, addRecentProvider } from '../utils/storage'

export default function Login() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [recentProviders, setRecentProviders] = useState<any[]>([])
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadRecentProviders()
    }, [])

    const loadRecentProviders = () => {
        const providers = getRecentProviders()
        setRecentProviders(providers)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await apiService.loginProvider(formData.email, formData.password)

            addRecentProvider({
                name: response.name || formData.email,
                email: formData.email,
                did: response.did,
                hospitalName: response.hospitalName,
            })

            login(response.name || formData.email, response.did, response.accessToken)

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
            })

            navigate('/dashboard')
        } catch (error: any) {
            console.error('Login failed:', error)
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || error.message || 'Invalid credentials. Please check your email and password.',
                confirmButtonColor: '#2563eb',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleQuickAccess = (provider: any) => {
        setFormData(prev => ({ ...prev, email: provider.email }))
        const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
        if (passwordInput) passwordInput.focus()
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-[#f8fafc]">
            <BackgroundLayer />

            {/* Left Panel - Branding & Info */}
            <div className="hidden lg:flex w-5/12 bg-slate-900 text-white relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <img src={logo} alt="MEDBLOCK" className="w-12 h-12 object-contain bg-white/10 rounded-xl p-1" />
                        <h1 className="text-2xl font-bold tracking-tight">MEDBLOCK <span className="text-blue-400 font-light block text-sm">Provider Portal</span></h1>
                    </div>

                    <div className="space-y-6 max-w-md">
                        <h2 className="text-4xl font-bold leading-tight">Secure Healthcare Management</h2>
                        <p className="text-slate-300 text-lg">Access patient records, manage authorizations, and ensure secure data exchange on the blockchain.</p>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Enterprise Security</h3>
                                <p className="text-slate-400 text-sm">DID-backed identity verification</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {['End-to-end encryption', 'Immutable audit logs', 'Role-based access control'].map(item => (
                                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle size={16} className="text-emerald-400" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-slate-500">
                        © 2026 MEDBLOCK Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative">
                <div className="w-full max-w-md space-y-8">

                    <div className="lg:hidden text-center mb-8">
                        <img src={logo} alt="MEDBLOCK" className="w-16 h-16 object-contain mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-slate-900">Provider Login</h1>
                        <p className="text-slate-500">Secure access to provider dashboard</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="doctor@hospital.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-blue-900/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>Login <ChevronRight size={18} /></>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Quick Access Section */}
                    {recentProviders.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Quick Access</h3>
                            </div>
                            <div className="space-y-2">
                                {recentProviders.slice(0, 3).map((provider, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickAccess(provider)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 transition-all border border-transparent hover:border-slate-200 group text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {provider.name?.charAt(0) || 'P'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate group-hover:text-blue-700 transition-colors">{provider.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{provider.hospitalName || provider.email}</p>
                                        </div>
                                        <LogIn size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div className="text-center space-y-4">
                        <Link to={`${PORTAL_URLS.PATIENT}/user-selection`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">
                            <ArrowLeft size={16} /> Back to Role Selection
                        </Link>
                        <p className="text-sm text-slate-400">
                            Looking for the Patient Portal? <a href={PORTAL_URLS.PATIENT} className="text-blue-600 hover:underline">Go here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
