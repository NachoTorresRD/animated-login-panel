'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import { AnimatedCharacter } from './AnimatedCharacter';
import { SequenceState, CharacterTransform, FormInteractionState } from '@/types/login';

interface CharacterSceneProps {
  state: SequenceState;
  characterTransformRef: React.MutableRefObject<CharacterTransform>;
  interactionState: FormInteractionState;
}

export default function CharacterScene({
  state,
  characterTransformRef,
  interactionState,
}: CharacterSceneProps) {
  const isError = interactionState.submitStatus === 'error';
  const isSuccess = interactionState.submitStatus === 'success';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 8]} intensity={1.8} castShadow />
        <directionalLight
          position={[-6, -4, -4]}
          intensity={0.6}
          color={isError ? '#ef4444' : isSuccess ? '#10b981' : '#a855f7'}
        />
        <pointLight
          position={[0, 4, 3]}
          intensity={1.2}
          color={isError ? '#dc2626' : isSuccess ? '#34d399' : '#38bdf8'}
        />

        <Suspense fallback={null}>
          <Float
            speed={state === 'idle' || state === 'finished' ? 1.5 : 0}
            rotationIntensity={0.1}
            floatIntensity={0.2}
          >
            <AnimatedCharacter
              characterTransformRef={characterTransformRef}
              state={state}
              interactionState={interactionState}
            />
          </Float>

          {/* Hero Sparkles / Particles */}
          <Sparkles
            count={isSuccess ? 80 : 35}
            scale={6}
            size={isSuccess ? 4 : 2}
            speed={isSuccess ? 2.5 : 0.6}
            color={isError ? '#ef4444' : isSuccess ? '#34d399' : '#c084fc'}
          />

          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.65}
            scale={16}
            blur={2.4}
            far={4.5}
            color={isError ? '#7f1d1d' : isSuccess ? '#064e3b' : '#0f0921'}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
