# 3. Planificación de la Implementación (Scrum)

El ciclo de desarrollo ágil está estructurado en **4 Sprints**, finalizando el día 25 de este mes. Esta metodología asegura entregas incrementales y de valor constante.

## 3.1 Historias de Usuario (Sprint 1 al 4)

| ID | Sprint | Título | Definición de la Historia de Usuario | Criterio de Validación (Gherkin) |
|:---|:---:|:---|:---|:---|
| **HU-01** | 1 | Inicialización del Frontend | **Como** desarrollador,<br>**Quiero** inicializar el proyecto base con Next.js y Tailwind CSS,<br>**Para** establecer la estructura del frontend. | **Given** un entorno de desarrollo limpio<br>**When** ejecuto comandos de inicialización y arranco el servidor<br>**Then** visualizo la página por defecto en el navegador |
| **HU-02** | 1 | Configuración de BD | **Como** desarrollador,<br>**Quiero** crear el proyecto en Supabase y aplicar el modelo de datos (7 entidades),<br>**Para** habilitar persistencia transaccional y relacional. | **Given** la consola de Supabase abierta<br>**When** ejecuto scripts SQL de creación<br>**Then** las tablas se reflejan correctamente |
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

## 3.2 Estado de los Sprints

### Sprint 1: Configuración + Setup Inicial ✅ COMPLETADO
| HU | Título | Estado |
|:---|:---|:---|
| HU-01 | Inicialización del Frontend | ✅ |
| HU-02 | Configuración de BD | ✅ |
| HU-03 | CI/CD | ✅ |
| HU-04 | Prueba Cloud | ✅ |

### Sprint 2: Autenticación + Core Residente ✅ COMPLETADO
| HU | Título | Estado |
|:---|:---|:---|
| HU-05 | Login de Usuarios | ✅ |
| HU-06 | Protección de Rutas | ✅ |
| HU-07 | Dashboard Residente | ✅ |
| HU-08 | Registrar Visita | ✅ |
| HU-09 | Pase Híbrido (QR+PIN) | ✅ |
| HU-17 | QR/PIN Personal Residente | ✅ |

### Sprint 3: Control de Acceso + Notificaciones + Admin 🔄 EN PROGRESO
| HU | Título | Estado |
|:---|:---|:---|
| HU-10 | UI en Portería | ⏳ Pendiente |
| HU-11 | Escáner QR | ⏳ Pendiente |
| HU-12 | PIN Manual | ⏳ Pendiente |
| HU-13 | Registro IA | ⏳ Pendiente |
| HU-14 | Notificación n8n | ⏳ Pendiente |
| HU-18 | Gestión de Usuarios (Admin) | ✅ |
| HU-19 | Gestión de Propiedades (Admin) | ✅ |
| HU-20 | Historial de Accesos (Admin) | ✅ |

### Sprint 4: Historial, Pulido + Documentación ⏳ NO INICIADO
| HU | Título | Estado |
|:---|:---|:---|
| HU-15 | Historial y Auditoría | ⏳ Pendiente |
| HU-16 | Control de Calidad | ⏳ Pendiente |

### Resumen de Progreso
```
Sprint 1: ████████████████████ 100% ✅
Sprint 2: ████████████████████ 100% ✅
Sprint 3: ████████░░░░░░░░░░░░  37% 🔄
Sprint 4: ░░░░░░░░░░░░░░░░░░░░   0% ⏳
```

**Avance total:** 14/20 HU completadas (70%)
