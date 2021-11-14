mapboxgl.accessToken = 'pk.eyJ1IjoicHJpdGlzaDUwOSIsImEiOiJja3YzaTZzNzU0OGIxMzBzNzljdHdhb3g3In0.waaFZiEvtv7mzgcVhs5_Bw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pritish509/ckvc0ze0uczk514p8ylwc7mnh',
});

const afghanBoundsCoordinates = [
  [62.5, 29.318572496],
  [75.1580277851, 38.4862816432]
]

const keyColors = [
  '#590d22',
  '#c9184a',
  '#ff8fa3',
  '#fff0f3'
]

const keyValues = [
  'High',
  'Moderate',
  'Minimal',
  'None'
]

map.getCanvas().style.cursor = 'default';
map.fitBounds(afghanBoundsCoordinates);

map.on('load', () => {
  // Generating legend details
  const legend = document.getElementById('legend-items')

  keyValues.forEach((value, i) => {
    const color = keyColors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    key.style.border = "thin solid black"
    key.style.display = "inline-block"
    key.style.margin = "0px 5px -2px 5px"
  
    const info = document.createElement('span');
    info.className = 'legend-info'
    info.innerHTML = `${value}`;
    
    item.id = `${value}`;
    item.appendChild(key);
    item.appendChild(info);
    legend.appendChild(item);
  });

  // View province wise data
  map.on('mousemove', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['afghanistan-provinces-heat']
    });
    const nameEl = document.getElementById('province-name')
    const detailsEl = document.getElementById('province-details')
    if (features.length) {
      const layerProperties = features[0].properties
      nameEl.innerHTML = `<h3>${layerProperties.NAME}</h3>`
      // Highlighting legend value
      keyValues.forEach((value) => {
        if (value == layerProperties.Influence2009){
          const legendItem = document.getElementById(`${value}`)
          legendItem.style.opacity = 1
        } else {
          const legendItem = document.getElementById(`${value}`)
          legendItem.style.opacity = 0.2
        }
      })
    } else {
      nameEl.innerHTML = '<p style="text-align: center; margin-top: 3.5em;">Touch or hover over province to view details</p>'
      keyValues.forEach((value) => {
        const legendItem = document.getElementById(`${value}`)
        legendItem.style.opacity = 1
      })
      map.fitBounds(afghanBoundsCoordinates);
    }
  });
});