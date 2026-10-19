# CIMMA — Caso 2: Sedimentos
## Paquete de avance y flujo de trabajo en Google Earth Engine

### Archivos

- `codigo/Caso2_Huepetuhe_Sentinel2_GEE.js`: script JavaScript para Google Earth Engine Code Editor.
- `codigo/generar_graficas.py`: código Python para rehacer las gráficas de la tabla del taller.
- `datos/sedimentos_SD01.csv`: transcripción de los valores 2017–2025 del Caso 2.
- `datos/resumen_cambios_calculado.csv`: cálculo reproducible de diferencia absoluta, factor y variación porcentual.
- `figuras/`: gráficas y composiciones mostradas en el PDF del taller.
- `presentacion/Avance_Caso2_CIMMA.pptx`: presentación editable para informar el avance preliminar.

## 1. Ejecutar el análisis satelital en Google Earth Engine

1. Entra en https://code.earthengine.google.com/ con tu cuenta Google.
2. Si Earth Engine solicita acceso/proyecto, sigue la guía oficial de registro: https://developers.google.com/earth-engine/guides/access?hl=es-419. Para un trabajo académico, selecciona el uso correspondiente y cumple la verificación que solicite Google.
3. En Code Editor elige **New** para crear un script.
4. Abre `codigo/Caso2_Huepetuhe_Sentinel2_GEE.js`, copia todo el contenido y pégalo en el editor. Guarda el script con el nombre `CIMMA_Caso2_Huepetuhe_2017_2025`.
5. Pulsa **Run**.
6. En la pestaña **Console**, comprueba el número de escenas Sentinel-2 disponibles para 2017 y 2025 y los valores medios de NDVI que se imprimen.
7. En la pestaña **Layers**, activa las capas de cada año para comparar los mismos productos:
   - `2017 - color natural B4-B3-B2` y `2025 - color natural B4-B3-B2`.
   - `2017 - falso color B11-B8-B4` y `2025 - falso color B11-B8-B4`.
   - `Delta NDVI 2025 - 2017 (exploratorio)`.
8. Si el mapa está cubierto por un rectángulo amarillo, desactiva la capa `AOI aproximada (validar)` para tomar capturas limpias.
9. En **Tasks**, pulsa **Run** en cada exportación que quieras guardar. Confirma el diálogo. Los GeoTIFF aparecerán en Google Drive dentro de la carpeta `Caso2_CIMMA`.
10. Para un primer avance, exporta como mínimo las cuatro composiciones (color natural y falso color para ambos años). Exporta también el NDVI si se va a analizar el cambio de cobertura.

### Parámetros técnicos usados

- Colección: `COPERNICUS/S2_SR_HARMONIZED` (reflectancia de superficie armonizada). Si devuelve cero escenas, revisar primero el AOI, las fechas y la consola; no se mezclan productos SR y TOA en el mismo análisis.
- Ventanas estacionales: del 1 de mayo al 30 de septiembre de 2017 y 2025, para mantener la misma ventana temporal en ambos años.
- Composición: mediana de escenas tras enmascarar píxeles con SCL que corresponden a sombras de nube, nubes y cirros.
- Color natural: B4-B3-B2.
- Falso color que solicita el Caso 2: B11-B8-B4 (SWIR-NIR-Rojo).
- NDVI: diferencia entre 2025 y 2017 para detectar cambios de verdor aparente; no es un mapa de contaminación química.
- Exportación: GeoTIFF georreferenciado; color natural a 10 m, falso color con B11 a 20 m.

## 2. Limitación importante: el área exacta aún debe validarse

El PDF del taller identifica el punto SD-01 sobre la figura, pero no entrega coordenadas GPS ni un polígono GIS descargable. El script contiene un AOI aproximado en el área minera para permitir que el flujo se ejecute, pero **no debe afirmarse que ese AOI es exactamente el área de las Figuras 3 y 4 ni que representa las coordenadas de SD-01**.

Antes de presentar los mapas como resultados finales:

1. Compara el encuadre de las imágenes de Earth Engine con las Figuras 3 y 4 del PDF.
2. Si no coincide, ajusta el punto/buffer de las líneas iniciales del script o dibuja un polígono de estudio con la herramienta de geometría del Code Editor.
3. Guarda las coordenadas/polígono que hayas usado, de modo que el análisis sea reproducible.

No se ha ejecutado el script desde esta carpeta en una sesión de Earth Engine, porque eso requiere tu cuenta/proyecto. Por tanto, el paquete incluye el código listo para ejecutar, no afirma que las exportaciones de GEE ya existan.

## 3. Gráficas de los datos de campo

Si tienes Python instalado con `pandas` y `matplotlib`, desde la carpeta raíz del paquete ejecuta:

```bash
python codigo/generar_graficas.py
```

El script vuelve a generar las gráficas en `figuras/` y el resumen cuantitativo en `datos/resumen_cambios_calculado.csv`. Estas figuras se basan en los números proporcionados por el PDF, no en nuevos análisis de laboratorio.

Resultados clave calculados de la tabla:

- Mercurio total: 0,45 a 3,80 mg/kg; factor 8,44; +744,4 %.
- Metilmercurio: 1,2 a 9,5 µg/kg; factor 7,92; +691,7 %.
- Arsénico: factor 2,34.
- Plomo: factor 2,33.
- Cadmio: factor 2,75.
- Materia orgánica: 4,2 % a 1,8 %; disminución relativa de 57,1 %.

## 4. Cómo presentar el avance sin sobreafirmar

Presenta el trabajo como **avance metodológico y análisis preliminar de los datos del taller**. Se puede afirmar que:

- ya se transcribió y graficó la serie de sedimentos 2017–2025;
- se comparó cualitativamente la evidencia visual proporcionada por el taller;
- el script GEE está preparado para producir composiciones estacionales comparables y una capa auxiliar de NDVI;
- queda pendiente ejecutar GEE, validar el AOI y revisar las composiciones exportadas.

No afirmes que Sentinel-2 midió mercurio ni que la expansión observada prueba por sí sola que la minería causó todo el incremento. Las imágenes ayudan a evaluar cambios de cobertura y superficie expuesta; las concentraciones de metales proceden de la tabla de monitoreo incluida en el taller.

## 5. Fuentes técnicas

- Catálogo oficial de Sentinel-2 SR Harmonized: https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED
- Guía oficial para exportar imágenes: https://developers.google.com/earth-engine/guides/exporting_images
- Acceso a Earth Engine: https://developers.google.com/earth-engine/guides/access?hl=es-419
