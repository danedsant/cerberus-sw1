# PROYECTO PLANIFICACIÓN BAJO METODOLOGÍA ÁGIL
## SISTEMA DE CONTROL DE ACCESO PARA CONDOMINIOS

**Docente:** Ing. Dubraska Roca  
**Alumnos:** Daniel Villalba Santamaría V-27.506.542  

**CIUDAD GUAYANA, SEPTIEMBRE DEL 2026.**

---

## Planteamiento

### Contexto
Los condominios residenciales enfrentan desafíos constantes en el control de acceso de visitantes y proveedores. Los métodos tradicionales, como llamadas telefónicas al residente y registros manuales en bitácoras de papel, generan congestión en las porterías y brechas de seguridad que afectan la calidad de vida de los residentes.

En un mundo cada vez más digitalizado, es necesario implementar soluciones tecnológicas que optimicen estos procesos, mejoren la experiencia del usuario y garanticen la seguridad del condominio.

### Problema
El problema principal se divide en dos áreas críticas:

**Congestión en Porterías**

| Problema | Impacto | Frecuencia |
| :--- | :--- | :--- |
| Colas de vehículos en horas pico | Retraso para residentes | Diaria |
| Tiempo promedio de registro manual: 2-5 min/vehículo | Ineficiencia operativa | Continua |
| Llamadas telefónicas no contestadas | Visitantes esperando | Frecuente |
| Registros ilegibles en papel | Pérdida de información | Periódica |

**Falta de Trazabilidad**

| Problema | Consecuencia |
| :--- | :--- |
| Sin registro digital | No se puede consultar quién visitó el condominio |
| Sin notificaciones | Residentes no saben cuándo llegan sus visitantes |
| Sin auditorías | Imposible generar reportes de seguridad |
| Sin control de proveedores | Brechas de seguridad por falta de registro |

---

## Solución Propuesta
Se propone el desarrollo de una aplicación web moderna (PWA) que permita a los residentes gestionar el acceso de visitantes de manera digital. La solución utilizará un **enfoque híbrido (QR + PIN de respaldo)** para garantizar la tolerancia a fallos de hardware en portería, utilizando tecnologías de vanguardia que garantizan:

* **Registro digital** de residentes y guardias con autenticación segura.
* **Generación de códigos híbridos** temporales para visitantes.
* **Validación rápida en portería** (Escáner de cámara o tecleo manual de PIN).
* **Lectura Inteligente (IA)** para extracción de datos de cédulas en visitas imprevistas.
* **Historial completo** de accesos y notificaciones automatizadas.

---

## Stack Tecnológico Propuesto

| Capa | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| Frontend | Next.js | 15+ | Framework web con App Router |
| UI Library | React | 19+ | Componentes de interfaz |
| Language | TypeScript | 5+ | Tipado estático |
| Estilos | Tailwind CSS | 3+ | Framework CSS utility-first |
| Backend & DB | Supabase (PostgreSQL)| 15+ | Auth + Database + API (BaaS) |
| Automatización| n8n | - | Webhooks para notificaciones |
| IA | Gemini API | - | OCR para lectura de documentos |
| Deploy | Vercel | - | Hosting y despliegue continuo |
| Versionado | Git / GitHub | - | Control de versiones |

---

## Objetivos

### Objetivo General
Desarrollar una aplicación web (PWA) con NEXT.JS y SUPABASE que permita a los residentes de condominios gestionar el acceso de visitantes de manera digital, reduciendo los tiempos de espera y mejorando la trazabilidad de ingresos.

### Objetivos Específicos

| Número | Objetivo | Tecnología |
| :---: | :--- | :--- |
| **1** | Implementar sistema de autenticación seguro para usuarios. | Supabase Auth |
| **2** | Desarrollar módulo de creación y gestión de pases híbridos (QR/PIN). | Server Actions / Supabase RPC |
| **3** | Implementar sistema de validación rápida y lectura biométrica/OCR en portería. | Supabase Query / Gemini API |
| **4** | Crear historial consultable de accesos y alertas automatizadas al residente. | Server Components / n8n |
| **5** | Generar código de acceso personal permanente (QR/PIN) para residentes. | qrcode lib / Supabase |

