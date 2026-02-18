import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    CheckCircle2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { requestProviderOtp } from '../services/api'
import Swal from 'sweetalert2'
import BackgroundLayer from '@/components/BackgroundLayer'
import logo from '../../../shared/logo.png'

const SignUpPage: React.FC = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState<'form' | 'generating' | 'complete'>('form')
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
            <BackgroundLayer />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-6xl z-10"
            >
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                    <div className="xl:col-span-2 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-sm p-8">
                        <img src={logo} alt="MEDBLOCK" className="w-24 h-24 object-contain mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Provider Registration</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Create your provider account with email and password, then verify your email to complete onboarding.
                        </p>

                        <div className="space-y-4">
                            {[
                                'Email and password authentication',
                                'Automatic DID-backed provider identity',
                                'FHIR-compatible provider workflows',
                                'Consent-aware patient record access',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="xl:col-span-3">
                        <AnimatePresence mode="wait">
                            {step === 'form' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm p-8 border border-white/60"
                                >
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        placeholder="Dr. John Doe"
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="doctor@hospital.com"
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital or Clinic Name *</label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input
                                                        type="text"
                                                        name="hospitalName"
                                                        placeholder="General Hospital Lagos"
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                        value={formData.hospitalName}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital Type *</label>
                                                <select
                                                    name="hospitalType"
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialty *</label>
                                                <select
                                                    name="specialty"
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        placeholder="At least 8 characters"
                                                        required
                                                        className={`w-full pl-10 pr-10 py-3 bg-gray-50/80 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        placeholder="Repeat password"
                                                        required
                                                        className={`w-full pl-10 pr-10 py-3 bg-gray-50/80 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                                            </div>
                                        </div>

                                        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-blue-900 mb-1">Automatic DID Provisioning</p>
                                                    <p className="text-xs text-blue-700 leading-relaxed">
                                                        Your decentralized provider identity is generated automatically after verification. No wallet connection is required.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!!errors.password || !!errors.confirmPassword}
                                            className="w-full py-3.5 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-sm  transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Create Provider Account <ArrowRight size={20} />
                                        </button>
                                    </form>

                                    <div className="mt-6 text-center pt-6 border-t border-gray-200/60">
                                        <p className="text-sm text-gray-600">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'generating' && (
                                <motion.div
                                    key="generating"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-sm p-12 border border-white/60 text-center"
                                >
                                    <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25" />
                                        <div className="relative bg-white p-4 rounded-full shadow-sm border border-blue-100">
                                            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Preparing Provider Identity</h2>
                                    <p className="text-gray-600 mb-8">Sending verification code and securing your provider credentials...</p>

                                    <div className="space-y-4 max-w-sm mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Requesting verification OTP</span>
                                            <span className="text-green-600 font-medium">In progress</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Initializing provider identity</span>
                                            <span className="text-blue-600 font-medium">Encrypting</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a href={`${PORTAL_URLS.PATIENT}/user-selection`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} /> Back to Role Selection
                    </a>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage

