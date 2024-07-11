import * as d3 from "d3"
import cloud from "@/assets/data/part2/cloud.json"

export function wordCloud() {
    let width = document.querySelector(".cloud .chart").offsetWidth
    let height = document.querySelector(".cloud .chart").offsetHeight
    let svg = d3.select(".cloud .chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    let leftCircleX = width / 5 * 2, rightCircleX = width / 5 * 3
    let circleY = height / 2
    let basicR = height / 3
    let data = []
    let microbeText = d3.select(".cloud .chart")
        .append("div").attr("class", "microbe-text")
    //去除没有关联的词语
    cloud.forEach((item, index) => {
        if (item.link.length) {
            data.push(item)
        }
    })
    let intervalAngle = Math.PI * 2 / data.length
    //计算节点坐标
    data.forEach((item, index) => {
        item.angle = intervalAngle * index
        if (index < data.length / 2) {
            item.x = rightCircleX + basicR * Math.sin(item.angle)
            item.y = circleY - basicR * Math.cos(item.angle)
        } else {
            item.x = leftCircleX + basicR * Math.sin(item.angle)
            item.y = circleY - basicR * Math.cos(item.angle)
        }
    });
    //设置连线数据
    data.forEach((item, index) => {
        item.linkPath = []
        //如果有连接线则进入循环
        if (item.link.length) {
            item.link.forEach((item1, index1) => {
                //遍历link，找到每个link对应的坐标
                data.forEach((item2, index2) => {
                    let id = parseInt(item2.id)
                    if (id == item1) {
                        item.linkPath.push({
                            sourceId: item.id,
                            targetId: item2.id,
                            source: [item.x, item.y],
                            target: [item2.x, item2.y]
                        })
                    }
                })
            })
        }
    })
    //添加节点和连线
    let link = svg.append("g")
    let node = svg.append("g")
    let text = svg.append("g")
    let count = data.map((item) => {
        return parseInt(item.count)
    })
    let scale = d3.scaleLinear()
        .domain([d3.max(count), d3.min(count)])
        .range([8, 10]) //圆半径
    node.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", (d) => `word-circle word-${d.id}`)
        .attr("cx", (d) => {
            return d.x
        })
        .attr("cy", (d => d.y))
        .attr("fill", (d) => {
            return "rgb(135,153,184)"
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 14)
                .attr("fill", "rgb(255,114,86)")
            d3.selectAll(".word-link")
                .transition()
                .duration(500)
                .attr("opacity", 0)
            d3.selectAll(`.word-link-${d.id}`)
                .transition()
                .duration(500)
                .attr("stroke", "rgb(205,173,0)")
                .attr("stroke-width", 3)
                .attr("opacity", 1)

            d.linkPath.forEach((item) => {
                d3.select(`.word-${item.targetId}`)
                    .transition()
                    .duration(500)
                    .attr("r", 12)
                    .attr("fill", "rgb(238,154,73)")
            })
        })
        .on("mouseleave", function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", () => {
                    // return 10
                    return scale(count[i])
                })
                .attr("fill", "rgb(135,153,184)")
            d3.selectAll(".word-link")
                .transition()
                .duration(500)
                .attr("opacity", 1)
                .attr("stroke", "rgb(196,163,131)")
                .attr("stroke-width", 1)

            d.linkPath.forEach((item) => {
                d3.select(`.word-${item.targetId}`)
                    .transition()
                    .duration(500)
                    .attr("r", 10)
                    .attr("fill", "rgb(135,153,184)")
            })
        })
        .transition()
        .duration(1000)
        .attr("r", (d, i) => {
            // return 10
            return scale(count[i])
        })
    text.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => {
            let rotateAngle = (-Math.PI / 2 + d.angle) / Math.PI * 180
            if (rotateAngle > 90) {
                return d.x - 15
            } else {
                return d.x + 15
            }
        })
        .attr("y", (d) => d.y + 5)
        .text((d) => d.name)
        .attr("font-szie", 25)
        .attr("font-family", "fangsong")
        .attr("transform", function (d) {
            let rotateAngle = (-Math.PI / 2 + d.angle) / Math.PI * 180
            let translate = [0, 0]
            if (rotateAngle > 90) {
                translate = [-d.name.length * 16, 0]
                rotateAngle += 180
                return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.x + d.name.length * 18},${d.y})`
            }
            return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${d.x},${d.y})`
        })
    data.forEach((item, index) => {
        if (item.link.length) {
            link.append("g")
                .selectAll("path")
                .data(item.linkPath)
                .enter()
                .append("path")
                .attr("class", (d) => `word-link word-link-${d.sourceId} word-link-${d.targetId}`)
                .attr("stroke", "rgb(196,163,131)")
                .attr("fill", "none")
                .attr("stroke-width", 1)
                .attr("d", (d) => `M${d.source[0]},${d.source[1]} Q${d.source[0]},${d.source[1]} ${d.source[0]},${d.source[1]}`)
                .transition()
                .duration(1000)
                .attr("d", (d) => `M${d.source[0]},${d.source[1]} Q${width / 2},${height / 2} ${d.target[0]},${d.target[1]}`)
        }
    })
}