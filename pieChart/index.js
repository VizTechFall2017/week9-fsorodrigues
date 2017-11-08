var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 0;
var marginTop = 0;

var pieX = width/2;
var pieY = height/2;

var svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var pieGroup = svg.append("g")
                  .attr('transform', 'translate(' + pieX + ',' + pieY + ')');

//set up scales to position circles using the data
var scaleColor = d3.scaleOrdinal().domain(["16-19", "20-24", "25-34", "35-44", "45-54", "55-64","65+"])
                                  .range(["red", "orange", "yellow", "lime", "blue", "purple", "magenta"]);

var nestedData = [];

var pieRadius = 200;

var makeArc = d3.arc()
                .innerRadius(pieRadius - pieRadius)
                .outerRadius(pieRadius);

var makePie = d3.pie()
                .sort(null)
                .value(function(d) { return d.total; });

//import the data from the .csv file
d3.csv('./incomeData.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = dataIn;

    var g = pieGroup.selectAll(".arc")
                    .data(makePie(loadData))
                    .enter()
                    .append("g")
                    .attr("class", "arc");

            g.append("path")
              .attr("d", makeArc)
              .attr("fill", function(d) { return  scaleColor(d.data.age); });

    var labelArc = d3.arc()
                     .innerRadius(pieRadius - 30)
                     .outerRadius(pieRadius - 30);

    g.append("text")
     .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"  })
     .attr("dy", ".35em")
     .attr("text-anchor", "middle")
     .text(function(d) { return d.data.age });

});
