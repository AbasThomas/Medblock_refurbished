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
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
            <BackgroundLayer />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-5xl z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-sm p-8 text-center space-y-4">
                        <img src={logo} alt="MEDBLOCK" className="w-24 h-24 object-contain mx-auto" />
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 leading-relaxed">
                            Sign in with your preferred credential—email + password or email + PIN—and keep your data ready on
                            trusted devices.
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-emerald-600 mt-0.5" />
                                <p className="text-sm text-gray-700">Encrypted authentication</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-emerald-600 mt-0.5" />
                                <p className="text-sm text-gray-700">Alternative PIN sign-in</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-emerald-600 mt-0.5" />
                                <p className="text-sm text-gray-700">Verified NIN handling</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm p-6 md:p-10 border border-white/60">
                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm">
                                <AlertTriangle className="flex-shrink-0" size={18} />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setAuthMode('password')}
                                className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm border ${authMode === 'password'
                                    ? 'bg-blue-600 text-white border-transparent'
                                    : 'text-gray-600 border-gray-200 hover:border-blue-400'
                                    }`}
                            >
                                Email + Password
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthMode('pin')}
                                className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm border ${authMode === 'pin'
                                    ? 'bg-blue-600 text-white border-transparent'
                                    : 'text-gray-600 border-gray-200 hover:border-blue-400'
                                    }`}
                            >
                                Email + PIN
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>

                            {authMode === 'password' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">5-digit PIN</label>
                                    <input
                                        required
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        maxLength={5}
                                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none tracking-[0.2em]"
                                        placeholder="•••••"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/user-selection" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors inline-flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Role Selection
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
