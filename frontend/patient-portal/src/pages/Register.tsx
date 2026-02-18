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

export default function Register() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [formData, setFormData] = useState<RegisterForm>(initialForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onChange = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

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

        setIsSubmitting(true)
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
            })

            login(result.did, result.patient_id, result.accessToken)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to create account')
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
                className="w-full max-w-6xl z-10"
            >
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                    <div className="xl:col-span-2">
                        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-sm p-8 h-full">
                            <img src={logo} alt="MEDBLOCK" className="w-24 h-24 object-contain mb-6" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">Create Your Patient Account</h1>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Register with email and password, then access your records securely from any authorized device.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'Email and password authentication',
                                    'Consent-managed access control',
                                    'Immutable audit visibility of record access',
                                    'Secure encrypted medical data handling',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-3 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm p-6 md:p-10 border border-white/60">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm">
                                <AlertTriangle className="flex-shrink-0" size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.givenName}
                                                onChange={(e) => onChange('givenName', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.familyName}
                                                onChange={(e) => onChange('familyName', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => onChange('gender', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="unknown">Prefer not to say</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => onChange('birthDate', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => onChange('email', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => onChange('phone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="+234..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                required
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => onChange('password', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="At least 8 characters"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                required
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => onChange('confirmPassword', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="Re-enter password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptTerms}
                                            onChange={(e) => onChange('acceptTerms', e.target.checked)}
                                            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">I agree to the Terms and Conditions</span>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptData}
                                            onChange={(e) => onChange('acceptData', e.target.checked)}
                                            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">I consent to processing of my medical data</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-200 shadow-sm  disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-4">
                    <Link to="/user-selection" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors inline-flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Role Selection
                    </Link>
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}


