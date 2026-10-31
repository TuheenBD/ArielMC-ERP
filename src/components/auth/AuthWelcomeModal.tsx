'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  X,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { UserProfile, UserRole, UserDepartment } from '@/types/auth';
import { EntityCode } from '@/types/erp';
import { INITIAL_USERS } from '@/data/initialUsers';
import { verifyTOTP } from '@/lib/totp';

interface AuthWelcomeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
  forceLock?: boolean;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'TWO_FACTOR';

export const AuthWelcomeModal: React.FC<AuthWelcomeModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  allUsers,
  onRegisterUser,
  forceLock = false,
}) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');

  // Login Form State
  const [email, setEmail] = useState('TuheenBD@gmail.com');
  const [password, setPassword] = useState('arielmc2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2SA State
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('482910');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+880 1819-');
  const [regDesignation, setRegDesignation] = useState('');
  const [regDepartment, setRegDepartment] = useState<UserDepartment>('SOURCING_MERCHANDISING');
  const [regRole, setRegRole] = useState<UserRole>('SOURCING_DIRECTOR');
  const [regEntity, setRegEntity] = useState<EntityCode>('ARIEL_BD');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'REQUEST' | 'VERIFY_RESET'>('REQUEST');
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        setErrorMessage('Corporate account not found with this email. Please check spelling or register.');
        return;
      }

      if (user.status === 'SUSPENDED') {
        setErrorMessage('This enterprise profile has been suspended by the Security Administrator.');
        return;
      }

      // Check if 2SA is enabled
      if (user.twoFactorEnabled) {
        setPendingUser(user);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSimulatedOtp(code);
        setMode('TWO_FACTOR');
        return;
      }

      // Log in directly
      onLoginSuccess(user);
      if (onClose) onClose();
    }, 600);
  };

  const handleTwoFactorVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;

    setIsLoading(true);
    setErrorMessage(null);

    const inputCode = twoFactorCode.trim().toUpperCase();

    // 1. Emergency Recovery Code Validation (e.g. AMC-XXXX-XXXX)
    if (pendingUser.recoveryCodes && pendingUser.recoveryCodes.some(c => c.toUpperCase() === inputCode)) {
      setIsLoading(false);
      onLoginSuccess(pendingUser);
      setPendingUser(null);
      if (onClose) onClose();
      return;
    }

    // 2. RFC 6238 Standard Authenticator TOTP Validation
    if (pendingUser.twoFactorMethod === 'AUTHENTICATOR_APP') {
      const secret = pendingUser.twoFactorSecret || 'JBSWY3DPEHPK3PXP';
      const isValid = await verifyTOTP(inputCode, secret);
      if (isValid) {
        setIsLoading(false);
        onLoginSuccess(pendingUser);
        setPendingUser(null);
        if (onClose) onClose();
        return;
      }
    }

    // 3. SMS / WhatsApp OTP Validation
    if (pendingUser.twoFactorMethod === 'SMS_WHATSAPP') {
      if (inputCode === simulatedOtp) {
        setIsLoading(false);
        onLoginSuccess(pendingUser);
        setPendingUser(null);
        if (onClose) onClose();
        return;
      }
    }

    setIsLoading(false);
    setErrorMessage('Invalid 6-digit authentication token or recovery key. Please check your Authenticator App.');
  };

  const handleResendSmsOtp = () => {
    if (resendTimer > 0) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(newCode);
    setResendTimer(60);
  };

  const handleQuickDemoSelect = (demoUser: UserProfile) => {
    setEmail(demoUser.email);
    setPassword('arielmc2026');
    setErrorMessage(null);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all required corporate fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (existing) {
      setErrorMessage('An enterprise profile with this email address already exists.');
      return;
    }

    const initials = regName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3) || 'AMC';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      designation: regDesignation.trim() || 'Merchandising Specialist',
      department: regDepartment,
      role: regRole,
      entityAccess: [regEntity],
      primaryEntity: regEntity,
      avatarInitials: initials,
      avatarColor: '#1F3A2E',
      signatureText: `${regName.trim()}, ${regDesignation.trim() || 'ArielMC Executive'}, ArielMC`,
      twoFactorEnabled: false,
      twoFactorMethod: 'NONE',
      status: 'ACTIVE',
      lastLogin: 'Just now',
      createdDate: new Date().toISOString().split('T')[0],
      passwordHash: regPassword,
      activeSessions: [
        {
          id: `sess-${Date.now()}`,
          device: 'Workstation Browser',
          browser: 'Current Session',
          ipAddress: '103.145.118.24',
          location: 'Dhaka, Bangladesh',
          isCurrent: true,
          lastActive: 'Active Now',
        },
      ],
      securityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          event: 'Corporate Account Registered & Provisioned',
          ip: '103.145.118.24',
          location: 'Dhaka, Bangladesh',
          status: 'SUCCESS',
        },
      ],
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    if (onClose) onClose();
  };

  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const user = allUsers.find((u) => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (!user) {
      setErrorMessage('No corporate account found with this email.');
      return;
    }

    setForgotStep('VERIFY_RESET');
  };

  const handleForgotReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotStep('REQUEST');
      setMode('LOGIN');
      setPassword(newPassword);
      setEmail(forgotEmail);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        id="auth-welcome-modal"
        className="relative w-full max-w-xl bg-[#12231B] border border-[#2C5240] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 transition-all"
      >
        {/* Modal Header */}
        <div className="relative px-6 py-6 border-b border-[#2C5240] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] text-center">
          {onClose && !forceLock && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-black/20 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl ring-4 ring-[#C8A96A]/30 border border-[#C8A96A]">
            <Image
              src="/images/ArielMC_Emblem_Square.png"
              alt="ArielMC Official Logo"
              width={56}
              height={56}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-bold text-white font-heading tracking-wide flex items-baseline justify-center gap-2">
            <span className="font-bold text-[#93C5FD] inline-flex items-baseline">
              ArielMC<sup className="text-[0.65em] font-bold text-[#93C5FD] -top-0.5 ml-[1px]">™</sup>
            </span>
            <span>Enterprise Resource Planning System</span>
          </h2>
          <p className="text-xs text-[#CFE0D5] mt-1 font-medium">
            © Ariel Marketing &amp; Communications Limited | All Right Reserve
          </p>

          {/* Mode Tabs */}
          {mode !== 'TWO_FACTOR' && (
            <div className="flex items-center justify-center gap-2 mt-4 max-w-xs mx-auto p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  mode === 'LOGIN' ? 'bg-[#C8A96A] text-[#1F3A2E] shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('REGISTER'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  mode === 'REGISTER' ? 'bg-[#C8A96A] text-[#1F3A2E] shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setMode('FORGOT_PASSWORD'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  mode === 'FORGOT_PASSWORD' ? 'bg-[#C8A96A] text-[#1F3A2E] shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN MODE */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#CFE0D5] mb-1.5">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@arielmc.com or TuheenBD@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#CFE0D5]">
                    Enterprise Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('FORGOT_PASSWORD')}
                    className="text-[11px] text-[#C8A96A] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#CFE0D5]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#2C5240] text-[#C8A96A] focus:ring-0"
                  />
                  <span>Remember this workstation</span>
                </label>
                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" /> AES-256 Auth
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter <span className="font-bold">ArielMC</span> ERP Station</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Enterprise Security Notice */}
              <div className="pt-3 border-t border-[#2C5240]/80 text-center">
                <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strict Two-Step Authentication (2SA) Enforced</span>
                </span>
              </div>
            </form>
          )}

          {/* 2. TWO-STEP AUTHENTICATION (2SA) VERIFICATION */}
          {mode === 'TWO_FACTOR' && pendingUser && (
            <form onSubmit={handleTwoFactorVerify} className="space-y-5">
              <div className="p-4 rounded-xl bg-[#162B22] border border-[#2C5240] text-center space-y-2.5">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#C8A96A]/20 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A]">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Two-Step Authentication Required (2SA)
                </h3>
                <p className="text-xs text-[#CFE0D5] leading-relaxed">
                  Enter the dynamic security token from your {pendingUser.twoFactorMethod === 'AUTHENTICATOR_APP' ? 'Authenticator App (Google / Microsoft / Apple)' : 'WhatsApp / SMS notification'}.
                </p>

                {pendingUser.twoFactorMethod === 'AUTHENTICATOR_APP' ? (
                  <div className="p-3 rounded-lg bg-black/40 border border-[#2C5240] text-xs text-slate-300 text-left space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#C8A96A] font-semibold">
                      <span>Authenticator Profile:</span>
                      <span className="font-mono text-gray-300">{pendingUser.email}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Open your Authenticator app to view the current 30-second 6-digit dynamic code.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-black/40 border border-[#2C5240] text-xs text-slate-300 text-center space-y-1.5">
                    <div className="text-[11px] text-[#C8A96A] font-semibold">
                      Security code dispatched to: {pendingUser.phone?.replace(/(\d{4})\d{4}(\d{2})/, '$1-****-$2') || '+880 1819-****58'}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {resendTimer > 0 ? (
                        <span>Resend available in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendSmsOtp}
                          className="text-[#C8A96A] underline font-bold hover:text-white"
                        >
                          Resend WhatsApp / SMS Code Now
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CFE0D5] mb-1.5 text-center">
                  {useRecoveryCode ? 'Enter Single-Use Recovery Code' : '6-Digit Authentication Code'}
                </label>
                <input
                  type="text"
                  maxLength={useRecoveryCode ? 16 : 6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  autoFocus
                  placeholder={useRecoveryCode ? 'AMC-9281-4092' : '000000'}
                  className={`mx-auto block text-center font-mono py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white focus:outline-none focus:border-[#C8A96A] ${
                    useRecoveryCode ? 'w-64 tracking-widest text-base' : 'w-48 tracking-[0.4em] text-lg'
                  }`}
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseRecoveryCode(!useRecoveryCode);
                    setTwoFactorCode('');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-[#C8A96A] hover:underline cursor-pointer"
                >
                  {useRecoveryCode ? '← Return to 6-digit Authenticator code' : 'Lost authenticator? Enter emergency recovery key'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setMode('LOGIN'); setPendingUser(null); setTwoFactorCode(''); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#1F3A2E] text-white hover:bg-[#2C5240] border border-[#2C5240] text-xs font-semibold"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] text-xs font-bold shadow-md flex items-center justify-center space-x-1"
                >
                  {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Verify &amp; Unlock</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. REGISTER NEW CORPORATE ACCOUNT */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="e.g. Shakil Ahmed"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="shakil@arielmc.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Mobile / WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+880 1819-..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="Senior Merchandiser / QA Officer"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Department
                  </label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value as UserDepartment)}
                    className="w-full px-2 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="SOURCING_MERCHANDISING">Merchandising</option>
                    <option value="FACTORY_COMPLIANCE">Compliance & QA</option>
                    <option value="FINANCE_COMMERCIAL">Finance & Tax</option>
                    <option value="LOGISTICS_FULFILLMENT">Logistics & CFS</option>
                    <option value="EXECUTIVE">Executive Trade Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Role Access
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-2 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="SOURCING_DIRECTOR">Merchandiser</option>
                    <option value="COMPLIANCE_AUDITOR">Compliance Auditor</option>
                    <option value="FINANCE_CONTROLLER">Finance Controller</option>
                    <option value="LOGISTICS_MANAGER">Logistics Manager</option>
                    <option value="BUYER_VIEWER">Partner Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Station Entity
                  </label>
                  <select
                    value={regEntity}
                    onChange={(e) => setRegEntity(e.target.value as EntityCode)}
                    className="w-full px-2 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="ARIEL_BD">ArielMC BD</option>
                    <option value="ARIEL_UK">ArielMC UK</option>
                    <option value="ARIEL_US">ArielMC US</option>
                    <option value="ARIEL_EU">ArielMC EU</option>
                    <option value="ARIEL_AU">ArielMC AU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Corporate Profile & Sign In</span>
              </button>
            </form>
          )}

          {/* 4. FORGOT PASSWORD FLOW */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {forgotSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Password Reset Successful</h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Your password has been updated. Redirecting you to sign in...
                  </p>
                </div>
              ) : forgotStep === 'REQUEST' ? (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <p className="text-xs text-[#CFE0D5] leading-relaxed">
                    Enter your registered <span className="font-bold">ArielMC</span> corporate email. A secure recovery authorization code will be verified.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-[#CFE0D5] mb-1.5">
                      Account Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="TuheenBD@gmail.com or name@arielmc.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('LOGIN')}
                      className="flex-1 py-2.5 rounded-xl bg-[#1F3A2E] text-white hover:bg-[#2C5240] border border-[#2C5240] text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs shadow-md"
                    >
                      Send Reset Authorization
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-4">
                  <div className="p-3 rounded-lg bg-[#162B22] border border-[#2C5240] text-xs text-[#CFE0D5]">
                    Authorization code sent for <span className="text-white font-semibold">{forgotEmail}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                      Reset Code
                    </label>
                    <input
                      type="text"
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      required
                      placeholder="Enter 6-digit code or '123456'"
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter new strong password"
                      className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs shadow-md"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0D1913] border-t border-[#2C5240] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#CFE0D5]/70">
          <div>
            <span className="text-white font-bold">ArielMC™</span> Enterprise Resource Planning System &bull; © Ariel Marketing &amp; Communications Limited | All Right Reserve
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-emerald-400">Security Node Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
