import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Lock,
    Mail,
    Phone,
    Shield,
    UserRound,
} from 'lucide-react'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '../components/BackgroundLayer'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/api'

type RegisterForm = {
    givenName: string
    familyName: string
    gender: string
    birthDate: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
    acceptData: boolean
}

const initialForm: RegisterForm = {
    givenName: '',
    familyName: '',
    gender: 'unknown',
    birthDate: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptData: false,
}

const highlights = [
    'Email and password authentication',
    'Consent-managed access control',
    'Immutable audit traces',
    'Secure handling of medical data',
]

export default function Register() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [formData, setFormData] = useState<RegisterForm>(initialForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rememberMe, setRememberMe] = useState(false)
    const [captcha, setCaptcha] = useState('')
    const [captchaCode, setCaptchaCode] = useState('')
    const [pin, setPin] = useState('')
    const [nin, setNin] = useState('')
    const [pinError, setPinError] = useState('')
    const [captchaError, setCaptchaError] = useState('')
    const [step, setStep] = useState<'form' | 'generating'>('form')

    useEffect(() => {
        const code = Math.random().toString(36).substring(2, 7).toUpperCase()
        setCaptchaCode(code)
    }, [])

    const onChange = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setPinError('')
        setCaptchaError('')

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (!formData.acceptTerms || !formData.acceptData) {
            setError('Please accept both consent checkboxes to continue.')
            return
        }

        if (!/^\d{5}$/.test(pin)) {
            setPinError('PIN must be exactly five digits.')
            return
        }

        if (captcha.trim().toUpperCase() !== captchaCode) {
            setCaptchaError('CAPTCHA does not match.')
            return
        }

        setIsSubmitting(true)
        setStep('generating')
        try {
            const result = await apiService.registerPatient({
                email: formData.email,
                password: formData.password,
                name: [
                    {
                        given: [formData.givenName],
                        family: formData.familyName,
                    },
                ],
                gender: formData.gender,
                birth_date: formData.birthDate || undefined,
                telecom: formData.phone ? [{ system: 'phone', value: formData.phone }] : [],
                address: [],
                nin: nin || undefined,
                pin,
            })

            login(result.did, result.patient_id, result.accessToken)
            if (rememberMe) {
                localStorage.setItem('patient_remember', 'true')
            } else {
                localStorage.removeItem('patient_remember')
            }
            navigate('/dashboard')
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to create account')
        } finally {
            setIsSubmitting(false)
            setStep('form')
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-16">
            <BackgroundLayer />
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10"
            >
                <div className="space-y-4 text-center">
                    <img src={logo} alt="MEDBLOCK" className="mx-auto h-32 w-32 object-contain" />
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Create your patient account</h1>
                        <p className="mx-auto mt-2 max-w-2xl text-lg text-slate-600">
                            Register securely with email, password, PIN, and NIN verification for trusted access.
                        </p>
                    </div>
                    <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3 text-sm text-slate-600">
                        {highlights.map((item) => (
                            <span key={item} className="rounded-2xl border border-slate-200 px-4 py-2">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10"
                >
                    <AnimatePresence mode="wait">
                        {step === 'form' && (
                            <motion.div
                                key="form-content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {error && (
                                    <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                                        <AlertTriangle size={20} />
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                                            <div className="relative">
                                                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.givenName}
                                                    onChange={(e) => onChange('givenName', e.target.value)}
                                                    placeholder="John"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                                            <div className="relative">
                                                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.familyName}
                                                    onChange={(e) => onChange('familyName', e.target.value)}
                                                    placeholder="Doe"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => onChange('gender', e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            >
                                                <option value="unknown">Prefer not to say</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => onChange('birthDate', e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => onChange('email', e.target.value)}
                                                    placeholder="john.doe@example.com"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => onChange('phone', e.target.value)}
                                                    placeholder="+234..."
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => onChange('password', e.target.value)}
                                                    placeholder="At least 8 characters"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                                                    placeholder="Re-enter your password"
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">National ID (NIN)</label>
                                            <input
                                                type="text"
                                                value={nin}
                                                onChange={(e) => setNin(e.target.value)}
                                                placeholder="e.g., 12345678901"
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Security PIN
                                                {pinError && <span className="text-rose-600 text-xs font-normal ml-2">{pinError}</span>}
                                            </label>
                                            <input
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                maxLength={5}
                                                placeholder="•••••"
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center text-sm tracking-[0.3em] text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="remember-me-signup"
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="remember-me-signup" className="text-sm text-slate-700 font-medium">
                                                Remember me on this device
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Security CAPTCHA</label>
                                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-mono text-slate-800">
                                                <span className="tracking-[0.4em]">{captchaCode}</span>
                                                <button
                                                    type="button"
                                                    className="text-blue-600 font-semibold"
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
                                                placeholder="Enter CAPTCHA code"
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 tracking-[0.3em]"
                                            />
                                            {captchaError && <p className="text-xs text-rose-600">{captchaError}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700">
                                        <p className="font-semibold text-blue-900">Consent & transparency</p>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptTerms}
                                                onChange={(e) => onChange('acceptTerms', e.target.checked)}
                                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            I agree to the Terms and Conditions
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptData}
                                                onChange={(e) => onChange('acceptData', e.target.checked)}
                                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            I consent to processing of my medical data
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                                        {isSubmitting ? 'Creating account...' : 'Create account'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 'generating' && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6 text-center"
                            >
                                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                                    <Loader2 size={40} className="animate-spin text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Preparing your identity</h2>
                                <p className="text-sm text-slate-500">
                                    Verifying your email, generating your secure PIN, and provisioning a DID.
                                </p>
                                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Verification email</span>
                                        <span className="font-semibold text-blue-600">In progress</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Identity provisioning</span>
                                        <span className="font-semibold text-blue-600">Encrypting</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="space-y-2 text-center text-sm text-slate-600">
                    <Link to="/user-selection" className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800">
                        <ArrowLeft size={16} /> Back to role selection
                    </Link>
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
