mapboxgl.accessToken = 'pk.eyJ1IjoicHJpdGlzaDUwOSIsImEiOiJja3YzaTZzNzU0OGIxMzBzNzljdHdhb3g3In0.waaFZiEvtv7mzgcVhs5_Bw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pritish509/ckvc0ze0uczk514p8ylwc7mnh',
});

map.getCanvas().style.cursor = 'default';
map.fitBounds([
  [60.5284298033, 29.318572496],
  [75.1580277851, 38.4862816432]
]);


map.on('mousemove', (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['afghanistan-provinces-heat']
  });
  const nameEl = document.getElementById('province-name')
  const detailsEl = document.getElementById('province-details')
  if (features.length) {
    const layerProperties = features[0].properties
    nameEl.innerHTML = `<h3>${layerProperties.NAME}</h3>`
    detailsEl.innerHTML = `<p>Taliban Influence Level - ${layerProperties.Influence2009}</p>`
  } else {
    nameEl.innerHTML = '<p style="text-align: center; margin-top: 3.5em;">Touch or hover over province to view details</p>'
    detailsEl.innerHTML = ''
    map.fitBounds([
      [60.5284298033, 29.318572496],
      [75.1580277851, 38.4862816432]
    ]);
  }
});