---

## Requisitos del Sistema

### Requisitos Funcionales (RF)
* **RF-01 (Autenticación):** El sistema debe permitir el inicio de sesión basado en roles (Residente, Vigilante, Administrativo, Superadmin) usando correo y contraseña.
* **RF-02 (Gestión de Pases):** El residente debe poder generar un pase temporal, indicando los datos del visitante, fecha esperada, tipo de visita y vehículo.
* **RF-02b (Acceso Residente):** El residente debe disponer de un código QR y PIN personal permanente para acceder al condominio sin necesidad de generar un pase temporal.
* **RF-03 (Pase Híbrido):** El sistema debe generar automáticamente un Código QR y un PIN alfanumérico por cada pase creado.
* **RF-04 (Validación de Ingreso):** El guardia debe poder validar un pase escaneando el Código QR con la cámara o tecleando el PIN.
* **RF-05 (Registro con IA):** El sistema debe extraer automáticamente los datos (OCR vía Gemini API) desde una foto de la cédula para visitas no anunciadas.
* **RF-06 (Trazabilidad):** El sistema debe registrar la fecha, hora exacta y guardia responsable al confirmar un ingreso.
* **RF-07 (Notificaciones):** El sistema debe emitir una alerta automatizada (vía n8n) al residente cuando su invitado llegue.
* **RF-08 (Auditoría):** El personal administrativo debe poder consultar y filtrar el historial global de accesos del condominio.

### Requisitos No Funcionales (RNF)
* **RNF-01 (Accesibilidad):** La solución debe ser una Progressive Web App (PWA) responsiva para operar fluidamente en celulares de gama media y monitores de escritorio.
* **RNF-02 (Rendimiento):** El tiempo de respuesta para la validación de un pase en la portería no debe exceder los 2 segundos para evitar colas de vehículos.
* **RNF-03 (Seguridad):** La autorización por rol se gestiona a nivel de aplicación mediante Next.js Middleware, protegiendo las rutas según el perfil del usuario autenticado.
* **RNF-04 (Usabilidad):** La interfaz del guardia debe poseer botones sobredimensionados (mínimo 56px de alto) en la zona inferior de la pantalla para evitar errores táctiles.
* **RNF-05 (Disponibilidad):** La arquitectura *serverless* debe soportar picos de concurrencia en "horas pico" del condominio (Ej. 6:00 PM a 8:00 PM) sin retrasos.

---

## Arquitectura de Base de Datos

Para garantizar la integridad, seguridad y trazabilidad de los datos, se ha diseñado una base de datos relacional (PostgreSQL) basada en el patrón de **Herencia Múltiple por Tablas (Class Table Inheritance)**. Este modelo normalizado en 6 entidades permite segmentar estrictamente los roles sin redundancia.

### Diagrama Entidad-Relación (ER)

