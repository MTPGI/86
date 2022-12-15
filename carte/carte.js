var map = L.map('mymap', {
  zoomSnap: 0.5
}).setView([46.60090935180355, 0.5818611371071515], 9.5);

var 
light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 9.5,
  maxZoom: 18
}),
geom = {
  "type":"Polygon",
  "coordinates":[[[0.192947,46.070849],[0.170288,46.184109],[0.08377,46.277208],[-0.019226,46.637651],[-0.131836,46.832483],[-0.213547,47.114533],[-0.028152,47.09537],[0.045319,47.14443],[0.275345,47.05609],[0.324097,46.942762],[0.599442,46.961979],[0.644073,46.971819],[0.911179,46.682421],[0.902252,46.593316],[1.154938,46.501701],[1.218796,46.370148],[0.803375,46.087043],[0.192947,46.070849]]]
},
boundaryLayer = L.TileLayer.BoundaryCanvas.createFromLayer(light, {
  boundary: geom, 
  trackAttribution: true
}).addTo(map);



var popmaps = function(feature, layer) {
  var prop = feature.properties,
    popUp = '<h2>' + prop.title + '</h2>' +
    '<div class="desc">' + (prop.description || '').replace(/\[\[(.+?)\|(.+?)\]\]/gi, '<a href="$1">$2</a>') + '</div>' +
    '<div class="num">' + (prop.phone || '').replace(/\[\[(.+?)\|(.+?)\]\]/gi, '<a href="$1">$2</a>').replace(/(?:\+33|0)([0-9 ]{3,})/g, '<a href="tel:+33$1">0$1</a>').replace(/0([0-9])([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/g, '0$1 $2 $3 $4 $5') + '</div>' +
    '<div class="mail">' + (prop.email || '').replace(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi, '<a href="mailto:$1">$1</a>') + '</div>' +
    '<div class="web">' + (prop.url || '').replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi, '<a href="$1">$1</a>') + '</div>' +
    '<div class="loc">' + (prop.address || '') + '</div>' +
    '<div class="bus">' + (prop.bus || '') + '</div>' +
    '<div class="park">' + (prop.park || '') + '</div>' +
    '<div class="acc">' + (prop.accessible || '') + '</div>' +
    '<div class="fb">' + (prop.facebook || '').replace(/(?:https?:\/\/www\.facebook\.com\/)?@?([a-zé_0-9-.]+)\/?/gi, '<a href="https://www.facebook.com/$1">@$1</a>') + '</div>' +
    '<div class="tw">' + (prop.twitter || '').replace(/(?:https?:\/\/www\.twitter\.com\/)?@?([a-z_0-9-.]+)\/?/gi, '<a href="https://www.twitter.com/$1">@$1</a>') + '</div>' +
    '<div class="ig">' + (prop.instagram || '').replace(/(?:https?:\/\/www\.instagram\.com\/)?@?([a-z_0-9-.]+)\/?/gi, '<a href="https://www.instagram.com/$1">@$1</a>') + '</div>' +
    '<div class="yt">' + (prop.youtube || '').replace(/\[\[(.+?)\|(.+?)\]\]/gi, '<a href="$1">$2</a>') + '</div>' +
    '<div class="sc">' + (prop.soundcloud || '').replace(/\[\[(.+?)\|(.+?)\]\]/gi, '<a href="$1">$2</a>') + '</div>' +
    '<div class="prix">' + (prop.prix || '') + '</div>' +
    '<div class="conv">' + (prop.conv || '') + '</div>' +
    '<div class="lng">' + (prop.language || '') + '</div>' +
    '<div class="info">' + (prop.info || '').replace(/\[\[(.+?)\|(.+?)\]\]/gi, '<a href="$1">$2</a>') + '</div>' +
    '<div class="avis">' + (prop.avis || '').replace(/\[\[(.+?)\|(.+?)\]\]/gi, '<a href="$1">$2</a>') + '</div>';
  layer.bindPopup(String(popUp));
},
main = L.geoJson(geojson, {
  pointToLayer: function(feature, latlng) {
    var icon = L.divIcon({
      iconSize: [35,35],
      iconAnchor: [17,35],
      className: 'm-' + (feature.properties.category || "default"),
      popupAnchor: [0,0],
      html: '<div class="marker-pin"></div><div class="shadow"></div>'
    });
    return L.marker(latlng, {
      icon: icon,
      riseOnHover: true
    });
  },
  onEachFeature: popmaps
}).addTo(map);

var command = L.control({position: 'topright'});

command.onAdd = function() {
  var div = L.DomUtil.create('div', 'command');
  div.innerHTML += '<h3>Filtrer</h3>'
  + '<label for="exit-command" class="lab"><input type="checkbox" id="exit-command" /></label>'
  + '<label for="m-menses"><input id="m-menses" type="checkbox" class="chk-filter" checked />Boîtes à don menstruelles</label>'
  + '<label for="m-host"><input id="m-host" type="checkbox" class="chk-filter" checked />Hébergement</label>'
  + '<label for="m-testing"><input id="m-testing" type="checkbox" class="chk-filter" checked />Dépistage IST</label>'
  + '<label for="m-doctor"><input id="m-doctor" type="checkbox" class="chk-filter" checked />Soignant&middot;es</label>'
  + '<label for="m-sport"><input id="m-sport" type="checkbox" class="chk-filter" checked />Sport</label>'
  + '<label for="m-activism"><input id="m-activism" type="checkbox" class="chk-filter" checked />Militer</label>'
  + '<label for="m-health"><input id="m-health" type="checkbox" class="chk-filter" checked />Santé</label>'
  + '<label for="m-culture"><input id="m-culture" type="checkbox" class="chk-filter" checked />Culturel</label>'
  + '<label for="m-support"><input id="m-support" type="checkbox" class="chk-filter" checked />Groupe de parole</label>'
  + '<label for="m-official"><input id="m-official" type="checkbox" class="chk-filter" checked />Élues</label>'
  + '<label for="m-solidarity"><input id="m-solidarity" type="checkbox" class="chk-filter" checked />Solidarité</label>'
  + '<label for="m-right"><input id="m-right" type="checkbox" class="chk-filter" checked />Droit & Justice</label>'
  return div;
};
command.addTo(map);

document.addEventListener('click', (e) => {
  if ('chk-filter' == e.target.className) {
    var el = document.getElementsByClassName(e.target.id);
    if (e.target.checked) {
      [...el].forEach(x => (x.style.display = 'block'));
    } else {
      [...el].forEach(x => (x.style.display = 'none'));
    }
  }
  if ('exit-command' == e.target.id) {
    document.querySelector('.command').classList.toggle('hide')
    document.querySelector('.lab').classList.toggle('down')
  }
}, false);
