var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(1000)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

var stateLookup = d3.map();

var sizeScale = d3.scaleLinear().range([0, 10])

queue()
  .defer(d3.json, "./cb_2016_us_state_20m.json") // import the map geoJSON
  .defer(d3.csv, "./statePop.csv")          // import the data from the .csv file
  .await( function(err, dataIn, popData) {

  popData.forEach(function(d) {
    stateLookup.set(d.name, d.population);
  });

  sizeScale.domain([0, d3.max(
                          popData.map(
                            function(d) {
                              return d.population;
  }))]);

  var centroids = dataIn.features.map( function(feature) {
                                          return { name: feature.properties.NAME ,
                                                   center: path.centroid(feature)} })

  console.log(centroids);

    svg.selectAll("path")               //make empty selection
        .data(dataIn.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','white')
        .attr('stroke-width',.2);


    svg.selectAll('circle')
        .data(centroids)
        .enter()
        .append('circle')
        .attr("id", function(d) { return d.name})
        .attr('cx', function (d){

            if (isNaN(d.center[0])) {
              return -100
            } else {
              return d.center[0]
            }
        })
        .attr('cy', function (d){
            return d.center[1]
        })
        .attr('r', 10 /*function(d) { return sizeScale(stateLookup.get(d.name))}*/)
        .attr('fill','purple')
        .attr("fill-opacity", .6)


  });
