import * as d3 from "d3"

export function kojiDetail(data) {
    let width = document.querySelector(".process").offsetWidth,
        height = document.querySelector(".process").offsetHeight + 200;
    let margin = width / 7;
    let svg = d3.select(".process-svg")

    let koji = svg.append("g")
        .attr("class", "koji-g")
    //添加一个小箭头
    // koji.append("path")
    //     .attr("d", ` M${margin - 20},${height / 6 * 4 - 5} L${margin - 20},${height / 6 * 4 + 5} L${margin - 40},${height / 6 * 4} `)
    //     .attr("stroke-width", 2)
    //     .attr("fill", "#b1ada7")
    //添加曲线
    let arcR = height / 12
    let arc = d3.arc()
        .innerRadius(arcR)
        .outerRadius(arcR)
        .startAngle(Math.PI * 0)
        .endAngle(Math.PI * 1)
    koji.append("path")
        .attr("class", "scircle")
        .attr("d", arc())
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr('transform', `translate(${width - margin},${height / 6 * 3 + arcR})`)
        .attr('stroke-dasharray', '5 15')

    koji.append("path")
        .attr("class", "scircle")
        .attr("d", `M ${width - margin},${height / 6 * 4} H${margin - 20} `)
        .attr("stroke-width", 2)
        .attr("fill", "none")

    //设置数据
    let lenMain = data.dot.length;
    let bandwidthMain = (width - 2 * margin) / (lenMain - 1);
    let bandwidthChild = 60;
    let nodeData = data.dot;
    //计算主节点的坐标
    nodeData.forEach((item, index) => {
        if (index % 2) {
            item.direct = -1
        }
        item.x = width - margin - bandwidthMain * index;
        item.y = height / 6 * 4
    });
    //添加子节点的path
    let lineChild = svg.append("g")
        .attr("class", "lineChild")
    lineChild.selectAll(".pathChild")
        .data(nodeData)
        .enter()
        .append("path")
        .attr("class", "pathChild")
        .attr("d", function (d, i) {
            if (d.direct == 1 && d.children) {
                return `M ${d.x},${d.y} Q${d.x},${d.y - 60},${d.x - 60},${d.y - 60} H${d.x - 60 - d.children.length * bandwidthChild} `
            } else if (d.children && d.direct == -1) {
                return `M ${d.x},${d.y} Q${d.x},${d.y + 60},${d.x + 60},${d.y + 60} H${d.x + 60 + d.children.length * bandwidthChild} `
            }
        })
        .attr("stroke-width", 2)
        .attr("fill", "none")
    //添加主节点
    let nodeMain = svg.append("g")
        .attr("class", "nodeChild")
    nodeMain.selectAll(".nodeChild")
        .data(nodeData)
        .enter()
        .append("circle")
        .attr("class", "nodeMain")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 10)

    nodeMain.selectAll("text")
        .data(nodeData)
        .enter()
        .append("text")
        .attr("class", "processtext")
        .attr("font-size", 18)
        .attr("x", (d) => d.x - d.name.length * 18 / 2)
        .attr("y", (d) => d.y + 30)
        .text((d) => d.name)
    //添加子节点
    let nodeChild = svg.append("g")
        .attr("class", "nodeChild")

    nodeData.forEach((item, index) => {
        if (item.direct == 1 && item.children) {
            item.children.forEach((item1, index1) => {
                item1.y = item.y - 60
                item1.x = item.x - bandwidthChild * (index1 + 1)
            })
        } else if (item.direct == -1 && item.children) {
            item.children.forEach((item1, index1) => {
                item1.y = item.y + 60
                item1.x = item.x + bandwidthChild * (index1 + 1)
            })
        }
        if (item.children) {
            nodeChild.append("g")
                .selectAll(".nodeChild")
                .data(item.children)
                .enter()
                .append("circle")
                .attr("class", "nodeChild")
                .attr("r", 7)
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
            nodeChild.append("g")
                .selectAll("text")
                .data(item.children)
                .enter()
                .append("text")
                .attr("font-size", 18)
                .attr("class", "processtext")
                .attr("x", (d) => d.x - d.name.length * 18 / 2)
                .attr("y", (d) => d.y + 30)
                .text((d) => d.name)
        }
    })

}