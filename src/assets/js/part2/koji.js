import * as d3 from "d3";
import kojiMicrobe from "@/assets/data/part2/kojiMicrobe.json"
import flavor from "@/assets/data/part2/flavor.json"

export function drawKoji(cur) {
    // console.log(cur);
    let width = document.querySelector(".koji .chart").offsetWidth,
        height = document.querySelector(".koji .chart").offsetHeight

    let contain = d3.select(".koji .chart")
    let flavorKoji = flavor[cur].koji       //该香型用曲
    // console.log(flavorKoji);

    for (let i = 0; i < kojiMicrobe.length; i++) {
        let kojiItem = contain.append("div")
            .attr("class", "koji-item koji-item" + i)
            .style("background-color", () => {
                if (kojiMicrobe[i].name == flavorKoji) {
                    return "rgb(217,224,220)"
                }
            })
        kojiItem.append("div")
            .text(kojiMicrobe[i].name)
            .attr("class", "koji-div")
            .on("click", function () {
                d3.selectAll(".microbe")
                    .transition()
                    .duration(500)
                    .attr("r", 5)

                d3.selectAll(`.koji-${i}`)
                    .transition()
                    .duration(500)
                    .attr("r", 10)
            })



        kojiItem.append("svg")
            .attr("class", "koji-svg" + i)
            .attr("width", "100%")
            .attr("height", "100%")
            .on("click", function () {
                d3.selectAll(".microbe")
                    .transition()
                    .duration(500)
                    .attr("r", 5)

                d3.selectAll(`.koji-${i}`)
                    .transition()
                    .duration(500)
                    .attr("r", 10)
            })
            .on("mousemove", d => {
                kojiItem.style("background-color", "rgb(217,224,220)")
                let tooltip = d3.select(".koji-tooltip")
                tooltip.select(".text-describe").text(flavor[cur].detail)
                tooltip.style("opacity", 1)
                tooltip.style("left", d3.event.layerX + 10 + "px")
                tooltip.style("top", d3.event.layerY + i * height / 5 + 80 + "px")
            })
            .on("mouseout", d => {
                let tooltip = d3.select(".koji-tooltip")
                tooltip.select(".text-describe").text("")
                tooltip.style("opacity", 0)
                tooltip.style("left", 0)
                tooltip.style("top", 0)
                if (flavorKoji.includes(kojiMicrobe[i].name)) {
                    d3.select(".koji-item" + i).style(
                        "background-color",
                        "rgb(217,224,220)"
                    );
                    // kojiItem.style("background-color","rgb(217,224,220)")
                } else {
                    d3.select(".koji-item" + i).style(
                        "background-color",
                        "transparent"
                    );
                }
            })

            .append("circle")
            .attr("class", `koji-circle-${i}`)
            .attr("fill", "none")
            .attr("stroke", () => {
                return flavorKoji.includes(kojiMicrobe[i].name) ? "rgb(164,189,207)" : "none"
            })
            .attr("stroke-width", 8)
            .attr("r", width / 6 + 4)
            .attr("cx", width / 5)
            .attr("cy", height / 10)
        d3.select('.koji-svg' + i).append("image")
            .attr("transform", 'translate(0,8)')
            .attr("class", "koji-img")
            .attr("xlink:href", `koji/koji_${i}.png`)
    }
}