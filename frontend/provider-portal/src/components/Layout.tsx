import { Outlet, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../App'
import Sidebar from './Sidebar'
import BackgroundLayer from './BackgroundLayer'
import { Menu01Icon, Hospital01Icon, Search01Icon } from 'hugeicons-react'
import NotificationBell from './NotificationBell'

export default function Layout() {
    const { isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen flex bg-[#f8fafc]">
            <BackgroundLayer />
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                className="print:hidden"
            />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-400 ease-[0.23, 1, 0.32, 1] ${isCollapsed ? 'md:ml-[100px]' : 'md:ml-[280px]'
                    } ml-0 w-full min-h-screen`}
            >
                {/* Header / Top Navigation */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 print:hidden">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="md:hidden p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                            <Menu01Icon size={24} />
                        </button>

                        <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl w-96 group focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                            <Search01Icon size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Universal search..."
                                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-900 w-full placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="md:hidden flex items-center gap-2">
                            <Hospital01Icon className="text-blue-600" size={24} />
                            <span className="font-black text-lg text-slate-900 tracking-tight">MEDBLOCK</span>
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <div className="flex-1 flex flex-col">
                    <main className="flex-1 w-full p-8 md:p-12">
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <footer className="bg-white border-t border-slate-50 py-10 print:hidden">
                        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <Hospital01Icon className="text-slate-300" size={20} />
                                <span className="font-black text-slate-400 tracking-tight">MEDBLOCK</span>
                            </div>
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                                Trusted blockchain infrastructure for Nigerian Clinicians
                            </p>
                            <p className="text-sm font-medium text-slate-400">
                                © 2026. Secure & Canonical.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}
