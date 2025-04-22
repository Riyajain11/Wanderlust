
if (listing && listing.geometry && listing.geometry.coordinates) {
    const lat = listing.geometry.coordinates[1];
    const lng = listing.geometry.coordinates[0];

    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    L.marker([lat, lng], { icon: redIcon })
        .addTo(map)
        .bindPopup(`
            <h4>${listing.title}</h4>
            <p>Exact location provided after booking!</p>
        `)
        .openPopup();
}

