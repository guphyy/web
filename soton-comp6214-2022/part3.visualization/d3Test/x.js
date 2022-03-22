
function dashboard(id, fData){
    var barColor = 'steelblue';

    function segColor(c){ 
		return {less250:"#807dba", more250:"#e08214",all:"#41ab5d"}[c]; 
	}
    
    // compute total for each state.
    // fData.forEach(function(d){
	// 	d.total=d.freq.less250+d.freq.more250;
	// });
    fData.forEach(element => {
        element.total=element.freq.less250+element.freq.more250;
    })
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={};
        var hGDim = {t: 60, r: 0, b: 30, l: 0};
        var HG_width = 1200 - hGDim.l - hGDim.r;
        var HG_height = 800 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", HG_width)
            .attr("height", HG_height + hGDim.t + hGDim.b)
            .append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, HG_width], 0.2)
                .domain(fD.map(function(e) { 
					return e[0]; 
				}));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + HG_height + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([HG_height, 0])
                .domain([0, 0.6*d3.max(fD, function(d) { 
					return d[1]; 
				})]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g")
                .attr("class", "bar");
        

        function mouseover(e){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ 
                return s.State == e[0];
            })[0],////////////////////////////////////////////
                nD = d3.keys(st.freq).map(function(s){ 
                    return {type:s, freq:st.freq[s]};
                });
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(e){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }
                
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(e) { 
                return x(e[0]); 
            })
            .attr("y", function(e) { 
                return y(e[1]); 
            })
            .attr("width", x.rangeBand())
            .attr("height", function(e) { 
                return HG_height - y(e[1]); 
            })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(e){ 
            return d3.format(",")(e[1])
            })
            .attr("x", function(e) { 
                return x(e[0])+x.rangeBand()/2; 
            })
            .attr("y", function(e) { 
                return y(e[1])-5; 
            })
            .attr("text-anchor", "middle");
        
        
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { 
                return d[1]; 
            })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {
                    return y(d[1]); 
                })
                .attr("height", function(d) { 
                    return HG_height - y(d[1]); 
                })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ 
                    return d3.format(",")(d[1])
                })
                .attr("y", function(d) {
                    return y(d[1])-5; 
                });            
        }        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        //  to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        //  to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(e) { 
            return e.freq; 
        });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(e) { 
                this._current = e; 
            })
            .style("fill", function(e) { 
                return segColor(e.data.type); 
            })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(e){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.State,v.freq[e.data.type]];}),segColor(e.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(e){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
        //////////////// create the table next to piechar ///////////////      
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(e){ 
                return segColor(e.type); 
            });
         
        // create the second column for each segment.
        tr.append("td").text(function(e){ 
            return e.type;
        });

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(e){ 
                return d3.format(",")(e.freq);
            });

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(e){ 
                return getLegend(e,lD);
            });
        /////////////////////////////////////////////////////////////////
        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(e){ 
                return d3.format(",")(e.freq);
            });

            // update the percentage column.
            l.select(".legendPerc").text(function(e){ 
                return getLegend(e,nD);
            });        
        }
        
        function getLegend(e,aD){ // Utility function to compute percentage.
            return d3.format("%")(e.freq/d3.sum(aD.map(function(v){ 
                return v.freq; 
            })));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var tF = ['less250','more250','all'].map(function(e){   //here to control what the piechar show
        return {type:e, freq: d3.sum(fData.map(function(t){ 
            return t.freq[e];
        }))}; 
    });    
    
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(e){ 
        return [e.State,e.total,e.all];
    });
    //Call the constructor together at the end
    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}

function createTable(dataSet){
    var area = document.getElementById("myTable");
    str = [];
    for(i in dataSet){
        //  str.push(dataSet[i].num + ':' + dataSet[i].State + '\n');
        var row = document.createElement('div')
        //row.getAttribute('id', hyy[i]);
        row.innerHTML = dataSet[i].State + ': ' + dataSet[i].Name;
        area.appendChild(row);

    }
    console.log(area)
}
var freqData=[
	 {State:'No.1',Name:'Mining And Quarrying',freq:{less250:15, more250:13, all:28}}
	,{State:'No.2',Name:'Manufacturing',freq:{less250:1785, more250:1370, all:3155}}
	,{State:'No.3',Name:'Water Supply,Sewerage, Waste Management And Remediation Activities',freq:{less250:130, more250:71, all:201}}
	,{State:'No.4',Name:'Construction',freq:{less250:722, more250:312, all:1034}}
	,{State:'No.5',Name:'Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles',freq:{less250:1819, more250:1180, all:2999}}
	,{State:'No.6',Name:'Accommodation And Food Service Activities',freq:{less250:975, more250:659, all:1634}}
	,{State:'No.7',Name:'Transportation And Storage',freq:{less250:528, more250:335, all:863}}
	,{State:'No.8',Name:'Information And Communication',freq:{less250:794, more250:422, all:1216}}
	,{State:'No.9',Name:'Real Estate Activities',freq:{less250:112, more250:88, all:200}}
	,{State:'No.10',Name:'Professional, Scientific And Technical Activities',freq:{less250:1303, more250:720, all:2023}}
	,{State:'No.11',Name:'Administrative And Support Service Activities',freq:{less250:1287, more250:1072, all:2359}}
	,{State:'No.12',Name:'Education',freq:{less250:303, more250:457, all:760}}
	,{State:'No.13',Name:'KHuman Health And Social Work Activities',freq:{less250:145, more250:149, all:294}}
	,{State:'No.14',Name:'Arts, Entertainment And Recreation',freq:{less250:415, more250:303, all:718}}
	,{State:'No.15',Name:'Other Service Activities',freq:{less250:108, more250:29, all:137}}
	//,{State:'All Industries',freq:{less250:10442, more250:7181, all:17623}}
	];

    
	dashboard('#dashboard',freqData);

    createTable(freqData);

    