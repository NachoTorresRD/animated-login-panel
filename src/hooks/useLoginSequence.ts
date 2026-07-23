import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CharacterTransform, FormInteractionState, SequenceState } from '@/types/login';

type StagePositions = {
  entranceX: number;
  restingX: number;
  rightEdgeX: number;
  pushingX: number;
};

function getStagePositions(): StagePositions {
  if (typeof window === 'undefined') {
    return { entranceX: -1.6, restingX: -2.8, rightEdgeX: 5.2, pushingX: 2.5 };
  }

  if (window.innerWidth < 480) {
    return { entranceX: -0.35, restingX: -1.25, rightEdgeX: 1.55, pushingX: 0.85 };
  }

  if (window.innerWidth < 768) {
    return { entranceX: -0.9, restingX: -1.9, rightEdgeX: 2.75, pushingX: 1.35 };
  }

  return { entranceX: -1.6, restingX: -2.8, rightEdgeX: 5.2, pushingX: 2.5 };
}

export function useLoginSequence() {
  const [state, setState] = useState<SequenceState>('idle');
  const [statusMessage, setStatusMessage] = useState('Preparando la entrada del personaje…');
  const [interactionState, setInteractionState] = useState<FormInteractionState>({
    focusedField: 'none',
    isPasswordVisible: false,
    submitStatus: 'idle',
    keystrokeCount: 0,
  });

  const characterTransformRef = useRef<CharacterTransform>({
    x: -1.6,
    y: 1.65,
    z: 0,
    rotationY: Math.PI / 2,
  });
  const formContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const isReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const setFocusedField = useCallback((field: 'none' | 'email' | 'password') => {
    setInteractionState((previous) => ({ ...previous, focusedField: field }));
  }, []);

  const setIsPasswordVisible = useCallback((visible: boolean) => {
    setInteractionState((previous) => ({ ...previous, isPasswordVisible: visible }));
  }, []);

  const setSubmitStatus = useCallback(
    (submitStatus: 'idle' | 'submitting' | 'success' | 'error') => {
      setInteractionState((previous) => ({ ...previous, submitStatus }));
    },
    []
  );

  const triggerKeystroke = useCallback(() => {
    setInteractionState((previous) => ({
      ...previous,
      keystrokeCount: previous.keystrokeCount + 1,
    }));
  }, []);

  const skipSequence = useCallback(() => {
    timelineRef.current?.kill();
    const { restingX } = getStagePositions();

    characterTransformRef.current = {
      x: restingX,
      y: -1.2,
      z: 0,
      rotationY: 0.15,
    };

    if (formContainerRef.current) {
      gsap.set(formContainerRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
      });
    }

    setState('finished');
    setStatusMessage('Formulario listo. Esperando tus credenciales.');
  }, []);

  const startSequence = useCallback(() => {
    if (isReducedMotion()) {
      skipSequence();
      return;
    }

    timelineRef.current?.kill();
    const { entranceX, restingX, rightEdgeX, pushingX } = getStagePositions();

    setInteractionState({
      focusedField: 'none',
      isPasswordVisible: false,
      submitStatus: 'idle',
      keystrokeCount: 0,
    });

    Object.assign(characterTransformRef.current, {
      x: entranceX,
      y: 1.65,
      z: 0,
      rotationY: Math.PI / 2,
    });

    if (formContainerRef.current) {
      gsap.set(formContainerRef.current, {
        x: '85vw',
        opacity: 0,
        scale: 0.96,
        rotation: 3,
      });
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        setState('finished');
        setStatusMessage('Formulario en su lugar. Esperando tu correo y contraseña.');
      },
    });
    timelineRef.current = timeline;

    timeline.call(() => {
      setState('maroma');
      setStatusMessage('¡Entrada acrobática en camino!');
    });
    timeline.to(characterTransformRef.current, {
      // Keep the whole flip and landing on the same horizontal axis.
      // The character moves to its final left position later in the sequence.
      x: entranceX,
      y: -1.2,
      rotationY: 0.15,
      duration: 1.85,
      ease: 'power2.inOut',
    });

    timeline.call(() => {
      setState('waving');
      setStatusMessage('¡Hola! Voy a buscar el panel de acceso…');
    });
    timeline.to({}, { duration: 2.75 });

    timeline.call(() => {
      setState('searching');
      setStatusMessage('Buscando el cajón del login…');
    });
    timeline.to(characterTransformRef.current, {
      rotationY: Math.PI / 2,
      duration: 0.35,
      ease: 'power2.out',
    });
    timeline.to({}, { duration: 1.85 });

    timeline.call(() => {
      setState('walking');
      setStatusMessage('Ya lo vi. Voy por él…');
    });
    timeline.to(characterTransformRef.current, {
      x: rightEdgeX,
      y: -1.2,
      duration: 1.9,
      ease: 'power1.inOut',
    });

    timeline.call(() => {
      setState('pushing');
      setStatusMessage('¡Encontrado! Empujando el cajón hacia el centro…');
    });
    timeline.to(characterTransformRef.current, {
      rotationY: -Math.PI / 2,
      duration: 0.3,
      ease: 'power2.out',
    });
    timeline.to(
      characterTransformRef.current,
      {
        x: pushingX,
        y: -1.2,
        duration: 2.6,
        ease: 'power1.out',
      },
      'push'
    );
    if (formContainerRef.current) {
      timeline.to(
        formContainerRef.current,
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 2.6,
          ease: 'power1.out',
        },
        'push'
      );
    }

    timeline.call(() => {
      setState('walking');
      setStatusMessage('Dejando todo listo para ti…');
    });
    timeline.to(characterTransformRef.current, {
      x: restingX,
      y: -1.2,
      rotationY: 0.15,
      duration: 1.45,
      ease: 'power2.out',
    });
  }, [isReducedMotion, skipSequence]);

  useEffect(() => {
    startSequence();
    return () => {
      timelineRef.current?.kill();
    };
  }, [startSequence]);

  return {
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
    isReducedMotion: isReducedMotion(),
  };
}
