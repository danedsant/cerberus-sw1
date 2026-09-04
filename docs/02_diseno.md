# 2. Diseño y Arquitectura

## 2.1 Arquitectura del Sistema
El proyecto sigue una arquitectura Cliente-Servidor moderna basada en la nube (Serverless) utilizando **Next.js** y **Supabase**, lo cual permite un desarrollo ágil y escalable.

* **Frontend:** Desarrollado como PWA (Progressive Web App) para ser consumido desde navegadores de escritorio y dispositivos móviles sin descargas previas.
* **Backend:** Funciones Serverless (API Routes de Next.js) y BaaS (Backend as a Service) a través de Supabase para manejo de datos en tiempo real.

## 2.2 Stack Tecnológico
* **Frontend:** Next.js y Tailwind CSS (Para una interfaz rápida, moderna y adaptable a móviles).
* **Base de Datos y Autenticación:** PostgreSQL alojado en Supabase con autenticación segura usando JWT.
* **Inteligencia Artificial:** Gemini API (Para realizar OCR y extracción inteligente de datos de texto desde fotografías de identificaciones en portería).
* **Automatización:** n8n (Orquestador de flujos de trabajo que escuchará eventos en la base de datos y despachará notificaciones automáticas).
* **Despliegue (Deploy):** Vercel (Hosting nativo y optimizado para Next.js, con CI/CD automático desde GitHub).

## 2.3 Modelo de Datos Preliminar (Diagrama ER Base)

A nivel de base de datos relacional, implementaremos el patrón de **Herencia Múltiple por Tablas (Class Table Inheritance)**. Tendremos una entidad base abstracta (`USUARIOS`) que contendrá los datos comunes, y entidades separadas (`RESIDENTES` y `VIGILANTES`) para manejar los atributos exclusivos de cada rol.

```mermaid
erDiagram
    USUARIOS ||--|| RESIDENTES : "es un"
    USUARIOS ||--|| VIGILANTES : "es un"
    PROPIEDADES ||--o{ RESIDENTES : "habita"
    
    RESIDENTES ||--o{ VISITAS : "autoriza"
    VIGILANTES ||--o{ VISITAS : "valida"
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
```

### Definición de las Tablas y su Propósito

| Entidad | Tabla en BD | Propósito Principal | Relaciones Clave |
| :--- | :--- | :--- | :--- |
| **Propiedades** | `PROPIEDADES` | Administrar la estructura física del condominio (apartamentos, casas o locales). Esencial para agrupar a los residentes que viven bajo un mismo techo y saber el destino exacto de la visita. | Contiene a muchos `RESIDENTES`. |
| **Usuarios** | `USUARIOS` | Entidad base de autenticación y datos biográficos comunes. Contiene nombre, apellido y cédula de todos los que acceden al sistema. | Hereda atributos a `RESIDENTES` y `VIGILANTES` en una relación 1:1. |
| **Residentes** | `RESIDENTES` | Extensión de Usuarios. Almacena atributos exclusivos como el teléfono de contacto y la propiedad asignada. | Autoriza las `VISITAS`. Se asocia a `PROPIEDADES`. |
| **Vigilantes** | `VIGILANTES` | Extensión de Usuarios. Almacena atributos propios del cargo como el turno laboral. | Valida las `VISITAS` en la portería. |
| **Visitantes** | `VISITANTES` | Almacenar datos personales de personas externas a la residencia. Se separa de la visita para evitar duplicar registros si la persona asiste frecuentemente. No poseen cuenta en el sistema. | Realiza muchas `VISITAS`. |
| **Visitas / Pases** | `VISITAS` | Tabla transaccional central. Registra el pase: quién lo autoriza (`residente_id`), quién ingresa, tipo de visita (ej. Social, Delivery), placa del vehículo, y quién lo valida (`vigilante_id`). | Pivote que vincula `RESIDENTES`, `VIGILANTES` y `VISITANTES`. |

---

## 2.4 Diccionario de Datos (Atributos)

A continuación se detalla la definición, tipo de dato y restricciones clave (Primary Key, Foreign Key, Unique) para cada atributo de las 6 entidades del sistema.

### 1. PROPIEDADES (properties)
| Atributo | Tipo de Dato | Clave | Definición |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | Identificador único de la propiedad. |
| `numero_unidad` | `VARCHAR` | - | Número o nombre descriptivo de la vivienda (Ej. "Apto 4B"). |

### 2. USUARIOS (users)
| Atributo | Tipo de Dato | Clave | Definición |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | Identificador único ligado a la tabla de autenticación (`auth.users`) de Supabase. |
| `correo` | `VARCHAR` | **UK** | Correo electrónico del usuario. |
| `nombre` | `VARCHAR` | - | Nombre de pila del usuario. |
| `apellido` | `VARCHAR` | - | Apellido del usuario. |
| `cedula` | `VARCHAR` | **UK** | Documento de identidad del usuario. |
| `rol` | `VARCHAR` | - | Columna discriminadora para definir el tipo de usuario (`superadmin`, `administrativo`, `vigilante`, `residente`). |

### 3. RESIDENTES (residents)
| Atributo | Tipo de Dato | Clave | Definición |
| :--- | :--- | :--- | :--- |
| `usuario_id` | `UUID` | **PK, FK** | Referencia a la tabla `USUARIOS` (Relación 1:1). |
| `propiedad_id` | `UUID` | **FK** | Identificador de la propiedad donde reside. |
| `telefono_contacto` | `VARCHAR` | - | Número celular principal del residente para avisos. |

### 4. VIGILANTES (guards)
| Atributo | Tipo de Dato | Clave | Definición |
| :--- | :--- | :--- | :--- |
| `usuario_id` | `UUID` | **PK, FK** | Referencia a la tabla `USUARIOS` (Relación 1:1). |
| `turno` | `VARCHAR` | - | Horario de trabajo asignado al guardia (Ej. "Diurno", "Nocturno"). |

### 5. VISITANTES (visitors)
| Atributo | Tipo de Dato | Clave | Definición |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | Identificador único del visitante. |
| `cedula` | `VARCHAR` | **UK** | Documento de identidad del visitante. |
| `nombre` | `VARCHAR` | - | Nombre de pila del visitante. |
| `apellido` | `VARCHAR` | - | Apellido del visitante. |

### 6. VISITAS (visits)
| Atributo | Tipo de Dato | Clave | Definición |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | Identificador único del pase transaccional. |
| `residente_id` | `UUID` | **FK** | Referencia al residente que autorizó el pase. |
| `visitante_id` | `UUID` | **FK** | Referencia al visitante que realizará el ingreso. |
| `vigilante_id` | `UUID` | **FK** | Referencia al guardia que validó el acceso (Permite `NULL` al crear). |
| `fecha_esperada` | `DATE` | - | Fecha agendada en la que el pase tiene validez. |
| `tipo_visita` | `VARCHAR` | - | Categoría de la visita (`social`, `delivery`, `mantenimiento`, `transporte`). |
| `estado` | `VARCHAR` | - | Estado actual del pase (`pendiente`, `ingresado`, `cancelado`). |
| `codigo_pin` | `VARCHAR` | **UK** | Código alfanumérico corto generado automáticamente (Ej. A7-992). |
| `placa_vehiculo` | `VARCHAR` | - | Placa del transporte de llegada (Permite `NULL` si no se conoce). |
| `fecha_creacion` | `TIMESTAMP`| - | Fecha y hora en que se creó el pase en el sistema. |
| `fecha_hora_ingreso` | `TIMESTAMP`| - | Fecha y hora exacta del escaneo en la portería (Permite `NULL`). |
