'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginFormProps {
  formContainerRef: React.RefObject<HTMLDivElement | null>;
  isInteractive: boolean;
  onFocusEmail: () => void;
  onFocusPassword: () => void;
  onBlurField: () => void;
  onTogglePasswordVisibility: (visible: boolean) => void;
  onKeystroke: () => void;
  onSubmitStart: () => void;
  onSubmitSuccess: () => void;
  onSubmitError: () => void;
  onSubmitReset: () => void;
}

export function LoginForm({
  formContainerRef,
  isInteractive,
  onFocusEmail,
  onFocusPassword,
  onBlurField,
  onTogglePasswordVisibility,
  onKeystroke,
  onSubmitStart,
  onSubmitSuccess,
  onSubmitError,
  onSubmitReset,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    };
  }, []);

  const resetError = () => {
    if (status !== 'error') return;
    setStatus('idle');
    setErrorMessage('');
    onSubmitReset();
  };

  const togglePassword = () => {
    const nextValue = !showPassword;
    setShowPassword(nextValue);
    onTogglePasswordVisibility(nextValue);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setStatus('error');
      setErrorMessage('Por favor, completa todos los campos.');
      onSubmitError();
      return;
    }

    if (!email.includes('@')) {
      setStatus('error');
      setErrorMessage('Ingresa un correo electrónico válido.');
      onSubmitError();
      return;
    }

    setStatus('submitting');
    onSubmitStart();
    submitTimerRef.current = setTimeout(() => {
      setStatus('success');
      onSubmitSuccess();
    }, 1200);
  };

  const fieldsDisabled = !isInteractive || status === 'submitting' || status === 'success';

  return (
    <div
      ref={formContainerRef}
      aria-hidden={!isInteractive}
      style={{
        transform: 'translateX(120vw)',
        opacity: 0,
        pointerEvents: isInteractive ? 'auto' : 'none',
        willChange: 'transform, opacity',
      }}
      className="relative z-20 mx-auto w-full max-w-md select-text transition-shadow duration-300"
    >
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/85 p-6 shadow-2xl shadow-purple-950/40 backdrop-blur-xl sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="mb-6 text-center">
          <span className="mb-3 inline-block rounded-full border border-red-500/30 bg-red-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-300">
            NTDESWEB Hero FX
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Acceso a la plataforma</h2>
          <p className="mt-1 text-sm text-slate-400">Escribe tu correo y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                disabled={fieldsDisabled}
                value={email}
                onFocus={onFocusEmail}
                onBlur={onBlurField}
                onChange={(event) => {
                  setEmail(event.target.value);
                  onKeystroke();
                  resetError();
                }}
                placeholder="superheroe@ejemplo.com"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Contraseña <span className="normal-case tracking-normal text-slate-500">(el héroe no mira)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={fieldsDisabled}
                value={password}
                onFocus={onFocusPassword}
                onBlur={onBlurField}
                onChange={(event) => {
                  setPassword(event.target.value);
                  onKeystroke();
                  resetError();
                }}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={togglePassword}
                disabled={fieldsDisabled}
                className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex min-h-11 cursor-pointer items-center text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                disabled={fieldsDisabled}
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-red-500 focus:ring-red-400 focus:ring-offset-slate-900"
              />
              <span className="ml-2">Recordarme</span>
            </label>
            <a href="#forgot" className="rounded text-red-400 transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
              ¿Olvidaste tu clave?
            </a>
          </div>

          {status === 'error' && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>¡Acceso autorizado! El héroe celebra contigo.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={fieldsDisabled}
            className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:from-red-500 hover:to-pink-500 hover:shadow-red-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Verificando…</span>
              </>
            ) : (
              <>
                <span>{status === 'success' ? 'Acceso autorizado' : 'Iniciar sesión'}</span>
                {status !== 'success' && <ArrowRight className="h-4 w-4" />}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800/80 pt-4 text-center text-xs text-slate-400">
          <span>¿No tienes una cuenta aún? </span>
          <a href="#register" className="rounded font-semibold text-red-400 transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
            Crear cuenta gratis
          </a>
        </div>
      </div>
    </div>
  );
}
