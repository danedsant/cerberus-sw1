# 4. Documentación Técnica del Proyecto

Este documento actuará como la base para el archivo `README.md` del repositorio y para la configuración y documentación general del proyecto.

## 4.1 Requisitos Previos (Dependencias de Desarrollo)
Para ejecutar este proyecto en un entorno local, se requiere:
* **Node.js** (v18 o superior)
* **npm** o **yarn** como gestores de paquetes.
* Una cuenta en **GitHub** para control de versiones.
* Una cuenta en **Supabase** (Capa gratuita válida para desarrollo).
* Una cuenta en **Vercel** para despliegues.
* Instancia de **n8n** (Puede ejecutarse localmente usando Docker o usando su capa Cloud).
* Llave API de **Gemini** (Para el módulo opcional de OCR de identificaciones).

## 4.2 Instrucciones de Inicialización (Local)
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/cerberus-app.git

# 2. Entrar al directorio del proyecto
cd cerberus-app

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales reales

# 5. Arrancar el entorno de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 4.3 Variables de Entorno (`.env.local`)
El proyecto requerirá un archivo `.env.local` en la raíz con las siguientes credenciales para operar correctamente:
* `NEXT_PUBLIC_SUPABASE_URL`: URL base de la API de Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Llave anónima y segura provista por Supabase para peticiones de cliente.
* `GEMINI_API_KEY`: Credencial privada para las consultas a la API de Gemini.
* `N8N_WEBHOOK_URL`: Endpoint expuesto por el servidor n8n para recibir notificaciones (POST) desde nuestra App.

## 4.4 Guía de Despliegue en Producción (Vercel)
Para el despliegue del Sprint 1 en adelante:
1. Conectar la cuenta de GitHub en el panel de Vercel e importar el repositorio `proyecto_24`.
2. Durante la configuración inicial, cargar todas las variables de entorno mencionadas en el paso 4.3.
3. Activar el despliegue automático asociado a los *commits* de la rama `main`.
4. Vercel optimizará las imágenes, correrá el comando de `build` de Next.js y expondrá la aplicación de manera global.
