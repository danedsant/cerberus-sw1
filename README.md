<p align="center">
  <img src="src/img/Logo.png" alt="Cerberus Logo" width="200" />
</p>

<h1 align="center">Cerberus - Control de Acceso para Condominios</h1>

<p align="center">
  <b>Sistema de gestión y validación de visitas en tiempo real mediante QR + PIN para condominios residenciales.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini_AI-3.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/n8n-Automations-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📌 Descripción

**Cerberus** es una solución web responsiva orientada a resolver las demoras en porterías y la falta de trazabilidad en condominios residenciales. Mediante un esquema híbrido de **Código QR y PIN de respaldo**, permite a los residentes preregistrar invitados y autorizar accesos al instante, mientras que el personal de vigilancia valida la entrada desde dispositivos móviles con confirmación en tiempo real.

---

## ⚡ Características Principales

- 🔐 **Autenticación Basada en Roles:** Acceso restringido y rutas protegidas vía Middleware (Residente, Vigilante, Administrativo).
- 🎫 **Pases Híbridos (QR + PIN):** Generación automática de QR visual y PIN de respaldo alfanumérico para cada visitante.
- 📱 **Panel Mobile-First para Portería:** Escaneo con cámara activa (`html5-qrcode`) e ingreso manual por PIN optimizado para operabilidad móvil.
- 🔑 **Acceso Permanente para Residentes:** Código QR y PIN personal para el ingreso rápido de propietarios e inquilinos.
- 🤖 **Resumen Diario con Inteligencia Artificial:** Síntesis automatizada en lenguaje natural de la actividad diaria mediante **Google Gemini API** (con fallback local resiliente).
- 📧 **Notificaciones Automatizadas:** Integración de webhooks con **n8n** para correos de bienvenida y alerta inmediata de llegada al residente.
- 📊 **Auditoría e Historiales:** Filtros avanzados por fecha, tipo de visita e ingresos validados de forma global y por vigilante.

---

## 👤 Matriz de Roles y Permisos

| Rol | Alcance | Funciones Principales |
| :--- | :--- | :--- |
| **Residente** | Mobile / Desktop | Crear visitas temporales, generar pases QR/PIN, consultar QR personal permanente, recibir notificaciones de llegada. |
| **Vigilante** | Mobile-First | Escanear QR, validar PIN manual, confirmar ingreso de visitantes y residentes, consultar historial personal. |
| **Administrativo** | Desktop / Tablet | Gestión de usuarios (CRUD), gestión de propiedades, auditoría global de accesos y resumen diario por IA. |

---

## 🛠️ Tecnologías e Integraciones

### Core Stack
- **Framework:** Next.js 16 (App Router)
- **UI & Estilos:** React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide React
- **Base de Datos & Auth:** Supabase (PostgreSQL, Auth, RLS)

### Librerías & Integraciones
- **Lectura/Generación QR:** `html5-qrcode`, `qrcode`
- **Inteligencia Artificial:** Google Gemini API (`gemini-3.5-flash-lite`)
- **Automatización de Emails:** Workflows de n8n vía HTTP Webhooks
- **Despliegue:** Vercel

---

## 🗄️ Modelo de Datos (PostgreSQL)

| Tabla | Descripción | Clave Primaria / Relaciones |
| :--- | :--- | :--- |
| `propiedades` | Unidades habitacionales del condominio | `id` (UUID), `numero_unidad` (UNIQUE) |
| `usuarios` | Perfiles de usuario vinculados a Supabase Auth | `id` (FK a `auth.users`), `rol`, `cedula`, `correo` |
| `residentes` | Información del residente y accesos permanentes | `usuario_id` (PK/FK), `propiedad_id` (FK), `codigo_pin_personal`, `qr_token` |
| `vigilantes` | Personal de portería y turnos asignados | `usuario_id` (PK/FK), `turno` |
| `visitantes` | Registro de personas externas autorizadas | `id` (UUID), `cedula` (UNIQUE) |
| `visitas` | Pases de entrada temporales y su estado | `id` (UUID), `residente_id` (FK), `visitante_id` (FK), `codigo_pin` (UNIQUE), `estado` |
| `ingresos_residentes` | Trazabilidad de entradas de residentes | `id` (UUID), `residente_id` (FK), `vigilante_id` (FK), `fecha_hora` |

---

## 🔄 Flujo Operativo del Sistema

