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
    Calendar,
    ChevronRight,
    ChevronLeft,
    FileText,
    Fingerprint
} from 'lucide-react'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '../components/BackgroundLayer'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/api'

// Define the steps and their fields for validation
const STEPS = [
    {
        id: 'account',
        title: 'Account Credentials',
        description: 'Set up your login details',
        fields: ['email', 'password', 'confirmPassword', 'phone']
    },
    {
        id: 'personal',
        title: 'Personal Info',
        description: 'Tell us about yourself',
        fields: ['givenName', 'familyName', 'gender', 'birthDate']
    },
    {
        id: 'security',
        title: 'Security Setup',
        description: 'Verify your identity',
        fields: ['nin', 'pin', 'captcha']
    },
    {
        id: 'consent',
        title: 'Review & Consent',
        description: 'Terms and data processing',
        fields: ['acceptTerms', 'acceptData']
    }
]

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

    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<RegisterForm>(initialForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rememberMe, setRememberMe] = useState(false)
    const [captcha, setCaptcha] = useState('')
    const [captchaCode, setCaptchaCode] = useState('')
    const [pin, setPin] = useState('')
    const [nin, setNin] = useState('')
    // Field-specific errors
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        refreshCaptcha()
    }, [])

    const refreshCaptcha = () => {
        const code = Math.random().toString(36).substring(2, 7).toUpperCase()
        setCaptchaCode(code)
    }

    const onChange = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
        // Clear error for this field if it exists
        if (fieldErrors[key]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[key]
                return newErrors
            })
        }
    }

    const validateStep = (stepIndex: number): boolean => {
        const errors: Record<string, string> = {}
        let isValid = true

        const currentStepId = STEPS[stepIndex].id

        if (currentStepId === 'account') {
            if (!formData.email) errors.email = 'Email is required'
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address'

            if (!formData.password) errors.password = 'Password is required'
            else if (formData.password.length < 8) errors.password = 'Must be at least 8 chars'

            if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'
        }

        if (currentStepId === 'personal') {
            if (!formData.givenName) errors.givenName = 'First Name is required'
            if (!formData.familyName) errors.familyName = 'Last Name is required'
            if (!formData.birthDate) errors.birthDate = 'Date of Birth is required'
        }

        if (currentStepId === 'security') {
            if (nin && !/^\d{11}$/.test(nin)) errors.nin = 'NIN must be 11 digits'
            if (!pin) errors.pin = 'PIN is required'
            else if (!/^\d{5}$/.test(pin)) errors.pin = 'PIN must be 5 digits'

            if (!captcha) errors.captcha = 'CAPTCHA is required'
            else if (captcha.trim().toUpperCase() !== captchaCode) errors.captcha = 'Incorrect CAPTCHA'
        }

        if (currentStepId === 'consent') {
            if (!formData.acceptTerms) errors.acceptTerms = 'Required'
            if (!formData.acceptData) errors.acceptData = 'Required'
        }


        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            isValid = false
            // Show a general error if needed, or just let field errors speak
        } else {
            setFieldErrors({})
        }

        return isValid
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateStep(currentStep)) return

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
        }
    }

    const InputField = ({ label, icon: Icon, error, ...props }: any) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
                <input
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden bg-[#f8fafc]">
            <BackgroundLayer />

            <div className="w-full max-w-5xl z-10 flex flex-col md:flex-row gap-6 items-stretch">

                {/* Left Side: Progress & Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:w-1/3 bg-white rounded-3xl border border-gray-200 shadow-xl p-8 flex flex-col"
                >
                    <div className="mb-8">
                        <img src={logo} alt="MEDBLOCK" className="w-16 h-16 object-contain mb-4" />
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 text-sm mt-2">Join the secure medical blockchain network.</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStep
                            const isCompleted = index < currentStep

                            return (
                                <div key={step.id} className="flex gap-4 relative">
                                    {/* Line connector */}
                                    {index !== STEPS.length - 1 && (
                                        <div className={`absolute left-[15px] top-[32px] bottom-[-24px] w-0.5 ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                    )}

                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-300 ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600' :
                                        isCompleted ? 'border-blue-600 bg-blue-600 text-white' :
                                            'border-slate-200 text-slate-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}
                                    </div>
                                    <div className={`pb-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                        <h3 className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{step.title}</h3>
                                        <p className="text-xs text-slate-500">{step.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Right Side: Form Wizard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:w-2/3 bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-10 flex flex-col relative overflow-hidden"
                >
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center gap-3 text-sm animate-fade-in">
                            <AlertTriangle className="flex-shrink-0" size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* STEP 1: ACCOUNT */}
                                    {currentStep === 0 && (
                                        <div className="space-y-5">
                                            <h2 className="text-xl font-bold text-slate-800 mb-4">Account Credentials</h2>

                                            <InputField
                                                label="Email Address"
                                                icon={Mail}
                                                type="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={(e: any) => onChange('email', e.target.value)}
                                                error={fieldErrors.email}
                                            />

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <InputField
                                                    label="Password"
                                                    icon={Lock}
                                                    type="password"
                                                    placeholder="8+ characters"
                                                    value={formData.password}
                                                    onChange={(e: any) => onChange('password', e.target.value)}
                                                    error={fieldErrors.password}
                                                />
                                                <InputField
                                                    label="Confirm Password"
                                                    icon={Lock}
                                                    type="password"
                                                    placeholder="Repeat password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e: any) => onChange('confirmPassword', e.target.value)}
                                                    error={fieldErrors.confirmPassword}
                                                />
                                            </div>

                                            <InputField
                                                label="Phone Number (Optional)"
                                                icon={Phone}
                                                type="tel"
                                                placeholder="+234..."
                                                value={formData.phone}
                                                onChange={(e: any) => onChange('phone', e.target.value)}
                                            />

                                            <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl">
                                                <input
                                                    id="remember-me"
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor="remember-me" className="text-sm text-slate-700 font-medium">
                                                    Remember me on this device
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: PERSONAL INFO */}
                                    {currentStep === 1 && (
                                        <div className="space-y-5">
                                            <h2 className="text-xl font-bold text-slate-800 mb-4">Personal Information</h2>

                                            <div className="grid grid-cols-2 gap-5">
                                                <InputField
                                                    label="First Name"
                                                    icon={UserRound}
                                                    placeholder="John"
                                                    value={formData.givenName}
                                                    onChange={(e: any) => onChange('givenName', e.target.value)}
                                                    error={fieldErrors.givenName}
                                                />
                                                <InputField
                                                    label="Last Name"
                                                    icon={UserRound}
                                                    placeholder="Doe"
                                                    value={formData.familyName}
                                                    onChange={(e: any) => onChange('familyName', e.target.value)}
                                                    error={fieldErrors.familyName}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                                                <select
                                                    value={formData.gender}
                                                    onChange={(e) => onChange('gender', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                >
                                                    <option value="unknown">Prefer not to say</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <InputField
                                                label="Date of Birth"
                                                icon={Calendar}
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e: any) => onChange('birthDate', e.target.value)}
                                                error={fieldErrors.birthDate}
                                            />
                                        </div>
                                    )}

                                    {/* STEP 3: SECURITY */}
                                    {currentStep === 2 && (
                                        <div className="space-y-5">
                                            <h2 className="text-xl font-bold text-slate-800 mb-4">Security Setup</h2>

                                            <InputField
                                                label="National Identity Number (NIN)"
                                                icon={Fingerprint}
                                                value={nin}
                                                onChange={(e: any) => {
                                                    setNin(e.target.value)
                                                    if (fieldErrors.nin) setFieldErrors(prev => ({ ...prev, nin: '' }))
                                                }}
                                                placeholder="11-digit NIN"
                                                maxLength={11}
                                                error={fieldErrors.nin}
                                            />

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Security PIN</label>
                                                <input
                                                    type="password"
                                                    value={pin}
                                                    onChange={(e) => {
                                                        setPin(e.target.value)
                                                        if (fieldErrors.pin) setFieldErrors(prev => ({ ...prev, pin: '' }))
                                                    }}
                                                    maxLength={5}
                                                    className={`w-full px-4 py-3 bg-gray-50/50 border ${fieldErrors.pin ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-center tracking-[0.5em] text-lg font-mono`}
                                                    placeholder="•••••"
                                                />
                                                {fieldErrors.pin ? (
                                                    <p className="text-xs text-red-500 mt-1">{fieldErrors.pin}</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 mt-1">5-digit numeric PIN for quick access</p>
                                                )}
                                            </div>

                                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-sm font-semibold text-gray-700">Security Check</label>
                                                    <button type="button" onClick={refreshCaptcha} className="text-xs text-blue-600 font-semibold">Refresh Code</button>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-1/3 flex items-center justify-center bg-slate-100/50 rounded-xl border border-slate-200 font-mono text-xl tracking-widest text-slate-700 select-none">
                                                        {captchaCode}
                                                    </div>
                                                    <div className="w-2/3">
                                                        <input
                                                            type="text"
                                                            value={captcha}
                                                            onChange={(e) => {
                                                                setCaptcha(e.target.value)
                                                                if (fieldErrors.captcha) setFieldErrors(prev => ({ ...prev, captcha: '' }))
                                                            }}
                                                            className={`w-full px-4 py-3 bg-gray-50/50 border ${fieldErrors.captcha ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none`}
                                                            placeholder="Enter code"
                                                        />
                                                    </div>
                                                </div>
                                                {fieldErrors.captcha && <p className="text-xs text-red-500">{fieldErrors.captcha}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: CONSENT */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-bold text-slate-800 mb-4">Final Review</h2>

                                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">Terms of Service</h4>
                                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                            By creating an account, you agree to abide by the MEDBLOCK platform rules and regulations regarding acceptable use and security responsibilities.
                                                        </p>
                                                        <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.acceptTerms}
                                                                onChange={(e) => onChange('acceptTerms', e.target.checked)}
                                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                                                            />
                                                            <span className={`text-sm font-medium transition-colors ${formData.acceptTerms ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>I agree to the Terms of Service</span>
                                                        </label>
                                                        {fieldErrors.acceptTerms && <p className="text-xs text-red-500 mt-1 font-semibold">You must accept the terms to proceed</p>}
                                                    </div>
                                                </div>

                                                <div className="w-full h-px bg-blue-200/50"></div>

                                                <div className="flex items-start gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                                        <Shield size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">Data Processing Consent</h4>
                                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                            I consent to the processing of my personal and medical data within the MEDBLOCK secure blockchain environment for healthcare purposes.
                                                        </p>
                                                        <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.acceptData}
                                                                onChange={(e) => onChange('acceptData', e.target.checked)}
                                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                                                            />
                                                            <span className={`text-sm font-medium transition-colors ${formData.acceptData ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>I consent to data processing</span>
                                                        </label>
                                                        {fieldErrors.acceptData && <p className="text-xs text-red-500 mt-1 font-semibold">Consent is required</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-xs">
                                                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                                                <p>Your data is encrypted. Only authorized providers you approve will be able to access your medical records.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 0 || isSubmitting}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>

                            {currentStep === STEPS.length - 1 ? (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Complete Registration <CheckCircle2 size={16} />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                                >
                                    Next Step <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            )}
                        </div>
                    </form>


                </motion.div>
            </div>
        </div>
    )
}
