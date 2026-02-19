"use client"

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PORTAL_URLS } from '@medblock/shared'
import {
  Shield01Icon,
  UserIcon,
  Mail01Icon,
  AccessIcon,
  Hospital01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ViewIcon,
  ViewOffIcon,
  Calendar01Icon,
  Upload01Icon,
  Tick01Icon,
  AlertCircleIcon,
  FingerPrintIcon,
} from 'hugeicons-react'
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

const issuingAuthorities = ['MDCN', 'NMCN', 'State Ministry of Health', 'Pharmacists Council of Nigeria', 'Other']

const STEPS = [
  { id: 'account', title: 'Account Credentials', description: 'Email, password & PIN' },
  { id: 'identity', title: 'Professional Identity', description: 'Name, specialty, institution' },
  { id: 'credentials', title: 'Credentials', description: 'Licensing + documents' },
  { id: 'consent', title: 'Consent Review', description: 'Agree to policies' },
]

type SignUpForm = {
  fullName: string
  email: string
  hospitalName: string
  hospitalType: string
  specialty: string
  password: string
  confirmPassword: string
  nin: string
  pin: string
  medicalLicenseNumber: string
  yearsExperience: string
  issuingAuthority: string
  licenseExpiryDate: string
  acceptTerms: boolean
  acceptData: boolean
}

const initialForm: SignUpForm = {
  fullName: '',
  email: '',
  hospitalName: '',
  hospitalType: '',
  specialty: '',
  password: '',
  confirmPassword: '',
  nin: '',
  pin: '',
  medicalLicenseNumber: '',
  yearsExperience: '',
  issuingAuthority: '',
  licenseExpiryDate: '',
  acceptTerms: false,
  acceptData: false,
}

const InputField = ({ label, icon: Icon, error, ...props }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />}
      <input
        className={`w-full rounded-2xl border px-5 py-4 pl-12 text-sm font-medium focus:bg-white focus:outline-none transition-all ${error ? 'border-rose-200 bg-rose-50/30 focus:ring-rose-500/10 focus:border-rose-500' : 'border-slate-200 bg-slate-50/30 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm'
          }`}
        {...props}
      />
    </div>
    {error && <p className="text-[10px] font-bold text-rose-600 mt-2 ml-1 uppercase tracking-wider">{error}</p>}
  </div>
)

