# 1. Análisis del Proyecto

## 1.1 Planteamiento del Problema
En la administración y gestión de condominios (edificios y conjuntos residenciales), el proceso actual de control de acceso en la portería presenta graves deficiencias:
* **Congestión e ineficiencia:** Se forman largas filas de vehículos y visitantes en la entrada debido a que la validación se realiza mediante llamadas telefónicas (intercomunicador) y el registro se efectúa manualmente en bitácoras de papel.
* **Falta de trazabilidad:** Existe una gran dificultad para registrar y monitorear adecuadamente el ingreso de personal temporal (mantenimiento, proveedores) o servicios de *delivery*, lo que genera vulnerabilidades y brechas de seguridad para los residentes.

## 1.2 Alcance del Proyecto
Para mantener el proyecto acotado, realista y viable dentro del tiempo establecido para la materia, el alcance se centrará **exclusivamente en el flujo central de autorización y validación de visitas**. 

El sistema permitirá:
1. **A los residentes:** Pre-autorizar visitas y generar un pase de acceso digital de formato híbrido (Código QR + PIN numérico).
2. **A los guardias:** Validar el acceso escaneando el QR o introduciendo el PIN de respaldo para registrar el ingreso en tiempo real, sin necesidad de confirmación telefónica.
3. **A la administración:** Visualizar un historial de ingresos para efectos de auditoría y seguridad.

*(Nota: Quedan fuera del alcance integraciones con hardware como talanqueras automáticas, módulos de cobro de alícuotas o reserva de áreas comunes, para enfocar los esfuerzos en la calidad arquitectónica y el flujo principal).*

## 1.3 Evaluación de Alternativas

### Plataforma de Desarrollo (PWA vs Nativa vs WhatsApp)
Se evaluaron alternativas como una App Nativa o un Bot de WhatsApp. Se optó por una **Aplicación Web Responsiva (PWA)** porque permite tener un solo código base para todos los dispositivos (celular del guardia, PC del administrador, celular del residente), sin obligar a los visitantes a descargar aplicaciones, lo cual garantiza una mejor adopción y un desarrollo más ágil para cumplir con los tiempos del proyecto (4 sprints).

### Método de Validación en Portería (Enfoque Híbrido: QR + PIN)
Para el método de validación se analizaron los escenarios de fallas en el mundo real:
* **El código QR** ofrece máxima velocidad y seguridad, pero es vulnerable a fallos de hardware (pantalla del visitante rota, celular sin batería, o cámara del guardia sin buena iluminación).
* **El PIN** es accesible universalmente (útil para servicios de *delivery* que solo pueden anotar un número), pero ingresarlo es más lento y propenso a errores humanos al teclear.

**Solución definitiva:** El sistema generará siempre un Código QR para que el guardia lo escanee como primera opción (asegurando rapidez). Justo debajo del QR se imprimirá un código PIN corto (ej. `A7-992`) como plan de respaldo por si la lectura falla. Esto demuestra un diseño maduro y tolerante a fallos, cubriendo todos los casos extremos físicos.
