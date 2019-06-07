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

	let svg = d3.select("#pie")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width/2 + "," + height/2 +")")	

	let g = svg.selectAll("arc")
				.data(pie)
				.enter()
				.append("g")
				.attr("class", "arc")

	svg.append("svg:circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", radius /2)
		.attr("class", "middle")
		.style("fill", "grey")

	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "Type")
		.text("Fuel Type")
		.attr('y', height * -0.1)

	g.append("path")
		.attr("d", arc)
		.style("fill", (d) => {
			return color(d.data.Type)
		})

	

	g.on("mouseover", (d) => {
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.Type)
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.presses).attr('y', height * 0.1)
	}).on("mouseout", (d) => {
		svg.selectAll(".donut").remove()
	})
}

const brandChart = (chartData) => {

	let width = 300
	let height = 300
	let radius = Math.min(width, height) / 2
	let color = d3.scaleOrdinal().range(["#d11141","#00b159","#00aedb","#f37735","#ffc425","#222f5b","#946b2d"])

	let pie = d3.pie().value((d) => {
		return d.presses
	})(chartData)

	let arc = d3.arc().outerRadius(radius - 20).innerRadius(90)

	let svg = d3.select("#brand")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width/2 + "," + height/2 +")")	

	let g = svg.selectAll("arc")
				.data(pie)
				.enter()
				.append("g")
				.attr("class", "arc")

	svg.append("svg:circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", radius /2)
		.attr("class", "middle")
		.style("fill", "grey")

	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "Type")
		.text("Brand")
		.attr('y', height * -0.1)

	g.append("path")
		.attr("d", arc)
		.style("fill", (d) => {
			return color(d.data.Brand)
		})

	

	g.on("mouseover", (d) => {
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.Brand)
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.presses).attr('y', height * 0.1)
	}).on("mouseout", (d) => {
		svg.selectAll(".donut").remove()
	})
}


const lineChart = (chartData) => {
	let width = 600
	let height = 300

	let vis = d3.select("#line")
				.append("svg")
				.attr("width", width)
				.attr("height", height)

	let xScale = d3.scaleLinear().domain([0, 10]).range([0, 400])
	let xAxis = d3.axisBottom().scale(xScale)
	let x = vis.append("g").attr("class", "x axis").attr("transform", "translate(25,210)").call(xAxis)

	let yScale = d3.scaleLinear().domain([40, 0]).range([0, 200])
	let yAxis = d3.axisLeft().scale(yScale)
	let y = vis.append("g").attr("class", "y axis").attr("transform", "translate(25,10)").call(yAxis)

	let line = d3.line().x((d,i) => {
		return xScale(i) + 25
	}).y((d) => {
		return yScale(d.y) + 10
	}).curve(d3.curveMonotoneX)

	vis.append("path")
		.datum(chartData)
		.attr("class", "line")
		.attr("d", line)

	vis.selectAll(".dot")
		.data(chartData)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("cx", (d, i) => {
			return xScale(i) + 25
		})
		.attr("cy", (d) => {
			return yScale(d.y) + 10
		})
		.attr("r", 4)

}

//////////////////////////////
// Document Ready
//////////////////////////////

$(() => {
	selectDrop()
})