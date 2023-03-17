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
        d3.csv('clean_resultPru15_latest.csv')

    ]).then(data => {



        var parlimen = data[0]
        var dataP = data[1]

        console.log(parlimen.features)

        features = parlimen.features

        var parlimenW = dataP.filter(d => d.status == "MENANG")


        parlimenW.forEach((d, l) => {

            if(d.parti == 'PN'){
            d.color = '#043253'
            }
            if(d.parti == 'PH'){
                 d.color = '#D7292F'
            }
            if(d.parti == 'MUDA'){
                 d.color = 'black'
            }
            if(d.parti == 'BN'){
                 d.color = '#031A93'
            }
            if(d.parti == 'PAS'){
                 d.color = '#6CB332'
            }
            if(d.parti == 'GPS'){
                 d.color = '#1F2C45'
            }
            if(d.parti == 'DAP'){
                 d.color = '#E30911'
            }
            if(d.parti == 'GRS'){
                 d.color = '#6285a8'
            }
            if(d.parti == 'BEBAS'){
                 d.color = '#993300'
            }
            if(d.parti == 'WARISAN'){
                 d.color = '#5BC5F0'
            }
            if(d.parti == 'PBM'){
                 d.color = '#323467'
            }
            if(d.parti == 'KDM'){
                 d.color = '#EB7389'
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
