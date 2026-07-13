# Politica de privacidad de Umbral

Ultima actualizacion: 13 de julio de 2026.

Umbral es una extension de Chrome que reduce las visitas repetidas a sitios elegidos por la persona usuaria. No requiere una cuenta y no utiliza servidores propios ni de terceros.

## Datos que utiliza

Para prestar su funcion principal, Umbral procesa localmente:

- Los dominios que la persona usuaria decide proteger.
- El momento de la ultima visita permitida a cada dominio o grupo protegido.
- Los intervalos, estados de activacion y preferencias de sonido elegidos.
- La direccion de la pagina al confirmarse una navegacion, exclusivamente para comprobar si su dominio coincide con uno protegido.

Esta informacion puede considerarse actividad de navegacion segun las definiciones de Chrome Web Store, aunque permanezca en el dispositivo.

## Finalidad y almacenamiento

Los datos se utilizan unicamente para determinar si una visita debe permitirse o redirigirse a la pausa de Umbral, y para conservar la configuracion de la extension. La configuracion y la fecha de la ultima visita se guardan mediante `chrome.storage.local` en el perfil local de Chrome.

Umbral no crea historiales de navegacion, perfiles de comportamiento ni estadisticas de uso. Tampoco utiliza estos datos para publicidad, analitica o decisiones automatizadas ajenas a su funcion principal.

## Transferencia y divulgacion

Umbral no envia, vende, comparte ni divulga datos de la persona usuaria a su desarrollador ni a terceros. Todo el procesamiento ocurre localmente. Los sonidos de Modo Zen se generan en el dispositivo y no utilizan streaming.

## Conservacion y eliminacion

La informacion se conserva en el perfil de Chrome mientras la configuracion exista. La persona usuaria puede eliminar sitios desde el popup, restablecer los datos de la extension desde Chrome o desinstalar Umbral para eliminar su almacenamiento local asociado.

## Permisos de Chrome

Umbral solicita acceso a la navegacion y a los sitios web para reconocer los dominios protegidos y aplicar las redirecciones configuradas. Tambien utiliza almacenamiento local, alarmas y reproduccion de audio en segundo plano. Estos permisos se usan solamente para las funciones visibles descritas en la ficha de Chrome Web Store.

## Cambios

Si las practicas de datos cambian, esta politica y la informacion mostrada a las personas usuarias se actualizaran antes de que las nuevas practicas entren en vigor.

## Contacto

Las consultas de privacidad o soporte pueden enviarse mediante el sistema de issues del repositorio oficial:

https://github.com/joaquin-gerez/umbral/issues
