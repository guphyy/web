function createGraph(id, fData){  
//This function creates a chart with the data of fData at the specified ID
    var barColor = 'Navy';
    
    function setColor(values){
        //Match different types of data with different colors
        return {less250:"#807dba", more250:"#e08214",all:"#41ab5d"}[values];
    }

    fData.forEach(element => {
        element.all = element.freq.less250 + element.freq.more250 + element.freq.total;
    });

    function createHistogram(data){
        var HG_width = 1200;
        var HG_height = 800;
        var HGsvg = d3.select(id).append('svg')
            .attr('width', HG_width)
            .attr('height', HG_height)
            .append('g')
            .attr('transfrom', 'translate(' + 0 + ',' + 60 +')');

        var xScale = d3.scale.ordinal([0, HG_width], 1)//Construct an ordinal scale
                .domain(data.map(function(e) {
                    return e[0];
                }));
                
        HGsvg.append('g').attr('class', 'x_axis')
                .attr('transfrom', 'translate(0,' + HG_height + ')')
                .call(d3.svg.axis().scale(xScale).orient('bottom'));
        
        var yScale = d3.scaleBand.linear().range([HG_height, 0])
                    .domain([0, d3.max(data, function(e){
                        return e[1];
                    })]);

        var bars = HGsvg.selectAll('.bar').data(data).enter()
                    .append('g').atrr('class', 'bar');


        // two function of mouse
        function mouseOver(e){
            var temp = fData.filter(function(e) {
                return e.State == e[0];
            })[0];
            var newData = d3.keys(temp.freq).map(function(e){
                return {type:e, freq:temp.freq[e]};
            });
            pieChr.update(newData);
            legend_tag.update(newData);

        }

        function mouseOut(e){
            pieChr.update(newData);
            legend_tag.update(newData)
        }

        // create retangles
        bars.append('rect')
            .attr('x', function(e){
                return xScale(e[0]);
            })
            .attr('y', function(e){
                return yScale(e[0]);
            })
            .attr('width', xScale.rangeBand())
            .attr('height', function(e){
                return HG_height - yScale(e[1]);
            })
            .attr('fill', barColor)
            .on('mouseOver', mouseOver)
            .on('mouseOut', mouseOut);

        bars.append('text').text(function(e){
            return d3.format(',')(e[1])
        })
        .attr('x', function(e){
            return xScale(e[0]) + xScale.rangeBand() / 2;  //////////
        })
        .attr('y', function(e) {
            return yScale(e[1]) - 5;
        })
        .attr('text-anchor', 'middle')


        // function of update the bars.
        var hGbars = {};
        hGbars.update = function(newData, color){
            yScale.domain([0, d3.max(newData, function(e) {
                return e[1];
            })]);

            var bars = HGsvg.selectAll('.bar').data(newData);
            bars.select('rect').transition().duration(500) //set duration
                .attr("yScale", function(e){
                    return yScale(e[1]);
                })
                .attr('height', function(e) {
                    return HG_height - yScale(e[1]);
                })
                .attr('fill', color);

            bars.select('text').transition().duration(500)
                .text(function(e){
                    return d3.format(',')(e[1])
                })
                .attr('yScale', function(e) {
                    return yScale(e[1]) - 5;
                });
        }
        return hGbars
    }

    
}


var freqData=[
    {State:'Mining And Quarrying',freq:{less250:15, more250:13, all:28}}
   ,{State:'Manufacturing',freq:{less250:1785, more250:1370, all:3155}}
   ,{State:'Water Supply,Sewerage, Waste Management\n And Remediation Activities',freq:{less250:130, more250:71, all:201}}
   ,{State:'Construction',freq:{less250:722, more250:312, all:1034}}
   ,{State:'Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles',freq:{less250:1819, more250:1180, all:2999}}
   ,{State:'Accommodation And Food Service Activities',freq:{less250:975, more250:659, all:1634}}
   ,{State:'Transportation And Storage',freq:{less250:528, more250:335, all:863}}
   ,{State:'Information And Communication',freq:{less250:794, more250:422, all:1216}}
   ,{State:'Real Estate Activities',freq:{less250:112, more250:88, all:200}}
   ,{State:'Professional, Scientific And Technical Activities',freq:{less250:1303, more250:720, all:2023}}
   ,{State:'Administrative And Support Service Activities',freq:{less250:1287, more250:1072, all:2359}}
   ,{State:'Education',freq:{less250:303, more250:457, all:760}}
   ,{State:'KHuman Health And Social Work Activities',freq:{less250:145, more250:149, all:294}}
   ,{State:'Arts, Entertainment And Recreation',freq:{less250:415, more250:303, all:718}}
   ,{State:'Other Service Activities',freq:{less250:108, more250:29, all:137}}
   //,{State:'All Industries',freq:{less250:10442, more250:7181, all:17623}}
   ];
   
   createGraph('#dashboard',freqData);