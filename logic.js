// URL for reported earthquakes in the past week
var jsonurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

d3.json(jsonurl, function(data) {
  // console.log(data)
  createFeatures(data.features);
});

// Create features
function createFeatures(earthquakeData) {

  // Creating geoJSON layers
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "black",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },

      // Adding earthquake tooltips/popups
      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Time: </strong>${Date(feature.properties.time)}`);
      }
    });

    // Send layers to createMap function
  createMap(earthquakes);
}

// CreateMap function 
function createMap(earthquakes) {

  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetMap,
    "Light Map": lightMap
  };

   var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.0902, 95.7129
    ],
    zoom: 2,
    layers: [streetMap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};

// Define colors 
function fillColor(magnitude) {

  switch (true) {
    case magnitude >= 6.0:
      return 'red';
      break;
    
    case magnitude >= 5.0:
      return 'orangered';
      break;

    case magnitude >= 4.0:
      return 'darkorange';
      break;
    
    case magnitude >= 3.0:
      return 'orange';
      break;

    case magnitude >= 2.0:
      return 'gold';
      break;

    case magnitude >= 1.0:
      return 'yellow';
      break;

    default:
      return 'greenyellow';
  };
};

// Defining marker size based on magnitude - slightly inflating for viewability.
function markerSize(magnitude) {
  return magnitude*5;
}