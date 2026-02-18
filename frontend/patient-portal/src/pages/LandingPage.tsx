import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import BackgroundLayer from '../components/BackgroundLayer'
import Footer from '../components/Footer'
import {
    AlertTriangle,
    Building,
    CheckCircle,
    Clock,
    Eye,
    Fingerprint,
    FileText,
    Lock,
    Microscope,
    RefreshCw,
    Shield,
    Stethoscope,
    Zap,
    UserCheck,
    Sparkles,
    ArrowRight,
} from 'lucide-react'

const frictionStats = [
    {
        icon: FileText,
        title: 'Fragmented records',
        desc: 'Clinicians inherit incomplete histories from disconnected systems.',
    },
    {
        icon: Shield,
        title: 'Transparency gaps',
        desc: 'Patients lack visibility into who sees their data and why.',
    },
    {
        icon: RefreshCw,
        title: 'Inefficient workflows',
        desc: 'Duplicate diagnostics and manual approvals still dominate care delivery.',
    },
    {
        icon: AlertTriangle,
        title: 'Risk exposure',
        desc: 'Care quality suffers when teams work without timely context.',
    },
]

const stakeholderFeatures = [
    {
        title: 'Patients',
        icon: UserCheck,
        benefits: [
            'Consent-first record sharing',
            'Immutable audit of every access',
            'Control who uses what and for how long',
        ],
    },
    {
        title: 'Hospitals & Clinics',
        icon: Building,
        benefits: [
            'Complete longitudinal context at every touchpoint',
            'Standardized exchange and diagnostic continuity',
            'Audit-ready claims and care documentation',
        ],
    },
    {
        title: 'Labs & HMOs',
        icon: Microscope,
        benefits: [
            'Signed results that stay attached to the patient',
            'Automation-ready workflows with trustworthy data',
            'Tamper-evident evidence for payouts and approvals',
        ],
    },
]

const useCases = [
    {
        title: 'Emergency Response',
        icon: Stethoscope,
        desc: 'Clinicians pull allergies, medications, and consent scope in minutes.',
    },
    {
        title: 'Referral Continuity',
        icon: Building,
        desc: 'Specialists receive verified histories before the first consultation.',
    },
    {
        title: 'Lab to Practice',
        icon: Microscope,
        desc: 'Signed diagnostics travel securely and avoid redundant testing.',
    },
    {
        title: 'Claims Validation',
        icon: FileText,
        desc: 'Payers approve faster with auditable treatments and outcomes.',
    },
]

const securityFeatures = [
    {
        icon: Lock,
        title: 'Layered encryption',
        desc: 'Data is encrypted across transport, storage, and blockchain proofs.',
    },
    {
        icon: Fingerprint,
        title: 'Decentralized identity',
        desc: 'Patients and providers verify with DID-backed credentials.',
    },
    {
        icon: Clock,
        title: 'Time-bound consent',
        desc: 'Access windows are explicit, revocable, and logged.',
    },
]

const impactSignals = [
    { label: 'Clinical Visibility', value: 'Faster & safer decisions', icon: Eye },
    { label: 'Operational Throughput', value: 'Less chasing paperwork', icon: RefreshCw },
    { label: 'Claims Confidence', value: 'Traceable & trustworthy', icon: Shield },
]

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: delay / 1000 }}
    >
        {children}
    </motion.div>
)

const LandingPage: React.FC = () => {

    return (
        <div className="relative min-h-screen overflow-hidden font-sans text-slate-900 antialiased">
            <BackgroundLayer />
            <Navbar />

            <section id="home" className="mt-20">
                <HeroSection />
            </section>

            <section className="py-16" id="friction">
                <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center space-y-3">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                                <Zap size={16} />
                                Healthcare Friction
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                Disconnected systems slow down care delivery
                            </h2>
                            <p className="mx-auto max-w-3xl text-lg text-slate-600">
                                MEDBLOCK removes the friction so teams can collaborate with trust, consent, and clarity.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid gap-6 md:grid-cols-2">
                        {frictionStats.map((stat, index) => (
                            <FadeInSection key={stat.title} delay={index * 90}>
                                <div className="relative space-y-2 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
                                    <stat.icon size={28} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-slate-900">{stat.title}</h3>
                                    <p className="text-sm text-slate-500">{stat.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-slate-900 text-white" id="features">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
                    <FadeInSection>
                        <div className="text-center space-y-3">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                                <Building size={16} />
                                Tailored for Every Stakeholder
                            </div>
                            <h2 className="text-3xl font-bold sm:text-4xl">Workflows that match each user</h2>
                            <p className="mx-auto max-w-3xl text-sm text-white/70">
                                MEDBLOCK adapts to the way patients, hospitals, payers, and labs collaborate.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid gap-6 md:grid-cols-3">
                        {stakeholderFeatures.map((stakeholder, idx) => (
                            <FadeInSection key={stakeholder.title} delay={idx * 80}>
                                <div className="h-full space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="rounded-2xl bg-white/10 p-3 text-blue-200">
                                            <stakeholder.icon size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold">{stakeholder.title}</h3>
                                    </div>
                                    <ul className="space-y-2 text-sm text-white/70">
                                        {stakeholder.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-2">
                                                <CheckCircle size={16} className="mt-1 text-emerald-400" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16" id="use-cases">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
                    <FadeInSection>
                        <div className="text-center space-y-3">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                <Sparkles size={16} />
                                Use Cases & Operational Impact
                            </div>
                            <h2 className="text-3xl font-bold sm:text-4xl">Where trusted data makes a difference</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid gap-6 md:grid-cols-2">
                        {useCases.map((item, index) => (
                            <FadeInSection key={item.title} delay={index * 80}>
                                <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
                                    <div className="mb-4 flex items-center gap-3 text-blue-600">
                                        <div className="rounded-2xl bg-blue-50 p-3">
                                            <item.icon size={26} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-slate-950 text-white" id="security">
                <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center space-y-3">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                                <Lock size={16} />
                                Enterprise-Grade Security
                            </div>
                            <h2 className="text-3xl font-bold sm:text-4xl">Privacy and trust by design</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid gap-6 md:grid-cols-3">
                        {securityFeatures.map((feature, idx) => (
                            <FadeInSection key={feature.title} delay={idx * 80}>
                                <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="rounded-2xl bg-white/10 p-3 text-blue-200">
                                            <feature.icon size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/70">{feature.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16" id="impact">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center space-y-3">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                <Shield size={16} />
                                Measurable Impact
                            </div>
                            <h2 className="text-3xl font-bold sm:text-4xl">Outcomes that prove the value</h2>
                            <p className="mx-auto max-w-3xl text-base text-slate-600">
                                Deployments report faster context, reduced repeat diagnostics, and higher claims transparency.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {impactSignals.map((metric, idx) => (
                            <FadeInSection key={metric.label} delay={idx * 70}>
                                <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 text-center">
                                    <metric.icon size={32} className="mx-auto mb-4 text-blue-600" />
                                    <p className="text-sm text-slate-500">{metric.label}</p>
                                    <p className="text-lg font-semibold text-slate-900">{metric.value}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="py-16 bg-blue-900 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <FadeInSection>
                        <h2 className="text-3xl font-bold sm:text-4xl">Ready to bring trusted data to your care team?</h2>
                        <p className="mt-3 text-lg text-blue-100">Join MEDBLOCK and unlock secure collaboration across Nigeria.</p>
                        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <a
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:translate-y-0.5"
                            >
                                Create Patient Account
                                <ArrowRight size={18} />
                            </a>
                            <a
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Patient Login
                                <ArrowRight size={18} />
                            </a>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage
