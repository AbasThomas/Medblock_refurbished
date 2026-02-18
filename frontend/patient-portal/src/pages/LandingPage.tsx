import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import BackgroundLayer from '../components/BackgroundLayer'
import Footer from '../components/Footer'
import {
    AlertTriangle,
    ArrowRight,
    Building,
    CheckCircle,
    Clock,
    Cpu,
    Eye,
    Fingerprint,
    FileText,
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
    Patients: [
        'Control who can access your records and for how long.',
        'Carry your verified medical history to any facility instantly.',
        'Track every access request with a clear audit timeline.',
        'Get safer care with complete medication and allergy context.',
    ],
    Hospitals: [
        'Open complete patient history in minutes during emergencies.',
        'Reduce duplicate diagnostics and avoid treatment delays.',
        'Coordinate care across partner hospitals with shared records.',
        'Submit cleaner, verifiable claims with less back-and-forth.',
    ],
    HMOs: [
        'Validate claims quickly with tamper-evident treatment records.',
        'Cut fraud exposure and improve payout confidence.',
        'Automate approvals with policy-aware workflows.',
        'Audit every decision with immutable traceability.',
    ],
    Labs: [
        'Publish signed results directly to patient-controlled records.',
        'Prevent duplicate testing through shared verified results.',
        'Improve turnaround for referrals and specialist follow-ups.',
        'Strengthen trust with cryptographic result verification.',
    ],
    Government: [
        'Use privacy-preserving analytics for outbreak visibility.',
        'Monitor service quality signals across regions in near real time.',
        'Support planning with reliable national health data.',
        'Improve accountability with tamper-evident system logs.',
    ],
}

const problemStats = [
    { icon: FileText, text: 'Most facilities still rely on paper files or disconnected systems.', color: 'text-blue-600' },
    { icon: Shield, text: 'Claims fraud drains resources that should go to patient care.', color: 'text-red-600' },
    { icon: RefreshCw, text: 'Patient data rarely moves smoothly between providers.', color: 'text-purple-600' },
    { icon: TestTube, text: 'Repeated tests increase costs and delay treatment decisions.', color: 'text-green-600' },
    { icon: TrendingDown, text: 'Public-health monitoring is slow when data is fragmented.', color: 'text-orange-600' },
    { icon: AlertTriangle, text: 'Clinicians make decisions with incomplete patient context.', color: 'text-amber-600' },
]

const solutionPillars = [
    { title: 'Trusted Records', desc: 'Tamper-evident event history for every critical record action.', icon: Shield },
    { title: 'FHIR Interoperability', desc: 'Standardized exchange across hospitals, labs, HMOs, and agencies.', icon: RefreshCw },
    { title: 'Patient Consent', desc: 'Time-bound, permissioned access controlled by the patient.', icon: UserCheck },
    { title: 'Fast Claims', desc: 'Structured records that speed approvals and reduce disputes.', icon: Zap },
    { title: 'Live Visibility', desc: 'Privacy-safe signals for planning and response across the ecosystem.', icon: Eye },
]

const connectedCareSteps = [
    {
        icon: UserCheck,
        title: 'Patient Authorizes Access',
        description: 'A patient grants scoped, time-bound consent from any compliant portal.',
    },
    {
        icon: Stethoscope,
        title: 'Clinician Delivers Care',
        description: 'Doctors work with full history, reducing guesswork and repeated procedures.',
    },
    {
        icon: Microscope,
        title: 'Labs and HMOs Sync',
        description: 'Results and claims flow through standardized records with verifiable integrity.',
    },
    {
        icon: Cpu,
        title: 'Insights Improve Outcomes',
        description: 'Anonymized analytics support better operational and public-health decisions.',
    },
]

