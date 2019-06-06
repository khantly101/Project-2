//////////////////////////////
// SIDENAV
//////////////////////////////

const sidebar = () => {
	$('.sidenav').sidenav()
}

const logout = () => {
	$('.logout').submit()
}

//////////////////////////////
// DROP DOWN
//////////////////////////////

const selectDrop = () => {
	$('select').formSelect()
}


//////////////////////////////
// CHART
//////////////////////////////

const pieChart = (chartData) => {

	let width = 300
	let height = 300
	let radius = Math.min(width, height) / 2
	let color = d3.scaleOrdinal().range(["#d11141","#00b159","#00aedb","#f37735","#ffc425","#222f5b","#946b2d"])

	let pie = d3.pie().value((d) => {
		return d.presses
	})(chartData)

	let arc = d3.arc().outerRadius(radius - 20).innerRadius(90)

	let svg = d3.select("#pie").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width/2 + "," + height/2 +")")	
	let g = svg.selectAll("arc").data(pie).enter().append("g").attr("class", "arc")

	svg.append("svg:circle")
   		.attr("cx", 0)
    	.attr("cy", 0)
    	.attr("r", radius /2)
    	.attr("class", "middle")
    	.style("fill", "grey")

	g.append("path").attr("d", arc).style("fill", (d) => {
		return color(d.data.Type)
	})

	

	g.on("mouseover", (d) => {
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.Type)
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.presses).attr('y', height * 0.1)
	}).on("mouseout", (d) => {
		svg.selectAll(".donut").remove()
	})
}

const lineChart = (chartData) => {
	let width = 1000
	let height = 500

	let vis = d3.select("#line").append("svg").attr("width", width).attr("height", height)

	let xScale = d3.scaleLinear().domain([0, 20]).range([2, 400])
	let xAxis = d3.axisBottom().scale(xScale)
	let x = vis.append("g").call(xAxis)
}

//////////////////////////////
// Document Ready
//////////////////////////////

$(() => {
	lineChart()
	selectDrop()
})