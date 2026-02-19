"use client"

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
  Calendar,
  FileUp,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
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

const issuingAuthorities = ['MDCN', 'NMCN', 'State Ministry of Health', 'Pharmacists Council of Nigeria', 'Other']

const STEPS = [
  { id: 'account', title: 'Account', description: 'Credentials & PIN' },
  { id: 'identity', title: 'Identity', description: 'Name & specialty' },
  { id: 'credentials', title: 'Credentials', description: 'Licensing verification' },
  { id: 'consent', title: 'Consent', description: 'Agreements & privacy' },
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
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
      <input
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-gray-50/50 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'} rounded-xl focus:ring-4 outline-none transition-all duration-200 text-sm text-slate-700`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Provider Registration</h1>
            <p className="text-slate-500 text-sm mt-2">Join Nigeria’s national EMR infrastructure.</p>
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
              <a href="/login" className="text-blue-600 font-semibold hover:underline">
                Sign in
              </a>
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
                  {currentStep === 0 && (
                    <div className="space-y-5">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">Account Credentials</h2>
                      <InputField
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        name="email"
                        placeholder="doctor@hospital.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                          label="Password"
                          icon={Lock}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="At least 8 characters"
                          value={formData.password}
                          onChange={handleChange}
                          error={errors.password}
                        />
                        <InputField
                          label="Confirm Password"
                          icon={Lock}
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          error={errors.confirmPassword}
                        />
                      </div>

                      <div className="flex gap-3 text-xs text-slate-500">
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          {showPassword ? 'Hide password' : 'Show password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          {showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Security PIN</label>
                        <input
                          type="password"
                          name="pin"
                          value={formData.pin}
                          onChange={handleChange}
                          maxLength={5}
                          className={`w-full px-4 py-3 bg-gray-50/50 border ${errors.pin ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-center tracking-[0.5em] text-lg font-mono`}
                          placeholder="•••••"
                        />
                        {errors.pin ? (
                          <p className="text-xs text-red-500 mt-1">{errors.pin}</p>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1 text-center">5-digit numeric PIN for quick access</p>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">Identity Details</h2>
                      <InputField
                        label="Full Name"
                        icon={User}
                        type="text"
                        name="fullName"
                        placeholder="Dr. Jane Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialty</label>
                          <select
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700"
                          >
                            <option value="">Select specialty</option>
                            {specialties.map((spec) => (
                              <option key={spec} value={spec}>
                                {spec}
                              </option>
                            ))}
                          </select>
                          {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty}</p>}
                        </div>
                        <InputField
                          label="Hospital or Clinic"
                          icon={Building}
                          type="text"
                          name="hospitalName"
                          placeholder="General Hospital Lagos"
                          value={formData.hospitalName}
                          onChange={handleChange}
                          error={errors.hospitalName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Institution Type</label>
                        <select
                          name="hospitalType"
                          value={formData.hospitalType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700"
                        >
                          <option value="">Select type</option>
                          {hospitalTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.hospitalType && <p className="text-xs text-red-500 mt-1">{errors.hospitalType}</p>}
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">Professional Credentials</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                          label="Medical License Number"
                          icon={Shield}
                          type="text"
                          name="medicalLicenseNumber"
                          placeholder="e.g., MDCN/2024/12345"
                          value={formData.medicalLicenseNumber}
                          onChange={handleChange}
                          error={errors.medicalLicenseNumber}
                        />
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issuing Authority</label>
                          <select
                            name="issuingAuthority"
                            value={formData.issuingAuthority}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm text-slate-700"
                          >
                            <option value="">Select authority</option>
                            {issuingAuthorities.map((authority) => (
                              <option key={authority} value={authority}>
                                {authority}
                              </option>
                            ))}
                          </select>
                          {errors.issuingAuthority && <p className="text-xs text-red-500 mt-1">{errors.issuingAuthority}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                          label="Years of Experience (optional)"
                          icon={Calendar}
                          type="number"
                          min={0}
                          name="yearsExperience"
                          placeholder="e.g., 8"
                          value={formData.yearsExperience}
                          onChange={handleChange}
                        />
                        <InputField
                          label="License Expiry Date"
                          icon={Calendar}
                          type="date"
                          name="licenseExpiryDate"
                          value={formData.licenseExpiryDate}
                          onChange={handleChange}
                          error={errors.licenseExpiryDate}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                          <FileUp size={18} />
                          Verification Document (PDF/Image)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleDocumentUpload}
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm text-slate-700"
                        />
                        {verificationDocument && (
                          <p className="text-xs text-slate-500 mt-1">Uploaded: {verificationDocument.name}</p>
                        )}
                        {errors.verificationDocument && <p className="text-xs text-red-500 mt-1">{errors.verificationDocument}</p>}
                      </div>
                      <InputField
                        label="National Identity Number (NIN)"
                        icon={Fingerprint}
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
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">Consent & Review</h2>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                            <Shield size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm">Terms of Service</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              I agree to the MEDBLOCK Terms of Service and professional conduct policy.
                            </p>
                            <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                              />
                              <span className={`text-sm font-medium transition-colors ${formData.acceptTerms ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>I agree to the Terms of Service</span>
                            </label>
                            {errors.acceptTerms && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.acceptTerms}</p>}
                          </div>
                        </div>

                        <div className="w-full h-px bg-blue-200/50"></div>

                        <div className="flex items-start gap-4">
                          <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                            <Shield size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm">Data Processing Consent</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              I consent to secure processing and hashing of my identity and credential data on MEDBLOCK.
                            </p>
                            <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                name="acceptData"
                                checked={formData.acceptData}
                                onChange={(e) => setFormData(prev => ({ ...prev, acceptData: e.target.checked }))}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                              />
                              <span className={`text-sm font-medium transition-colors ${formData.acceptData ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>I consent to data processing</span>
                            </label>
                            {errors.acceptData && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.acceptData}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-[11px]">
                        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>Uploaded documents are encrypted and hashed on Cardano. Verification alerts will be sent once processed.</p>
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
                <ArrowLeft size={16} /> Back
              </button>

              {currentStep === STEPS.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      Complete Registration <ArrowRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                >
                  Next Step <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </form>

          <p className="text-xs text-slate-400 mt-6 text-center">
            Need a patient account instead?{' '}
            <a href={`${PORTAL_URLS.PATIENT}/register`} className="text-blue-600 font-semibold hover:underline">
              Switch to patient signup
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUpPage
