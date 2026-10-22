import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, ShieldCheck, CheckCircle2, Lock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('admin@homease.in');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>('Super Admin');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [resendTimer, setResendTimer] = useState(30);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setHasError(true);
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto advance focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered === '123456') {
      setIsLoading(true);
      setTimeout(() => {
        login(email, selectedRole);
      }, 500);
    } else {
      setHasError(true);
      setErrorMessage('Invalid 2FA code. For demo, please enter 123456.');
    }
  };

  const handleQuickDemoLogin = (role: Role = 'Super Admin') => {
    login('admin@homease.in', role);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--canvas)',
        position: 'relative',
        padding: '24px'
      }}
    >
      <div className="aurora-backdrop" style={{ top: -60, right: -60, width: 650, height: 650 }} />

      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: '1020px',
          borderRadius: 24,
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-e3)',
          border: '1px solid var(--border)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Left Side: Login Form */}
        <div style={{ padding: '48px', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div
              className="clay-badge"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #8B73FF, #6C4DFF)'
              }}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)' }}>
                HomeEase
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                Operations & Marketplace Web Admin
              </p>
            </div>
          </div>

          {step === 'credentials' ? (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                  Sign in to your account
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-2)', marginTop: 4 }}>
                  Enter your operator credentials to access the backoffice panel.
                </p>
              </div>

              {hasError && (
                <div
                  className="error-shake"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'var(--danger-soft)',
                    color: 'var(--danger)',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: 20,
                    border: '1px solid rgba(240, 82, 79, 0.2)'
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Password</span>
                    <a href="#forgot" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>
                      Forgot?
                    </a>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--ink-3)'
                      }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Select Demo Role to Preview</label>
                  <select
                    className="form-select"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as Role)}
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Operations Manager">Operations Manager (Bookings & Pros)</option>
                    <option value="Support Agent">Support Agent (Disputes & Tickets)</option>
                    <option value="Finance">Finance (Payouts & Refunds)</option>
                    <option value="Marketing">Marketing (CMS, Coupons & Memberships)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--ink-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: 44, width: '100%', marginTop: 8 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Continue to 2FA Step →'}
                </button>
              </form>

              {/* Quick Demo One-Click Access */}
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  borderRadius: 14,
                  background: 'var(--primary-soft)',
                  border: '1px solid rgba(108, 77, 255, 0.18)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Zap size={16} color="var(--primary)" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                    Client Presentation Demo Mode
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-2)', marginBottom: 12 }}>
                  Bypass credentials and instantly launch the dashboard as any operator role:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button
                    onClick={() => handleQuickDemoLogin('Super Admin')}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '12px' }}
                  >
                    Enter as Super Admin
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('Operations Manager')}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '12px' }}
                  >
                    Ops Manager
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('Support Agent')}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '12px' }}
                  >
                    Support Agent
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 2: 2FA Screen */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                  Two-Factor Authentication
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--ink-2)', marginTop: 4 }}>
                  Enter the 6-digit verification code sent to <strong>{email}</strong>.
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 8,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'var(--success-soft)',
                    color: 'var(--success)',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  Demo OTP is: 123456
                </div>
              </div>

              {hasError && (
                <div
                  className="error-shake"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'var(--danger-soft)',
                    color: 'var(--danger)',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: 20
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '24px 0' }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      style={{
                        width: 48,
                        height: 54,
                        textAlign: 'center',
                        fontSize: '22px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        borderRadius: 12,
                        border: '2px solid var(--border)',
                        background: 'var(--surface-2)',
                        color: 'var(--ink)',
                        outline: 'none'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  ))}
                </div>

                <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-2)', marginBottom: 24 }}>
                  {resendTimer > 0 ? (
                    <span>Resend code in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResendTimer(30)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="btn btn-outline"
                    style={{ height: 44, flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: 44, flex: 2 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying OTP...' : 'Verify & Sign In'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Clay Illustration & Trust Features */}
        <div
          style={{
            background: 'linear-gradient(145deg, #16143A, #0D0C22)',
            color: '#FFFFFF',
            padding: '48px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div
              className="clay-card"
              style={{
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}
            >
              <ShieldCheck size={32} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
              Enterprise Operations for On-Demand Home Services
            </h3>

            <p style={{ fontSize: '13.5px', color: '#B5B8DA', marginTop: 12, lineHeight: 1.6 }}>
              Control real-time dispatch, automatic professional assignment, transparent customer pricing,
              dispute arbitration, and automated weekly payouts.
            </p>
          </div>

          {/* Three Trust Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="clay-badge" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>Instant Auto-Assignment</div>
                <div style={{ fontSize: '12px', color: '#8E91B2' }}>Matches nearest verified partner in under 45 seconds</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="clay-badge" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>Partner Simulator Included</div>
                <div style={{ fontSize: '12px', color: '#8E91B2' }}>Test end-to-end partner journeys without a second phone</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="clay-badge" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>Urban Company-Grade Security</div>
                <div style={{ fontSize: '12px', color: '#8E91B2' }}>Granular RBAC, OTP checks & immutable audit logging</div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              color: '#8E91B2',
              marginTop: 32
            }}
          >
            Connected to Live Shared Mock Engine • Multi-city Hub
          </div>
        </div>
      </div>
    </div>
  );
};
