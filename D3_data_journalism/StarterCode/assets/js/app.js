// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 550;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth )
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
  // if (err) throw err;
console.log(healthData)
  // Step 1: Parse Data/CONVERT TO numbers
   // ==============================
  healthData.forEach(function(data) {
    
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    
  });

  // Step 2: Create scale functions
  // ==============================
  //xscale
  var xLinearScale = d3.scaleLinear().domain([d3.min(healthData, d=>d.poverty)*0.9, 
    d3.max(healthData, d => d.poverty)*1.1]).range([0, width]);
  //yscale  
  var yLinearScale = d3.scaleLinear().domain([0, d3.max(healthData, d => d.healthcare)*1.1])
  .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(healthData, function(data) {
      return data.poverty;
  });
  
  xMax = d3.max(healthData, function(data) {
      return data.poverty;
  });
  
  yMin = d3.min(healthData, function(data) {
      return data.healthcare;
  });
  
  yMax = d3.max(healthData, function(data) {
      return data.healthcare;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .style("font-size", "18px")
  .call(bottomAxis);

  chartGroup.append("g")
  .style("font-size", "18px")
  .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty +0.3))
  .attr("cy", d => yLinearScale(d.healthcare +1.5))
  .attr("r", "13")
  .attr("fill", "blue")
  .attr("opacity", .4)

  // Create text within Circles
  var circlesGroup = chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty +0.15);
      })
      .attr("y", function(data) {
          return yLinearScale(data.healthcare +1.3);
      })
      .text(function(data) {
          return data.abbr
      });
  

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      return (`${data.state}<br>Poverty Rate: ${data.poverty}<br>No Access to Healthcare: ${data.healthcare}`);
      });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  // Create axes labels

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("font-size", "18px")
    .text("Inadequate Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .style("font-size", "18px")
    .text("Poverty Rate (%)");
     
});