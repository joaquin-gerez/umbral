# Focus Flow - Chrome Extension

## 📌 Objetivo Principal
Construir una extensión simple, ultraligera y altamente funcional para Google Chrome que proteja tu estado de "flow" (concentración). En lugar de aplicar bloqueos absolutos que suelen generar frustración, utiliza un sistema estratégico de **"Cooldowns" (tiempos de enfriamiento) por acceso**.

## 🚀 Funcionalidad Core (El problema a resolver)
El concepto principal es el **Bloqueo tras el primer acceso**:
1. El usuario configura URLs que suelen ser su principal distracción (ej. `instagram.com`, `reddit.com`) y les asigna un tiempo de "espera" (ej. 30 minutos).
2. **Acceso inicial libre:** El usuario entra a `instagram.com`. La extensión detecta el acceso, permite la navegación, e inmediatamente "sella" la web iniciando un temporizador oculto por 30 minutos.
3. **Penalización por volver temprano:** Si el usuario sale de la web e intenta *volver a entrar* antes de que se cumplan los 30 minutos (los próximos 29 minutos, por ejemplo), la extensión bloquea el acceso y muestra una pantalla indicando los minutos restantes de espera.
4. Una vez cumplido el tiempo, el ciclo se reinicia: puedes entrar, y al hacerlo, se vuelve a bloquear por 30 min.

## ✨ Funcionalidades Adicionales (Roadmap)
Una vez el Core funcione perfectamente, añadiremos:
- **Límites de permanencia (Session Limits) [A definir]:** Cuando entras por primera vez, solo puedes estar X minutos antes de que la página se bloquee forzosamente y comience el cooldown.
- **Bloqueo directo por código horario:** Bloquear acceso totalmente de Lunes a Viernes entre las 09:00 y las 14:00.

## 💻 Backlog: Versión CLI (Terminal para SO)
- **Bloqueo a nivel de Sistema Operativo:** Desarrollar una aplicación de terminal (ej. para Ubuntu/Windows) que bloquee el acceso a sitios web modificando el archivo `hosts` o mediante reglas de red. De esta forma, el bloqueo aplicará a cualquier navegador, no solo a Chrome. Ambas versiones (Extensión y CLI) convivirán en este mismo repositorio en carpetas separadas.

## 🛠️ Arquitectura y Stack Técnico
Se construirá nativamente para Google Chrome (Manifest V3) garantizando rendimiento sin frameworks pesados.
* **HTML/CSS/JS (Vanilla):** Sin librerías que sumen peso. Diseño muy limpio y minimalista.
* **Estructura de Archivos:**
  * `manifest.json`: Permisos requeridos (`storage`, `scripting`, `tabs`, `declarativeNetRequest` o `webNavigation`).
  * `background.js` (Service Worker): Será el cerebro. Registrará las marcas de tiempo (timestamps) de los accesos y determinará si una navegación se permite o se intercepta.
  * `popup/`: (HTML/CSS/JS) La interfaz que se abre al pinchar el ícono de la extensión. Aquí se verán los timers activos y se añadirán/borrarán webs de la lista.
  * `block_page/`: La pantalla que se muestra cuando un nivel está bloqueado ("Estás enfocado. Vuelve a instagram.com en 12:45 minutos").

## 📋 Plan de Desarrollo (Paso a Paso)

### Fase 1: Setup y Estructura Base
- [ ] Crear el `manifest.json` (Manifest V3).
- [ ] Configurar los iconos básicos de la extensión.
- [ ] Estructurar los directorios (background, popup, páginas).

### Fase 2: Configuración de Datos y Storage
- [ ] Crear la interfaz (`popup.html/js`) para añadir una URL (ej. `instagram.com`) y un tiempo de cooldown (ej. `30` min).
- [ ] Guardar esta configuración de manera persistente usando la API `chrome.storage.local`.
- [ ] Crear la lógica para listar, editar y eliminar URLs desde el popup.

### Fase 3: El Motor (Service Worker)
- [ ] Escuchar cuando una pestaña cambia de URL o se abre usando `chrome.tabs.onUpdated` o `chrome.webNavigation`.
- [ ] Analizar si la URL a la que viaja el usuario está en nuestra lista de configuración.
- [ ] Si es la primera vez (no hay timestamp previo activo): Registrar el timestamp actual en el storage como "Último Acceso".
- [ ] Si hay un timestamp guardado y no ha vencido el cooldown: Redirigir inmediatamente la pestaña a `block_page/index.html`.

### Fase 4: La UI de Bloqueo
- [ ] Diseñar `block_page.html`. Debe ser muy limpia, estética (fondo oscuro/bonito) para no frustrar pero sí ser firme.
- [ ] Añadir lógica en la página de bloqueo para leer de la URL temporal (parámetro query) a dónde quería ir el usuario y mostrar un conteo regresivo de cuándo se despeja el acceso.

### Fase 5: Pruebas y Edge Cases
- [ ] Qué pasa si recargo la web estando ya dentro (¿Cuenta como nueva visita o no?) *Ideal: solo se activa el cooldown si vienes de otra tab o ha pasado 'x' tiempo fuera de foco.*
- [ ] Qué pasa si el usuario desactiva la extensión y ya (mitigaciones).
- [ ] Limpieza de variables antiguas en el storage para no ocupar memoria.

## 🤝 Contribución y Siguientes Pasos
Este documento servirá de base. Si estás de acuerdo con el plan, crearemos los archivos de la Fase 1.
