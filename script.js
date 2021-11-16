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
  'afghanistan-provinces-2009',
  'afghanistan-provinces-2012'
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
  
  // View province wise data
  map.on('mousemove', (event) => {
    // const currentLayer = 'afghanistan-provinces-2012'
    const activeButton = document.getElementsByClassName('active')
    const currentLayer = activeButton[0].getAttribute("id")

    const features = map.queryRenderedFeatures(event.point, {
      layers: [currentLayer]
    });
    const nameEl = document.getElementById('province-name')
    const detailsEl = document.getElementById('province-details')
    if (features.length) {
      const layerProperties = features[0].properties
      const provinceName = layerProperties.NAME
      var talibanInfluence = '';
      switch (currentLayer) {
        case 'afghanistan-provinces-2009':
          talibanInfluence = layerProperties.Influence2009;
          break;
        case 'afghanistan-provinces-2012':
          talibanInfluence = layerProperties.Influence2012;
          break;
        default:
          talibanInfluence = 'None';
      }
      // console.log(talibanInfluence)

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
    if (id == 'afghanistan-provinces-2009') {
      link.className = 'button active';
    } else link.className = 'button';

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

      layerIds.forEach((id) => {
        if (id === clickedLayer) {
          map.setLayoutProperty(
            clickedLayer,
            'visibility',
            'visible'
          );
          this.className = 'button active';
        } else {
          const otherLayerBtn = document.getElementById(id)
          otherLayerBtn.className = 'button'
          map.setLayoutProperty(id, 'visibility', 'none');
        }
      })
      // Toggle layer visibility by changing the layout object's visibility property.
    };
  };
})