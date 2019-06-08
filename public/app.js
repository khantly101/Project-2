//////////////////////////////
// MAP API
//////////////////////////////

let map
let places
let InfoWindow
let markers = []
let autocomplete

const initMap = () => {

	map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 37.1, lng: -95.7}, 
		zoom: 3, 
		mapTypeControl: false,
		panControl: false,
		zoomControl: false,
		streetViewControl: false
	})

	infoWindow = new google.maps.InfoWindow({ content: document.getElementById("info-content") })

	autocomplete = new google.maps.places.Autocomplete((document.getElementById("autocomplete")), {types: ["(cities)"], componentRestrictions: {"country": "us"}})

	places = new google.maps.places.PlacesService(map)

	autocomplete.addListener("place_changed", changeLocation)
}

const changeLocation = () => {
	let place = autocomplete.getPlace()

	if (place.geometry) {
		map.panTo(place.geometry.location)
		map.setZoom(12)
		search()
	} else {
		document.getElementById("autocomplete").placeholder = "Enter a city"
	}
}

const search = () => {
	let searchType = {
		bounds: map.getBounds(),
		type: ["gas_station"]
	}

	places.nearbySearch(searchType, (results, status) => {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			clearMarkers()

			for (let i = 0; i < results.length; i++) {
				let markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26))

				markers[i] = new google.maps.Marker({
					position: results[i].geometry.location,
					animation: google.maps.Animation.DROP,
				});

				markers[i].placeResult = results[i];
				google.maps.event.addListener(markers[i], "click", () => {
					let marker = markers[i]
					places.getDetails({placeId: marker.placeResult.place_id}, (place, status) => {
						if (status !== google.maps.places.PlacesServiceStatus.OK) {
							return
						}
						infoWindow.open(map, marker)
						makeTooltip(place)
					})
				})
				setTimeout(dropMarker(i), i * 100);
			}
		}
	})
}

const clearMarkers = () => {
	markers.forEach((ele) => {
		if (ele) {
			ele.setMap(null)
		}
	})
	markers = []
}

const dropMarker = (ele) => {
	return () => {
		markers[ele].setMap(map)
	}
}

const makeTooltip = (place) => {
	document.getElementById("locName").innerHTML = '<b><a href="' + place.url + '">' + place.name + "</a></b>";
	document.getElementById("address").textContent = place.vicinity;
}

//////////////////////////////
// SIDENAV
//////////////////////////////

const sidebar = () => {
	$(".sidenav").sidenav()
}

const logout = () => {
	$(".logout").submit()
}

//////////////////////////////
// DROP DOWN
//////////////////////////////

const selectDrop = () => {
	$("select").formSelect()
}


//////////////////////////////
// CHART
//////////////////////////////

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
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("viewBox", "0 0 " + Math.min(width,height) + " " + Math.min(width,height))
				.append("g")
				.attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")	

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
		.attr("y", height * -0.1)

	g.append("path")
		.attr("d", arc)
		.style("fill", (d) => {
			return color(d.data.Brand)
		})

	

	g.on("mouseover", (d) => {
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.Brand)
		svg.append("text").attr("text-anchor", "middle").attr("class", "donut").text(d.data.presses).attr("y", height * 0.1)
	}).on("mouseout", (d) => {
		svg.selectAll(".donut").remove()
	})
}


const lineChart = (chartData) => {
	let width = 920 
	let height = width * .7 

	let vis = d3.select("#line")
				.append("svg")
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("viewBox", "0 0 " + Math.min(width,height) + " " + Math.min(width/2,height/2))

	let xScale = d3.scaleLinear().domain([0, 10]).range([0, 600])
	let xAxis = d3.axisBottom().scale(xScale)
	let x = vis.append("g").attr("class", "x axis").attr("transform", "translate(25,270)").call(xAxis)

	let yScale = d3.scaleLinear().domain([40, 0]).range([0, 300])
	let yAxis = d3.axisLeft().scale(yScale)
	let y = vis.append("g").attr("class", "y axis").attr("transform", "translate(25, -30)").call(yAxis)

	let line = d3.line().x((d,i) => {
		return xScale(i) + 25
	}).y((d) => {
		return yScale(d.y) - 30
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
			return yScale(d.y) - 30
		})
		.attr("r", 4)
}

//////////////////////////////
// Document Ready
//////////////////////////////

$(() => {
	selectDrop()
	initMap()
})