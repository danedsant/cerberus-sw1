# 3. Planificación de la Implementación (Scrum)

El ciclo de desarrollo ágil está estructurado en **4 Sprints**, finalizando el día 25 de este mes. Esta metodología asegura entregas incrementales y de valor constante.

## 3.1 Historias de Usuario (Sprint 1 al 4)

| ID | Sprint | Título | Definición de la Historia de Usuario | Criterio de Validación (Gherkin) |
|:---|:---:|:---|:---|:---|
| **HU-01** | 1 | Inicialización del Frontend | **Como** desarrollador,<br>**Quiero** inicializar el proyecto base con Next.js y Tailwind CSS,<br>**Para** establecer la estructura del frontend. | **Given** un entorno de desarrollo limpio<br>**When** ejecuto comandos de inicialización y arranco el servidor<br>**Then** visualizo la página por defecto en el navegador |
| **HU-02** | 1 | Configuración de BD | **Como** desarrollador,<br>**Quiero** crear el proyecto en Supabase y aplicar el modelo de datos (7 entidades),<br>**Para** habilitar persistencia transaccional y relacional. | **Given** la consola de Supabase abierta<br>**When** ejecuto scripts SQL de creación<br>**Then** las tablas se reflejan correctamente |
| **HU-03** | 1 | CI/CD | **Como** líder técnico,<br>**Quiero** enlazar GitHub con Vercel,<br>**Para** que cada cambio se despliegue automáticamente. | **Given** un nuevo commit en `main`<br>**When** hago push<br>**Then** Vercel detecta, compila y publica la versión |
| **HU-04** | 1 | Prueba Cloud | **Como** administrador,<br>**Quiero** acceder a la URL pública,<br>**Para** verificar que la infraestructura opera en la nube. | **Given** el pipeline exitoso<br>**When** ingreso a la URL<br>**Then** la app carga con Status 200 OK |
| **HU-05** | 2 | Login de Usuarios | **Como** usuario,<br>**Quiero** iniciar sesión con mis credenciales,<br>**Para** acceder a las funciones correspondientes a mi rol. | **Given** la página de login<br>**When** ingreso datos válidos<br>**Then** el sistema autentica al usuario y lo redirige al dashboard correspondiente |
| **HU-06** | 2 | Protección de Rutas | **Como** superadmin,<br>**Quiero** bloquear el acceso anónimo y segmentar vistas por rol,<br>**Para** proteger datos sensibles. | **Given** sin sesión o rol inválido<br>**When** navego a ruta protegida<br>**Then** soy redirigido al login o bloqueado |
| **HU-07** | 2 | Dashboard Residente | **Como** Residente,<br>**Quiero** visualizar mis invitaciones activas,<br>**Para** gestionar mis próximos invitados. | **Given** sesión como residente<br>**When** carga el panel<br>**Then** veo listado de mis invitados |
| **HU-08** | 2 | Registrar Visita | **Como** Residente,<br>**Quiero** llenar nombre, documento, tipo de visita (ej. Social), fecha y placa,<br>**Para** autorizar a una visita y su motivo. | **Given** formulario "Nueva Visita"<br>**When** completo datos y guardo<br>**Then** visita guardada como 'Pendiente' con su respectiva etiqueta |
| **HU-09** | 2 | Pase Híbrido | **Como** Residente,<br>**Quiero** generar automáticamente un pase híbrido,<br>**Para** disponer de QR y PIN. | **Given** registro exitoso<br>**When** el sistema procesa<br>**Then** despliega QR válido y PIN alfanumérico |
| **HU-10** | 3 | UI en Portería | **Como** Guardia,<br>**Quiero** una vista móvil optimizada,<br>**Para** manipular fácilmente estando de pie. | **Given** ingreso desde móvil<br>**When** carga el panel<br>**Then** botones grandes y responsivos |
| **HU-11** | 3 | Escáner QR y validación de acceso | **Como** Guardia,<br>**Quiero** escanear el QR o ingresar un código manual,<br>**Para** validar la identidad del visitante o residente y registrar su ingreso con trazabilidad básica. | **Given** escáner activo con selector Visitante/Residente<br>**When** enfoco el QR o ingreso el código manual<br>**Then** el sistema busca la visita o residente, muestra sus datos y permite confirmar el ingreso |
| **HU-12** | 3 | PIN Manual | **Como** Guardia,<br>**Quiero** validar un PIN manual si el QR falla,<br>**Para** identificar al visitante o residente y registrar el ingreso cuando la cámara no funciona. | **Given** vista manual con selector Visitante/Residente<br>**When** tecleo un PIN válido<br>**Then** se muestran los datos asociados y se registra el ingreso |
| **HU-13** | 3 | Resumen IA | **Como** Administrativo,<br>**Quiero** ver un resumen diario de actividad generado por IA,<br>**Para** entender rápido las tendencias de visitas. | **Given** sesión como admin<br>**When** accedo al dashboard<br>**Then** veo resumen con total visitas, horarios pico y apartamentos activos |
| **HU-14** | 3 | Notificaciones n8n | **Como** Sistema,<br>**Quiero** enviar emails automatizados via n8n,<br>**Para** notificar bienvenida y llegada de visitantes. | **Given** usuario creado o visita ingresada<br>**When** se ejecuta la acción<br>**Then** n8n envía email correspondiente |
| **HU-15** | 3 | Historial de Accesos (Admin) | **Como** Administrativo,<br>**Quiero** consultar el historial de ingresos con tipo de visita,<br>**Para** auditar la seguridad del condominio. | **Given** sesión como admin<br>**When** navego a Historial<br>**Then** veo tabla filtrable de accesos (visitantes y residentes) con opciones: Social, Delivery, Servicio, Transporte, Residente |
| **HU-16** | 4 | Control de Calidad | **Como** QA,<br>**Quiero** pruebas unitarias,<br>**Para** asegurar robustez previa entrega final. | **Given** ejecución de suite de pruebas<br>**When** evalúo generación de PIN<br>**Then** pruebas pasan en verde sin errores |
| **HU-17** | 2 | QR/PIN Personal Residente | **Como** Residente,<br>**Quiero** tener un código QR y PIN personal permanente,<br>**Para** acceder al condominio sin necesidad de pase temporal. | **Given** sesión como residente<br>**When** accedo a "Mi QR"<br>**Then** veo mi código QR personal y PIN alfanumérico permanente |
| **HU-18** | 3 | Gestión de Usuarios (Admin) | **Como** Administrativo,<br>**Quiero** registrar, editar y eliminar usuarios del sistema,<br>**Para** gestionar residentes, vigilantes y personal. | **Given** sesión como admin<br>**When** navego a Usuarios<br>**Then** puedo crear, editar y eliminar usuarios |
| **HU-19** | 3 | Gestión de Propiedades (Admin) | **Como** Administrativo,<br>**Quiero** registrar y administrar unidades del condominio,<br>**Para** asignar propiedades a residentes. | **Given** sesión como admin<br>**When** navego a Propiedades<br>**Then** puedo crear, editar y eliminar unidades y veo el nombre del residente en cada card |
| **HU-20** | 2 | Historial Personal del Vigilante | **Como** Vigilante,<br>**Quiero** consultar mi propio historial de ingresos validados,<br>**Para** auditar mi actividad en portería. | **Given** sesión como vigilante<br>**When** navego a Historial<br>**Then** veo solo los ingresos que yo he validado con filtros por fecha |
| **HU-21** | 3 | Transición de Login con Branding | **Como** usuario,<br>**Quiero** ver una transición visual con el logo de la aplicación al iniciar sesión,<br>**Para** acceder a mi dashboard con una experiencia más fluida y consistente con la identidad visual del sistema. | **Given** la página de login disponible<br>**When** ingreso credenciales válidas y el sistema autentica al usuario<br>**Then** se muestra una transición visual con el logo y luego se redirige al dashboard correspondiente |
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