```mermaid
erDiagram
    USUARIOS ||--|| RESIDENTES : "es un"
    USUARIOS ||--|| VIGILANTES : "es un"
    PROPIEDADES ||--o{ RESIDENTES : "habita"
    
    RESIDENTES ||--o{ VISITAS : "autoriza"
    RESIDENTES ||--o{ INGRESOS_RESIDENTES : "ingresa"
    VIGILANTES ||--o{ VISITAS : "valida"
    VIGILANTES ||--o{ INGRESOS_RESIDENTES : "valida"
    VISITANTES ||--o{ VISITAS : "realiza"

    PROPIEDADES {
        uuid id PK
        string numero_unidad "Ej. Apto 4B"
    }

    USUARIOS {
        uuid id PK
        string correo
        string nombre
        string apellido
        string cedula UK
        string rol "superadmin, administrativo, vigilante, residente"
    }

    RESIDENTES {
        uuid usuario_id PK_FK
        uuid propiedad_id FK
        string telefono_contacto
        string codigo_pin_personal UK "PIN permanente Ej. X7-456"
        string qr_token UK "Token único para QR personal"
    }

    VIGILANTES {
        uuid usuario_id PK_FK
        string turno "Ej. Diurno / Nocturno"
    }

    VISITANTES {
        uuid id PK
        string cedula UK
        string nombre
        string apellido
    }

    VISITAS {
        uuid id PK
        uuid residente_id FK
        uuid visitante_id FK
        uuid vigilante_id FK "Nulo hasta ingreso"
        date fecha_esperada
        string tipo_visita "social, delivery, mantenimiento, transporte"
        string estado "pendiente, ingresado, cancelado"
        string codigo_pin UK
        string placa_vehiculo "Opcional"
        datetime fecha_creacion
        datetime fecha_hora_ingreso "Timestamp real"
    }

    INGRESOS_RESIDENTES {
        uuid id PK
        uuid residente_id FK
        uuid vigilante_id FK "Nulo hasta validación"
        datetime fecha_hora "Timestamp del ingreso"
    }
```

### Propósito de las Entidades

| Entidad | Tabla en BD | Propósito Principal |
| :--- | :--- | :--- |
| **Propiedades** | `PROPIEDADES` | Estructura física del condominio (ej. apartamentos). |
| **Usuarios** | `USUARIOS` | Entidad base de autenticación, datos biográficos comunes y Rol. |
| **Residentes** | `RESIDENTES` | Hereda de Usuarios. Asigna la propiedad que habitan y su código de acceso personal permanente. |
| **Vigilantes** | `VIGILANTES` | Hereda de Usuarios. Asigna atributos como el turno laboral. |
| **Visitantes** | `VISITANTES` | Actores externos sin cuenta. Evita duplicar registros en visitas recurrentes. |
| **Visitas** | `VISITAS` | Tabla transaccional (Pivote). Registra el tipo de visita, quién autoriza, vehículo, hora de llegada y guardia validador. |
| **Ingresos Residentes** | `INGRESOS_RESIDENTES` | Registra cada ingreso de un residente usando su QR/PIN personal para trazabilidad. |

---

## Alcance del Proyecto

### Módulo 1: Autenticación e Infraestructura
| Funcionalidad | Descripción | Prioridad | Tecnología |
| :--- | :--- | :--- | :--- |
| Setup del proyecto | Inicialización de BD y repositorios | Alta | GitHub / Vercel |
| Inicio de sesión | Autenticación de roles con email y password | Alta | Supabase Auth |
| Cierre de sesión | Destrucción de sesión segura | Alta | Supabase Auth |
| Protección de rutas | Middleware de protección según rol del usuario | Alta | Next.js Middleware |

### Módulo 2: Invitaciones y Acceso (Módulo Residente)
| Funcionalidad | Descripción | Prioridad | Tecnología |
| :--- | :--- | :--- | :--- |
| Crear invitación | Formulario con datos del visitante | Alta | Server Action |
| Generar código híbrido | Generación de imagen QR y PIN único | Alta | Supabase RPC |
| Listar invitaciones | Ver pases pendientes del residente | Alta | Server Component |
| Cancelar invitación | Cambiar estado de la visita a "Cancelado" | Media | Server Action |
| Mi QR / PIN personal | Código de acceso permanente del residente | Alta | qrcode lib |

### Módulo 3: Control de Acceso (Módulo Guardia)
| Funcionalidad | Descripción | Prioridad | Tecnología |
| :--- | :--- | :--- | :--- |
| Escanear código QR | Leer código de acceso mediante la cámara | Alta | Librería JS Scanner |
| Validar código PIN | Buscador manual en caso de falla del QR | Alta | Supabase Query |
| Registro veloz con IA | Extraer texto de cédulas con cámara | Media | Gemini API |
| Registrar entrada | Marcar fecha y hora exacta de llegada | Alta | Server Action |

