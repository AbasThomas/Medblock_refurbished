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
    const [step, setStep] = useState<number>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
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

        if (step < 3) {
            setStep(step + 1)
            return
        }

        if (formData.password.length < 8) {
            setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }))
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
            return
        }

        setIsSubmitting(true)

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
        } catch (error: any) {
            console.error('OTP request failed:', error)
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: error.response?.data?.message || error.message || 'Failed to send verification code. Please try again.',
                confirmButtonColor: '#ef4444',
            })
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
                    className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/5"
                >
                    {/* Progress Bar */}
                    <div className="mb-10">
                        <div className="flex justify-between mb-4">
                            {['Account', 'Identity', 'Organization'].map((label, i) => (
                                <div key={label} className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                                        {step > i + 1 ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${step === i + 1 ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: "33.33%" }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="doctor@hospital.com"
                                                    required
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        placeholder="At least 8 characters"
                                                        required
                                                        className={`w-full rounded-2xl border px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${errors.password ? 'border-rose-300' : 'border-slate-200 bg-slate-50'}`}
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
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        placeholder="Repeat password"
                                                        required
                                                        className={`w-full rounded-2xl border px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${errors.confirmPassword ? 'border-rose-300' : 'border-slate-200 bg-slate-50'}`}
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
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Dr. John Doe"
                                                    required
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Specialty</label>
                                            <select
                                                name="specialty"
                                                required
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
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
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hospital or Clinic Name</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="text"
                                                    name="hospitalName"
                                                    placeholder="General Hospital Lagos"
                                                    required
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                                    value={formData.hospitalName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hospital Type</label>
                                            <select
                                                name="hospitalType"
                                                required
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
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
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4 pt-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Processing...
                                    </>
                                ) : step === 3 ? (
                                    <>Create Account <ArrowRight size={18} /></>
                                ) : (
                                    <>Continue <ArrowRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-slate-500">
                        Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign In</a>
                    </p>
                    <a href={`${PORTAL_URLS.PATIENT}/user-selection`} className="inline-flex items-center gap-2 font-bold text-slate-400 transition hover:text-slate-600 text-sm">
                        <ArrowLeft size={16} />
                        Back to Role Selection
                    </a>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage
