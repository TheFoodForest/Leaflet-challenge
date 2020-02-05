var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


function createMap(earthquakes, faultlines) {
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
        });
    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
        });
    var satelite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
            });

    var baseMaps = {
        'Light Map': lightMap,
        'Dark Map': darkMap,
        'Satellite': satelite
    };
    var overlayMaps = {
        'Earthquakes' : earthquakes,
        "Fault Lines" : faultlines
    };
    
    var myMap = L.map('map', {
        center: [40,-90],
        zoom:3,
        layers:[satelite, earthquakes,faultlines]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed:false
    }).addTo(myMap);
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        // var labels = ['0-1','1-2','2-3','3-4','4-4','5+'];
        // var colors = ['rgb(64, 255, 0)','rgb(191, 255, 0)','rgb(255, 255, 0)','rgb(255, 191, 0)','rgb(255, 128, 0)','rgb(255, 0, 0)'];
        
     
        // Add min & max
        var legendInfo = `
        <table>
        <tr>
            <td class="color" style="background-color: rgb(64, 255, 0);"></td>
            <td>0-1</td>
        </tr>
        <tr>
            <td class="color" style="background-color: rgb(191, 255, 0);"></td>
            <td>1-2</td>
        </tr>
        <tr>
            <td class="color" style="background-color: rgb(255, 255, 0);"></td>
            <td>2-3</td>
        </tr>
        <tr>
            <td class="color" style="background-color: rgb(255, 191, 0);"></td>
            <td>3-4</td>
        </tr>
        <tr>
            <td class="color" style="background-color: rgb(255, 128, 0);"></td>
            <td>4-5</td>
        </tr>
        <tr>
            <td class="color" style="background-color: rgb(255, 0, 0);"></td>
            <td>5+</td>
        </tr>
    </table>`
    
        div.innerHTML = legendInfo;
    
        // labels.forEach(function(label, index) {
        //   div.innerHTML += '<tr> <td style="background-color: ' + colors[index] +';"></td><td>' + label + '</td></tr>';
        // });
    
        // div.innerHTML += "</table>";
       return div;
      };
    
      // Adding legend to the map
      legend.addTo(myMap);
}
function circleZise(mag) {
    if (mag <= 0){
        return 25000;
    }
    else {
    return (25000 * mag);
    }
}
function createMarkers(responce, geoData) {
    var features = responce.features;
    var markers = []
    features.forEach(function(data) {
        if (data.properties.mag > 5) {
            var markerColor = 'rgb(255, 0, 0)';
        }
        else if (data.properties.mag >= 4) {
            var markerColor = 'rgb(255, 128, 0)';
        }
        else if (data.properties.mag >= 3) {
            var markerColor = 'rgb(255, 191, 0)';
        }
        else if (data.properties.mag >= 2) {
            var markerColor = '	rgb(255, 255, 0)';
        }
        else if (data.properties.mag >= 1) {
            var markerColor = 'rgb(191, 255, 0)';
        }
        else {
            var markerColor = 'rgb(64, 255, 0)'
        }
        var utcSeconds = data.properties.time;
        var d = new Date(utcSeconds);
        var formatTime = d3.timeFormat('%m-%d-%Y %H:%M %p');
        var timestamp = formatTime(d);
        markers.push(
            L.circle([data.geometry.coordinates[1],data.geometry.coordinates[0]], {
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.65,
                radius: circleZise(data.properties.mag)
            }).bindPopup(`<b>Magnitude: </b>${data.properties.mag}<br><b>Time: </b>${timestamp}<br><b>Location:</b> ${data.properties.place}`)
        );
    });
    var earthquakes = L.layerGroup(markers);

    var faultlines = L.geoJSON(geoData, {
        style : {
            color: 'orange',
            fillColor:'white',
            fillOpacity: 0,
            weight: 1.5
        }
    });
    createMap(earthquakes, faultlines);

}

var fault = geoDatas
d3.json(url, function(earthquakeData) {

        createMarkers(earthquakeData, geoDatas);
   
});