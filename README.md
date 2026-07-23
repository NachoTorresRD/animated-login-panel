# Animated 3D Login Panel

Experiencia de acceso construida con Next.js, React Three Fiber, Three.js y GSAP. Un personaje 3D entra con una maroma, saluda, busca el panel, camina hasta él y lo empuja al centro antes de reaccionar al formulario.

## Características

- Secuencia 3D por estados: maroma, saludo, búsqueda, caminata, empuje y celebración.
- Transiciones suaves entre clips de animación GLB.
- Reacciones al correo, la contraseña y la validación del formulario.
- Diseño adaptable para escritorio, tablet y móvil.
- Controles para repetir o saltar la introducción.
- Compatibilidad con `prefers-reduced-motion`.
- Etiquetas, foco visible y mensajes accesibles para el formulario.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para validar el build de producción:

```bash
npm run build
npm start
```

## Estructura principal

- `src/hooks/useLoginSequence.ts`: secuencia y posiciones del personaje y el panel.
- `src/components/AnimatedCharacter.tsx`: carga del GLB y control de clips.
- `src/components/CharacterScene.tsx`: Canvas, cámara, luces y partículas.
- `src/components/LoginForm.tsx`: formulario y estados interactivos.
- `public/glb/hero_animated.glb`: modelo final con todos los clips requeridos.

## Importante

El login es una demostración visual. La validación actual ocurre en el navegador y no está conectada a un sistema real de autenticación.

## Licencia

[MIT](LICENSE). Creado por [Nacho Torres](https://github.com/NachoTorresRD) para [NTDESWEB](https://www.ntdesweb.com).
