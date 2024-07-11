import * as d3 from "d3"
import rank from "@/assets/data/part3/rank.json"

export function rankChart() {
    let width = document.querySelector(".rank").offsetWidth,
        height = document.querySelector(".rank").offsetHeight
    let heightInterval = height * 0.8 / (rank.length)

    let rankClassLetter = ["acid", "ester", "ethylAcetate", "solid"],
        rankClass = ["总酸", "总酯", "乙酸乙酯", "固形物"]

    let barCenterX = width * 0.6,
        maxWidth = width * 0.4
    let rectHeight = heightInterval / 2

    let svg = d3.select(".rank")
        .append("svg")
        .attr("class", "rank-svg")
        .attr("height", height)
        .attr("width", width)
    let flavorText = svg.append("g")
        .selectAll("text")
        .data(rank)
        .enter()
        .append("text")
        .attr("font-size", 24)
        .attr("font-family", "KaiTi")
        .attr("x", 20)
        .attr("y", (d, i) => height * 0.12 + heightInterval * (i))
        .text((d) => d.name)

    let rect = svg.append("g")
    let maxAcid = 0, maxEster = 0
    rank.forEach((item, index) => {
        //找出每个香型的最大值
        let maxAcidValue = 0,
            maxEsterValue = 0
        item.total.forEach((item1, index) => {
            maxAcidValue = maxAcidValue > item1.num.acid ? maxAcidValue : item1.num.acid
            maxEsterValue = maxEsterValue > item1.num.ester ? maxEsterValue : item1.num.ester
        })
        item.maxAcidValue = maxAcidValue
        item.maxEsterValue = maxEsterValue
        //所有香型中酸和酯最大的值
        maxAcid = maxAcid > item.maxAcidValue ? maxAcid : item.maxAcidValue
        maxEster = maxEster > item.maxEsterValue ? maxEster : item.maxEsterValue
    });
    //设置比例尺
    let acidScale = d3.scaleLinear()
        .domain([maxAcid / 3, maxAcid])
        .range([width * 0.15, width * 0.35])
    let esterScale = d3.scaleLinear()
        .domain([0, maxEster])
        .range([width * 0.15, width * 0.35])
    let acidColor = "#EEC591", esterColor = "#EEB4B4"
    let rankName = ["高度优级", "高度一级", "低度优级", "低度一级"],
        rankColor = d3.scaleSequential(d3.interpolateRdYlBu),
        rankPath = [20, 10, -10, -20]
    rank.forEach((item, index) => {
        //添加矩形
        let curG = rect.append("g")
        let acidRect = curG.append("g"),
            esterRect = curG.append("g"),
            rankLine = curG.append("g")
        let baseRankHeight = height * 0.12 + heightInterval * (index)
        acidRect.append("rect")
            .datum(item)
            .attr("x", barCenterX)
            .attr("y", baseRankHeight)
            .attr("height", rectHeight / 2)
            .attr("width", 0)
            .attr("transform", `rotate(180,${barCenterX},${baseRankHeight})`)
            .attr("fill", acidColor)
            .transition()
            .duration(1000)
            .attr("width", (d) => acidScale(d.maxAcidValue))
        esterRect.append("rect")
            .datum(item)
            .attr("x", barCenterX)
            .attr("y", baseRankHeight - rectHeight / 2)
            .attr("height", rectHeight / 2)
            .attr("width", 0)
            .attr("fill", esterColor)
            .transition()
            .duration(1000)
            .attr("width", (d) => esterScale(d.maxEsterValue))
        //添加矩形上的刻度

        item.total.forEach((item1, index1) => {
            let pathV = rankPath[rankName.indexOf(item1.name)]//根据等级设置的偏移量
            let baseY = baseRankHeight - (pathV > 0 ? 0 : rectHeight / 2),//初始状态的Y
                transformY = baseRankHeight - (pathV > 0 ? (pathV + rectHeight / 2) : pathV)//动画后的Y
            let rankAcid = acidRect.append("path")
                .datum(item1.num.acid)
                .attr("class", `rank-path rank-path-${rankName.indexOf(item1.name)}`)
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "grey")
                .attr("d", (d) => `M${barCenterX},${baseRankHeight} V${baseRankHeight - rectHeight / 2}`)
                .attr("opacity", 0)
                .transition()
                .duration(1000)
                .delay(100 * index1)
                .ease(d3.easeBackInOut)
                .attr("opacity", 1)
                .attr("fill", "none")
                .attr("d", (d) => {
                    return `M${barCenterX - acidScale(d)},${baseY} V${transformY}`
                })

            let rankEster = esterRect.append("path")
                .datum(item1.num.ester)
                .attr("class", `rank-path rank-path-${rankName.indexOf(item1.name)}`)
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "grey")
                .attr("d", (d) => {
                    return `M${barCenterX},${baseRankHeight} V${baseRankHeight - rectHeight / 2}`
                })
                .attr("opacity", 0)
                .transition()
                .duration(1000)
                .ease(d3.easeBackInOut)
                .delay(100 * index1)
                .attr("opacity", 1)
                .attr("fill", "none")
                .attr("d", (d) => {
                    return `M${barCenterX + esterScale(d)},${baseY} V${transformY}`
                })

            let rankDash = rankLine.append("path")
                .datum(item1.num)
                .attr("class", `rank-dash rank-dash-${rankName.indexOf(item1.name)}`)
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1)
                .attr("stroke", "grey")
                .attr("opacity", 0)
                .attr("d", (d) => {
                    return `M${barCenterX},${transformY} H${barCenterX}`
                })
                .transition()
                .attr("opacity", 1)
                .attr("d", (d) => {
                    return `M${barCenterX - acidScale(d.acid)},${transformY} H${barCenterX + esterScale(d.ester)}`
                })
            let rankCircle = rankLine.append("circle")
                .datum(item1.num)
                .attr("r", 0)
                .attr("class", `rank-circle rank-circle-${rankName.indexOf(item1.name)}`)
                .attr("fill", rankColor(0.5 + pathV / 50))
                .attr("cx", (d) => (barCenterX - acidScale(d.acid) + barCenterX + esterScale(d.ester)) / 2)
                .attr("cy", transformY)
                .on("mouseover", function (d) {
                    d3.select(this)
                        .transition()
                        .attr("r", 8)
                    let circle = d3.select(this).node()
                    let tooltip = d3.select(".rank-tooltip")
                    tooltip.style("left", circle.cx.baseVal.value + 10 + "px")
                        .style("top", circle.cy.baseVal.value - 35 + "px")
                        .style("opacity", 1)
                    tooltip.select(".rank-tooltip-title").text(item1.name)
                    tooltip.select(".rank-tooltip-text").select(".text-acid").text(`总酸≥：${d.acid}g/L`)
                    tooltip.select(".rank-tooltip-text").select(".text-ester").text(`总酯≥：${d.ester}g/L`)
                })
                .on("mouseleave", function (d) {
                    d3.select(this)
                        .transition()
                        .attr("r", 5)
                    let tooltip = d3.select(".rank-tooltip")
                    tooltip.style("left", 0)
                        .style("top", 0)
                        .style("opacity", 0)
                    tooltip.select(".rank-tooltip-title").text("")
                    tooltip.select(".rank-tooltip-text").select(".text-acid").text("")
                    tooltip.select(".rank-tooltip-text").select(".text-ester").text("")
                })
                .transition()
                .duration(500)
                .delay(500)
                .attr("r", 5)

        })
    })
    let legendMargin = width * 0.2
    let legend = svg.append("g")
    legend.append("g")
        .selectAll("circle")
        .data(rankName)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => legendMargin + width / rankName.length * (i % 2))
        .attr("cy", (d, i) => i < 2 ? (height * 0.90) : (height * 0.90 + 50))
        .attr("r", 10)
        .attr("fill", (d, i) => rankColor(0.5 + rankPath[i] / 50))
    legend.append("g")
        .selectAll("text")
        .data(rankName)
        .enter()
        .append("text")
        .attr("font-size", 18)
        .attr("x", (d, i) => legendMargin + width / rankName.length * (i % 2) - d.length * 18 / 2)
        .attr("y", (d, i) => i < 2 ? (height * 0.90 + 30) : (height * 0.90 + 80))
        .text((d) => d)
    legend.append("g")
        .selectAll("rect")
        .data(["总酸", "总酯"])
        .enter()
        .append("rect")
        .attr("x", (d, i) => legendMargin + width * 0.45 + 100 * i)
        .attr("y", height * 0.9 - 10)
        .attr("height", 70)
        .attr("width", 36)
        .attr("fill", (d) => d == "总酸" ? acidColor : esterColor)
    legend.append("g")
        .selectAll("text")
        .data(["总酸", "总酯"])
        .enter()
        .append("text")
        .attr("font-size", 18)
        .attr("x", (d, i) => legendMargin + width * 0.45 + 100 * i)
        .attr("y", height * 0.9 - 10 + 90)
        .text((d) => d)
}