# 5. Diseño UI/UX y Sistema de Diseño (Design System)

Para garantizar consistencia visual a lo largo del proyecto y facilitar el desarrollo del Frontend con Tailwind CSS, se define un sistema de diseño centralizado. Este sistema utiliza codificación por colores según el rol del usuario para reducir la carga cognitiva y evitar confusiones operativas.

## 5.1 Tipografía
Se prioriza la máxima legibilidad en dispositivos móviles, especialmente bajo condiciones de luz solar exterior (para el caso de los guardias).
* **Fuente Principal:** `Inter` (Google Fonts). Es limpia, moderna y altamente legible en interfaces de usuario densas.
* **Pesos Tipográficos:**
  * *Regular (400):* Para el cuerpo del texto, descripciones y datos.
  * *Medium (500):* Para etiquetas, botones e inputs.
  * *Bold (700):* Para títulos de páginas y el nombre resaltado de los visitantes.

## 5.2 Paleta de Colores Base (Global)
Aplicable a la estructura general de la aplicación sin importar el rol.
* **Fondo Principal (App Background):** `#F3F4F6` (Tailwind `gray-100`). Reduce la fatiga visual.
* **Fondo de Componentes (Cards/Modals):** `#FFFFFF` (Blanco puro). Genera contraste para leer datos.
* **Texto Principal:** `#1F2937` (Tailwind `gray-800`). Gris muy oscuro para máximo contraste sin ser negro puro.
* **Texto Secundario (Subtítulos, fechas):** `#6B7280` (Tailwind `gray-500`).

## 5.3 Codificación de Color por Rol (Role-Based Accent Colors)
Cada módulo de la aplicación tendrá un "Color de Acento" distinto (usado en botones principales, barra de navegación superior e íconos activos). Esto permite a los usuarios saber instantáneamente en qué entorno están operando.

| Módulo / Rol | Color de Acento | Código HEX (Tailwind) | Razón Psicológica y Práctica |
| :--- | :--- | :--- | :--- |
| **Residente** | Verde Aqua / Menta | `#0bf7ae` | Color vibrante y moderno que indica agilidad tecnológica. Se sincroniza visualmente con el estado de "Éxito". |
| **Vigilante** | Azul Zafiro | `#2563EB` (`blue-600`) | Transmite seguridad institucional, autoridad formal y calma. Ideal para la portería. |
| **Administrativo** | Naranja Beige / Crema | `#FDBA74` (`orange-300`) | Tono cálido y corporativo para la gestión de auditorías sin generar fatiga visual en monitores de escritorio. |
| **Superadmin** | Gris Pizarra Oscuro| `#334155` (`slate-700`) | Color neutral técnico, exclusivo para configuración de base de datos e infraestructura (backend UI). |

## 5.4 Paleta de Colores Semánticos (Estados y Alertas)
Estos colores son universales y se utilizan estrictamente para comunicar el estado del flujo de datos (Pases de acceso).
* **Éxito (Success):** `#0bf7ae` ➔ Acceso concedido, Pase generado, Escaneo válido.
* **Peligro (Error/Danger):** `#f26d6d` ➔ QR expirado, PIN incorrecto, Visita rechazada.
* **Advertencia (Warning):** `#f8c367` ➔ Visita Pendiente, Atención requerida en portería.

## 5.5 Patrones de Interfaz y Usabilidad (UX)

### Diseño Orientado a Portería (Mobile-First Estricto)
* **Thumb-Zone (Zona del pulgar):** Dado que el guardia trabaja de pie sosteniendo el móvil con una mano, el botón central de **"Escanear QR"** y el teclado numérico del PIN deben ubicarse en la mitad inferior de la pantalla para fácil alcance del pulgar.
* **Botones Gigantes:** Los *Call to Action* (CTA) en el entorno del guardia no deben medir menos de 56px de alto (`h-14` en Tailwind) para evitar toques accidentales en momentos de apuro.

### Patrones de Navegación
* **Residentes y Guardias (Móviles):** Utilizarán un menú de navegación inferior fijo (*Bottom Tab Bar*) con iconos simples (Ej. "Invitar", "Mis Visitas", "Perfil").
* **Administrativo y Superadmin (Escritorio):** Utilizarán un menú lateral clásico (*Sidebar*) para visualizar cómodamente las tablas anchas del Historial de Accesos y reportes.

### Estilo de Componentes
* **Bordes:** Ligeramente redondeados (`rounded-lg`) para suavizar la interfaz tecnológica.
* **Sombras:** Uso de elevaciones sutiles (`shadow-md`) en tarjetas de visitas para que destaquen sobre el fondo gris claro.

## 5.6 Iconografía
Para la comunicación visual rápida se implementará la biblioteca **Lucide React** (`lucide-react`).
* **Estilo:** Ofrece íconos de trazado lineal (stroke) modernos, minimalistas y limpios, que encajan perfectamente con el diseño de Tailwind CSS.
* **Implementación:** Se importarán directamente como componentes React y heredarán automáticamente el color de acento y tamaño de las clases Tailwind (`text-[#0bf7ae] w-6 h-6`).

### Catálogo de Iconos Estándar
Se define el uso exclusivo de los siguientes componentes gráficos para mantener la coherencia a lo largo de las Historias de Usuario:

| Contexto / Acción | Componente Lucide | Propósito Visual |
| :--- | :--- | :--- |
| **Navegación General** | `<Home />`, `<LogOut />`, `<User />` | Dashboard principal, botón de salida, ajustes de perfil. |
| **Creación de Pases** | `<UserPlus />`, `<QrCode />`, `<CarFront />` | Nuevo invitado, visualización del pase QR, campo de placa de vehículo. |
| **Acción en Portería** | `<ScanLine />`, `<Keyboard />`, `<Camera />` | Activar lector QR, búsqueda manual por PIN, IA para extraer cédula. |
| **Estado de Seguridad**| `<ShieldCheck />`, `<ShieldAlert />` | Pantalla del guardia: Acceso Concedido (Éxito) o Acceso Denegado (Peligro). |
| **Auditoría (Admin)** | `<History />`, `<Filter />`, `<Bell />` | Tabla del historial de visitas, filtrado por fechas, notificaciones n8n. |
| **Visita: Social** | `<Users />` | Etiqueta para visitas familiares o amigos. |
| **Visita: Delivery** | `<Package />` | Etiqueta para entrega de comida o paquetería. |
| **Visita: Servicio** | `<Wrench />` | Etiqueta para plomeros, electricistas o mantenimiento. |
| **Visita: Transporte** | `<CarTaxiFront />` | Etiqueta para taxis o Uber de rápida entrada y salida. |