const useCases = [
    {
        title: 'Emergency Triage',
        icon: Stethoscope,
        desc: 'Clinicians retrieve allergies, prior diagnoses, and medications in minutes.',
    },
    {
        title: 'Referral Continuity',
        icon: Building,
        desc: 'Specialists receive complete context before consultation, improving first-contact care.',
    },
    {
        title: 'Lab-to-Provider Flow',
        icon: Microscope,
        desc: 'Signed results are shared once and reused across authorized care teams.',
    },
    {
        title: 'Claims Validation',
        icon: Landmark,
        desc: 'Insurers validate service events against trusted records before payout.',
    },
    {
        title: 'Outbreak Awareness',
        icon: Eye,
        desc: 'Public-health teams get timely trends without exposing patient identities.',
    },
    {
        title: 'Telemedicine Confidence',
        icon: Cpu,
        desc: 'Remote consultations run with complete verified history and better safety checks.',
    },
]

const securityFeatures = [
    { icon: Lock, title: 'AES-256 Encryption', desc: 'Record payloads are encrypted before storage and transport.' },
    { icon: Cpu, title: 'SHA-256 Hashing', desc: 'Critical events are fingerprinted for immutable integrity checks.' },
    { icon: Fingerprint, title: 'Decentralized Identity', desc: 'Identity is portable and can be verified across institutions.' },
    { icon: Shield, title: 'NDPR Aligned', desc: 'Controls support Nigerian privacy and data governance requirements.' },
    { icon: Clock, title: 'Time-Bound Consent', desc: 'Access windows are explicit, revocable, and fully auditable.' },
    { icon: FileText, title: 'Immutable Audit Trail', desc: 'Every read, write, and consent event has a verifiable trace.' },
]

const outcomeMetrics = [
    { label: 'Faster Clinical Context', value: 'Minutes, not days', icon: Zap },
    { label: 'Duplicate Test Reduction', value: 'Lower repeat diagnostics', icon: TestTube },
    { label: 'Claims Confidence', value: 'Fewer disputed cases', icon: Shield },
    { label: 'System Accountability', value: 'Verifiable end-to-end logs', icon: Eye },
]

const LandingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<keyof typeof stakeholderFeatures>('Patients')

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
                                Healthcare Challenge
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The Nigerian Healthcare Problem</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Care teams, patients, and payers still operate in disconnected silos. The result is slower care, wasted spend,
                                and preventable risk.
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
                                MEDBLOCK Approach
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The MEDBLOCK Solution</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                A consent-first, standards-based health data infrastructure built for secure collaboration across Nigeria.
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
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Connected Care Journey</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                MEDBLOCK links care delivery, diagnostics, and payer workflows into one trusted patient record lifecycle.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {connectedCareSteps.map((step, idx) => (
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
                                <UserCheck size={18} />
                                Stakeholder Experiences
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tailored for Every Stakeholder</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Each portal is optimized for the workflows that matter to that user group.
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
                                Operational Impact
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Use Cases and Impact</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Concrete workflows where secure interoperability directly improves speed, quality, and trust.
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
                                Built with layered controls that protect patient data while enabling controlled, verifiable access.
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

            <section id="outcomes" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection>
                        <div className="text-center mb-14">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Better Infrastructure Delivers</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                MEDBLOCK is designed to produce measurable clinical, financial, and operational improvements at scale.
                            </p>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {outcomeMetrics.map((metric, idx) => (
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

                    <FadeInSection delay={220}>
                        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Clinical Reliability</h3>
                                    <p className="text-sm text-gray-700">Better first-contact decisions with complete patient context.</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Operational Throughput</h3>
                                    <p className="text-sm text-gray-700">Less time chasing records, more time delivering care.</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Integrity</h3>
                                    <p className="text-sm text-gray-700">Clearer claims evidence and reduced fraud exposure.</p>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <section id="contact" className="py-16 bg-blue-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <FadeInSection>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Modernize Healthcare Delivery?</h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join MEDBLOCK and give every care decision the secure context it needs.
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={150}>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link
                                to="/user-selection"
                                className="group px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold  transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Get Started
                                <Zap size={22} className="group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="group px-6 py-3 bg-transparent border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Patient Login
                                <Eye size={22} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                        <div className="mt-8 pt-8 border-t border-blue-800/50">
                            <p className="text-blue-200 mb-4">Need provider onboarding?</p>
                            <a
                                href={`${(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3001' : 'https://medblock-app-provider.web.app'}/signup`}
                                className="inline-flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors"
                            >
                                Join as Provider <ArrowRight size={20} />
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

