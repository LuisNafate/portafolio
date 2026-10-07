# Luis Nafate — Portafolio

Portafolio interactivo construido con React, Three.js, React Three Fiber y GSAP.

## Sitio público

[luisnafate.github.io/portafolio](https://luisnafate.github.io/portafolio/)

## Ejecutar

```bash
npm install
npm run dev
```

La versión de producción se genera con:

```bash
npm run build
```

## Cambiar contenido

- Los proyectos, textos, enlaces e imágenes están en `src/App.jsx`.
- Las portadas optimizadas están en `public/projects` y se generan con `scripts/build_project_images.py`.
- La escena 3D está en `src/Experience.jsx`.
- Colores, tipografía, responsive y animaciones visuales están en `src/styles.css`.

Las imágenes de los proyectos fueron compuestas a partir de capturas y recursos de sus repositorios originales. La fotografía de perfil se obtiene del avatar público de GitHub.

## Publicación

Para compilar y publicar una nueva versión en GitHub Pages:

```bash
pnpm deploy
```

El comando construye la versión optimizada y actualiza la rama `gh-pages`.
