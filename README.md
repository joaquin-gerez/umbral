<p align="center">
  <img src="assets/logo.svg" width="96" alt="Logo de Umbral">
</p>

# Umbral

Entrá una vez. Volvé cuando lo decidas, no por reflejo.

Umbral es una extensión de Chrome para cortar esas visitas de pocos segundos que rompen una sesión de trabajo. Elegís un sitio y un intervalo. La primera entrada queda habilitada; las siguientes esperan hasta que termine el enfriamiento.

No mide productividad, no arma rachas y no necesita una cuenta.

## Cómo se usa

La extensión arranca con un grupo de redes sociales preparado. Desde el popup podés dejar la protección encendida hasta que la apagues o iniciar una sesión temporal de 25, 45, 60 o 90 minutos. Al terminar una sesión, Umbral se desactiva solo.

El ambiente Zen es opcional y reproduce el sonido elegido mientras Umbral está activo. También podés sumar tus propios dominios y configurar cada intervalo por separado.

Cuando intentás volver antes de tiempo, Umbral reemplaza la página por una respiración breve y una cita. La idea no es retarte: es darte unos segundos para decidir si realmente querías estar ahí.

Modo Zen puede mantener un ambiente sonoro mientras navegás. Incluye lluvia, ruido marrón, binaural, lo-fi, jazz, clásica minimal y meditación. Son paisajes generativos locales; no hay streaming.

## Instalar para probar

1. Descargá o cloná este repositorio.
2. Abrí `chrome://extensions`.
3. Activá **Modo de desarrollador**.
4. Elegí **Cargar extensión sin empaquetar** y seleccioná esta carpeta.

No hay dependencias ni proceso de compilación.

## Privacidad

Las reglas, intervalos y preferencias se guardan con `chrome.storage.local`. Umbral no envía historial, URLs ni estadísticas a ningún servidor.

La explicación completa del tratamiento local de datos está en la [política de privacidad](PRIVACY.md).

## Desarrollo

La extensión usa Manifest V3, JavaScript, HTML y CSS. `background.js` administra los enfriamientos; `blocked/` contiene la pausa; `offscreen/` mantiene el audio de Zen.

Para regenerar los íconos:

```bash
node scripts/generate-icons.mjs
```

Para preparar los recursos y el ZIP de Chrome Web Store:

```bash
node scripts/generate-store-assets.mjs
node scripts/package-extension.mjs
```

La investigación de producto y evidencia está resumida en [RESEARCH.md](RESEARCH.md). Las reglas para trabajar sobre el código están en [AGENTS.md](AGENTS.md).

## Licencia

MIT.
