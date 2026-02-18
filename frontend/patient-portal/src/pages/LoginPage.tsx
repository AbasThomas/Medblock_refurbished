import { useState, useEffect } from 'react'
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
    const [nin, setNin] = useState('')
    const [pin, setPin] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [captcha, setCaptcha] = useState('')
    const [captchaCode, setCaptchaCode] = useState('')
    const [pinError, setPinError] = useState('')

    useEffect(() => {
        const generate = () => {
            const code = Math.random().toString(36).substring(2, 7).toUpperCase()
            setCaptchaCode(code)
        }
        generate()
    }, [])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setPinError('')

        if (captcha.trim().toUpperCase() !== captchaCode) {
            setError('CAPTCHA does not match.')
            return
        }

        if (!/^\d{5}$/.test(pin)) {
            setPinError('PIN must contain exactly five digits.')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await apiService.loginPatient(email, password)
            login(result.did, result.patient_id, result.accessToken)
            if (rememberMe) {
                localStorage.setItem('patient_remember', 'true')
            } else {
                localStorage.removeItem('patient_remember')
            }
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
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-sm p-8">
                        <img src={logo} alt="MEDBLOCK" className="w-24 h-24 object-contain mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Sign in with your email and password to access your patient dashboard.
                        </p>

                        <div className="space-y-4">
                            {[
                                'Secure email and password login',
                                'Consent and record history visibility',
                                'Encrypted medical data workflows',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm p-6 md:p-10 border border-white/60">
                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm">
                                <AlertTriangle className="flex-shrink-0" size={18} />
                                {error}
                            </div>
                        )}

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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIN (optional)</label>
                                    <input
                                        type="text"
                                        value={nin}
                                        onChange={(e) => setNin(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="National Identification Number"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-1.5">
                                        <span>5-digit PIN</span>
                                        {pinError && <span className="text-rose-600 text-xs font-normal">{pinError}</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        maxLength={5}
                                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none tracking-widest"
                                        placeholder="•••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="remember-me" className="text-sm text-gray-700 font-medium">
                                    Remember me on this device
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Security CAPTCHA</label>
                                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/90">
                                    <span className="tracking-widest text-lg font-mono text-gray-900">{captchaCode}</span>
                                    <button
                                        type="button"
                                        className="text-blue-600 text-sm font-semibold"
                                        onClick={() =>
                                            setCaptchaCode(Math.random().toString(36).substring(2, 7).toUpperCase())
                                        }
                                    >
                                        Refresh
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={captcha}
                                    onChange={(e) => setCaptcha(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none tracking-[0.2em]"
                                    placeholder="Enter CAPTCHA code"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-200 shadow-sm  disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="text-sm text-gray-500 mt-6 text-center">
                            Do not have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                                Create account
                            </Link>
                        </p>
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


