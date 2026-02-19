import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtpAndCreateProvider } from '../services/api';
import { Shield01Icon, Refresh01Icon, ArrowLeft01Icon } from 'hugeicons-react';
import BackgroundLayer from '@/components/BackgroundLayer';
import { AuthContext } from '../App';
import { addRecentProvider } from '../utils/storage';
import { motion } from 'framer-motion';

interface LocationState {
    email: string;
    devOtp?: string;
    registrationData: any;
}

const OtpVerification: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const { email, registrationData, devOtp } = (location.state as LocationState) || {};

    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [resending, setResending] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (index === 5 && value) {
            const fullOtp = newOtp.join('');
            if (fullOtp.length === 6) {
                handleVerify(fullOtp);
            }
        }
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

        // Focus the next empty input or last input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();

        // Auto-submit if complete
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (otpCode?: string) => {
        const code = otpCode || otp.join('');

        if (code.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyOtpAndCreateProvider(email, code);

            // Store credentials locally via AuthContext
            login(result.name || email, result.did, result.accessToken);

            // Add to recent providers (device specific)
            addRecentProvider({
                name: result.name || email,
                email: email,
                did: result.did,
                hospitalName: registrationData?.hospitalName || result.hospitalName
            });

            // Navigate to dashboard
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');

        try {
            // Re-request OTP with the same registration data
            const { requestProviderOtp } = await import('../services/api');
            await requestProviderOtp(registrationData);

            setTimeLeft(300); // Reset timer
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden py-16 px-6 flex items-center justify-center bg-[#f8fafc]">
            <BackgroundLayer />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full z-10"
            >
                <div className="text-center mb-10">
                    <img src={require('../../../shared/logo.png')} alt="MEDBLOCK" className="w-20 h-20 object-contain mx-auto mb-6 bg-white border border-slate-100 p-3 rounded-[2rem] shadow-sm" />
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">Verify Identity</h1>
                    <p className="text-slate-500 font-medium mt-3">
                        Enter the 6-digit code sent to <br />
                        <span className="font-bold text-blue-600 lowercase">{email}</span>
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
                    <div className="flex items-center gap-3 mb-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                        <Shield01Icon className="w-5 h-5 text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">Secure blockchain verification</p>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 mb-8" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-full h-14 text-center text-xl font-black rounded-2xl border transition-all duration-200 outline-none ${error
                                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                                    : 'border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white'
                                    }`}
                                disabled={loading}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8"
                        >
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
                        </motion.div>
                    )}

                    <button
                        onClick={() => handleVerify()}
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed group"
                    >
                        {loading ? 'Verifying...' : 'Verify & Complete Account'}
                    </button>

                    <div className="text-center mt-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0 || resending}
                            className={`flex items-center justify-center gap-2 mx-auto text-xs font-black transition-all ${timeLeft > 0 || resending
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-800'
                                }`}
                        >
                            <Refresh01Icon size={16} className={`${resending ? 'animate-spin' : ''}`} />
                            <span className="uppercase tracking-widest">
                                {resending
                                    ? 'Resending...'
                                    : timeLeft > 0
                                        ? `Wait ${formatTime(timeLeft)}`
                                        : 'Resend Code'}
                            </span>
                        </button>
                    </div>

                    {devOtp && (
                        <div className="mt-8 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                            <p className="uppercase tracking-[0.2em] mb-2 text-amber-600">Developer Bridge</p>
                            <p className="leading-relaxed">Temporary OTP: <span className="font-black text-xs text-amber-900">{devOtp}</span>. Email delivery is disabled in this environment.</p>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/signup')}
                        className="mt-10 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all group"
                    >
                        <ArrowLeft01Icon size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Sign Up
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OtpVerification;
