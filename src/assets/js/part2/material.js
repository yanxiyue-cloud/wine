import * as d3 from "d3"
import material from "@/assets/data/part2/material.json"
import materialSvg from "@/assets/data/part1/materialSvg.json"
import flavor from "@/assets/data/part2/flavor.json"

export function materialCps(that) {
    let width = document.querySelector('.compositionChart').offsetWidth,
        height = document.querySelector('.compositionChart').offsetHeight
    let svg = d3.select(".composition-all-svg")

    let mOuterRadius = height * 0.16
    let mInnerRadius = height * 0.06
    //计算材料成分的间隔
    let cpsLen = 0
    for (let i = 0; i < material.length; i++) {
        cpsLen += material[i].main.length + 3
    }
    let intervalAngle = Math.PI * 2 / cpsLen
    //计算材料节点和成分节点的位置
    let mainNode = []
    let mAngle = Math.PI * 2 / material.length
    material.forEach((item, index) => {
        let curAngle = mAngle * index
        let len = item.main.length
        let startAngle = curAngle - len / 2 * intervalAngle
        let endAngle = curAngle + len / 2 * intervalAngle
        mainNode.push({
            ...item,
            startAngle: startAngle,
            endAngle: endAngle,
            midAngle: curAngle,
            x: width / 2 - mInnerRadius * Math.sin(curAngle),
            y: height / 2 - mInnerRadius * Math.cos(curAngle),
            children: []
        })
        item.main.forEach((item1, index1) => {
            let cpsInterval = (mainNode[index].endAngle - mainNode[index].startAngle) / (len - 1)
            let childAngle = mainNode[index].startAngle + cpsInterval * index1
            let curveAngle = childAngle - Math.PI / 8
            let curveRadius = height * 0.12
            mainNode[index].children.push({
                ...item1,
                x: width / 2 - mOuterRadius * Math.sin(childAngle),
                y: height / 2 - mOuterRadius * Math.cos(childAngle),
                curveX: width / 2 - curveRadius * Math.sin(curveAngle),
                curveY: height / 2 - curveRadius * Math.cos(curveAngle),
            })
        })
    });
    let cpsLink = svg.append("g")

    let mainNodeG = svg.append("g")
        .selectAll("circle")
        .data(mainNode)
        .enter()
        .append("circle")
        .attr("class", (d, i) => `main-node main-node-${i}`)
        .attr("fill", "rgb(190,158,98)")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .on("mouseover", function (d) {
            let node = d3.select(this).node()
            let tooltip = d3.select(".tooltip-cps")
            tooltip.select(".name").text(d.name)
            tooltip.style("opacity", 1)
            tooltip.style("left", (node.cx.baseVal.value + 20) + "px")
            tooltip.style("top", (node.cy.baseVal.value - 20) + "px")
        })
        .on("mouseout", function (d, i) {
            let tooltip = d3.select(".tooltip-cps")
            tooltip.select(".name").text("")
            tooltip.select(".value").text("")
            tooltip.style("opacity", 0)
            tooltip.style("left", 0)
            tooltip.style("top", 0)
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 120)
        .attr("r", (d) => {
            let rr;
            for (let j = 0; j < flavor[that.cur].brew.length; j++) {
                if (d.name == flavor[that.cur].brew[j]) {
                    rr = 25;
                    return rr;
                } else {
                    rr = 20;
                }
            }
            return rr;
        })
        .attr("fill", function (d, i) {
            let color = ""
            for (let j = 0; j < flavor[that.cur].brew.length; j++) {
                if (d.name == flavor[that.cur].brew[j]) {
                    color = "#E0BE8C"
                    break
                } else {
                    color = "rgb(190,158,98)"
                }
            }
            return color
        })

    let mainNodeSvg = svg.append("g")
        .selectAll("path")
        .data(mainNode)
        .enter()
        .append("path")
        .attr("class", "main-path")
        .attr("d", (d) => materialSvg[d.name].path)
        .attr("transform", function (d) {
            return `translate(${d.x - 512 * 0.03},${d.y - 512 * 0.03}),scale(0.03)`
        })
        .attr("fill", "#E8E0D4")
        .attr("opacity", 0)
        .style("pointer-events", "none")
        .transition()
        .duration(1000)
        .delay((d, i) => i * 120)
        .attr("opacity", 1)

    let cpsNodeG = svg.append("g")
    let delay = 0
    // console.log(mainNode);
    mainNode.forEach((item, index) => {
        cpsLink.append("g")
            .selectAll("path")
            .data(item.children)
            .enter()
            .append("path")
            .attr("d", (d) => `M${item.x},${item.y} Q${item.x},${item.y} ${item.x},${item.y}`)
            .attr("stroke", 'grey')
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .transition()
            .duration(500)
            .delay(() => delay > cpsLen ? 0 : delay++ * 20)
            .attr("d", (d) => `M${item.x},${item.y} Q${d.curveX},${d.curveY} ${d.x},${d.y}`)
        cpsNodeG.append("g")
            .selectAll("circle")
            .data(item.children)
            .enter()
            .append("circle")
            .attr("class", "children-node")
            .attr("r", 0)
            .attr("fill", d => {
                if (d.name == '蛋白质') {
                    return "rgb(198,165,13)"
                } else if (d.name == '碳水化合物') {
                    return "rgb(184,194,202)"
                } else if (d.name == '磷') {
                    return "rgb(186,201,180)"
                } else if (d.name == '氨基酸') {
                    return "rgb(192,165,193)"
                } else {
                    return "rgb(160,98,87)"
                }
            })
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 12)
                    .attr("fill", "rgb(241,110,27)")
            })
            .on("mousemove", function (d, i) {
                let node = d3.select(this).node()
                let tooltip = d3.select(".tooltip-cps")
                tooltip.select(".name").text(d.name)
                tooltip.select(".value").text(d.value)

                tooltip.style("opacity", 1)
                tooltip.style("left", node.cx.baseVal.value + 20 + "px")
                tooltip.style("top", node.cy.baseVal.value - 20 + "px")
            })
            .on("mouseout", function (d, i) {
                let tooltip = d3.select(".tooltip-cps")
                tooltip.select(".name").text("")
                tooltip.select(".value").text("")
                tooltip.style("opacity", 0)
                tooltip.style("left", 0)
                tooltip.style("top", 0)
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 8)
                    .attr("fill", d => {
                        if (d.name == '蛋白质') {
                            return "rgb(198,165,13)"
                        } else if (d.name == '碳水化合物') {
                            return "rgb(184,194,202)"
                        } else if (d.name == '磷') {
                            return "rgb(186,201,180)"
                        } else if (d.name == '氨基酸') {
                            return "rgb(192,165,193)"
                        } else {
                            return "rgb(160,98,87)"
                        }
                    })
            })
            .transition()
            .duration(500)
            .delay(() => delay > cpsLen ? 0 : delay++ * 20)
            .attr("r", 8)
    })
}