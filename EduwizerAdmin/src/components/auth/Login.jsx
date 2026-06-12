import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Services/api";
import toast from "react-hot-toast";
import eduwizerLogoFull from "../../assets/eduwizer-logo-full.png";

const IconShield = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const IconMail = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const IconLock = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconEye = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconArrowRight = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const IconCheck = () => (
    <svg className="w-3 h-3 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function Checkbox({ checked }) {
    return (
        <div
            className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150 ${
                checked
                    ? "border-brand-gold bg-brand-gold"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
            }`}
        >
            {checked && <IconCheck />}
        </div>
    );
}

function Field({ label, id, type, placeholder, icon, rightSlot, value, onChange }) {
    return (
        <div className="mb-4.5">
            <label className="block text-[10.5px] font-bold text-brand-navy tracking-wider uppercase mb-1.5" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                    {icon}
                </span>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={id}
                    className="w-full h-11 border border-slate-200 bg-white focus:border-brand-gold focus:bg-white focus:ring-4 focus:ring-brand-gold/15 rounded-xl pl-10 pr-11 text-sm text-brand-navy outline-none transition-all duration-180 shadow-2xs"
                />
                {rightSlot && (
                    <button
                        type="button"
                        onClick={rightSlot.onClick}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center"
                        aria-label={rightSlot.label}
                    >
                        {rightSlot.icon}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail) {
            setEmail(savedEmail);
            setRemember(true);
        }
        if (savedPassword) {
            setPassword(savedPassword);
        }
    }, []);

    const validate = () => {
        const e = {};
        if (!email.trim()) {
            e.email = "Email or Username is required";
        }
        if (!password) {
            e.password = "Password is required";
        }
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length === 0) {
            setLoading(true);
            try {
                const trimmedInput = email.trim();
                const isEmail = /\S+@\S+\.\S+/.test(trimmedInput);
                const payload = isEmail 
                    ? { email: trimmedInput, password }
                    : { userName: trimmedInput, password };

                const response = await login(payload);
                if (response.data && response.data.success === 1) {
                    if (remember) {
                        localStorage.setItem("rememberedEmail", email);
                        localStorage.setItem("rememberedPassword", password);
                    } else {
                        localStorage.removeItem("rememberedEmail");
                        localStorage.removeItem("rememberedPassword");
                    }
                    if (response.data.session) {
                        localStorage.setItem("token", response.data.session);
                    }
                    toast.success("Login successful! Welcome back.");
                    navigate("/users-listing", { replace: true });
                } else {
                    toast.error(response.data.message || "Invalid credentials");
                }
            } catch (err) {
                console.error("Login Error:", err);
                toast.error("Internal server error. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            const firstError = Object.values(e)[0];
            toast.error(firstError);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-gradient font-sans p-6 relative overflow-hidden">
            {/* Background decorative circles/rings */}
            <div className="absolute w-[600px] h-[600px] rounded-full border-[80px] border-brand-gold/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
            <div className="absolute w-[450px] h-[450px] rounded-full border-[65px] border-brand-gold/3 -top-24 -left-24 pointer-events-none z-0" />
            <div className="absolute w-[400px] h-[400px] rounded-full border-[60px] border-brand-gold/3 -bottom-24 -right-24 pointer-events-none z-0" />
            <div className="absolute w-[320px] h-[320px] rounded-full border-[45px] border-brand-gold/2.5 -top-16 -right-16 pointer-events-none z-0" />
            <div className="absolute w-[350px] h-[350px] rounded-full border-[50px] border-brand-gold/2.5 -bottom-24 -left-24 pointer-events-none z-0" />
            <div className="absolute w-[200px] h-[200px] rounded-full border-[25px] border-brand-gold/2 top-[15%] left-[20%] pointer-events-none z-0" />
            <div className="absolute w-[220px] h-[220px] rounded-full border-[28px] border-brand-gold/2 bottom-[15%] right-[20%] pointer-events-none z-0" />

            <div className="flex w-full max-w-4xl min-h-[560px] rounded-3xl overflow-hidden shadow-2xl shadow-brand-navy/10 border border-slate-100 bg-white relative z-10">
                <div className="hidden md:flex md:w-[42%] bg-brand-gradient flex-col justify-start gap-10 pb-10 px-10 pt-0 relative overflow-hidden text-white">
                    <div className="absolute w-72 h-72 rounded-full border-[44px] border-brand-gold/5 -bottom-16 -right-20 pointer-events-none" />
                    <div className="absolute w-40 h-40 rounded-full border-[28px] border-brand-gold/5 top-14 right-4 pointer-events-none" />

                    <div className="flex items-center justify-center z-10">
                        <div className="bg-white rounded-b-xl px-2.5 py-1.5 shadow-md flex items-center justify-center">
                            <img
                                src={eduwizerLogoFull}
                                alt="Eduwizer"
                                className="h-[36px] w-auto object-contain"
                            />
                        </div>
                    </div>

                    <div className="z-10 flex-1 flex flex-col justify-center items-center text-center pb-12">
                        <h2 className="font-serif text-white text-3xl font-semibold leading-snug mb-3">
                            Admin<br />
                            <span className="text-brand-gold">Control Panel</span>
                        </h2>
                        <p className="text-slate-400/90 text-[13px] leading-relaxed font-light max-w-[260px]">
                            Restricted access only. All sessions are monitored, encrypted, and fully audited.
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-10 bg-slate-50/50">
                    <div className="w-full max-w-[340px]">
                        <div className="inline-flex items-center gap-1.5 bg-brand-gold/15 border border-brand-gold/30 rounded-full px-3 py-1 text-[10px] font-bold text-amber-800 tracking-wider uppercase mb-5">
                            <IconShield />
                            Administrator Access
                        </div>

                        <h1 className="font-serif text-3xl font-semibold text-brand-navy mb-1.5">Sign in</h1>
                        <p className="text-sm text-slate-500 font-light mb-8">Enter your credentials to access the admin panel</p>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <Field
                                label="Admin Email or Username"
                                id="email"
                                type="text"
                                placeholder="admin@company.com or username"
                                icon={<IconMail />}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <Field
                                label="Password"
                                id="password"
                                type={showPw ? "text" : "password"}
                                placeholder="Enter your password"
                                icon={<IconLock />}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                rightSlot={{
                                    onClick: () => setShowPw(v => !v),
                                    label: showPw ? "Hide password" : "Show password",
                                    icon: showPw ? <IconEyeOff /> : <IconEye />,
                                }}
                            />

                            <div className="flex items-center mt-4 mb-6">
                                <div 
                                    onClick={() => setRemember(v => !v)}
                                    className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-650 select-none"
                                >
                                    <Checkbox checked={remember} />
                                    <span>Remember me</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-brand-gold hover:bg-btn-gold-hover active:scale-[0.98] text-brand-navy font-bold rounded-xl text-sm transition-all duration-150 shadow-md shadow-brand-gold/15 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        Logging in…
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <IconArrowRight />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-400">
                            <IconLock />
                            Secured & encrypted connection
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}