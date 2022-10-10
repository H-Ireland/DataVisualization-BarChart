// get json data using fetch() method & use new Date() method to new Date() create a new date object with the current date and time:   "data": ["1947-01-01", 243.1]

// fetch("/03_dataVisualizationProjects/data/gdpData.json")
fetch("data/gdpData.json")
    .then(response => response.json())
    .then(data => {
        let info = data.data;
        info.map(item => {
            item.date = new Date(item[0]);
            item.gdp = item[1];
        })
        makeBars(info)
    })

// set global variables for SVG height, width, & padding
let h = 750;
let w = 1500;
const padding = {
    top: 75,
    right: 75,
    bottom: 75,
    left: 75,
}

// create SVG canvas
const svg = d3
    .select('body')
    .append('svg')
    .attr('height', h)
    .attr('width', w);

//create labels
svg
    .append('text')
    .attr('x', w / 2)
    .attr('y', h - 685)
    .attr('text-anchor', 'middle')
    .attr('class', 'top-label')
    .text('United States Annual Gross Domestic Product (GDP)');

svg
    .append('text')
    .attr('x', w / 2)  // this (along with text-anchor below) places text in proper position on x-axis
    .attr('y', h - 30)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .text('Annual Time Period');

svg
    .append('text')
    .attr('x', -h / 2) // this (along with rotate and text-anchor below) places text in proper position on y-axis
    .attr('y', 27)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .text('Gross Domestic Product');

//create dimensions for graph
let displayHeight = h - (padding.top + padding.bottom)
let displayWidth = w - (padding.right + padding.left)

const makeBars = (arr) => {

    let dataset = arr;
    // console.log(dataset)

    // iterate through data and isolate both the date and gdp values
    let xData = (d) => d.date
    // console.log(xData)
    let yData = (d) => d.gdp

    //create both scales
    const xScale = d3
        .scaleTime() // method works with date formats
        .domain(d3.extent(dataset, xData))
        .range([0, displayWidth]);
    // console.log(d3.extent(dataset, xData))

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, yData)])
        .range([displayHeight, 0]); // using [max value, min value] inverts the y-axis

    // create both axes      
    const xAxis = d3.axisBottom(xScale).tickSize([-displayHeight]);
    const yAxis = d3.axisLeft(yScale).tickSize(-displayWidth);
    // const yAxis = d3.axisLeft(yScale).tickSize(-displayWidth);

    // append both scales to graph
    const graph = d3
        .select("svg")
        .append("g")
        .attr("transform", `translate(${padding.left}, ${padding.bottom})`)

    graph
        .append("g")
        .attr("transform", `translate(0, ${displayHeight})`)
        .call(xAxis);

    graph
        .append('g')
        .attr("transform", `translate(xScale(xData(d), ${displayWidth})`)
        .call(yAxis);

    // create rectangles to display data
    graph.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(xData(d)))
        .attr("y", (d) => yScale(yData(d)))
        .attr("width", 3)
        .attr("height", (d) => displayHeight - yScale(yData(d)))
        .attr("fill", "grey")
        .attr("class", "bar")
        .attr("id", "myGraph")

        // create tooltip and instead of using the date as it appears in json object (a long format), use callback function and toLocaleDateString method to reformat date to display mm/dd/yyyy - the hover value is set in the style sheet for the "bar" class
        .append("title")
        .attr("id", "tooltip")
        .text((d) => new Date(d.date).toLocaleDateString());

    // console.log(dataset)
}