const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationDocument, setVerificationDocument] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<SignUpForm>(initialForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setVerificationDocument(file)
    if (file && errors.verificationDocument) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.verificationDocument
        return next
      })
    }
  }

  const validateStep = (stepIndex: number) => {
    const stepId = STEPS[stepIndex].id
    const stepErrors: Record<string, string> = {}

    if (stepId === 'account') {
      if (!formData.email) stepErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) stepErrors.email = 'Invalid email'
      if (!formData.password) stepErrors.password = 'Password is required'
      else if (formData.password.length < 8) stepErrors.password = 'At least 8 characters'
      if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = 'Passwords must match'
      if (!formData.pin || !/^\d{5}$/.test(formData.pin)) stepErrors.pin = 'Enter a 5-digit PIN'
    }

    if (stepId === 'identity') {
      if (!formData.fullName) stepErrors.fullName = 'Full name is required'
      if (!formData.specialty) stepErrors.specialty = 'Specialty is required'
      if (!formData.hospitalName) stepErrors.hospitalName = 'Institution name is required'
      if (!formData.hospitalType) stepErrors.hospitalType = 'Select hospital type'
    }

    if (stepId === 'credentials') {
      if (!formData.nin || !/^\d{11}$/.test(formData.nin)) stepErrors.nin = 'Valid 11-digit NIN'
      if (!formData.medicalLicenseNumber) stepErrors.medicalLicenseNumber = 'License number is required'
      if (!formData.issuingAuthority) stepErrors.issuingAuthority = 'Issuing authority is required'
      if (!formData.licenseExpiryDate) stepErrors.licenseExpiryDate = 'Expiry date is required'
      if (!verificationDocument) stepErrors.verificationDocument = 'Upload a verification document'
    }

    if (stepId === 'consent') {
      if (!formData.acceptTerms) stepErrors.acceptTerms = 'Required'
      if (!formData.acceptData) stepErrors.acceptData = 'Required'
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return
    if (currentStep < STEPS.length - 1) {
      handleNext()
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
        nin: formData.nin,
        pin: formData.pin,
        medicalLicenseNumber: formData.medicalLicenseNumber,
        yearsExperience: formData.yearsExperience,
        issuingAuthority: formData.issuingAuthority,
        licenseExpiryDate: formData.licenseExpiryDate,
      })
      navigate('/verify-otp', {
        state: {
          email: formData.email,
          registrationData: {
            ...formData,
            verificationDocumentName: verificationDocument?.name,
          },
          devOtp: res?.devOtp,
        },
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.response?.data?.message || error.message || 'Failed to send verification code',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#f8fafc] relative overflow-hidden">
      <BackgroundLayer />
      <div className="w-full max-w-6xl z-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        {/* Left Sidebar - Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <img src={logo} alt="MEDBLOCK" className="h-14 w-14 mb-8 bg-white/10 p-2 rounded-2xl" />
            <h1 className="text-4xl font-black mb-4 leading-tight">Provider Registration</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
              Onboard with your license, consent to secure blockchain architecture, and manage patients in a trusted national EMR.
            </p>

            <div className="space-y-8 flex-1">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                return (
                  <div key={step.id} className="flex gap-6 relative group">
                    {index !== STEPS.length - 1 && (
                      <div className={`absolute left-[19px] top-[42px] bottom-[-24px] w-[2px] ${isCompleted ? 'bg-blue-500' : 'bg-slate-800'}`} />
                    )}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {isCompleted ? <Tick01Icon size={20} /> : index + 1}
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-black tracking-widest ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{step.title}</p>
                      <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Already onboarded?{' '}
                <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600/5 -skew-x-12 transform origin-bottom-left pointer-events-none" />
        </motion.div>

        {/* Right Form Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 md:p-14 relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {currentStep === 0 && (
                  <div className="space-y-8">
                    <div className="mb-2">
                      <h2 className="text-3xl font-black text-slate-900 leading-none">Account Credentials</h2>
                      <p className="text-slate-500 font-medium mt-3">Start by setting up your secure entrance</p>
                    </div>

                    <InputField
                      label="Email Address"
                      icon={Mail01Icon}
                      type="email"
                      name="email"
                      placeholder="doctor@hospital.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <InputField
                          label="Password"
                          icon={AccessIcon}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="8+ characters"
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-[46px] text-slate-400 hover:text-blue-600 transition-colors p-1"
                        >
                          {showPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
                        </button>
                      </div>
                      <div className="relative">
                        <InputField
                          label="Confirm Password"
                          icon={AccessIcon}
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          error={errors.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-4 top-[46px] text-slate-400 hover:text-blue-600 transition-colors p-1"
                        >
                          {showConfirmPassword ? <ViewOffIcon size={18} /> : <ViewIcon size={18} />}
                        </button>
                      </div>
                    </div>
                    <InputField
                      label="Security PIN"
                      icon={FingerPrintIcon}
                      type="password"
                      name="pin"
                      placeholder="5-digit security PIN"
                      maxLength={5}
                      value={formData.pin}
                      onChange={handleChange}
                      error={errors.pin}
                    />
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="mb-2">
                      <h2 className="text-3xl font-black text-slate-900 leading-none">Identity Details</h2>
                      <p className="text-slate-500 font-medium mt-3">Help us verify your professional status</p>
                    </div>

                    <InputField
                      label="Full Name"
                      icon={UserIcon}
                      type="text"
                      name="fullName"
                      placeholder="Dr. Jane Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      error={errors.fullName}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Specialty</label>
                        <select
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        >
                          <option value="">Select specialty</option>
                          {specialties.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                        {errors.specialty && <p className="text-[10px] font-bold text-rose-600 mt-2 ml-1 uppercase tracking-wider">{errors.specialty}</p>}
                      </div>
                      <InputField
                        label="Hospital or Clinic"
                        icon={Hospital01Icon}
                        type="text"
                        name="hospitalName"
                        placeholder="Institution Name"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        error={errors.hospitalName}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Institution Type</label>
                      <select
                        name="hospitalType"
                        value={formData.hospitalType}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                      >
                        <option value="">Select type</option>
                        {hospitalTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.hospitalType && <p className="text-[10px] font-bold text-rose-600 mt-2 ml-1 uppercase tracking-wider">{errors.hospitalType}</p>}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="mb-2">
                      <h2 className="text-3xl font-black text-slate-900 leading-none">Professional Credentials</h2>
                      <p className="text-slate-500 font-medium mt-3">Secure verification of your medical license</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField
                        label="License Number"
                        icon={Shield01Icon}
                        type="text"
                        name="medicalLicenseNumber"
                        placeholder="MDCN/2024/12345"
                        value={formData.medicalLicenseNumber}
                        onChange={handleChange}
                        error={errors.medicalLicenseNumber}
                      />
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Issuing Authority</label>
                        <select
                          name="issuingAuthority"
                          value={formData.issuingAuthority}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        >
                          <option value="">Select authority</option>
                          {issuingAuthorities.map((authority) => (
                            <option key={authority} value={authority}>
                              {authority}
                            </option>
                          ))}
                        </select>
                        {errors.issuingAuthority && <p className="text-[10px] font-bold text-rose-600 mt-2 ml-1 uppercase tracking-wider">{errors.issuingAuthority}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField
                        label="Exp. Years (optional)"
                        icon={Calendar01Icon}
                        type="number"
                        min={0}
                        name="yearsExperience"
                        placeholder="Years"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                      />
                      <InputField
                        label="License Expiry"
                        icon={Calendar01Icon}
                        type="date"
                        name="licenseExpiryDate"
                        value={formData.licenseExpiryDate}
                        onChange={handleChange}
                        error={errors.licenseExpiryDate}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Verification Document (PDF/Image)</label>
                      <div className="relative group">
                        <Upload01Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleDocumentUpload}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 px-5 py-4 pl-12 text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        />
                      </div>
                      {verificationDocument && (
                        <p className="text-[10px] font-bold text-emerald-600 mt-2 ml-1 uppercase tracking-wider">Ready to upload: {verificationDocument.name}</p>
                      )}
                      {errors.verificationDocument && <p className="text-[10px] font-bold text-rose-600 mt-2 ml-1 uppercase tracking-wider">{errors.verificationDocument}</p>}
                    </div>
                    <InputField
                      label="National ID (NIN)"
                      icon={FingerPrintIcon}
                      type="text"
                      name="nin"
                      placeholder="11-digit NIN"
                      value={formData.nin}
                      maxLength={11}
                      onChange={handleChange}
                      error={errors.nin}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="mb-2">
                      <h2 className="text-3xl font-black text-slate-900 leading-none">Consent & Review</h2>
                      <p className="text-slate-500 font-medium mt-3">Final confirmation of our secure protocols</p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-start gap-4 p-6 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-blue-100 rounded-[2rem] cursor-pointer transition-all duration-300">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                          className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                        />
                        <span className="text-sm font-medium text-slate-700 leading-relaxed">
                          I agree to the MEDBLOCK <span className="text-blue-600 font-bold">Terms of Service</span> and professional conduct policy.
                        </span>
                      </label>
                      {errors.acceptTerms && <p className="text-[10px] font-bold text-rose-600 ml-1 uppercase tracking-wider">{errors.acceptTerms}</p>}

                      <label className="flex items-start gap-4 p-6 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-blue-100 rounded-[2rem] cursor-pointer transition-all duration-300">
                        <input
                          type="checkbox"
                          name="acceptData"
                          checked={formData.acceptData}
                          onChange={(e) => setFormData(prev => ({ ...prev, acceptData: e.target.checked }))}
                          className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                        />
                        <span className="text-sm font-medium text-slate-700 leading-relaxed">
                          I consent to secure processing and hashing of my identity data on the <span className="text-blue-600 font-bold">blockchain</span>.
                        </span>
                      </label>
                      {errors.acceptData && <p className="text-[10px] font-bold text-rose-600 ml-1 uppercase tracking-wider">{errors.acceptData}</p>}
                    </div>

                    <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 flex gap-4 text-amber-900 text-xs font-medium leading-relaxed">
                      <AlertCircleIcon size={20} className="flex-shrink-0 text-amber-600" />
                      Verification documents are encrypted. Approval codes will be sent to your registered email.
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center pt-12">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed opacity-0' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <ArrowLeft01Icon size={18} /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-500/20 flex items-center gap-3 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {currentStep < STEPS.length - 1 ? (
                  <>
                    Next Step <ArrowRight01Icon size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                ) : isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield01Icon size={20} />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight01Icon size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center lg:hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Need a patient account instead?{' '}
              <a href={`${PORTAL_URLS.PATIENT}/register`} className="text-blue-600 hover:underline">
                Switch to patient signup
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUpPage
