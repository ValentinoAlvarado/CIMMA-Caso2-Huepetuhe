/******************************************************************************
 CIMMA — CASO 2: SEDIMENTOS | HUEPETUHE, MADRE DE DIOS
 Comparación multitemporal Sentinel-2: estación seca 2017 vs 2025
 Plataforma: Google Earth Engine Code Editor (JavaScript)

 LIMITACIONES IMPORTANTES
 1) El PDF del taller no entrega coordenadas GPS de SD-01 ni un polígono GIS.
 2) El centro y el AOI definidos abajo son PROVISIONALES; compruebe el encuadre
    contra las Figuras 3 y 4 antes de informar resultados como definitivos.
 3) Las imágenes satelitales permiten observar coberturas y superficies expuestas;
    NO miden mercurio/metilmercurio ni prueban por sí solas causalidad.
*******************************************************************************/

// 1) ÁREA DE ESTUDIO PROVISIONAL. Editar cuando se confirme el área de las figuras.
// Este punto es una aproximación de trabajo, no las coordenadas confirmadas de SD-01.
var centroAproximado = ee.Geometry.Point([-70.64672, -12.94895]);
var aoi = centroAproximado.buffer(6000).bounds(); // ventana aprox. 12 x 12 km
Map.centerObject(aoi, 12);
Map.addLayer(aoi, {color: 'yellow'}, 'AOI APROXIMADA — validar antes de informar', false);

// 2) COLECCIÓN: Sentinel-2 Level-2A, reflectancia de superficie armonizada.
var S2 = 'COPERNICUS/S2_SR_HARMONIZED';
var bandas = ['B2', 'B3', 'B4', 'B8', 'B11'];

// Enmascaramiento basado en SCL: píxeles defectuosos, sombra de nube,
// nubes de baja probabilidad/no clasificado, probabilidad media/alta,
// cirros y nieve/hielo. Reflectancia dividida entre 10000.
function prepararSR(img) {
  var scl = img.select('SCL');
  var mascara = scl.neq(1)
    .and(scl.neq(3))
    .and(scl.neq(7))
    .and(scl.neq(8))
    .and(scl.neq(9))
    .and(scl.neq(10))
    .and(scl.neq(11));
  return img.updateMask(mascara)
    .select(bandas)
    .divide(10000)
    .copyProperties(img, ['system:time_start', 'CLOUDY_PIXEL_PERCENTAGE']);
}

// 3) COMPOSICIONES ESTACIONALES COMPARABLES.
// Se usa mayo–septiembre en ambos años (fin exclusivo: 1 de octubre).
function composicionAnual(anio) {
  var inicio = ee.Date.fromYMD(anio, 5, 1);
  var fin = ee.Date.fromYMD(anio, 10, 1);
  var raw = ee.ImageCollection(S2)
    .filterBounds(aoi)
    .filterDate(inicio, fin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 90));

  print('Año ' + anio + ' — escenas Sentinel-2 antes de máscara:', raw.size());
  print('Año ' + anio + ' — fechas de las escenas:', raw.aggregate_array('system:time_start').map(function(t) {
    return ee.Date(t).format('YYYY-MM-dd');
  }));

  var preparada = raw.map(prepararSR);
  print('Año ' + anio + ' — imágenes en la colección:', preparada.size());
  return preparada.median().clip(aoi).set('anio', anio);
}

var img2017 = composicionAnual(2017);
var img2025 = composicionAnual(2025);

// 4) COMPOSICIONES DE BANDAS. Mantener parámetros idénticos entre años.
var visNatural = {
  bands: ['B4', 'B3', 'B2'],
  min: 0.02, max: 0.30, gamma: 1.2
};
var visFalsoColor = {
  bands: ['B11', 'B8', 'B4'],
  min: [0.02, 0.02, 0.015],
  max: [0.35, 0.45, 0.30],
  gamma: 1.1
};

Map.addLayer(img2017, visNatural, '2017 — color natural B4-B3-B2', false);
Map.addLayer(img2025, visNatural, '2025 — color natural B4-B3-B2', true);
Map.addLayer(img2017, visFalsoColor, '2017 — falso color B11-B8-B4', false);
Map.addLayer(img2025, visFalsoColor, '2025 — falso color B11-B8-B4', false);

