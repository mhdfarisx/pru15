function map() {
    var mymap = L
        .map('mapid')
        .setView([4.2105, 109.5], 6);


    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 8,
    }).addTo(mymap);

    Promise.all([
        d3.json('malaysia_parlimen.geojson'),
        d3.csv('clean_resultPru15.csv')

    ]).then(data => {



        var parlimen = data[0]
        var dataP = data[1]

        console.log(parlimen.features)

        features = parlimen.features

        var parlimenW = dataP.filter(d => d.status == "MENANG")
        // 1 parlimen is missing padang serai

        parlimenW.forEach((k, i) => {

            if (k.parti == "PAS") {
                k.parti = "PN"
            }
            if (k.parti == "DAP") {
                k.parti = "PH"
            }
            if (k.parti == "MUDA") {
                k.parti = "PH"
            }
        })

        parlimenW.forEach((k, l) => {

            if (k.parti == "GPS") {
                k.color = "rgb(177, 72, 210)"
            }
            if (k.parti == "PN") {
                k.color = "rgb(0, 49, 82)"
            }
            if (k.parti == "PH") {
                k.color = "rgb(216, 35, 43)"
            }
            if (k.parti == "BN") {
                k.color = "rgb(0, 0, 128)"
            }
            if (k.parti == "MUDA") {
                k.color = "#252525"
            }
            if (k.parti == "BEBAS") {
                k.color = "rgb(255, 63, 171)"
            }
            if (k.parti == "GRS") {
                k.color = "rgb(0, 146, 233)"
            }
            if (k.parti == "WARISAN") {
                k.color = "rgb(95, 170, 195)"
            }
            if (k.parti == "KDM") {
                k.color = "rgb(255,0,0)"
            }
            if (k.parti == "PBM") {
                k.color = "rgb(17, 17, 57)"
            }

        })

        console.log('parW', parlimenW)


        features.forEach((d, i) => {

            var par = d.id.substring(2, 6)
            var parid = parseInt(par)

            d.parid = parid

            parlimenW.forEach((k, l) => {

                if (parid == k.parid) {
                    console.log(k.color)
                    d.color = k.color
                    d.calon = k.nama_calon
                    d.parlimen = k.parlimen
                    d.total = k.total
                    d.jumlah_undian = k.jumlah_undian
                    d.parti = k.parti
                }


            })

        })


        console.log('faetures', features)

        var Tooltip = d3.select(".tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute")
            .style("pointer-events", "none")


        var geojsonLayer = L.geoJSON().addTo(mymap);

        geojsonLayer.addData(parlimen);

        var paths = geojsonLayer.getLayers().forEach(function (layer) {


            d3.select(layer._path)
                .style("stroke", "#252525")
                .style("stroke-width", 1)
                .style("opacity", 1)
                .style("fill", layer.feature.color)
                .style("fill-opacity", 0.9)


            var data = layer.feature

            layer.on('click', function (event) {

                var parti = '<img src="parti_logo/' + data.parti.toLowerCase() + '.png"/>'
                var popup = L.popup({
                    closeButton: false,

                })
                    .setLatLng(event.latlng)
                    .setContent(
                        '<div class="container">' +
                        `<div class="h3">${data.id.toUpperCase()}</div>` + '<br />' + `<div class="logo">${parti}</div>`
                        + `<div class="parti">${data.parti}</div>` + '</br >' + `<div class="calon">${data.calon}</div>`
                        + '</div>'
                    )

                    .openOn(mymap);

            })





        });

    })



}
