import * as d3 from "d3"
import distillData from '@/assets/data/part1/distillData.json'

export function distillAll(cur) {
    let width = document.querySelector('.distillAll .chart').offsetWidth,
        height = document.querySelector('.distillAll .chart').offsetHeight
    let wineClass = ["浓香型", "酱香型", "清香型", "米香型", "芝麻香型", "兼香型", "豉香型", "老白干香型", "馥郁香型", "凤香型", "特香型", "药香型"]
    let shortClass = ["浓", "酱", "清", "米", "芝", "兼", "豉", "白", "馥", "凤", "特", "药"]
    let svg = d3.select(".distillAll .chart")
        .append("svg")
        .attr("class", "distill-all-svg")
        .attr("width", width)
        .attr('height', height)
    let r = width / 2.5
    let dotFontSize = 17
    let treeData = d3.hierarchy(distillData)
    let treeSet = d3.tree()
        .size([360, r])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
    treeSet(treeData)
    treeData.each((item) => {
        let x1 = item.x
        item.r = r / 2 * item.depth
        item.angle = x1 / 180 * Math.PI
        item.x = item.r * Math.cos(item.angle)
        item.y = item.r * Math.sin(item.angle)
        item.xt = (item.r - 25) * Math.cos(item.angle)
        item.yt = (item.r - 25) * Math.sin(item.angle)
    })

    let nodes = treeData.descendants()
    let links = treeData.links()
    let link = d3.linkHorizontal()
        .x((d) => d.x)
        .y((d) => d.y)

    let treeLinkG = svg.append("g")
    treeLinkG.selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", (d) => {
            if (d.source.depth == 0) {
                return `distill-link-${wineClass.indexOf(d.target.data.name)} distill-link`
            } else if (d.source.depth == 1) {
                return `distill-link-${wineClass.indexOf(d.source.data.name)} distill-link`
            }
        })
        .attr("d", (d) => {
            if (d.source.depth > 0) {
                return `M${d.source.x},${d.source.y} Q${d.source.x},${d.source.y} ${d.source.x},${d.source.y}`
            }
        })
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .transition()
        .duration(300)
        .delay((d, i) => i * 20)
        .attr("d", (d) => {
            if (d.source.depth == 0) {
                return
            }
            return `M${d.source.x},${d.source.y} Q${(d.target.x + d.source.x) / 3},${(d.target.y + d.source.y) / 3} ${d.target.x},${d.target.y}`
        })
    //悬浮框
    let tooltip = d3.select(".distillAll")
        .append("div")
        .attr("class", "distillAll-tooltip")
    // .attr("width", 200px)
    tooltip.append("div").attr("class", "text-describe")


    let treeNodeG = svg.append("g")
    let color = d3.scaleSequential(d3.interpolatePuOr)
    treeNodeG.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", (d) => {
            if (d.depth == 1) {
                return `distill-flavor-${wineClass.indexOf(d.data.name)} distill-node`
            } else if (d.depth == 2) {
                return `distill-flavor-${wineClass.indexOf(d.parent.data.name)} distill-node`
            }
        })
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr('r', 0)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr('fill', (d, i) => d.depth == 2 ? color(0.7 + 0.002 * i) : color(1))
        .attr("opacity", (d, i) => i == 0 ? 1 : 0.3)
        .on("mouseover", function (d) {
            d3.selectAll(`.distill-flavor-${wineClass.indexOf(d.data.name)}`)
                .transition()
                .duration(500)
                .attr("r", "12")
                .attr("opacity", 1)

            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", (d) => d.depth == 2 ? 12 : 22)
                .attr("opacity", 1)

            if (d.depth == 2) {
                let j = 0   //第几步
                for (let k = 0; k < d.parent.children.length; k++) {
                    if (d.data.name == d.parent.children[k].data.name) {
                        j = k
                        break
                    }
                }
                tooltip.select(".text-describe").text(`第${j + 1}步：${d.data.name}`)
            } else {
                tooltip.select(".text-describe").text(d.data.name)
            }
            tooltip.style('display', 'block');
            tooltip.style('opacity', 2);
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
        })
        .on("mouseleave", function (d, i) {
            tooltip.style("display", "none");
            tooltip.style('opacity', 0);
            if (d.depth == 1) {
                d3.selectAll(`.distill-flavor-${wineClass.indexOf(d.data.name)}`)
                    .transition()
                    .duration(500)
                    .attr("r", (d) => d.depth == 2 ? 10 : 20)
                    .attr("opacity", 0.3)
            } else if (d.depth == 2) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", 9)
                    .attr("opacity", 0.3)
            }
            d3.selectAll(`.distill-flavor-${cur}`)
                .transition()
                .duration(500)
                .attr("r", (d) => d.depth == 2 ? 10 : 20)
                .attr("opacity", 1)
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr('r', (d) => d.depth == 2 ? 10 : 20)
    //添加文字
    let treeText = svg.append('g')
    treeText.selectAll('text')
        .data(nodes.slice(1, 13))
        .enter()
        .append("text")
        .attr("class", "tree-text")
        .text((d, i) => shortClass[i])
        .attr("font-size", dotFontSize)
        .attr("font-family", "KaiTi")
        .attr("fill", "white")
        .attr("font-size", 20)
        .attr("x", (d) => d.x - 11)
        .attr("y", (d) => d.y + 7)
        .attr("opacity", 0)
        .attr('transform', function (d, i) {
            return `translate(${width / 2},${height / 2})`
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("opacity", 1)

    setTimeout(() => {
        d3.selectAll(`.distill-flavor-${cur}`)
            .transition()
            .duration(500)
            .attr("opacity", 1)
        d3.selectAll(`.distill-link-${cur}`)
            .transition()
            .duration(500)
            .attr("stroke", "grey")
    }, 1000);
    //图例
    let tyWidth = document.querySelector(".distill-typical").offsetWidth;
    let tyHeight = document.querySelector(".distill-typical").offsetHeight;
    let typicalSvg = d3.select(".distill-typical")
        .append("svg")
        .attr("class", "typical-svg")
        .attr("width", tyWidth)
        .attr("height", tyHeight)
    let dot1 = typicalSvg.append("g")
    dot1.append("circle")
        .attr("r", 10)
        .attr("cx", tyWidth / 6)
        .attr("cy", tyHeight / 9 + 10)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("opacity", 0.3)
        .attr('fill', color(1))
    dot1.append("text")
        .text("香型")
        .attr("font-size", dotFontSize)
        .attr("font-family", "KaiTi")
        .attr("font-weight", "bold")
        .attr("fill", "grey")
        .attr("x", tyWidth / 6 + 15)
        .attr("y", tyHeight / 7 + dotFontSize / 2 + 5)

    let dot2 = typicalSvg.append("g")
    dot2.append("circle")
        .attr("r", 10)
        .attr("cx", tyWidth / 6)
        .attr("cy", tyHeight / 2 + 18)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("opacity", 0.3)
        .attr('fill', color(0.7))
    dot1.append("text")
        .text("蒸馏步骤")
        .attr("font-size", dotFontSize)
        .attr("font-family", "KaiTi")
        .attr("font-weight", "bold")
        .attr("fill", "grey")
        .attr("x", tyWidth / 6 + 15)
        .attr("y", tyHeight / 2 + dotFontSize / 2 + 16)
}