### Módulo 4: Historial y Notificaciones
| Funcionalidad | Descripción | Prioridad | Tecnología |
| :--- | :--- | :--- | :--- |
| Ver historial | Lista cronológica de ingresos al condominio | Alta | Server Component |
| Notificación de llegada | Alerta por correo al residente en tiempo real | Alta | n8n Webhook |
| Filtrar por fecha | Buscar accesos en un rango de tiempo | Media | URL Params |

### Módulo 5: Administración (Módulo Admin)
| Funcionalidad | Descripción | Prioridad | Tecnología |
| :--- | :--- | :--- | :--- |
| Gestionar usuarios | Crear, editar, eliminar residentes y vigilantes | Alta | Server Action |
| Gestionar propiedades | Crear, editar, eliminar unidades del condominio | Alta | Server Action |
| Historial de accesos | Tabla filtrable con tipo de visita y datos completos | Alta | Server Component |
| Dashboard admin | Resumen de estadísticas del sistema | Media | Server Component |

---

## Metodología Ágil (Scrum)

El desarrollo de este sistema se fundamenta en el marco de trabajo **Scrum**, permitiendo flexibilidad, entregas iterativas y aportación de valor temprana. La planificación se ha estructurado en los siguientes pilares:

* **Product Backlog:** El alcance del proyecto se desglosó en 16 Historias de Usuario redactadas bajo el estándar *Given-When-Then* (Criterios de Aceptación) para facilitar el control de calidad.
* **Ciclos Iterativos (Sprints):** El desarrollo se dividió en 4 iteraciones (Sprints). Cada Sprint cuenta con un Objetivo (*Sprint Goal*) y genera un incremento de software 100% funcional y testeable.
* **Roles y Artefactos:** Los requerimientos técnicos actúan como lineamientos del *Product Owner*, mientras que el documento actual sirve como el artefacto principal de planificación.

A continuación, se detalla el **Product Backlog** estructurado del proyecto:

### Product Backlog Detallado (Gherkin)

