# TFG Tutor IA

Aplicacion web con autenticacion por credenciales y un tutor de ingles asistido por IA.

## Stack tecnico

- Next.js 13 con App Router
- React 18
- TypeScript
- Tailwind CSS
- MongoDB con Mongoose
- NextAuth con provider de credenciales
- OpenAI API para chat, feedback, transcripcion y voz

## Funcionalidades actuales

- Registro e inicio de sesion con email y contrasena.
- Proteccion basica de rutas mediante middleware de NextAuth.
- Dashboard de usuario autenticado.
- Tutor conversacional de ingles por escenarios.
- Generacion de feedback final de la sesion.
- Transcripcion de audio, sintesis de voz y exportacion de feedback a PDF.

## Funcionalidades pendientes

- Endurecer validaciones de entrada en rutas API.
- Persistir sesiones, conversaciones o resultados si el producto lo requiere.
- Anadir tests automatizados.
- Revisar permisos, cuotas y rate limiting antes de desplegar.
- Completar configuracion de produccion en Vercel u otro proveedor.

## Instalacion local

```bash
npm install
cp .env.example .env
npm run dev
```

Abre `http://localhost:3000` en el navegador.

## Variables de entorno

Configura estas variables en `.env` para desarrollo local o en el panel del proveedor de despliegue:

```bash
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
OPENAI_API_KEY=
```

Las claves reales no se incluyen en el repositorio. Usa `.env.example` como plantilla y manten `.env` fuera de Git.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Seguridad

Antes de publicar o desplegar, rota cualquier clave que haya estado en archivos locales, revisa el historial Git si existia uno previo y confirma que `.env` no esta trackeado.
