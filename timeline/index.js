var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 100;
var marginTop = 100;

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleY = d3.scaleTime().range([0, (height - 2 * marginTop)]);
var scaleX = d3.scaleLinear().range([0,(width - 2 * marginLeft)]).domain([0,200]);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(scaleY))

//import the data from the .csv file
d3.csv('./daca_timeline.csv', function(dataIn){

  var parser = d3.timeParse("%m/%d/%Y")

  dataIn.forEach(function(d){
      d.date = parser(d.start_date);
  });

  console.log(dataIn);

  scaleY.domain([d3.min(dataIn.map(function(d){ return d.date })), d3.max(dataIn.map(function(d){ return d.date }))]);

  d3.select(".axis")
    .call(d3.axisLeft(scaleY).ticks(d3.timeMonth.every(3)))

  svg.selectAll(".date-lines")
      .data(dataIn)
      .enter()
      .append("line")
      .attr("class", "date-lines")
      .attr('y1',function(d) { return scaleY(d.date); })
      .attr('y2', function(d) { return scaleY(d.date); })
      .attr('x1', scaleX(0))
      .attr('x2', scaleX(100))
      .attr('stroke-width',1)
      .attr('stroke','gray');

  svg.selectAll(".titles")
      .data(dataIn)
      .enter()
      .append('text')
      .attr("class", "titles")
      .attr('y', function(d){ return scaleY(d.date); })
      .attr("dy", 25)
      .attr('x', scaleX(20))
      .text(function(d){return d.title});

  svg.selectAll(".labels")
      .data(dataIn)
      .enter()
      .append('text')
      .attr("class", "labels")
      .attr('y', function(d){ return scaleY(d.date); })
      .attr("dy", 50)
      .attr('x', scaleX(20))
      .text(function(d){return d.text});

});
