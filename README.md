# Extension Chrome Focus

Extension Chrome Focus es una extension para navegador pensada para reducir distracciones y sostener sesiones de trabajo profundas.

## Stack

- Chrome Extension Manifest V3
- HTML, CSS y JavaScript
- `chrome.storage` para configuracion local

## Que hace

- Permite definir sitios distractores
- Aplica reglas de bloqueo o enfriamiento por sitio
- Muestra estado y tiempo restante desde la extension
- Busca favorecer foco sin depender de servicios externos

## Como funciona

- `manifest.json`: permisos y configuracion base
- `background` o service worker: reglas de bloqueo y temporizadores
- `popup/`: panel de configuracion y estado
- `block_page/`: vista mostrada cuando un acceso esta bloqueado