// 5) NDVI Y DIFERENCIA (2025 menos 2017).
// NDVI ayuda a ver cambios de verdor; puede verse afectado por agua, suelo desnudo,
// sombras residuales y nubes. No usarlo sin validación como área minera cuantificada.
function calcularNDVI(img) {
  return img.normalizedDifference(['B8', 'B4']).rename('NDVI');
}
var ndvi2017 = calcularNDVI(img2017);
var ndvi2025 = calcularNDVI(img2025);
var deltaNDVI = ndvi2025.subtract(ndvi2017).rename('NDVI_2025_menos_2017');

Map.addLayer(ndvi2017,
  {min: -0.2, max: 0.8, palette: ['#8c510a', '#dfc27d', '#f6e8c3', '#80cdc1', '#01665e']},
  'NDVI 2017', false);
Map.addLayer(ndvi2025,
  {min: -0.2, max: 0.8, palette: ['#8c510a', '#dfc27d', '#f6e8c3', '#80cdc1', '#01665e']},
  'NDVI 2025', false);
Map.addLayer(deltaNDVI,
  {min: -0.5, max: 0.5, palette: ['#b2182b', '#f7f7f7', '#1a9850']},
  'Diferencia NDVI (2025 menos 2017)', false);

print('AOI provisional usado:', aoi);
print('NDVI medio 2017 en el AOI:', ndvi2017.reduceRegion({
  reducer: ee.Reducer.mean(), geometry: aoi, scale: 20, maxPixels: 1e9
}));
print('NDVI medio 2025 en el AOI:', ndvi2025.reduceRegion({
  reducer: ee.Reducer.mean(), geometry: aoi, scale: 20, maxPixels: 1e9
}));

// 6) EXPORTACIÓN A GOOGLE DRIVE.
// Ejecuta el script y luego entra en Tasks; pulsa Run en cada exportación elegida.
// Los archivos exportados son GeoTIFF. Las cuatro composiciones son RGB renderizado.
Export.image.toDrive({
  image: img2017.visualize(visNatural),
  description: 'CIMMA_Caso2_Natural_2017',
  folder: 'Caso2_CIMMA', fileNamePrefix: 'Caso2_Natural_B4_B3_B2_2017',
  region: aoi, scale: 10, maxPixels: 1e13, fileFormat: 'GeoTIFF'
});
Export.image.toDrive({
  image: img2025.visualize(visNatural),
  description: 'CIMMA_Caso2_Natural_2025',
  folder: 'Caso2_CIMMA', fileNamePrefix: 'Caso2_Natural_B4_B3_B2_2025',
  region: aoi, scale: 10, maxPixels: 1e13, fileFormat: 'GeoTIFF'
});
Export.image.toDrive({
  image: img2017.visualize(visFalsoColor),
  description: 'CIMMA_Caso2_SWIR_2017',
  folder: 'Caso2_CIMMA', fileNamePrefix: 'Caso2_SWIR_NIR_Rojo_B11_B8_B4_2017',
  region: aoi, scale: 20, maxPixels: 1e13, fileFormat: 'GeoTIFF'
});
Export.image.toDrive({
  image: img2025.visualize(visFalsoColor),
  description: 'CIMMA_Caso2_SWIR_2025',
  folder: 'Caso2_CIMMA', fileNamePrefix: 'Caso2_SWIR_NIR_Rojo_B11_B8_B4_2025',
  region: aoi, scale: 20, maxPixels: 1e13, fileFormat: 'GeoTIFF'
});
// Este quinto archivo conserva los valores numéricos del cambio NDVI (no RGB renderizado).
Export.image.toDrive({
  image: deltaNDVI,
  description: 'CIMMA_Caso2_DeltaNDVI_2025_menos_2017',
  folder: 'Caso2_CIMMA', fileNamePrefix: 'Caso2_DeltaNDVI_2025_menos_2017',
  region: aoi, scale: 10, maxPixels: 1e13, fileFormat: 'GeoTIFF'
});

// FIN DEL SCRIPT
