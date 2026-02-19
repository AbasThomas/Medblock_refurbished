import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AccessIcon, ArrowLeft01Icon, ViewIcon, ViewOffIcon, Shield01Icon, Refresh01Icon } from 'hugeicons-react';
import { resetPassword, requestPasswordReset } from '../services/api';
import BackgroundLayer from '@/components/BackgroundLayer';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationState {
    email: string;
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email: initialEmail } = (location.state as LocationState) || {};

    const [email, setEmail] = useState(initialEmail || '');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [resending, setResending] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!initialEmail && !email) {
            // If accessed directly without email state, user might want to enter it manually
        }
    }, [initialEmail, email]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleResend = async () => {
        if (timeLeft > 0 || !email) return;

        setResending(true);
        setError('');

        try {
            await requestPasswordReset(email);
            setTimeLeft(300); // Reset timer to 5 minutes
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
        setOtp(newOtp);
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (otp.join('').length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                email,
                otp: otp.join(''),
                newPassword
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">Key Reset</h1>
                    <p className="text-slate-500 font-medium mt-3">
                        Securely re-establish your <span className="text-blue-600 font-bold">cryptographic identity</span>.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                                    <Shield01Icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Identity Updated!</h3>
                                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                                    Your secure credentials have been updated successfully.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping"></div>
                                    Redirecting to Login
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
                                {!initialEmail && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full px-6 py-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold transition-all duration-300 outline-none"
                                            placeholder="practitioner@medblock.com"
                                        />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                                        Verification Code
                                    </label>
                                    <div className="flex items-center justify-center gap-2.5" onPaste={handlePaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-full h-12 text-center text-lg font-black rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-slate-900 transition-all outline-none"
                                            />
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={timeLeft > 0 || resending}
                                            className={`inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${timeLeft > 0 || resending
                                                    ? 'text-slate-300 cursor-not-allowed'
                                                    : 'text-blue-600 hover:text-blue-800'
                                                }`}
                                        >
                                            <Refresh01Icon className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                                            {resending
                                                ? 'Resending...'
                                                : timeLeft > 0
                                                    ? `Resend in ${formatTime(timeLeft)}`
                                                    : 'Resend OTP'}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Secure Password</label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="block w-full pl-6 pr-14 py-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold placeholder:text-slate-300 transition-all duration-300 outline-none"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-blue-600 transition-colors"
                                            >
                                                {showPassword ? <ViewOffIcon size={20} /> : <ViewIcon size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm New Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full px-6 py-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 focus:bg-white text-slate-900 font-semibold placeholder:text-slate-300 transition-all duration-300 outline-none"
                                            placeholder="••••••••"
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
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Updating Vault...
                                        </div>
                                    ) : (
                                        'Secure Account Now'
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
            </motion.div>
        </div >
    );
};

export default ResetPassword;
