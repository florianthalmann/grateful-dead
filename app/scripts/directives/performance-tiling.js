(function () {
	'use strict';

	angular.module('gratefulDead.directives')
		.directive('performanceTiling', ['d3', function(d3) {
			return {
				restrict: 'EA',
				scope: {
					data: "=",
					onClick: "&"
				},
				link: function(scope, iElement, iAttrs) {
					var svg = d3.select(iElement[0])
						.append("svg")
						.attr("width", "100%");

					var height = 600;
					var padding = 50;
					var previousColors = null;
					var prevRandomValues = {};

					var xScale, yScale, widthScale, heightScale, colorScale;

					// Axes. Note the inverted domain for the y-scale: bigger is up!
					var xAxis = d3.svg.axis().orient("bottom"),
					yAxis = d3.svg.axis().orient("left");

					svg.append("g")
						.attr("class", "xaxis")  //Assign "axis" class
						.attr("transform", "translate(0," + (height - padding) + ")")
						.attr("stroke", "grey")
						.call(xAxis);

					svg.append("g")
						.attr("class", "yaxis")
						.attr("transform", "translate(" + padding + ",0)")
						.attr("stroke", "grey")
						.call(yAxis);

					// on window resize, re-render d3 canvas
					window.onresize = function() {
						return scope.$apply();
					};
					scope.$watch(function(){
							return angular.element(window)[0].innerWidth;
						}, function(){
							return scope.render(scope.data);
						}
					);

					// watch for data changes and re-render
					scope.$watch('data', function(newVals, oldVals) {
						return scope.render(newVals);
					}, true);

					// define render function
					scope.render = function(data, changedSelection){
						// setup variables
						var width = d3.select(iElement[0])[0][0].offsetWidth - padding; // 20 is for paddings and can be changed
						// set the height based on the calculations above
						svg.attr('height', height);

						var allIds = Array.from(new Set(data.map(d => d.id.value)));

						xScale = d3.scale.linear().domain([0, d3.max(data, d => d.end.value)]).range([padding, width-padding]),
						yScale = d3.scale.linear().domain([0, allIds.length]).range([height-padding, padding]),
						heightScale = d3.scale.linear().domain([0, allIds.length]).range([0, height-2*padding]),
						widthScale = d3.scale.linear().domain([0, d3.max(data, d => d.end.value)]).range([0, width-2*padding]),
						colorScale = d3.scale.linear().domain([0, d3.max(data, d => d.dur.value)]).rangeRound([0, 360]);

						xAxis.scale(xScale).tickFormat(d3.format(".g"));
						yAxis.scale(yScale).tickFormat(d3.format(".g"));

						//update axes
						svg.selectAll("g.xaxis")
							.call(xAxis);
						svg.selectAll("g.yaxis")
							.call(yAxis);

						var rects = svg.selectAll("rects").data(data);

						rects.enter()
							.append("rect")
							.on("click", d => scope.onClick({item: d}))
							.style("fill", d => getHsl(d.dur.value))
							.style("opacity", 0.2)
							.attr("x", d => xScale(d.start.value))
							.attr("y", (d) => yScale(allIds.indexOf(d.id.value)+1))
							.attr("width", d => widthScale(d.end.value-d.start.value))
							.attr("height", d => heightScale(1));

						rects
							.transition()
								.duration(500) // time of duration
								.style("fill", d => getHsl(d.dur.value))
								.style("opacity", 0.2)
								.attr("x", d => xScale(d.start.value))
								.attr("y", (d,i) => yScale(allIds.indexOf(d.id.value)+1))
								.attr("width", d => widthScale(d.end.value-d.start.value))
								.attr("height", d => heightScale(1));

						rects.exit().remove();

					};


					function getXValue(d, i) {
						return xScale(getVisualValue(d, scope.viewconfig.xAxis.param, "x"));
					}

					function getYValue(d, i) {
						return yScale(getVisualValue(d, scope.viewconfig.yAxis.param, "y"));
					}

					function getR(d) {
						return sizeScale(getVisualValue(d, scope.viewconfig.size.param, "size"));
					}

					function getHsl(d) {
						return "hsl(" + colorScale(d) + ", 80%, 50%)";
					}

				}
			};
		}]);

}());
