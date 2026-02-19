import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail01Icon, ArrowLeft01Icon, AccessIcon, Tick01Icon } from 'hugeicons-react';
import { requestPasswordReset } from '../services/api';
import BackgroundLayer from '@/components/BackgroundLayer';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await requestPasswordReset(email);
            setSuccess(true);

            // Navigate to Reset Password page after short delay
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-[#f8fafc]">
            <BackgroundLayer />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <img src={require('../../../shared/logo.png')} alt="MEDBLOCK" className="w-20 h-20 object-contain mx-auto mb-6 bg-white border border-slate-100 p-3 rounded-[2rem] shadow-sm" />
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">Recovery</h1>
                    <p className="text-slate-500 font-medium mt-3 px-6">
                        Enter your professional email to receive a secure recovery code.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                                    <Tick01Icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Code Sent!</h3>
                                <p className="text-slate-500 font-medium mb-6">
                                    We've dispatched a code to <br />
                                    <span className="font-bold text-blue-600">{email}</span>
                                </p>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                                    Redirecting to Reset
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                        Professional Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-200">
                                            <Mail01Icon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-14 pr-6 py-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold placeholder:text-slate-300 transition-all duration-300 outline-none"
                                            placeholder="practitioner@clinic.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4"
                                    >
                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed uppercase tracking-widest"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        'Request Recovery Code'
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all group"
                        >
                            <ArrowLeft01Icon size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Login
                        </Link>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <AccessIcon size={14} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Secure</span>
                    </div>
                </div>
            </motion.div>
        </div >
    );
};

export default ForgotPassword;
