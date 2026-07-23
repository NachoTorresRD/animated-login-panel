# Animated 3D Login Panel

An interactive sign-in experience built with Next.js, React Three Fiber, Three.js, and GSAP. A 3D character enters with a somersault, waves, searches for the panel, walks toward it, and pushes it into place before reacting to the form.

## Features

- State-driven 3D sequence: somersault, wave, search, walk, push, and celebration.
- Smooth transitions between GLB animation clips.
- Character reactions to email, password, and validation states.
- Responsive layouts for desktop, tablet, and mobile.
- Controls to replay or skip the introduction.
- `prefers-reduced-motion` support.
- Accessible labels, visible focus states, and form feedback.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To validate the production build:

```bash
npm run build
npm run preview
```

## Cloudflare deployment

The application uses Next.js static export. `npm run build` generates `out/`, and Wrangler publishes that directory as the Worker's static assets:

```bash
npm run deploy
```

For Cloudflare Workers Builds, use `npm run build` as the Build command and `npx wrangler deploy` as the Deploy command. For a Cloudflare Pages project, select **Next.js (Static HTML Export)** and use `out` as the output directory.

## Main structure

- `src/hooks/useLoginSequence.ts`: character and panel sequence and positioning.
- `src/components/AnimatedCharacter.tsx`: GLB loading and clip controller.
- `src/components/CharacterScene.tsx`: Canvas, camera, lighting, and particles.
- `src/components/LoginForm.tsx`: form and interaction states.
- `public/glb/hero_animated.glb`: final model containing the required clips.

## Important

This login is a visual demonstration. Its current validation runs in the browser and is not connected to a real authentication system.

## License

[MIT](LICENSE). Created by [Nacho Torres](https://github.com/NachoTorresRD) for [NTDESWEB](https://www.ntdesweb.com).
