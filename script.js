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
  '#840128',
  '#e41b1e',
  '#fdafaf',
  '#ffffff'
]

const keyValues = [
  'High',
  'Moderate',
  'Minimal',
  'None'
]

const layerIds = [
  'afghanistan-provinces-2012', 
  'afghanistan-provinces-2009'
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
    key.style.border = 'thin solid black'
    key.style.display = 'inline-block'
    key.style.margin = '0px 5px -2px 5px'
  
    const info = document.createElement('span');
    info.className = 'legend-info'
    info.innerHTML = `${value}`;
    
    item.id = `${value}`;
    item.appendChild(key);
    item.appendChild(info);
    legend.appendChild(item);
  });

  // Toggling Layer (Work In Progress!)
  const visibleLayer = (() => {  
    for (const id of layerIds) {
      // Skip layers that already have a button set up.
      if (document.getElementById(id)) {
        continue;
      }
      // Create a link.
      const link = document.createElement('a');
      link.id = id;
      link.href = '#';
      link.textContent = id.split("-")[2];
      link.className = 'button';

      const layers = document.getElementById('layer-toggles');
      layers.appendChild(link);

      link.onclick = function (e) {
        const clickedLayer = this.id;
        e.preventDefault();
        e.stopPropagation();
         
        const visibility = map.getLayoutProperty(
          clickedLayer,
          'visibility'
        );
        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = 'button';
        } else {
          this.className = 'button active';
          map.setLayoutProperty(
            clickedLayer,
            'visibility',
            'visible'
          );
        }
      };
    
    };
    return 'afghanistan-provinces-2009'
  })()
  
  // View province wise data
  map.on('mousemove', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: [visibleLayer]
    });
    const nameEl = document.getElementById('province-name')
    const detailsEl = document.getElementById('province-details')
    console.log(visibleLayer)
    if (features.length) {
      const layerProperties = features[0].properties
      const provinceName = layerProperties.NAME
      var talibanInfluence = '';
      switch (visibleLayer) {
        case 'afghanistan-provinces-2009':
          talibanInfluence = layerProperties.Influence2009;
          break;
        case 'afghanistan-provinces-2012':
          talibanInfluence = layerProperties.Influence2012;
          break;
        default:
          talibanInfluence = 'None';
      }
      console.log(talibanInfluence)

      nameEl.innerHTML = `<h3>${provinceName}</h3>`
      // Highlighting legend value
      keyValues.forEach((value) => {
        const legendItem = document.getElementById(`${value}`)
        if (value == talibanInfluence){
          legendItem.style.opacity = 1;
        } else legendItem.style.opacity = 0.2;
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

map.on('idle', () => {
  const layer1 = 10;
})