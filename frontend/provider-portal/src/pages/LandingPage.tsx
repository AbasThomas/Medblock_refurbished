import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import BackgroundLayer from '@/components/BackgroundLayer'
import Footer from '../components/Footer'
import {
    AlertTriangle,
    Building,
    CheckCircle,
    Clock,
    Cpu,
    Eye,
    FileText,
    Fingerprint,
    Landmark,
    Lock,
    Microscope,
    RefreshCw,
    Shield,
    Stethoscope,
    TestTube,
    TrendingDown,
    UserCheck,
    Zap,
} from 'lucide-react'

const stakeholderFeatures = {
    Hospitals: [
        'Retrieve full patient context across facilities in minutes.',
        'Reduce duplicate investigations and accelerate treatment plans.',
        'Coordinate referrals with complete, current patient records.',
        'Strengthen claims documentation with trusted data lineage.',
    ],
    Patients: [
        'Grant and revoke provider access with transparent consent controls.',
        'Carry verified health records across care settings.',
        'Monitor every access event in a clear audit timeline.',
        'Receive safer care with complete history available at point of care.',
    ],
    HMOs: [
        'Validate treatment events with tamper-evident records.',
        'Reduce fraud and cycle time in claims operations.',
        'Automate approval workflows with standardized data inputs.',
        'Improve audit readiness with immutable evidence trails.',
    ],
    Labs: [
        'Publish signed results into shared patient timelines once.',
        'Support referral decisions without manual result chasing.',
        'Eliminate unnecessary repeats through trusted result reuse.',
        'Improve turnaround through direct provider interoperability.',
    ],
    Government: [
        'Monitor epidemiological trends with privacy-preserving analytics.',
        'Detect system pressure earlier using structured care signals.',
        'Improve planning with cleaner national healthcare datasets.',
        'Enable accountable reporting backed by immutable logs.',
    ],
}

const problemStats = [
    { icon: FileText, text: 'Clinical records remain fragmented across disconnected systems.', color: 'text-blue-600' },
    { icon: Shield, text: 'Fraud and poor traceability continue to inflate claims costs.', color: 'text-red-600' },
    { icon: RefreshCw, text: 'Referrals frequently lose critical patient context.', color: 'text-purple-600' },
    { icon: TestTube, text: 'Duplicate diagnostics consume time and resources unnecessarily.', color: 'text-green-600' },
    { icon: TrendingDown, text: 'Public-health visibility is delayed when data is siloed.', color: 'text-orange-600' },
    { icon: AlertTriangle, text: 'Care quality suffers when providers lack complete histories.', color: 'text-amber-600' },
]

const solutionPillars = [
    { title: 'Trusted Care Timeline', desc: 'Immutable event history for every important record action.', icon: Shield },
    { title: 'FHIR Data Exchange', desc: 'Reliable standards-based interoperability across institutions.', icon: RefreshCw },
    { title: 'Consent Governance', desc: 'Patient-approved access controls with clear expiration windows.', icon: UserCheck },
    { title: 'Claims Integrity', desc: 'Structured records that reduce disputes and fraud exposure.', icon: Landmark },
    { title: 'Operational Insight', desc: 'Actionable visibility for clinical and administrative teams.', icon: Eye },
]

const coordinationSteps = [
    {
        icon: UserCheck,
        title: 'Consent Activation',
        description: 'Patients authorize provider access with scope and duration controls.',
    },
    {
        icon: Stethoscope,
        title: 'Clinical Delivery',
        description: 'Providers treat with complete context, improving first-contact decisions.',
    },
    {
        icon: Microscope,
        title: 'Diagnostics and Claims',
        description: 'Labs and HMOs process trusted records without manual reconciliation.',
    },
    {
        icon: Cpu,
        title: 'System Learning',
        description: 'Operational and public-health teams gain timely, privacy-safe intelligence.',
    },
]

