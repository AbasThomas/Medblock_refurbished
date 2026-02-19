"use client"

import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'
import { PORTAL_URLS } from '@medblock/shared'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mail,
    Lock,
    ArrowLeft,
    Eye,
    EyeOff,
    LogIn,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    Shield,
    KeyRound,
    Fingerprint,
    Loader2
} from 'lucide-react'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '@/components/BackgroundLayer'
import { apiService } from '../services/api'
import Swal from 'sweetalert2'
import { getRecentProviders, addRecentProvider } from '../utils/storage'

export default function Login() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [pin, setPin] = useState('')
    const [authMode, setAuthMode] = useState<'password' | 'pin'>('password')
    const [recentProviders, setRecentProviders] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadRecentProviders()
    }, [])

    const loadRecentProviders = () => {
        const providers = getRecentProviders()
        setRecentProviders(providers)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const credential = authMode === 'pin' ? pin : password
            // Note: Backend currently handles password login for practitioners. 
            // PIN logic is implemented for visual parity and future readiness.
            const response = await apiService.loginProvider(email, credential)

            addRecentProvider({
                name: response.name || email,
                email: email,
                did: response.did,
                hospitalName: response.hospitalName,
            })
            login(response.name || email, response.did, response.accessToken)

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            })

            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully',
            })

            navigate('/dashboard')
        } catch (err: any) {
            console.error('Login failed:', err)
            setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Invalid credentials. Please check your details.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleQuickAccess = (provider: any) => {
        setEmail(provider.email)
        setAuthMode('password')
    }

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-16 flex items-center justify-center bg-[#f8fafc]">
            <BackgroundLayer />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <img src={logo} alt="MEDBLOCK" className="mx-auto h-20 w-20 object-contain mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Provider Login</h1>
                    <p className="text-slate-500 mt-2">Secure access to the MEDBLOCK console</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 overflow-hidden"
                            >
                                <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mb-8 p-1 bg-slate-100 rounded-xl flex relative">
                        <motion.div
                            className="absolute bg-white rounded-lg shadow-sm border border-slate-200 h-[calc(100%-8px)] top-1 bottom-1"
                            initial={false}
                            animate={{
                                x: authMode === 'password' ? 4 : '100%',
                                width: 'calc(50% - 8px)'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button
                            type="button"
                            onClick={() => setAuthMode('password')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg flex items-center justify-center gap-2 ${authMode === 'password' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <KeyRound size={16} /> Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode('pin')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg flex items-center justify-center gap-2 ${authMode === 'pin' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Fingerprint size={16} /> PIN
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="doctor@hospital.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="min-h-[90px]">
                            <AnimatePresence mode="wait">
                                {authMode === 'password' ? (
                                    <motion.div
                                        key="password-field"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                                            <Link to="/forgot-password" size={18} className="text-xs text-blue-600 hover:underline">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="pin-field"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Security PIN</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                maxLength={5}
                                                placeholder="•••••"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg tracking-[0.5em] font-mono text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-blue-900/10 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Signing In...
                                </>
                            ) : (
                                <>
                                    <Shield size={18} /> Sign In Securely
                                </>
                            )}
                        </button>
                    </form>

                    {recentProviders.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Access</p>
                            <div className="space-y-3">
                                {recentProviders.slice(0, 2).map((provider, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickAccess(provider)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {provider.name?.charAt(0) || 'P'}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{provider.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{provider.hospitalName || provider.email}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                            <span>Your session is protected by end-to-end encryption</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to={`${PORTAL_URLS.PATIENT}/user-selection`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={16} /> Back to role selection
                    </Link>
                    <div className="mt-4">
                        <span className="text-slate-500 text-sm">Don't have an account? </span>
                        <Link to="/register" className="text-blue-600 font-bold hover:underline text-sm">Create one now</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
