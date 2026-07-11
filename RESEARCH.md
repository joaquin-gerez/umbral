# Investigacion de producto y evidencia

Fecha de revision: 11 de julio de 2026.

## Productos comparables

- **Freedom** organiza el bloqueo alrededor de sesiones, listas y horarios. Su modo estricto evita terminar una sesion antes de tiempo. Umbral toma la claridad del estado de sesion, pero mantiene el diferencial del enfriamiento entre aperturas. Fuente: https://freedom.to/features
- **Opal** combina listas de bloqueo, sesiones, limites de tiempo y limites de aperturas. Umbral prioriza una superficie mas pequena: estado general, presets y configuracion manual secundaria. Fuente: https://opalapp.com/help/what-is-opal
- **one sec** introduce friccion antes de abrir una distraccion mediante respiracion, intencion y otras intervenciones. Un estudio publicado en PNAS encontro una reduccion media del 57% en aperturas de apps durante seis semanas. Umbral adopta la pausa consciente, sin copiar sus mecanismos ni afirmar que el mismo resultado se transfiera automaticamente al navegador. Fuentes: https://www.pnas.org/doi/10.1073/pnas.2213114120 y https://one-sec.app/research/

## Interrupciones y cambio de contexto

- El trabajo interrumpido puede completarse mas rapido porque las personas compensan trabajando con mas apuro, pero aumenta el estres, la frustracion, la presion temporal y el esfuerzo. Fuente: Gloria Mark, Daniela Gudith y Ulrich Klocke, *The Cost of Interrupted Work: More Speed and Stress*: https://www.ics.uci.edu/~gmark/chi08-mark.pdf
- Al cambiar de una tarea incompleta a otra persiste un "residuo de atencion" que perjudica el rendimiento posterior. Fuente: Sophie Leroy, *Why is it so hard to do my work?*: https://doi.org/10.1016/j.obhdp.2009.04.002

## Respiracion y sonido

- Una revision sistematica encontro que la respiracion lenta, por debajo de 10 respiraciones por minuto, se asocia con cambios autonomicos y psicologicos. El patron de Umbral usa 4 segundos de inhalacion y 6 de exhalacion: 6 respiraciones por minuto. Fuente: https://pubmed.ncbi.nlm.nih.gov/30245619/
- La evidencia sobre musica, ruido ambiental, ruido blanco y beats binaurales para mejorar la cognicion o la atencion es mixta o insuficiente. Por eso Umbral presenta lluvia y ruido marron como ambiente opcional, no como tratamiento ni garantia de rendimiento. Fuente: https://pubmed.ncbi.nlm.nih.gov/38458383/

## Preset de distracciones populares

Similarweb ubico en mayo de 2026 a YouTube, Facebook, Instagram, Reddit, X y TikTok entre los diez sitios con mayor trafico global. El preset suma Twitch, Netflix, Pinterest y Amazon por representar video en vivo, streaming, descubrimiento visual y compras. Se excluyen herramientas de uso general como Google, Wikipedia, WhatsApp y servicios de IA porque bloquear popularidad no equivale a bloquear distraccion. Fuente: https://www.similarweb.com/blog/research/market-research/most-visited-websites/

## Citas de la pausa

Las traducciones pueden variar entre ediciones. La seleccion usa fragmentos breves y conserva autor y obra en pantalla.

- Dostoyevski, *Los hermanos Karamazov*: https://www.argentina.gob.ar/sites/default/files/los_hermanos_karamazov_dostoyevski.pdf
- Pierre Bourdieu, *Sobre la television*: https://www.eldiario.es/vertele/videos/actualidad/television_1_7687228.html
- Simone Weil, carta a Joe Bousquet, citada en *Sobre Dios*: https://proassets.planetadelibros.cl/usuaris/libros_contenido/arxius/63/62220_Sobre_dios.pdf
- Blaise Pascal, *Pensamientos*: https://www.larazon.es/sociedad/blaise-pascal-todos-problemas-provienen-incapacidad-hombre-sentarse-solo-habitacion-p7m_202607046a48f825a8768a6aee40f0d3.html
- Nietzsche, *Crepusculo de los idolos*: https://blogdenotasnietzsche.wordpress.com/2010/02/04/quien-tiene-un-porque-para-vivir-encontrara-casi-siempre-el-como/
- Schopenhauer, *Parerga y paralipomena*: https://www.elconfidencial.com/alma-corazon-vida/2026-03-03/arthur-schopenhauer-filosofo-si-no-ama-soledad-no-ama-libertad-1qrt_4313168/
- Marco Aurelio, *Meditaciones*, V.16: https://theobjective.com/lifestyle/2026-02-12/marco-aurelio-filosofo-emperador-50-anos-felicidad-vida-depende-calidad-pensamientos/
- Byung-Chul Han, discurso de 2025: https://elpais.com/cultura/2025-10-24/byung-chul-han-en-los-premios-princesa-de-asturias-nos-hemos-convertido-en-una-herramienta-del-smartphone-nos-usa-a-nosotros-y-no-al-reves.html

## Decisiones de producto

1. El interruptor maestro y el badge resuelven primero si la extension esta activa.
2. Los presets hacen visible que ya existen sitios protegidos; agregar una URL queda como accion secundaria.
3. La pausa rota citas breves verificadas y muestra siempre autor y obra.
4. El audio se genera localmente y continua mediante un documento offscreen mientras Modo Zen esta activo.
5. Umbral no bloquea por popularidad indiscriminada: el usuario activa cada preset.
