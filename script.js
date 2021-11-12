mapboxgl.accessToken = 'pk.eyJ1IjoicHJpdGlzaDUwOSIsImEiOiJja3YzaTZzNzU0OGIxMzBzNzljdHdhb3g3In0.waaFZiEvtv7mzgcVhs5_Bw';
const map = new mapboxgl.Map({
  container: 'map',
  // Replace YOUR_STYLE_URL with your style URL.
  style: 'mapbox://styles/pritish509/ckvc0ze0uczk514p8ylwc7mnh',
});


map.getCanvas().style.cursor = 'default';
map.fitBounds([
  [60.5284298033, 29.318572496],
  [75.1580277851, 38.4862816432]
]);


// let hoveredStateId = null;

// map.on('load', () => {
//   map.addSource('provinces', {
//     type: 'vector',
//     // Use any Mapbox-hosted tileset using its tileset id.
//     // Learn more about where to find a tileset id:
//     // https://docs.mapbox.com/help/glossary/tileset-id/
//     url: 'mapbox://pritish509.c55vhtbv'
//   });

//   map.addLayer({
//     'id': 'province-fills',
//     'type': 'fill',
//     'source': 'provinces',
//     'source-layer': 'afghanistan-provinces-bx5pi6',
//     'layout': {},
//     'paint': {
//       'fill-color': '#627BC1',
//       'fill-opacity': [
//         'case',
//         ['boolean', ['feature-state', 'hover'], false],
//         1,
//         0.5
//       ]
//     }
//   });


//   map.addLayer({
//     'id': 'province-line',
//     'type': 'line',
//     'source': 'provinces',
//     'source-layer': 'afghanistan-provinces-bx5pi6',
//     'layout': {},
//     'paint': {
//       'line-color': 'black',
//       'line-width': 1.5
//     }
//   });


//   map.on('mousemove', 'province-fills', (e) => {
//     const features = map.queryRenderedFeatures(e.point);

//     // Limit the number of properties we're displaying for
//     // legibility and performance
//     const displayProperties = [
//       'type',
//       'properties',
//       'id',
//       'layer',
//       'source',
//       'sourceLayer',
//       'state'
//     ];

//     hoveredStateId = e.features[0].id;
//     map.setFeatureState( {source: 'provinces', sourceLayer: 'afghanistan-provinces-bx5pi6' , id: hoveredStateId}, { hover: true });

//     const displayFeatures = features.map((feat) => {
//       const displayFeat = {};
//       displayProperties.forEach((prop) => {
//         displayFeat[prop] = feat[prop];
//       });
//       return displayFeat;
//     });
    
//     document.getElementById('features').innerText = JSON.stringify(displayFeatures[0]);
//   });


//   map.on('mousemove', 'state-fills', (e) => {
//     if (e.features.length > 0) {
//       if (hoveredStateId !== null) {
//         map.setFeatureState(
//           { source: 'states', 
//           sourceLayer: 'afghanistan-provinces-bx5pi6', 
//           id: hoveredStateId},
//           { hover: false }
//         );
//       }
//       hoveredStateId = e.features[0].id;
//       map.setFeatureState(
//         { source: 'states', 
//           sourceLayer: 'afghanistan-provinces-bx5pi6', 
//           id: hoveredStateId},
//           { hover: true }
//       );
//     }
//   });
     
//     // When the mouse leaves the state-fill layer, update the feature state of the
//     // previously hovered feature.
//   map.on('mouseleave', 'state-fills', () => {
//     if (hoveredStateId !== null) {
//       map.setFeatureState(
//         { source: 'states', 
//         sourceLayer: 'afghanistan-provinces-bx5pi6', 
//         id: hoveredStateId},
//         { hover: false }
//       );
//     }
//     hoveredStateId = null;
//   });
  
// });
map.on('mousemove', (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['afghanistan-provinces-heat']
  });

  const detailsEl = document.getElementById('province-details')
  if (features.length) {
    const layerProperties = features[0].properties
    detailsEl.innerHTML = `<p>Province Name - ${layerProperties.NAME}</p>
    <p>Taliban Influence Level - ${layerProperties.Influence2009}</p>`
  } else {
    detailsEl.innerHTML = '<p style="text-align: center;">Touch or hover over province to view details</p>'
    map.fitBounds([
      [60.5284298033, 29.318572496],
      [75.1580277851, 38.4862816432]
    ]);
  }
});