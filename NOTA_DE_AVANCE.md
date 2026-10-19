# Avance reportable — Caso 2: Sedimentos

## Completado en el paquete

- Se organizaron los valores de la serie de sedimentos SD-01 de 2017 a 2025.
- Se generaron gráficas de mercurio total, metilmercurio, índice relativo de arsénico/plomo/cadmio y materia orgánica.
- Se calcularon los factores de cambio y variaciones porcentuales entre los extremos de la serie.
- Se dejó preparado un flujo de Google Earth Engine con Sentinel-2, comparación de color natural (B4-B3-B2), falso color (B11-B8-B4), máscara de nubes y diferencia NDVI.
- Se armó una presentación breve del avance.

## Resultado cuantitativo principal

El mercurio total en sedimento pasó de 0,45 mg/kg (2017) a 3,80 mg/kg (2025), factor 8,44 (+744,4 %). El metilmercurio pasó de 1,2 a 9,5 µg/kg, factor 7,92 (+691,7 %). La materia orgánica descendió de 4,2 % a 1,8 % (−57,1 %).

## Pendiente para completar el flujo GEE

1. Abrir el Code Editor y ejecutar el script con una cuenta/proyecto que tenga Earth Engine habilitado.
2. Revisar el conteo de escenas y las capas exportadas.
3. Validar/ajustar el AOI: el taller no entrega coordenadas exactas de SD-01.
4. Exportar las cuatro composiciones satelitales y capturar las capas en GEE.
5. Sustituir, en la presentación final, el panel de imágenes reproducido del PDF por las salidas nuevas de Earth Engine cuando estén revisadas.

## Cómo describirlo en una reunión

“Ya organizamos la serie de monitoreo de sedimentos y cuantificamos las tendencias 2017–2025. El mercurio total se multiplica por 8,44, mientras que la materia orgánica cae 57,1 %. En paralelo estamos implementando en Google Earth Engine una comparación Sentinel-2 con ventanas secas equivalentes, máscara de nubes, color natural, falso color SWIR-NIR-Rojo y NDVI. El siguiente hito es validar el AOI y contrastar las salidas con las imágenes del taller antes de reportar superficie intervenida.”
