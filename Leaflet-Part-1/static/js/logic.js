// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create a map object
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
});

// add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Function to determine circle color based on the depth in km 
function getColor(depth){
  switch(true){
      case (depth <= 1):
          return '#f2f0f7';
          break;
      case (depth <= 2):
          return '#dadaeb';
          break;
      case (depth <= 3):
          return '#bcbddc';
          break;
      case (depth <= 4):
          return '#9e9ac8';
          break;
      case (depth <= 5):
          return '#756bb1';
          break;
      case (depth > 5):
          return '#54278f';
          break;
      default:
          return '#cccccc';
          break;
  }
}

// Function to determine circle radius based on the magnitude 
function getRadius(magnitude){
  switch(true){
      case (magnitude <= 1):
          return 3;
          break;
      case (magnitude <= 2):
          return 7;
          break;
      case (magnitude <= 3):
          return 11;
          break;
      case (magnitude <= 4):
          return 15;
          break;
      case (magnitude <= 5):
          return 21;
          break;
      case (magnitude > 5):
          return 28;
          break;
      default:
          return 1;
          break;
  }
}  


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  
  L.geoJson(data,{
    pointToLayer: function (feature, latlng) {
        // Create a circle marker
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.mag), // different radius for different magnitude
            fillColor: getColor(feature.geometry.coordinates[2]), // different circle colors for different depths
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer){
        layer.bindPopup(`<span>Earthquake magnitude: ${feature.properties.mag}</span><hr><span>Depth (km): ${feature.geometry.coordinates[2]}</span>`)
    }
}).addTo(myMap);

// Create a legend

var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depth</h4>";
  div.innerHTML += '<i style="background: #f2f0f7"></i><span> Less than 1 km</span><br>';
  div.innerHTML += '<i style="background: #dadaeb"></i><span> Less than 2 km</span><br>';
  div.innerHTML += '<i style="background: #E6E696"></i><span> Less than 3 km</span><br>';
  div.innerHTML += '<i style="background: #E8E6E0"></i><span> Less than 4 km</span><br>';
  div.innerHTML += '<i style="background: #FFFFFF"></i><span> Less than 5 km</span><br>';

  return div;
};

legend.addTo(myMap);

})