| ID | Sprint | Título | Definición de la Historia de Usuario | Criterio de Validación (Gherkin) |
|:---|:---:|:---|:---|:---|
| **HU-01** | 1 | Inicialización del Frontend | **Como** desarrollador,<br>**Quiero** inicializar el proyecto base con Next.js y Tailwind CSS,<br>**Para** establecer la estructura del frontend. | **Given** un entorno de desarrollo limpio<br>**When** ejecuto comandos de inicialización y arranco el servidor<br>**Then** visualizo la página por defecto en el navegador |
| **HU-02** | 1 | Configuración de BD | **Como** desarrollador,<br>**Quiero** crear el proyecto en Supabase y aplicar el modelo de datos (6 entidades),<br>**Para** habilitar persistencia transaccional y relacional. | **Given** la consola de Supabase abierta<br>**When** ejecuto scripts SQL de creación<br>**Then** las tablas se reflejan correctamente |
| **HU-03** | 1 | CI/CD | **Como** líder técnico,<br>**Quiero** enlazar GitHub con Vercel,<br>**Para** que cada cambio se despliegue automáticamente. | **Given** un nuevo commit en `main`<br>**When** hago push<br>**Then** Vercel detecta, compila y publica la versión |
| **HU-04** | 1 | Prueba Cloud | **Como** administrador,<br>**Quiero** acceder a la URL pública,<br>**Para** verificar que la infraestructura opera en la nube. | **Given** el pipeline exitoso<br>**When** ingreso a la URL<br>**Then** la app carga con Status 200 OK |
| **HU-05** | 2 | Login de Usuarios | **Como** usuario,<br>**Quiero** iniciar sesión con mis credenciales,<br>**Para** acceder a funciones de mi rol. | **Given** la página de login<br>**When** ingreso datos válidos<br>**Then** soy redirigido a mi dashboard |
| **HU-06** | 2 | Protección de Rutas | **Como** superadmin,<br>**Quiero** bloquear el acceso anónimo y segmentar vistas por rol,<br>**Para** proteger datos sensibles. | **Given** sin sesión o rol inválido<br>**When** navego a ruta protegida<br>**Then** soy redirigido al login o bloqueado |
| **HU-07** | 2 | Dashboard Residente | **Como** Residente,<br>**Quiero** visualizar mis invitaciones activas,<br>**Para** gestionar mis próximos invitados. | **Given** sesión como residente<br>**When** carga el panel<br>**Then** veo listado de mis invitados |
| **HU-08** | 2 | Registrar Visita | **Como** Residente,<br>**Quiero** llenar nombre, documento, tipo de visita (ej. Social), fecha y placa,<br>**Para** autorizar a una visita y su motivo. | **Given** formulario "Nueva Visita"<br>**When** completo datos y guardo<br>**Then** visita guardada como 'Pendiente' con su respectiva etiqueta |
| **HU-09** | 2 | Pase Híbrido | **Como** Residente,<br>**Quiero** generar automáticamente un pase híbrido,<br>**Para** disponer de QR y PIN. | **Given** registro exitoso<br>**When** el sistema procesa<br>**Then** despliega QR válido y PIN alfanumérico |
| **HU-10** | 3 | UI en Portería | **Como** Guardia,<br>**Quiero** una vista móvil optimizada,<br>**Para** manipular fácilmente estando de pie. | **Given** ingreso desde móvil<br>**When** carga el panel<br>**Then** botones grandes y responsivos |
| **HU-11** | 3 | Escáner QR | **Como** Guardia,<br>**Quiero** escanear el QR y verificar/añadir placa de vehículo,<br>**Para** validar la entrada con trazabilidad completa. | **Given** escáner activo<br>**When** enfoco QR y confirmo la placa<br>**Then** estado cambia a 'Ingresado' con placa registrada |
| **HU-12** | 3 | PIN Manual | **Como** Guardia,<br>**Quiero** un buscador de PIN,<br>**Para** validar si el QR falla. | **Given** vista manual<br>**When** tecleo PIN correcto<br>**Then** datos aparecen y estado cambia a 'Ingresado' |
| **HU-13** | 3 | Registro IA | **Como** Guardia,<br>**Quiero** que IA lea la identificación,<br>**Para** evitar teclear al registrar visitas imprevistas. | **Given** registro manual<br>**When** capturo foto y uso "Extraer"<br>**Then** API autocompleta formulario |
| **HU-14** | 3 | Notificación n8n | **Como** Residente,<br>**Quiero** alerta en tiempo real,<br>**Para** enterarme del ingreso de mi invitado. | **Given** visita ingresada<br>**When** registro cambia en BD<br>**Then** n8n envía correo de llegada |
| **HU-15** | 4 | Historial y Auditoría| **Como** Personal Administrativo,<br>**Quiero** tabla de accesos filtrable,<br>**Para** auditar la seguridad. | **Given** rol administrativo<br>**When** navego a Historial<br>**Then** veo tabla ordenada de ingresos |
| **HU-16** | 4 | Control de Calidad | **Como** QA,<br>**Quiero** pruebas unitarias,<br>**Para** asegurar robustez previa entrega final. | **Given** ejecución de suite de pruebas<br>**When** evalúo generación de PIN<br>**Then** pruebas pasan en verde sin errores |
| **HU-17** | 2 | QR/PIN Personal Residente | **Como** Residente,<br>**Quiero** tener un código QR y PIN personal permanente,<br>**Para** acceder al condominio sin necesidad de pase temporal. | **Given** sesión como residente<br>**When** accedo a "Mi QR"<br>**Then** veo mi código QR personal y PIN alfanumérico permanente |
| **HU-18** | 3 | Gestión de Usuarios (Admin) | **Como** Administrativo,<br>**Quiero** registrar, editar y eliminar usuarios del sistema,<br>**Para** gestionar residentes, vigilantes y personal. | **Given** sesión como admin<br>**When** navego a Usuarios<br>**Then** puedo crear, editar y eliminar usuarios |
| **HU-19** | 3 | Gestión de Propiedades (Admin) | **Como** Administrativo,<br>**Quiero** registrar y administrar unidades del condominio,<br>**Para** asignar propiedades a residentes. | **Given** sesión como admin<br>**When** navego a Propiedades<br>**Then** puedo crear, editar y eliminar unidades |
| **HU-20** | 3 | Historial de Accesos (Admin) | **Como** Administrativo,<br>**Quiero** consultar el historial de ingresos con tipo de visita,<br>**Para** auditar la seguridad del condominio. | **Given** sesión como admin<br>**When** navego a Historial<br>**Then** veo tabla filtrable de accesos con tipo de visita |

