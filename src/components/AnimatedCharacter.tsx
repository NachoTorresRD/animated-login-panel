'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterTransform, FormInteractionState, SequenceState } from '@/types/login';

interface AnimatedCharacterProps {
  characterTransformRef: React.MutableRefObject<CharacterTransform>;
  state: SequenceState;
  interactionState: FormInteractionState;
}

export function AnimatedCharacter({
  characterTransformRef,
  state,
  interactionState,
}: AnimatedCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const canvasWidth = useThree((threeState) => threeState.size.width);

  const gltf = useGLTF('/glb/hero_animated.glb') as any;
  const { actions } = useAnimations(gltf.animations || [], groupRef);
  const { focusedField, isPasswordVisible, submitStatus, keystrokeCount } = interactionState;

  const characterScale = useMemo(() => {
    if (canvasWidth < 480) return 0.72;
    if (canvasWidth < 768) return 0.9;
    return 1.25;
  }, [canvasWidth]);

  useEffect(() => {
    if (!gltf.scene) return;

    gltf.scene.traverse((child: THREE.Object3D) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.roughness = 0.45;
          material.metalness = 0.08;
        }
      });
    });
  }, [gltf.scene]);

  useEffect(() => {
    let targetClip = 'idle';

    if (submitStatus === 'success') targetClip = 'success';
    else if (state === 'maroma') targetClip = 'maroma';
    else if (state === 'waving') targetClip = 'wave';
    else if (state === 'searching') targetClip = 'search';
    else if (state === 'walking') targetClip = 'walk';
    else if (state === 'pushing') targetClip = 'push';
    else if (focusedField === 'email') targetClip = 'search';

    const nextAction = actions[targetClip] || actions.idle;
    if (!nextAction || activeActionRef.current === nextAction) return;

    const previousAction = activeActionRef.current;
    nextAction.enabled = true;
    nextAction.setEffectiveTimeScale(1);
    nextAction.setEffectiveWeight(1);
    nextAction.reset();

    if (targetClip === 'maroma' || targetClip === 'wave' || targetClip === 'success') {
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
    } else {
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      nextAction.clampWhenFinished = false;
    }

    nextAction.play();
    if (previousAction) previousAction.crossFadeTo(nextAction, 0.28, false);
    else nextAction.fadeIn(0.28);
    activeActionRef.current = nextAction;
  }, [actions, focusedField, state, submitStatus]);

  useEffect(() => {
    return () => {
      Object.values(actions).forEach((action) => action?.stop());
      activeActionRef.current = null;
    };
  }, [actions]);

  useFrame((threeState, delta) => {
    const group = groupRef.current;
    const body = bodyRef.current;
    const transform = characterTransformRef.current;
    const smoothing = 1 - Math.exp(-10 * delta);

    if (group && transform) {
      group.position.x = THREE.MathUtils.lerp(group.position.x, transform.x, smoothing);
      group.position.y = THREE.MathUtils.lerp(group.position.y, transform.y, smoothing);
      group.position.z = THREE.MathUtils.lerp(group.position.z, transform.z, smoothing);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, transform.rotationY, smoothing);
    }

    if (!body) return;
    const clock = threeState.clock.getElapsedTime();
    const t = clock * 6;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetRotZ = 0;

    if (submitStatus === 'success') {
      targetRotX = -0.1;
      targetRotZ = Math.sin(t * 0.8) * 0.1;
    } else if (submitStatus === 'error') {
      targetRotX = 0.2;
      targetRotZ = Math.sin(t * 2) * 0.12;
    } else if (focusedField === 'password') {
      targetRotY = isPasswordVisible ? 0.3 : 0.85;
      targetRotX = 0.15;
    } else if (focusedField === 'email') {
      targetRotY = -0.45;
      targetRotX = 0.1;
      body.position.y = Math.sin(keystrokeCount * 2) * 0.04;
    } else {
      body.position.y = Math.sin(clock * 2.2) * 0.02;
    }

    body.rotation.y = THREE.MathUtils.lerp(body.rotation.y, targetRotY, smoothing);
    body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, targetRotX, smoothing);
    body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, targetRotZ, smoothing);
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} scale={characterScale}>
      <group ref={bodyRef}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

useGLTF.preload('/glb/hero_animated.glb');
