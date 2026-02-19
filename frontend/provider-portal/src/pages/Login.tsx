"use client"

import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../App'
import { PORTAL_URLS } from '@medblock/shared'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft, Eye, EyeOff, LogIn, ChevronRight, CheckCircle } from 'lucide-react'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '@/components/BackgroundLayer'
import { apiService } from '../services/api'
import Swal from 'sweetalert2'
import { getRecentProviders, addRecentProvider } from '../utils/storage'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [recentProviders, setRecentProviders] = useState<any[]>([])
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadRecentProviders()
  }, [])

  const loadRecentProviders = () => {
    const providers = getRecentProviders()
    setRecentProviders(providers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await apiService.loginProvider(formData.email, formData.password)
      addRecentProvider({
        name: response.name || formData.email,
        email: formData.email,
        did: response.did,
        hospitalName: response.hospitalName,
      })
      login(response.name || formData.email, response.did, response.accessToken)

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })

      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully',
      })

      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login failed:', error)
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || error.message || 'Invalid credentials. Please check your email and password.',
        confirmButtonColor: '#2563eb',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickAccess = (provider: any) => {
    setFormData((prev) => ({ ...prev, email: provider.email }))
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement
    if (passwordInput) passwordInput.focus()
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#f8fafc]">
      <BackgroundLayer />
      <div className="flex-1 flex flex-col lg:flex-row items-stretch">
        <div className="hidden lg:flex lg:w-5/12 bg-slate-900/80 text-white p-10 flex-col justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="MEDBLOCK" className="w-12 h-12 object-contain bg-white/10 rounded-xl p-1" />
              <div>
                <h1 className="text-3xl font-black tracking-tight">MEDBLOCK</h1>
                <span className="text-xs text-blue-400 uppercase tracking-[0.5em]">Provider Portal</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold leading-tight">Secure healthcare management</h2>
            <p className="text-slate-300 mt-4 text-lg">Access patient records, manage authorizations, and exchange data with blockchain confidence.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.5em] text-slate-300">Security Snapshot</p>
              {['End-to-end encryption', 'Immutable audit logs', 'Role-based access control'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              © 2026 MEDBLOCK Inc. Building Nigeria’s blockchain EMR infrastructure.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-xl space-y-10">
            <div className="lg:hidden text-center space-y-2">
              <img src={logo} alt="MEDBLOCK" className="w-16 h-16 mx-auto" />
              <h1 className="text-3xl font-black text-slate-900">Provider Login</h1>
              <p className="text-sm text-slate-500">Secure access to the MEDBLOCK provider console</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-[32px] p-8 space-y-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-semibold shadow-xl shadow-blue-600/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing...' : 'Login'}
                  {!isSubmitting && <ChevronRight size={18} />}
                </button>
              </form>
            </motion.div>

            {recentProviders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Access</p>
                  <span className="text-xs text-slate-400">{recentProviders.length} saved</span>
                </div>
                <div className="space-y-3">
                  {recentProviders.slice(0, 3).map((provider, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAccess(provider)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-slate-200 transition"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {provider.name?.charAt(0) || 'P'}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-slate-900 truncate">{provider.name}</p>
                        <p className="text-xs text-slate-500 truncate">{provider.hospitalName || provider.email}</p>
                      </div>
                      <LogIn size={16} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="text-center space-y-3">
              <Link to={`${PORTAL_URLS.PATIENT}/user-selection`} className="inline-flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 font-medium">
                <ArrowLeft size={16} /> Back to Role Selection
              </Link>
              <p className="text-xs text-slate-400">
                Need the patient console? <a href={PORTAL_URLS.PATIENT} className="text-blue-600 hover:underline">Go here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