### Desglose del Sprint Backlog (Asignación)

#### Sprint 1: Configuración + Setup Inicial ✅ COMPLETADO
**Objetivo:** Base de datos relacional y despliegue continuo operativos.  
**Entregable:** Repositorio público, pipeline de Vercel y esquema SQL (7 entidades) aplicado.

| ID | Historia de Usuario | Prioridad | Estado |
| :--- | :--- | :--- | :--- |
| US-001 | Inicialización del Frontend (Next.js + Tailwind) | Alta | ✅ Completado |
| US-002 | Configuración de Base de Datos y Diagrama ER | Alta | ✅ Completado |
| US-003 | Configurar Repositorio y CI/CD en Vercel | Alta | ✅ Completado |
| US-004 | Prueba de Despliegue en la Nube | Alta | ✅ Completado |

### Sprint 2: Autenticación + Core Residente ✅ COMPLETADO
**Objetivo:** App con login seguro y generación de pases funcionando.  
**Entregable:** Dashboard de residente con formulario, creación de pases híbridos y código de acceso personal.

| ID | Historia de Usuario | Prioridad | Estado |
| :--- | :--- | :--- | :--- |
| US-005 | Implementar Login de Usuarios y Guardias | Alta | ✅ Completado |
| US-006 | Proteger Rutas y Middleware | Alta | ✅ Completado |
| US-007 | Desarrollar Dashboard Residente y Lista de Pases | Alta | ✅ Completado |
| US-008 | Formulario de Registro (con Tipo de Visita y Vehículo) | Alta | ✅ Completado |
| US-009 | Generación del Pase Híbrido (QR + PIN) | Alta | ✅ Completado |
| US-017 | QR/PIN Personal Permanente del Residente | Alta | ✅ Completado |

### Sprint 3: Control de Acceso + Notificaciones + Admin 🔄 EN PROGRESO
**Objetivo:** Portería digital y panel de administración completamente funcionales.  
**Entregable:** Vista de guardia, escáner, IA, notificaciones en tiempo real (n8n) y panel admin.

| ID | Historia de Usuario | Prioridad | Estado |
| :--- | :--- | :--- | :--- |
| US-010 | Diseñar UI Responsiva para Guardias | Alta | ⏳ Pendiente |
| US-011 | Validar Entrada mediante Escáner QR | Alta | ⏳ Pendiente |
| US-012 | Validar Entrada manual mediante PIN | Alta | ⏳ Pendiente |
| US-013 | Registro de Visitas Imprevistas con IA | Media | ⏳ Pendiente |
| US-014 | Configurar Notificación Automática vía n8n | Alta | ⏳ Pendiente |
| US-018 | Gestión de Usuarios (Admin) | Alta | ✅ Completado |
| US-019 | Gestión de Propiedades (Admin) | Alta | ✅ Completado |
| US-020 | Historial de Accesos con Tipo de Visita | Alta | ✅ Completado |

### Sprint 4: Historial, Pulido + Documentación
**Objetivo:** Proyecto terminado, auditable y documentado.  
**Entregable:** Aplicación pulida, panel para personal administrativo y documentación técnica final.

| ID | Historia de Usuario | Prioridad | Estado |
| :--- | :--- | :--- | :--- |
| US-015 | Desarrollar Panel de Historial y Auditoría | Alta | Pendiente |
| US-016 | Control de Calidad y Pruebas Unitarias | Media | Pendiente |
