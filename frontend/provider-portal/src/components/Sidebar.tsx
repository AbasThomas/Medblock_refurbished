import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    DashboardSquare01Icon,
    Search01Icon,
    UserGroupIcon,
    Share01Icon,
    Activity01Icon,
    UserIcon,
    Logout01Icon,
    ArrowLeft01Icon,
    Cancel01Icon,
} from 'hugeicons-react'
import logo from '../../../shared/logo.png';
import { motion, AnimatePresence } from 'framer-motion'
import { useContext } from 'react'
import { AuthContext } from '../App'

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
    isMobileOpen?: boolean
    onMobileClose?: () => void
    className?: string
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen = false, onMobileClose, className = '' }: SidebarProps) {
    const { pathname } = useLocation()
    const { logout, providerName, providerDID } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: DashboardSquare01Icon },
        { name: 'My Patients', href: '/my-patients', icon: UserGroupIcon },
        { name: 'Patient Search', href: '/patients/search', icon: Search01Icon },
        { name: 'Interoperability', href: '/interoperability', icon: Share01Icon },
        { name: 'Audit Logs', href: '/audit-logs', icon: Activity01Icon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
    ]

    const shortId = (value?: string) => {
        if (!value) return 'Medblock:0000'
        const raw = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        return `Medblock:${raw.slice(-4).padStart(4, '0')}`
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-24 flex items-center justify-between px-6 border-b border-slate-50">
                <div className="flex items-center overflow-hidden">
                    <div
                        className="flex items-center cursor-pointer min-w-max"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="p-2 bg-white rounded-2xl mr-4 shadow-sm border border-slate-100">
                            <img src={logo} alt="MEDBLOCK" className="h-9 w-9 object-contain" />
                        </div>

                        {(!isCollapsed || isMobile) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col"
                            >
                                <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">
                                    MEDBLOCK
                                </h1>
                                <span className="text-[10px] text-blue-600 font-black tracking-[0.2em] mt-1 uppercase">
                                    Provider Portal
                                </span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {isMobile && (
                    <button
                        onClick={onMobileClose}
                        className="ml-auto p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
                    >
                        <Cancel01Icon size={20} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => isMobile && onMobileClose?.()}
                            className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon
                                size={22}
                                className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}
                            />
                            {(!isCollapsed || isMobile) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`ml-4 text-sm font-black tracking-wide whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-500'}`}
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                {/* User Info */}
                {(!isCollapsed || isMobile) && (
                    <div className="mb-6 px-4 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Authenticated Identity</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600">
                                {providerName?.[0] || 'D'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate">
                                    {providerName || 'Healthcare Provider'}
                                </p>
                                <p className="text-[10px] text-blue-600 font-bold truncate tracking-tight" title={providerDID || ''}>
                                    {shortId(providerDID)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={`flex items-center w-full ${(isCollapsed && !isMobile) ? 'justify-center' : 'px-4'
                        } py-4 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-200 group`}
                >
                    <Logout01Icon size={22} className="group-hover:-translate-x-1 transition-transform" />
                    {(!isCollapsed || isMobile) && <span className="ml-4 text-sm font-black uppercase tracking-widest">Sign Out</span>}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                initial={{ width: 280 }}
                animate={{ width: isCollapsed ? 100 : 280 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`hidden md:flex h-screen bg-white border-r border-slate-100 fixed left-0 top-0 z-50 flex-col shadow-2xl shadow-slate-100/50 ${className}`}
            >
                {sidebarContent}

                {/* Desktop Toggle Button - Centered on border */}
                <button
                    onClick={onToggle}
                    className="absolute -right-4 top-12 w-8 h-8 bg-white border border-slate-100 rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-xl transition-all duration-300 z-[60] group"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ArrowLeft01Icon size={16} className="group-hover:scale-110 transition-transform" />
                    </motion.div>
                </button>
            </motion.div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onMobileClose}
                            className="md:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed left-0 top-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
