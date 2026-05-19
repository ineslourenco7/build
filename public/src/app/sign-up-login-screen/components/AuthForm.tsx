'use client';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Copy,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'login' | 'signup';

interface LoginValues { email: string; password: string; remember: boolean; }
interface SignupValues { name: string; email: string; password: string; terms: boolean; }

const DEMO_EMAIL = 'miguel@buildai.dev';
const DEMO_PASSWORD = 'BuildAI2026!';

export default function AuthForm() {
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();

  const loginForm = useForm<LoginValues>({ defaultValues: { email: '', password: '', remember: false } });
  const signupForm = useForm<SignupValues>({ defaultValues: { name: '', email: '', password: '', terms: false } });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const autofillDemo = () => {
    loginForm.setValue('email', DEMO_EMAIL);
    loginForm.setValue('password', DEMO_PASSWORD);
  };

  const onLogin = async (data: LoginValues) => {
    if (data.email !== DEMO_EMAIL || data.password !== DEMO_PASSWORD) {
      loginForm.setError('email', { message: 'Invalid credentials — use the demo accounts below to sign in' });
      return;
    }
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/login { email, password }
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success('Welcome back, Miguel!');
    router.push('/');
  };

  const onSignup = async (data: SignupValues) => {
    if (!data.terms) {
      signupForm.setError('terms', { message: 'You must accept the terms to continue' });
      return;
    }
    setIsLoading(true);
    // BACKEND INTEGRATION: POST /api/auth/signup { name, email, password }
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    toast.success('Account created! Redirecting...');
    router.push('/');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-sm">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">B</span>
          </div>
          <span className="font-semibold text-base text-gradient-primary">BuildAI</span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {tab === 'login' ? 'Sign in to continue building' : 'Start building with AI for free'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg p-0.5 mb-6" style={{ background: 'var(--muted)' }}>
          {(['login', 'signup'] as Tab[]).map((t) => (
            <button
              key={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                tab === t
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Google auth */}
        <button className="btn-secondary w-full mb-4 justify-center gap-3">
          <Globe size={16} className="text-muted-foreground" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-base pl-9"
                  {...loginForm.register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-base pl-9 pr-10"
                  {...loginForm.register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-red-400 mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded accent-primary"
                {...loginForm.register('remember')}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</label>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === 'signup' && (
          <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Miguel Santos"
                  className="input-base pl-9"
                  {...signupForm.register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                />
              </div>
              {signupForm.formState.errors.name && (
                <p className="text-xs text-red-400 mt-1">{signupForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-base pl-9"
                  {...signupForm.register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-xs text-red-400 mt-1">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="input-base pl-9 pr-10"
                  {...signupForm.register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-xs text-red-400 mt-1">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded accent-primary mt-0.5"
                  {...signupForm.register('terms')}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
              {signupForm.formState.errors.terms && (
                <p className="text-xs text-red-400 mt-1">{signupForm.formState.errors.terms.message}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
              {isLoading ? (
                <><Loader2 size={14} className="animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        )}

        {/* Demo credentials box */}
        {tab === 'login' && (
          <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(110,231,183,0.05)', border: '1px solid rgba(110,231,183,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={14} className="text-primary" />
              <p className="text-xs font-semibold text-primary">Demo Credentials</p>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Email', value: DEMO_EMAIL, field: 'email' },
                { label: 'Password', value: DEMO_PASSWORD, field: 'password' },
              ].map((item) => (
                <div key={`cred-${item.field}`} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-mono text-foreground">{item.value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.value, item.field)}
                    className="p-1.5 rounded-md hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                  >
                    {copiedField === item.field ? <CheckCircle2 size={13} className="text-primary" /> : <Copy size={13} />}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={autofillDemo}
              className="mt-3 w-full py-1.5 text-xs font-medium rounded-lg transition-all duration-150 hover:bg-primary/10 text-primary border border-primary/20"
            >
              Autofill demo credentials
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-5">
          {tab === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <button onClick={() => setTab('signup')} className="text-primary hover:underline font-medium">
                Sign up free
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setTab('login')} className="text-primary hover:underline font-medium">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}