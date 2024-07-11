import * as d3 from "d3"
import { svg } from "d3";

export function fermentationCircle(data) {
    d3.select(".fermentation-svg").remove()
    let width = document.querySelector(".fermentation").offsetWidth,
        height = document.querySelector(".fermentation").offsetHeight,
        radius = (height - 150) / 2
    let fSvg = d3.select(".fermentation").append("svg")
        .attr('class', 'fermentation-svg')
        .attr('width', width)
        .attr('height', height)
    //添加温度刻度
    let temperArr = []
    for (let i = 0; i < 11; i++) {
        let angle = Math.PI * 2 / 11 * (i - 1)
        temperArr.push({
            temper: 5 + 5 * i,
            x: width / 2 + radius * Math.sin(angle),
            y: height / 2 - radius * Math.cos(angle)
        })
    }
    let scale = fSvg.append("g")
    scale.selectAll("path")
        .data(temperArr)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("d", (d) => `M${width / 2},${height / 2} L${d.x},${d.y}`)
    scale.selectAll("text")
        .data(temperArr)
        .enter()
        .append("text")
        .text((d) => d.temper + "°C")
        .attr("x", (d) => {
            if (d.x > width / 2) {
                return d.x + 10
            } else if (d.x < width / 2) {
                return d.x - 25
            } else {
                return d.x - 5
            }
        })
        .attr('y', (d) => {
            if (d.y > height / 2) {
                return d.y + 15
            } else if (d.y < height / 2) {
                return d.y - 10
            } else {
                return d.y + 5
            }
        })
    //添加每个阶段的弧
    let stage = []
    for (let i = 0; i < data.stage.length; i++) {
        stage.push({
            name: data.stage[i].name,
            temper: data.stage[i].temperature
        })
    }
    let yaxis = radius / 3 * 2 / (stage.length + 1)
    stage.forEach((item, index) => {
        let temp = item.temper - 5
        let r = radius / 3 + yaxis * (index + 1)
        let endAngle = temp * (Math.PI * 2 / 55)
        let startAngle = Math.PI * 2 / 11 * (-1)
        let arc = d3.arc()
            .innerRadius(r)
            .outerRadius(r)
            .startAngle(startAngle)
            .endAngle(endAngle)
        item.r = r
        item.startAngle = startAngle
        item.d = arc()
    })
    let stageArc = fSvg.append("g")
    let tooltip = d3.select(".fermentation")
        .append("div")
        .attr("class", "fermentation-tooltip")
    tooltip.append("div").attr("class", "text-stage")
    tooltip.append("div").attr("class", "text-temper")

    let color = d3.scaleSequential(d3.interpolateYlOrBr);
    stageArc.selectAll("path")
        .data(stage)
        .enter()
        .append("path")
        .attr("class", "stage-arc")
        .attr("stroke", (d, i) => `rgb(${141 + i * 2},${114 + i * 2},${87 + i * 2})`)
        .attr("stroke-width", 0)
        .attr('opacity', 0)
        .attr("d", (d) => d.d)
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .on("mouseover", function (d) {
            tooltip.select(".text-stage").text("发酵阶段:" + d.name)
            tooltip.select(".text-temper").text("发酵温度:" + d.temper + "°C")
            d3.select(this)
                .transition()
                .duration(500)
                .attr("stroke", "rgb(206,161,86)")
            tooltip.style('display', 'block');
            tooltip.style('opacity', 2);
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
        })
        .on("mouseleave", function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("stroke", `rgb(${141 + i * 2},${114 + i * 2},${87 + i * 2})`)

            tooltip.style("display", "none");
            tooltip.style('opacity', 0);
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 100)
        .attr("stroke-width", 8)
        .attr('opacity', 1)
    let stageText = fSvg.append("g")
        .selectAll("text")
        .data(stage)
        .enter()
        .append("text")
        .attr("x", (d) => width / 2 + d.r * Math.sin(d.startAngle) - 35)
        .attr("y", (d) => height / 2 - d.r * Math.cos(d.startAngle) + 15)
        .text((d, i) => {
            if (stage.length >= 7) {
                return i % 2 ? "" : d.name
            }
            return d.name
        })
        .attr("font-family", "KaiTi")
        .attr("font-weight", "bold")
}