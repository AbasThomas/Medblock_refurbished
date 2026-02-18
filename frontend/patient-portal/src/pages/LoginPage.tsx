import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Lock,
    Mail,
    Shield,
    Fingerprint,
    KeyRound
} from 'lucide-react'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '../components/BackgroundLayer'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/api'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [pin, setPin] = useState('')
    const [authMode, setAuthMode] = useState<'password' | 'pin'>('password')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (authMode === 'pin' && !/^\d{5}$/.test(pin)) {
            setError('PIN must be exactly five digits.')
            return
        }

        if (authMode === 'password' && password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        setIsSubmitting(true)
        try {
            const credential = authMode === 'pin' ? pin : password
            const result = await apiService.loginPatient(email, credential, authMode)
            login(result.did, result.patient_id, result.accessToken)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Login failed')
        } finally {
            setIsSubmitting(false)
        }
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
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your patient portal</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100"
                        >
                            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div className="mb-8 p-1 bg-slate-100/80 rounded-xl flex relative">
                        {/* Sliding Background */}
                        <motion.div
                            className="absolute bg-white rounded-lg shadow-sm border border-slate-200/50 h-[calc(100%-8px)] top-1 bottom-1"
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
                            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg flex items-center justify-center gap-2 ${authMode === 'password' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <KeyRound size={16} /> Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode('pin')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg flex items-center justify-center gap-2 ${authMode === 'pin' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
                                }`}
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
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
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
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
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
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Security PIN
                                        </label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                maxLength={5}
                                                placeholder="•••••"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-center text-lg tracking-[0.5em] font-mono text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                            <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                            <span>Your session is protected by end-to-end encryption</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/user-selection" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
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
