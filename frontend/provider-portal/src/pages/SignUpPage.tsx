import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PORTAL_URLS } from '@medblock/shared'
import {
    Shield,
    User,
    Mail,
    Lock,
    Building,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { requestProviderOtp } from '../services/api'
import Swal from 'sweetalert2'
import BackgroundLayer from '@/components/BackgroundLayer'
import logo from '../../../shared/logo.png'

const hospitalTypes = [
    'General Hospital',
    'Specialist Hospital',
    'Teaching Hospital',
    'Private Clinic',
    'Diagnostic Center',
    'Maternity Home',
    'Dental Clinic',
    'Eye Clinic',
    'Orthopedic Center',
    'Psychiatric Hospital',
]

const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Obstetrics and Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
]

const SignUpPage: React.FC = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState<'form' | 'generating'>('form')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        hospitalName: '',
        hospitalType: '',
        specialty: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        if (name === 'password') {
            if (value.length < 8) {
                setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }))
            } else {
                setErrors((prev) => ({ ...prev, password: '' }))
            }
        }

        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
            } else {
                setErrors((prev) => ({ ...prev, confirmPassword: '' }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password.length < 8) {
            setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }))
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
            return
        }

        setStep('generating')

        try {
            const res = await requestProviderOtp({
                fullName: formData.fullName,
                email: formData.email,
                hospitalName: formData.hospitalName,
                hospitalType: formData.hospitalType,
                specialty: formData.specialty,
                password: formData.password,
            })
            navigate('/verify-otp', {
                state: {
                    email: formData.email,
                    registrationData: {
                        fullName: formData.fullName,
                        email: formData.email,
                        hospitalName: formData.hospitalName,
                        hospitalType: formData.hospitalType,
                        specialty: formData.specialty,
                        password: formData.password,
                    },
                    devOtp: res?.devOtp,
                },
            })
            setStep('form')
        } catch (error: any) {
            console.error('OTP request failed:', error)
            setStep('form')
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: error.response?.data?.message || error.message || 'Failed to send verification code. Please try again.',
                confirmButtonColor: '#ef4444',
            })
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
                <div className="space-y-3 text-center">
                    <img src={logo} alt="MEDBLOCK" className="mx-auto h-32 w-32 object-contain" />
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Provider registration</h1>
                        <p className="mx-auto mt-2 max-w-2xl text-lg text-slate-600">
                            Create your provider account with email and password, then verify your email to complete onboarding.
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10"
                >
                    <AnimatePresence mode="wait">
                        {step === 'form' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Dr. John Doe"
                                                    required
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="doctor@hospital.com"
                                                    required
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hospital or Clinic Name *</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    name="hospitalName"
                                                    placeholder="General Hospital Lagos"
                                                    required
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                    value={formData.hospitalName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hospital Type *</label>
                                            <select
                                                name="hospitalType"
                                                required
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                value={formData.hospitalType}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Type</option>
                                                {hospitalTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Specialty *</label>
                                            <select
                                                name="specialty"
                                                required
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                value={formData.specialty}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Specialty</option>
                                                {specialties.map((spec) => (
                                                    <option key={spec} value={spec}>
                                                        {spec}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="At least 8 characters"
                                                    required
                                                    className={`w-full rounded-2xl border px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.password ? 'border-rose-300' : 'border-slate-200 bg-slate-50/80'}`}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    placeholder="Repeat password"
                                                    required
                                                    className={`w-full rounded-2xl border px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.confirmPassword ? 'border-rose-300' : 'border-slate-200 bg-slate-50/80'}`}
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>}
                                        </div>

                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700">
                                            <div className="flex items-start gap-3">
                                                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-blue-900 mb-1">Automatic DID Provisioning</p>
                                                    <p className="text-xs text-blue-700">
                                                        Your decentralized provider identity is generated automatically after verification. No wallet connection is required.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!!errors.password || !!errors.confirmPassword}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                                        >
                                            <ArrowRight size={18} />
                                            Create Provider Account
                                        </button>
                                    </div>
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
                                <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-50" />
                                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Preparing Provider Identity</h2>
                                <p className="text-sm text-slate-500">Sending verification code and securing your provider credentials...</p>
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Requesting verification OTP</span>
                                        <span className="font-semibold text-blue-600">In progress</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Initializing provider identity</span>
                                        <span className="font-semibold text-blue-600">Encrypting</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="text-center text-sm text-slate-600">
                    <a href={`${PORTAL_URLS.PATIENT}/user-selection`} className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800">
                        <ArrowLeft size={16} />
                        Back to Role Selection
                    </a>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage
