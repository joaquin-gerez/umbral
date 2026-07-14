# Publicacion en Chrome Web Store

Este documento contiene el material listo para copiar al Developer Dashboard. Debe mantenerse consistente con el comportamiento de la extension y con `PRIVACY.md`.

## Datos de la ficha

**Nombre:** Umbral - Anti Microcortes

**Idioma principal:** espanol

**Categoria sugerida:** Productividad

**Resumen breve:** Deja entrar a sitios distractores solo cuando ya paso el intervalo que elegiste.

**Descripcion detallada:**

> Umbral reduce las visitas breves y repetidas que interrumpen lo que estabas haciendo. Elegis los sitios que queres proteger y cada cuanto queres permitir una nueva entrada. La primera visita queda habilitada; si intentas volver antes de que termine el intervalo, Umbral muestra una pausa de 30 segundos.
>
> Funciones principales:
>
> - Intervalos configurables por dominio o grupo de sitios.
> - Activacion indefinida o sesion temporal con apagado automatico.
> - Pausa sobria, sin rachas, puntos ni penalizaciones.
> - Modo Zen con ambientes sonoros generados localmente.
> - Configuracion y actividad procesadas solo en tu dispositivo.
> - Sin cuentas, publicidad, telemetria ni suscripciones.
>
> Umbral no bloquea sitios durante todo el dia ni mide productividad. Su unica finalidad es espaciar las visitas repetidas a los dominios que vos elegis.

**URL de soporte:** https://github.com/joaquin-gerez/umbral/issues

**URL de politica de privacidad:** https://github.com/joaquin-gerez/umbral/blob/main/PRIVACY.md

## Proposito unico

Espaciar las visitas repetidas a dominios elegidos por la persona usuaria mediante un enfriamiento configurable y una pausa local de 30 segundos.

## Justificacion de permisos

**storage:** Guarda localmente los dominios protegidos, los intervalos, el momento de la ultima visita permitida y las preferencias de la extension. No se sincroniza ni transmite esta informacion.

**alarms:** Actualiza periodicamente las reglas locales cuando termina un intervalo y apaga una sesion temporal al llegar a su fin, incluso si el popup esta cerrado.

**webNavigation:** Detecta la confirmacion de una navegacion principal para comprobar localmente si el dominio coincide con uno protegido y registrar una visita permitida. No crea ni transmite un historial.

**declarativeNetRequest:** Aplica reglas dinamicas locales que redirigen a la pausa de Umbral cuando un dominio protegido sigue dentro de su intervalo.

**offscreen:** Mantiene el ambiente sonoro generado localmente cuando Modo Zen esta activo y el popup se cierra.

**host permission `<all_urls>`:** Permite que la persona usuaria proteja cualquier dominio que elija. El acceso se usa solamente para reconocer esos dominios y aplicar la redireccion configurada; no se lee el contenido de las paginas.

## Declaraciones de privacidad

- Tipo de dato utilizado: actividad de navegacion, limitada al dominio o URL necesaria para reconocer una visita a un sitio protegido.
- El procesamiento y el almacenamiento ocurren localmente en el dispositivo.
- Los datos se usan exclusivamente para la funcion unica declarada.
- No se venden ni transfieren datos a terceros.
- No se usan datos para publicidad, analitica, evaluacion crediticia ni otros fines no relacionados.
- No se ejecuta codigo remoto. Todo el JavaScript se incluye en el paquete de la extension.
- Certificar el cumplimiento de Limited Use en el formulario del panel.

## Distribucion

- Visibilidad: Public.
- Precio: gratis; Umbral no implementa pagos.
- Regiones: todas, salvo que exista una decision de producto diferente.
- Contenido para adultos: no.

## Recursos graficos

- Icono de tienda: `icons/icon-128.png`.
- Imagen promocional pequena: `store-assets/small-promo-440x280.png`.
- Imagen promocional marquee opcional: `store-assets/marquee-1400x560.png`.
- Captura obligatoria: obtener al menos una captura real de `1280x800` o `640x400`.

Capturas recomendadas:

1. Popup con la sesion temporal, Modo Zen y los grupos protegidos visibles.
2. Panel para agregar un dominio y elegir su intervalo.
3. Pausa de 30 segundos mostrada tras la segunda visita a un dominio protegido.

No incluir datos personales, otras extensiones, herramientas de desarrollo ni elementos que no pertenezcan a Umbral.

## Acciones que requieren al titular

1. Registrar la cuenta de desarrollador, pagar la tarifa unica y activar la verificacion en dos pasos.
2. Verificar el correo de contacto y elegir el nombre publico del editor.
3. Tomar las capturas reales desde Chrome.
4. Subir `dist/umbral-0.4.0.zip`, completar los campos anteriores y aceptar las declaraciones legales.
5. Elegir Public, enviar a revision y responder cualquier consulta de Google.