```text
[Inicio de Sesión]
       │
       ├──► Residente: Crear Visita ──► Generar Pase (QR/PIN) ──► Compartir con Visitante
       │                                                                 │
       ├──► Vigilante: Escanear QR / PIN ──► Validar Pase ──► Confirmar Ingreso ──► Webhook n8n (Email)
       │                                                                 │
       └──► Administrador: Gestión de Usuarios/Propiedades ──► Consultar Historial ──► Resumen IA Gemini
```

---

## 🧪 Base de Datos y Usuarios de Prueba (Seed SQL)

Para poblar la base de datos con datos de prueba realistas para evaluación o desarrollo local, ejecuta los siguientes scripts en el **SQL Editor de Supabase** en este orden:

1. **[`database/schema.sql`](file:///c:/Users/Danedsant/Documents/danedsant/Cerberus/cerberus-app/database/schema.sql)**: Crea las tablas, relaciones e índices.
2. **[`database/seed.sql`](file:///c:/Users/Danedsant/Documents/danedsant/Cerberus/cerberus-app/database/seed.sql)**: Siembra usuarios en Supabase Auth, perfiles, propiedades y visitas.

### 🔑 Credenciales de Acceso de Prueba

Todos los usuarios de prueba tienen la contraseña predeterminada: **`123456`**

| Rol | Correo Electrónico | Contraseña | Nombre |
| :--- | :--- | :--- | :--- |
| **Administrativo** | `admin@cerberus.com` | `123456` | Carlos Mendoza |
| **Vigilante** | `vigilante@cerberus.com` | `123456` | Ramón Pérez |
| **Residente 1** | `residente@cerberus.com` | `123456` | María Delgado |
| **Residente 2** | `residente2@cerberus.com` | `123456` | Alejandro Gómez |

### 📦 Datos Iniciales Sembrados
- **Propiedades:** `A-101`, `B-202`, `C-303`, `D-404`.
- **Visitantes:** Juan Rodríguez, Ana Silva, Roberto Blanco.
- **Visitas Activas:** Pases de prueba en estados `pendiente`, `ingresado` y `expirado` para evaluar todos los paneles e IA de inmediato.

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- **Node.js** v18 o superior
- **npm** v9 o superior
- Cuenta en **Supabase**, **Google AI Studio** (Gemini) e instancia activa de **n8n**.

### 2. Clonar e Instalar
```bash
git clone https://github.com/tu-usuario/cerberus.git
cd cerberus/cerberus-app
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env.local` en la raíz de `cerberus-app`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
GEMINI_API_KEY=tu-gemini-api-key
NEXT_PUBLIC_GEMINI_API_KEY=tu-gemini-api-key
N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/bienvenida
N8N_WEBHOOK_URL_LLEGADA=https://tu-n8n.com/webhook/llegada
```

### 4. Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo (http://localhost:3000)
npm run build    # Compilar aplicación para producción
npm run start    # Ejecutar compilación de producción
npm run lint     # Análisis estático de código con ESLint
```
### 5. Documentación Técnica Detallada

Para consultar la arquitectura del sistema, casos de uso, historias de usuario e informe final completo, revisa los siguientes archivos de documentación:

- 📄 **[Informe Final Consolidado (Markdown)](docs/Informe_final.md)**
- 📕 **[Informe Final Consolidado (PDF)](<docs/Informe Final - Cerberus - Software 1.pdf>)**
---

## 📁 Estructura del Proyecto

```text
cerberus-app/
├── database/                # Scripts SQL (schema.sql y seed.sql para Supabase)
├── docs/                    # Documentación técnica e Informe Final consolidado
├── public/                  # Archivos estáticos
└── src/
    ├── app/                 # Rutas de Next.js App Router
    │   ├── (auth)/          # Vistas de autenticación (Login)
    │   └── (protected)/     # Rutas protegidas por rol
    │       ├── admin/       # Dashboard y gestión administrativa
    │       ├── residente/   # Dashboard residente, crear visitas, mi QR
    │       └── vigilante/   # Escáner QR, validación PIN e historial
    ├── components/          # Componentes reutilizables e interfaz de usuario
    ├── img/                 # Recursos gráficos (Logo oficial Logo.png)
    └── lib/                 # Utilidades, clientes de Supabase, Gemini y n8n
```

---

<p align="center">
  <sub>Desarrollado con ❤️ por Daniel V. Santamaria.</sub>
</p>
