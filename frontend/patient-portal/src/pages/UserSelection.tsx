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
    const actionLabel = isLogin ? 'Sign in' : 'Create account'

    const portals = [
        {
            id: 'patient',
            title: 'Patient Portal',
            description: 'Manage your health history, consent, and care collaborations from one secure dashboard.',
            icon: UserRound,
            href: patientLink,
            accent: 'from-blue-50 to-blue-100',
            cta: isLogin ? 'Enter Patient Portal' : 'Create Patient Account',
            isExternal: false,
        },
        {
            id: 'provider',
            title: 'Provider Portal',
            description: 'Access verified medical records, consent workflows, and operational insights for your care team.',
            icon: Stethoscope,
            href: providerLink,
            accent: 'from-purple-50 to-purple-100',
            cta: isLogin ? 'Enter Provider Portal' : 'Create Provider Account',
            isExternal: true,
        },
    ]

    return (
        <div className="min-h-screen relative overflow-hidden px-4 py-16">
            <BackgroundLayer />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-12 text-center"
            >
                <motion.img
                    src={logo}
                    alt="MEDBLOCK"
                    className="h-28 w-28 object-contain"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                />

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-900 md:text-5xl"
                    >
                        {isLogin ? 'Secure access for every role' : 'Choose your portal'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl text-lg text-slate-600"
                    >
                        Continue as the member of Nigeria's healthcare mesh that fits your workflow—patients, clinicians, or service partners. {actionLabel} with confidence via email and password.
                    </motion.p>
                </div>

                <div className="grid w-full gap-6 md:grid-cols-2">
                    {portals.map((portal, index) => {
                        const Icon = portal.icon

                        return (
                            <motion.div
                                key={portal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 * index }}
                                className="group"
                            >
                                {portal.isExternal ? (
                                    <a
                                        href={portal.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex h-full flex-col justify-between gap-6 rounded-[32px] border border-white/70 bg-white/80 px-8 py-10 text-left shadow-2xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-2 hover:border-blue-200"
                                    >
                                        <div className="flex flex-col gap-6">
                                            <div
                                                className={`flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${portal.accent} text-blue-600 transition-all duration-300 group-hover:scale-105`}
                                            >
                                                <Icon size={48} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-slate-900">{portal.title}</p>
                                                <p className="mt-2 text-sm text-slate-500">{portal.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                            <span className="inline-flex items-center gap-2 text-blue-600">
                                                {portal.cta} <ArrowRight size={18} />
                                            </span>
                                        </div>
                                    </a>
                                ) : (
                                    <Link
                                        to={portal.href}
                                        className="flex h-full flex-col justify-between gap-6 rounded-[32px] border border-white/70 bg-white/80 px-8 py-10 text-left shadow-2xl shadow-slate-900/5 transition-transform duration-300 hover:-translate-y-2 hover:border-blue-200"
                                    >
                                        <div className="flex flex-col gap-6">
                                            <div
                                                className={`flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${portal.accent} text-blue-600 transition-all duration-300 group-hover:scale-105`}
                                            >
                                                <Icon size={48} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-slate-900">{portal.title}</p>
                                                <p className="mt-2 text-sm text-slate-500">{portal.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                            <span className="inline-flex items-center gap-2 text-blue-600">
                                                {portal.cta} <ArrowRight size={18} />
                                            </span>
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                <div className="flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row sm:gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-slate-600 shadow-sm">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        Secure email + password access across portals
                    </div>
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default UserSelection
