import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Lock,
    Mail,
    Shield,
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
        <div className="relative min-h-screen overflow-hidden px-4 py-16">
            <BackgroundLayer />
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8"
            >
                <div className="space-y-3 text-center">
                    <img src={logo} alt="MEDBLOCK" className="mx-auto h-32 w-32 object-contain" />
                    <h1 className="text-4xl font-bold text-slate-900">Welcome back</h1>
                    <p className="text-lg text-slate-600">
                        Sign in with email + password or email + PIN and keep your health data accessible only to you.
                    </p>
                </div>

                <div className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10">
                    {error && (
                        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                            <AlertTriangle size={20} />
                            {error}
                        </div>
                    )}

                    <div className="mb-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setAuthMode('password')}
                            className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${authMode === 'password'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-slate-200 text-slate-600 hover:border-blue-300'
                                }`}
                        >
                            Email + Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setAuthMode('pin')}
                            className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${authMode === 'pin'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-slate-200 text-slate-600 hover:border-blue-300'
                                }`}
                        >
                            Email + PIN
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>

                        {authMode === 'password' ? (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    5-digit PIN
                                </label>
                                <input
                                    required
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    maxLength={5}
                                    placeholder="•••••"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center text-sm tracking-[0.3em] text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-600" />
                            <span>Encrypted authentication</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-600" />
                            <span>PIN alternative for trusted devices</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-600" />
                            <span>NIN-aware identity checks</span>
                        </div>
                    </div>
                </div>

                <div className="text-center text-sm text-slate-600">
                    <Link to="/user-selection" className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800">
                        <ArrowLeft size={16} /> Back to role selection
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
