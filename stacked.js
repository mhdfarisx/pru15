function stacked() {
    
    const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

d3.csv('clean_resultPru15_latest.csv')
    .then(csv => {

        fields = csv.columns;
        dataset = csv;
        console.log(fields)
        console.log(dataset)


        stackedBar(dataset)




    });


function stackedBar(data) {



    filterValues = data.filter(data => data.status == 'MENANG')
    //console.log(filterValues)
    filterParti = filterValues.filter(data => data.parti == 'PH' || data.parti == 'PN' || data.parti == 'BN' || data.parti == 'GPS' || data.parti == 'GRS' || data.parti == 'BEBAS')
    console.log('fiterParti', filterParti)


    var updated_groupParti = d3.groups(filterParti, d => d['parti'])
        .map(d => {
            return {
                parti: d[0],
                value: d[1].length
            }
        });

    console.log(updated_groupParti)

    var groupedParti = d3.groups(filterValues, d => d['parti'])
        .map(d => {
            return {
                parti: d[0],
                value: d[1]
            }
        });

    console.log(groupedParti)


    var ph = 0
    var pn = 0
    var dll = 0



    var sortedParti = groupedParti
        .sort((a, b) => {
            return d3.descending(a.value, b.value)  // sort by descending name
        });
    console.log('sorting', sortedParti)

    pos_x = 0

    sortedParti.forEach((d, i) => {
        d.x = pos_x
        d.y = i
        d.width = 100

    })

    

    console.log('sorted', sortedParti)




    var prevData = 0

    var tooltip = d3.select("#div_tooltip")
        .style("opacity", 0)
        .style("background-color", "#d5d5d5")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("pointer-events", "none")



    d3.select(".stacked_bar")
        .selectAll('.stacked')
        .data([{ data: sortedParti }])
        .join('div')
        .attr('class', 'stacked')

        .call(sel => {



            sel.selectAll('.svg1')
                .data(d => [d])
                .join('svg')
                .attr('class', 'svg1')
                .attr('width', 1000)
                .attr('height', 200)
                .selectAll('g')
                .data(d => [d])
                .join('g')
                .call(sel => {

                    sel.selectAll("svg2")  // if u just put svg without dot, means it is an element then no need attr for class
                        .data(d => [d])
                        .join('svg')
                        .attr('class', 'svg2')
                        //.attr('viewBox', [0,0,width,height])
                        .attr("width", 1000)
                        .attr("height", 500)
                        .selectAll('g')
                        .data(d => d.data)
                        .join('g')
                        .attr("transform", d => "translate(" + width / 10 + "," + 42 + ")") // translate is to position the elements in svg
                        .call(sel => {  // text-barchart-text
                            // the logic here is that you have to put the height of the bar outside the transition,delay,duration so that 
                            // it can only do for width of the bar
                            //// this is for the barchart
                            
                                    

                                    sel.selectAll('.rectbar')
                                        .data(d => [d])
                                        .join('rect')
                                        .attr('class', 'rectbar')
                                        .attr("transform", "translate(" + 20 + "," + 10 + ")")
                                        //.attr('y', d=>d.y*42)
                                        .attr('x', (d,i)=>{

                                                let pos = {
                                                PH:0,
                                                PAS:181,
                                                PN:76,
                                                BN:128,
                                                GPS:158,
                                                GRS:203,
                                                MUDA: 219,
                                                DAP:209,
                                                WARISAN:214,
                                                PBM:221,
                                                KDM:220,
                                                BEBAS:217

                                                };
                                                console.log(d.parti)
                                                return pos[d.parti]*4
                                            
                                            })
                                        .attr('fill', function (d) { return colorParti(d) })
                                        .attr('height', function (d, i) {
                                            prevData = prevData + d.value
                                           // console.log(prevData)
                                            return d.width
                                        })
                                        .on("mouseover", function (e, d) {

                                            d3.select(this)
                                                .style("stroke", "black")
                                                .style("stroke-width", 2)
                                                .style("opacity", 1)


                                            tooltip
                                                .style("opacity", 1)
                                        })
                                        .on("mousemove", function (e, d) {

                                            d3.select(this)
                                                .style("opacity", 1)
                                                .transition()
                                                .transition()
                                                .ease(d3.easeBounce)
                                                .duration(500)
                                                .attr('rx', 10)
                                                .attr('ry', 10)



                                            tooltip
                                                .html('<img src="parti_logo/' + d.parti.toLowerCase() + '.png" />'
                                                 + '<br />' +
                                                    "PARTI: " + d.parti +
                                                    "<br>" + "KERUSI: " + d.value.length)
                                                .style("left", (e.pageX + 20) + "px")
                                                .style("top", (e.pageY - 40) + "px")

                                        })
                                        .on("mouseout", function (e, d) {
                                            d3.select(this)
                                                .style("stroke-width", "0px")
                                                .style("opacity", 0.8)
                                                .transition()
                                                .ease(d3.easeBounce)
                                                .duration(500)
                                                .attr('rx', 0)
                                                .attr('ry', 0)

                                            tooltip
                                                .style("opacity", 0)
                                            //.style('display', 'none')
                                        })
                                        .on('click', kerusiMenang)
                                       // .text(d=>console.log(d))
                                        .style("opacity", 0.8)
                                        .style('cursor','pointer')
                                        // .transition()
                                        // .delay(function (d,i){ return i * 1000;})
                                        // .duration(1000)
                                        .attr('width', d => d.value.length * 4)

                                

                        })
                })
        })


}

  
function kerusiMenang(e,k) {



    let active = !d3.select(this).classed('active'); // toggle
  

            d3.select(this).classed('active', active);

            d3.select('.con')
                .selectAll('.menang')
                .data(active ? k.value : []) // if the active is true then return k.value, if false return empty array
                .join('div')
                .attr('class','menang')
                .attr('height', 1500)
                .attr('width', 1000)
                .style('border-top','1px solid #cccccc80')
                .style('padding','10px')
              
                .call(sel=>{

                
                    sel.selectAll('.imgParti')
                                .data(d=>[d])
                                .join('img')
                                .attr('class', 'imgParti')
                                .attr('src',d=> 'parti_logo/'+d.parti.toLowerCase()+'.png')
                                .html(d=> console.log(d))
                                .style('max-width','80px')
                                .style('max-height','60px')
                                .style('border', '2px solid black')
                                .style('margin', '10px')

                
                    sel.selectAll('parlimen-container')
                        .data(d=>[d])
                        .join('div')
                        .attr('class', 'parlimen-container')
                        .call(sel=>{

                            sel.selectAll('.parlimen-label')
                                .data(d=> [d])
                                .join('div').attr('class','parlimen-label')
                            //.attr("transform", d => "translate(" + width / 2 + "," + 10 + ")")
                        // .attr("transform", d => "translate(" + width + "," + d.index*20 + ")")
                                // .style('cursor','pointer')
                                //.style('margin-left','48px')
                                // .style('padding','6px')
                                // .style('background-color', 'black')
                                .html(d=>d.parlimen)

                        })
                    //=====================
                    //  parlimen-label
                    //=====================
                   

                })

    }
    function colorParti(d) {
        if(d.parti == 'PN'){
            return '#043253'
        }
        if(d.parti == 'PH'){
            return '#D7292F'
        }
        if(d.parti == 'MUDA'){
            return 'black'
        }
        if(d.parti == 'BN'){
            return '#031A93'
        }
        if(d.parti == 'PAS'){
            return '#6CB332'
        }
        if(d.parti == 'GPS'){
            return '#1F2C45'
        }
        if(d.parti == 'DAP'){
            return '#E30911'
        }
        if(d.parti == 'GRS'){
            return '#6285a8'
        }
        if(d.parti == 'BEBAS'){
            return '#993300'
        }
        if(d.parti == 'WARISAN'){
            return '#5BC5F0'
        }
        if(d.parti == 'PBM'){
            return '#323467'
        }
        if(d.parti == 'KDM'){
            return '#EB7389'
        }
    }
}
