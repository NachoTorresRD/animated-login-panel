'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Play, ShieldCheck, SkipForward } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';
import { useLoginSequence } from '@/hooks/useLoginSequence';

const CharacterScene = dynamic(() => import('@/components/CharacterScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-slate-500">
      Cargando personaje 3D…
    </div>
  ),
});

export default function Home() {
  const {
    state,
    statusMessage,
    interactionState,
    setFocusedField,
    setIsPasswordVisible,
    setSubmitStatus,
    triggerKeystroke,
    characterTransformRef,
    formContainerRef,
    startSequence,
    skipSequence,
  } = useLoginSequence();

  const isFormInteractive = state === 'finished';
  const visibleStatus =
    interactionState.focusedField === 'password'
      ? 'El personaje se gira para respetar tu contraseña.'
      : interactionState.focusedField === 'email'
        ? 'El personaje observa mientras escribes tu correo.'
        : interactionState.submitStatus === 'error'
          ? 'Revisa los campos señalados e inténtalo de nuevo.'
          : interactionState.submitStatus === 'success'
            ? '¡Sesión autorizada! El personaje celebra contigo.'
            : statusMessage;

  return (
    <main className="relative flex min-h-screen w-full select-none flex-col justify-between overflow-hidden bg-[#07060b] p-4 md:p-8">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-900/15 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-900/15 blur-[140px] animate-pulse-glow" />

      <header className="relative z-30 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-950/40 text-base font-black text-purple-300 shadow-lg shadow-purple-950/50 backdrop-blur">
            3D
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-white">NTDESWEB 3D Animated Login</h1>
            <p className="text-[11px] font-medium text-slate-400">Entrada, saludo y búsqueda del panel</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={startSequence}
            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-md transition-all hover:border-purple-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 sm:flex-none"
            title="Reiniciar secuencia animada"
          >
            <Play className="h-3.5 w-3.5 text-purple-400" />
            <span>Repetir animación</span>
          </button>
          <button
            type="button"
            onClick={skipSequence}
            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-md transition-all hover:border-purple-500/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:flex-none"
            title="Saltar directamente al formulario"
          >
            <SkipForward className="h-3.5 w-3.5 text-cyan-400" />
            <span>Saltar</span>
          </button>
        </div>
      </header>

      <section className="relative z-20 mx-auto flex min-h-[580px] w-full max-w-6xl flex-1 flex-col items-center justify-center py-6">
        <div className="relative z-30 mb-6 max-w-[calc(100vw-2rem)] transition-all duration-300">
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-slate-900/90 px-4 py-2 text-center text-xs font-semibold text-purple-100 shadow-xl backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
            </span>
            <span>{visibleStatus}</span>
          </div>
        </div>

        <Suspense fallback={null}>
          <CharacterScene
            state={state}
            characterTransformRef={characterTransformRef}
            interactionState={interactionState}
          />
        </Suspense>

        <LoginForm
          formContainerRef={formContainerRef}
          isInteractive={isFormInteractive}
          onFocusEmail={() => setFocusedField('email')}
          onFocusPassword={() => setFocusedField('password')}
          onBlurField={() => setFocusedField('none')}
          onTogglePasswordVisibility={setIsPasswordVisible}
          onKeystroke={triggerKeystroke}
          onSubmitStart={() => setSubmitStatus('submitting')}
          onSubmitSuccess={() => setSubmitStatus('success')}
          onSubmitError={() => setSubmitStatus('error')}
          onSubmitReset={() => setSubmitStatus('idle')}
        />
      </section>

      <footer className="relative z-30 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-slate-800/60 pt-4 text-[11px] text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            FSM: <strong className="uppercase text-purple-300">{state}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Interacción:{' '}
            <strong className="uppercase text-cyan-300">{interactionState.focusedField}</strong>
          </span>
        </div>
        <p>Next.js 14, React Three Fiber y GSAP</p>
      </footer>
    </main>
  );
}
