// This token will not work for anyone else, please generate your own token to access Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicHJpdGlzaDUwOSIsImEiOiJja3YzaTZzNzU0OGIxMzBzNzljdHdhb3g3In0.waaFZiEvtv7mzgcVhs5_Bw';

const map = new mapboxgl.Map({
  container: "map",
  style: 'mapbox://styles/pritish509/ckvc0ze0uczk514p8ylwc7mnh',
});

const afghanBoundsCoordinates = [
  [58.5506, 27.062],
  [80.5703, 39.3044],
];

const keyColors = ["#840128", "#e41b1e", "#fdafaf", "#ffffff"];

const keyValues = ["High", "Moderate", "Minimal", "None"];

const layerIds = ["afghanistan-provinces-2009", "afghanistan-provinces-2012"];

map.getCanvas().style.cursor = "default";
map.fitBounds(afghanBoundsCoordinates);

map.on("load", () => {
  // Generating legend details
  const legend = document.getElementById("legend-items");

  keyValues.forEach((value, i) => {
    const color = keyColors[i];
    const item = document.createElement("div");
    const key = document.createElement("span");
    key.className = "legend-key";
    key.style.backgroundColor = color;
    key.style.border = "thin solid black";
    key.style.display = "inline-block";
    key.style.margin = "0px 5px -2px 5px";

    const info = document.createElement("span");
    info.className = "legend-info";
    info.innerHTML = `${value}`;

    item.id = `${value}`;
    item.appendChild(key);
    item.appendChild(info);
    legend.appendChild(item);
  });

  // View province wise data
  map.on("mousemove", (event) => {
    // fetching the user chosen layer from buttons
    const activeButton = document.getElementsByClassName("active");
    const currentLayer = activeButton[0].getAttribute("id");

    // Querying the features of the chosen layer
    const features = map.queryRenderedFeatures(event.point, {
      layers: [currentLayer],
    });
    const nameEl = document.getElementById("province-name");
    const detailsEl = document.getElementById("province-details");
    if (features.length) {
      const layerProperties = features[0].properties;
      const provinceName = layerProperties.NAME;
      let talibanInfluence = null;
      switch (currentLayer) {
        case "afghanistan-provinces-2009":
          talibanInfluence = layerProperties.Influence2009;
          break;
        case "afghanistan-provinces-2012":
          talibanInfluence = layerProperties.Influence2012;
          break;
        default:
          talibanInfluence = "None";
      }
      // Adding fetched layer details to the info table
      nameEl.innerHTML = `<h3>${provinceName}</h3>`;

      // Highlighting legend value
      keyValues.forEach((value) => {
        const legendItem = document.getElementById(`${value}`);
        if (value == talibanInfluence) {
          $(`#${value}`).css("opacity", "1");
        } else $(`#${value}`).css("opacity", "0.2");
      });
    } else {
      nameEl.innerHTML =
        '<p style="text-align: center; margin-top: 3.5em;">Touch or hover over province to view details</p>';
      keyValues.forEach((value) => {
        $(`#${value}`).css("opacity", "1");
      });
      // ensuring that the map frame focuses on Afghanistan only
      map.fitBounds(afghanBoundsCoordinates);
    }
  });
});

// Runs when the last frame of the map has been rendered
map.on("idle", () => {
  for (const id of layerIds) {
    // Skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }
    // Create a link which will act as a button.
    const link = document.createElement("a");
    link.id = id;
    link.href = "#";
    link.textContent = id.split("-")[2];
    // Adding the layer buttons to the button group div element
    const layers = document.getElementById("layer-toggles");
    layers.appendChild(link);
    // Hard-coded, where the base layer from mapbox studio is toggled for button
    if (id == "afghanistan-provinces-2009") {
      $(`#${id}`).addClass("active button");
    } else $(`#${id}`).addClass("button");

    // Toggling layers logic for the created layer buttons
    link.onclick = function (e) {
      const clickedLayer = this.id;
      e.preventDefault();
      e.stopPropagation();

      layerIds.forEach((id) => {
        // Toggle layer visibility by changing the layout object's visibility property.
        if (id === clickedLayer) {
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
          // Setting respective layer button class to active
          $(`#${id}`).addClass("active");
        } else {
          $(`#${id}`).removeClass("active");
          map.setLayoutProperty(id, "visibility", "none");
        }
      });
    };
  }
});
