# TFG Tutor IA

Aplicación web de tutor de inglés asistido por IA con autenticación por credenciales.

## Descripción

Proyecto construido con Next.js 13 (App Router), TypeScript, Tailwind CSS y MongoDB. Incluye autenticación con NextAuth y funcionalidades de IA para chat, feedback, transcripción y síntesis de voz.

## Stack técnico

- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- MongoDB con Mongoose
- NextAuth.js (credenciales)
- OpenAI API

## Funcionalidades principales

- Registro e inicio de sesión con email y contraseña
- Protección de páginas con middleware de NextAuth
- Dashboard de usuario autenticado
- Tutor conversacional de inglés por escenarios
- Generación de feedback de la sesión
- Transcripción de audio y síntesis de voz
- Exportación de feedback a PDF

## Instalación local

1. Instalar dependencias:

```bash
npm install
```

2. Copiar el archivo de ejemplo de variables de entorno:

```bash
copy .env.example .env
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir en el navegador:

```text
http://localhost:3000
```

## Variables de entorno

Configura las siguientes variables en `.env`:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
OPENAI_API_KEY=
```

> No subas `.env` al repositorio. El archivo `.gitignore` ya excluye los archivos de entorno y dependencias locales.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Buenas prácticas

- Revisa que `.env` no esté trackeado en Git
- No subas claves ni secretos al repositorio
- Usa `.env.example` como plantilla para compartir la configuración sin datos sensibles
- Asegúrate de que `.gitignore` incluye `node_modules/`, `.next/`, archivos de logs y entornos locales

## Mejoras pendientes

- Validaciones más fuertes en las API routes
- Guardar sesiones, conversaciones o resultados de usuarios
- Añadir tests automatizados
- Controlar cuotas, permisos y rate limiting
- Configurar despliegue en Vercel u otro proveedor