const useCases = [
    {
        title: 'Emergency Admissions',
        icon: Stethoscope,
        desc: 'Clinical teams access medication and allergy history immediately.',
    },
    {
        title: 'Referral Handover',
        icon: Building,
        desc: 'Specialist teams receive full context before first consultation.',
    },
    {
        title: 'Diagnostic Continuity',
        icon: Microscope,
        desc: 'Signed results move across authorized providers without duplication.',
    },
    {
        title: 'Claims Verification',
        icon: Landmark,
        desc: 'Payers verify treatment events against trusted, auditable records.',
    },
    {
        title: 'Outbreak Monitoring',
        icon: Eye,
        desc: 'Health authorities track trends rapidly without exposing identities.',
    },
    {
        title: 'Virtual Care Safety',
        icon: Cpu,
        desc: 'Telemedicine sessions run with complete, verified clinical background.',
    },
]

const securityFeatures = [
    { icon: Lock, title: 'AES-256 Encryption', desc: 'Sensitive payloads remain encrypted at rest and in transit.' },
    { icon: Cpu, title: 'SHA-256 Integrity', desc: 'Record-critical events are cryptographically fingerprinted.' },
    { icon: Fingerprint, title: 'Decentralized Identity', desc: 'Portable identity verification across institutions.' },
    { icon: Shield, title: 'NDPR-Ready Controls', desc: 'Aligned with Nigerian privacy and governance requirements.' },
    { icon: Clock, title: 'Time-Bound Access', desc: 'Role-based permissions with explicit validity windows.' },
    { icon: FileText, title: 'Audit Transparency', desc: 'Every access and update is fully traceable.' },
]

const impactSignals = [
    { label: 'Clinical Decision Speed', value: 'Faster first-contact clarity', icon: Zap },
    { label: 'Operational Throughput', value: 'Less manual record chasing', icon: RefreshCw },
    { label: 'Claims Reliability', value: 'Higher trust and fewer disputes', icon: Shield },
    { label: 'System Accountability', value: 'End-to-end verifiable events', icon: Eye },
]

const LandingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<keyof typeof stakeholderFeatures>('Hospitals')

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

    return (
        <div className="relative min-h-screen font-sans text-gray-900 antialiased">
            <BackgroundLayer />
            <Navbar />

            <section id="home" className="mt-20">
                <HeroSection />
            </section>

            <section id="problem" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-6 border border-red-100">
                                <AlertTriangle size={18} />
                                Delivery Challenges
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The Nigerian Healthcare Problem</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Providers need reliable patient context, but legacy systems still keep records fragmented and hard to trust.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {problemStats.map((item, idx) => (
                            <FadeInSection key={idx} delay={idx * 90}>
                                <div className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 flex items-start space-x-4">
                                    <div className={`p-4 rounded-2xl bg-gray-50 ${item.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                        <item.icon size={34} />
                                    </div>
                                    <p className="text-gray-700 font-medium leading-relaxed">{item.text}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section id="solution" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6 border border-green-100">
                                <CheckCircle size={18} />
                                MEDBLOCK Platform
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The MEDBLOCK Solution</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                MEDBLOCK combines trusted records, consent governance, and interoperable exchange for real clinical workflows.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        {solutionPillars.map((item, idx) => (
                            <FadeInSection key={item.title} delay={idx * 90}>
                                <div className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 text-center transition-all duration-300 hover:-translate-y-1 h-full">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <item.icon size={38} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-14">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Clinical Coordination Engine</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                A modern flow that connects patient authorization, provider delivery, diagnostics, and claims verification.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coordinationSteps.map((step, idx) => (
                            <FadeInSection key={step.title} delay={idx * 110}>
                                <div className="group rounded-2xl border border-blue-100 bg-white p-6 h-full transition-all duration-300">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-blue-100 flex items-center justify-center mb-5 text-blue-700 group-hover:scale-110 transition-transform duration-300">
                                        <step.icon size={40} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium mb-6 border border-orange-100">
                                <Building size={18} />
                                Stakeholder Workflows
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tailored for Every Stakeholder</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                MEDBLOCK adapts to hospital operations, patient rights, payer controls, and public-health needs.
                            </p>
                        </div>
                    </FadeInSection>

                    <FadeInSection delay={120}>
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {Object.keys(stakeholderFeatures).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as keyof typeof stakeholderFeatures)}
                                    className={`group px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 border ${activeTab === tab
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                                        : 'bg-white/90 text-gray-700 hover:bg-gray-100 border-gray-200 hover:scale-105'
                                        }`}
                                >
                                    {tab === 'Patients' && <UserCheck size={22} />}
                                    {tab === 'Hospitals' && <Building size={22} />}
                                    {tab === 'HMOs' && <Landmark size={22} />}
                                    {tab === 'Labs' && <Microscope size={22} />}
                                    {tab === 'Government' && <Shield size={22} />}
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </FadeInSection>

                    <FadeInSection delay={220}>
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 shadow-sm max-w-6xl mx-auto min-h-[390px] flex items-center justify-center">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        {activeTab === 'Patients' && <UserCheck className="text-blue-600" size={36} />}
                                        {activeTab === 'Hospitals' && <Building className="text-blue-600" size={36} />}
                                        {activeTab === 'HMOs' && <Landmark className="text-blue-600" size={36} />}
                                        {activeTab === 'Labs' && <Microscope className="text-blue-600" size={36} />}
                                        {activeTab === 'Government' && <Shield className="text-blue-600" size={36} />}
                                        Benefits for {activeTab}
                                    </h3>
                                    <ul className="space-y-3">
                                        {stakeholderFeatures[activeTab].map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-gray-700">
                                                <CheckCircle className="text-green-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                                                <span className="leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="hidden lg:flex items-center justify-center">
                                    <div className="text-center bg-white rounded-2xl p-8 border border-blue-100 w-full">
                                        <div className="mx-auto mb-5 w-24 h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                                            {activeTab === 'Patients' && <UserCheck size={44} />}
                                            {activeTab === 'Hospitals' && <Building size={44} />}
                                            {activeTab === 'HMOs' && <Landmark size={44} />}
                                            {activeTab === 'Labs' && <Microscope size={44} />}
                                            {activeTab === 'Government' && <Shield size={44} />}
                                        </div>
                                        <p className="text-gray-600">Focused tools and workflows for</p>
                                        <div className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold inline-block">
                                            {activeTab}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <section id="use-cases" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6 border border-green-100">
                                <Zap size={18} />
                                Delivery Impact
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Use Cases and Impact</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Critical workflows where trusted data exchange improves patient safety and provider efficiency.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((item, idx) => (
                            <FadeInSection key={item.title} delay={idx * 90}>
                                <div className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 h-full">
                                    <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <item.icon size={38} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section id="security" className="py-20 bg-gray-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium mb-6">
                                <Lock size={18} />
                                Security and Privacy
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise-Grade Security and Privacy</h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Security controls are embedded by design so providers can collaborate without compromising patient trust.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {securityFeatures.map((item, idx) => (
                            <FadeInSection key={item.title} delay={idx * 85}>
                                <div className="group bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 h-full">
                                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <item.icon size={38} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-300 mb-2">{item.title}</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-14">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Performance Signals That Matter</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                MEDBLOCK is designed to improve care quality, claims integrity, and operational responsiveness.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {impactSignals.map((metric, idx) => (
                            <FadeInSection key={metric.label} delay={idx * 90}>
                                <div className="rounded-2xl border border-gray-200 bg-white/95 p-6 h-full transition-all duration-300">
                                    <div className="mb-4 w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                        <metric.icon size={32} />
                                    </div>
                                    <p className="text-gray-500 text-sm mb-1">{metric.label}</p>
                                    <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="py-16 bg-blue-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <FadeInSection>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Upgrade Provider Workflows?</h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join MEDBLOCK Provider Portal and deliver safer care with trusted patient context.
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={150}>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <a
                                href="/signup"
                                className="group px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold  transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Create Provider Account
                                <Zap size={22} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="/login"
                                className="group px-6 py-3 bg-transparent border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Provider Login
                                <Eye size={22} className="group-hover:scale-110 transition-transform" />
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

