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

	let arc = d3.arc().outerRadius(radius - 10).innerRadius(100)

	let svg = d3.select("#pie").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width/2 + "," + height/2 +")")
	let g = svg.selectAll("arc").data(pie).enter().append("g").attr("class", "arc")

	svg.append("svg:circle")
   		.attr("cx", 0)
    	.attr("cy", 0)
    	.attr("r", radius /2)
    	.style("fill", "grey")
    	.append("div")
    	.attr("class", "tooltip")

	g.append("path").attr("d", arc).style("fill", (d) => {
		return color(d.data.Type)
	})

	let tooltip = d3.select(".tooltip")

	tooltip.append("div").attr("class", "Type")
	tooltip.append("div").attr("class", "count")

	g.on("mouseover", (d) => {
		tooltip.select('.Type').html(d.data.Type)
		tooltip.select(".count").html(d.data.presses)
		tooltip.style("display", "block")
	})
}

//////////////////////////////
// Document Ready
//////////////////////////////

$(() => {
	selectDrop()
})