### Sprint 3: Control de Acceso + Notificaciones + Admin ✅ COMPLETADO
| HU | Título | Estado |
|:---|:---|:---|
| HU-10 | UI en Portería | ✅ |
| HU-11 | Escáner QR | ✅ |
| HU-12 | PIN Manual | ✅ |
| HU-13 | Resumen IA | ✅ |
| HU-14 | Notificaciones n8n | ✅ |
| HU-18 | Gestión de Usuarios (Admin) | ✅ |
| HU-19 | Gestión de Propiedades (Admin) | ✅ |
| HU-15 | Historial de Accesos (Admin) | ✅ |
| HU-20 | Historial Personal del Vigilante | ✅ |
| HU-21 | Transición de Login con Branding | ✅ |

### Sprint 4: Historial, Pulido + Documentación ⏳ NO INICIADO
| HU | Título | Estado |
|:---|:---|:---|
| HU-16 | Control de Calidad | ⏳ Pendiente |

### Resumen de Progreso
```
Sprint 1: ████████████████████ 100% ✅
Sprint 2: ████████████████████ 100% ✅
Sprint 3: ████████████████████ 100% ✅
Sprint 4: ░░░░░░░░░░░░░░░░░░░░   0% ⏳
```

**Avance total:** 20/21 HU completadas (95%)
