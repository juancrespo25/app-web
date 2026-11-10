# React + TypeScript + Vite

## Configuración de las API

Copie `.env.example` a `.env` y ajuste las URL según el entorno:

- `VITE_API_URL`: API principal (por ejemplo, `http://localhost:4000/api`).
- `VITE_OPERACIONES_API_URL`: API de operaciones (por ejemplo, `http://localhost:4006`).

Las URL son accesibles desde el navegador, por lo que deben ser alcanzables
desde el equipo del usuario. Reinicie Vite después de cambiar `.env`. No incluya
credenciales ni secretos en variables `VITE_`.

En Docker, estas variables se incorporan al compilar la imagen. Páselas
como argumentos de build; cambiarlas en el entorno de un contenedor existente
no modifica la aplicación ya compilada:

```sh
docker build --build-arg VITE_API_URL=http://localhost:4000/api --build-arg VITE_OPERACIONES_API_URL=http://localhost:4006 -t app-web .
```

Con Docker Compose, configure ambas variables en `.env` y ejecute
`docker compose up --build` para reconstruir la imagen con las URL indicadas.

Para el despliegue de GitHub Actions, configure `VITE_API_URL` y
`VITE_OPERACIONES_API_URL` como secretos del repositorio. Aunque se almacenen
como secretos en GitHub, sus valores quedan visibles en el código generado
para el navegador y no deben contener credenciales.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
