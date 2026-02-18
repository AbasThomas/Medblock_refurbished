import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShieldCheck, Stethoscope, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import logo from '../../../shared/logo.png'
import BackgroundLayer from '../components/BackgroundLayer'

const UserSelection: React.FC = () => {
    const [searchParams] = useSearchParams()
    const mode = searchParams.get('mode') || 'login'
    const isLogin = mode === 'login'

    const patientLink = isLogin ? '/login' : '/register'
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const productionProviderUrl = (import.meta as any).env?.VITE_PROVIDER_PORTAL_URL || 'https://medblock-app-provider.web.app'
    const providerBaseUrl = isLocal ? 'http://localhost:3001' : productionProviderUrl
    const providerLink = isLogin ? `${providerBaseUrl}/login` : `${providerBaseUrl}/signup`

    const actionText = isLogin ? 'Sign in' : 'Create account'

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10">
            <BackgroundLayer />

            <div className="relative z-10 max-w-6xl mx-auto w-full">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="mb-6"
                    >
                        <img src={logo} alt="MEDBLOCK" className="w-24 h-24 object-contain mx-auto" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        {isLogin ? 'Access Your Portal' : 'Choose Your Portal'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.16 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        Continue as a patient or healthcare provider with secure email and password authentication.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.22 }}
                    >
                        <Link to={patientLink} className="block h-full group">
                            <div className="relative h-full bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-sm  transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-blue-100 rounded-bl-full -mr-12 -mt-12 opacity-70 group-hover:scale-110 transition-transform duration-500" />

                                <div className="relative z-10 flex flex-col h-full items-center text-center">
                                    <UserRound size={72} className="text-blue-600 mb-6" />
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{actionText} as Patient</h2>
                                    <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                                        Manage your medical records, consent permissions, and health history in one secure place.
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-blue-700 font-semibold group-hover:gap-3 transition-all">
                                        {isLogin ? 'Enter Patient Portal' : 'Create Patient Account'} <ArrowRight size={20} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <a href={providerLink} className="block h-full group">
                            <div className="relative h-full bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-sm  transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-purple-100 rounded-bl-full -mr-12 -mt-12 opacity-70 group-hover:scale-110 transition-transform duration-500" />

                                <div className="relative z-10 flex flex-col h-full items-center text-center">
                                    <Stethoscope size={72} className="text-purple-600 mb-6" />
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{actionText} as Provider</h2>
                                    <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                                        Access provider workflows for patient records, diagnostics, and consent-aware care delivery.
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-purple-700 font-semibold group-hover:gap-3 transition-all">
                                        {isLogin ? 'Enter Provider Portal' : 'Create Provider Account'} <ArrowRight size={20} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                    className="text-center mt-10"
                >
                    <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/70 border border-white/70 rounded-full px-4 py-2 mb-5">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        Secure email and password sign-in for all roles
                    </div>
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UserSelection


