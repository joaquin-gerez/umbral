# Contexto para agentes

## Producto

Umbral es una extensión Chrome Manifest V3 que reduce microinterrupciones. Su contrato principal es: una visita permitida activa un enfriamiento por dominio o grupo; durante ese tiempo la navegación se redirige a una pausa.

No convertirla en un bloqueador diario, un Pomodoro ni un sistema de gamificación sin una decisión explícita de producto.

## Arquitectura

- `background.js`: estado inicial, migraciones, reglas dinámicas, badge y documento offscreen.
- `popup/`: configuración. El documento no debe tener scroll; sólo `#site-list` puede desplazarse.
- `blocked/`: intervención de 30 segundos. Debe caber completa en el viewport, sin scroll, header, footer ni CTA.
- `offscreen/`: audio generativo persistente de Modo Zen.
- `manifest.json`: permisos y recursos públicos.

El estado vive en `chrome.storage.local`:

- `sites`: objetos con `id`, `domains`, `minutes`, `lastVisit`, `enabled` y `kind`.
- `settings`: `enabled`, `zenMode` y `sound`.

## Invariantes

- Sin backend, telemetría, cuentas ni dependencias de runtime.
- Las opciones predeterminadas deben migrarse sin borrar configuración existente.
- `refreshRules` permanece serializado para evitar carreras en reglas dinámicas.
- Modo Zen activo reproduce audio mediante `chrome.offscreen` aun con el popup cerrado.
- No presentar beats, música o respiración como tratamiento o garantía científica.
- Las citas deben verificarse, ser breves y mostrar autor y obra.
- Mantener el popup sobrio: una sans, pocas superficies y sin estética de dashboard genérico.

## Validación

```bash
node --check background.js
node --check popup/popup.js
node --check blocked/blocked.js
node --check offscreen/audio.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8'))"
git diff --check
```

La prueba final se hace recargando la extensión en `chrome://extensions`, visitando dos veces un dominio protegido y comprobando que el audio continúe al cerrar el popup.
