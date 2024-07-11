import materialData from "@/assets/data/part1/materialData.json";
import * as d3 from "d3"
import materialSvg from "@/assets/data/part1/materialSvg.json"

export function materialAll(that, cur) {
    let shortClass = ["浓", "酱", "清", "米", "芝", "兼", "豉", "白", "馥", "凤", "特", "药",]
    let width = document.querySelector(".materialAll").offsetWidth;
    let height = document.querySelector(".materialAll").offsetHeight;
    let maxRadius = height / 2.2

    let svg = d3.select(".materialAll")
        .append("svg")
        .attr("width", width)
        .attr("height", height)


    //把所有酒放在一起
    let wine = [];
    for (let i = 0; i < materialData.total.length; i++) {
        for (let j = 0; j < 5; j++) {
            wine.push({
                parent: materialData.total[i].flavor,
                parentId: i,
                ...materialData.total[i].wine[j]
            })
        }
    }
    //计算所有节点坐标
    let wineAngle = Math.PI * 1.2 / (wine.length - 1)
    let flavorAngle = Math.PI * 1.1 / (materialData.total.length - 1)
    let materialAngle = Math.PI * 1.4 / (materialData.totalX.length - 1)
    let transformY = height / 2
    let transformX = width / 1.5

    let wineImage = svg.append("image")
        .attr("width", maxRadius / 2)
        .attr("height", maxRadius / 2)
        .attr("x", transformX - maxRadius / 4)
        .attr("y", transformY - maxRadius / 4)
        .attr("xlink:href", "wine/LuZhouLaoJiao.png")

    let wineName = svg.append("text")
        .attr("x", transformX - 18 * 2)
        .attr("y", transformY + maxRadius / 4)
        .attr("font-size", 18)
        .attr("font-family", "KaiTi")
        .text("泸州老窖")
    //计算酒节点
    for (let i = 0; i < wine.length; i++) {
        wine[i].x = maxRadius * Math.sin(wineAngle * i + Math.PI * 0.9) + transformX;
        wine[i].y = maxRadius * Math.cos(wineAngle * i + Math.PI * 0.9) + transformY;
    }
    //计算香型节点
    for (let i = 0; i < materialData.total.length; i++) {
        materialData.total[i].x = maxRadius / 3 * 2 * Math.sin(flavorAngle * i + Math.PI * 0.95) + transformX;
        materialData.total[i].y = maxRadius / 3 * 2 * Math.cos(flavorAngle * i + Math.PI * 0.95) + transformY;
        materialData.total[i].linkX = (maxRadius / 3 * 2 + 20) * Math.sin(flavorAngle * i + Math.PI * 0.95) + transformX;
        materialData.total[i].linkY = (maxRadius / 3 * 2 + 20) * Math.cos(flavorAngle * i + Math.PI * 0.95) + transformY;
        materialData.total[i].short = shortClass[i]
    }
    //计算材料节点
    let material = []
    for (let i = 0; i < materialData.totalX.length; i++) {
        material.push({
            name: materialData.totalX[i],
            x: maxRadius / 2.5 * Math.sin(materialAngle * i + Math.PI * 0.8) + transformX,
            y: maxRadius / 2.5 * Math.cos(materialAngle * i + Math.PI * 0.8) + transformY,
            d: materialSvg[materialData.totalX[i]].path
        })
    }
    //添加连接线
    svg.append("g")
        .selectAll("path")
        .data(wine)
        .enter()
        .append("path")
        .attr("d", function (d) {
            let parent = materialData.total[d.parentId]
            return `M${parent.linkX},${parent.linkY} Q${parent.linkX},${parent.linkY} ${parent.linkX},${parent.linkY}`
        })
        .attr("fill", "none")
        .attr('stroke', 'grey')
        .attr('stroke-width', 2)
        .transition()
        .duration(300)
        .delay((d, i) => i * 20)
        .attr("d", function (d) {
            let parent = materialData.total[d.parentId]
            return `M${parent.linkX},${parent.linkY} Q${(parent.linkX + d.x + 30) / 2},${(parent.linkY + d.y) / 2} ${d.x},${d.y}`
        })

    //添加节点
    //内侧材料节点
    let scaleBefore = 0.025
    let materialSvgG = svg.append("g")
        .selectAll("path")
        .data(material)
        .enter()
        .append("path")
        .attr("class", "material-path")
        .attr("d", (d) => d.d)
        .attr("stroke-width", 3)
        .attr("stroke", "grey")
        .attr("fill", "grey")
        .attr("transform", function (d) {
            return `translate(${d.x - 512 * scaleBefore},${d.y - 512 * scaleBefore}),scale(${scaleBefore})`
        })
        .attr("opacity", 1)

    //添加悬浮框
    let tooltip = d3.select(".materialAll")
        .append("div")
        .attr("class", "material-tooltip")
    tooltip.append("div").attr("class", "material-name")

    let materialNode = svg.append("g")
        .selectAll("circle")
        .data(material)
        .enter()
        .append("circle")
        .attr("class", "material-node")
        .attr("r", 0)
        .attr("cx", (d, i) => d.x)
        .attr("cy", (d, i) => d.y)
        .attr("opacity", 0.1)
        .on("mouseover", function (d, i) {
            tooltip.select(".material-name").text(d.name)
            tooltip.style('display', 'block');
            tooltip.style('opacity', 2);
            tooltip.style('top', (d3.event.layerY + 20) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
        })
        .on("mouseleave", function (d, i) {
            tooltip.style("left", 0)
            tooltip.style("top", 0)
            tooltip.style('opacity', 0);
            if (materialNode.nodes()[i].classList[1] == "active") {
                return
            }
        })
        .transition()
        .duration(300)
        .delay((d, i) => i * 30)
        .attr("r", 15)
        .attr("opacity", (d) => {
            if (wine[cur * 5].material.includes(d.name)) {
                return 0.6
            }
            return 0.1
        })
    //添加外侧节点
    let wineColor = d3.scaleSequential(d3.interpolateBrBG)
    let wineNode = svg.append("g")
        .selectAll("circle")
        .data(wine)
        .enter()
        .append("circle")
        .attr("class", (d, i) => i == cur * 5 ? "item-node active" : "item-node")
        .attr("r", 0)
        .attr("cx", (d, i) => d.x)
        .attr("cy", (d, i) => d.y)
        .attr("fill", (d, i) => wineColor(0.25 + 0.001 * i))
        .on("click", function (d) {
            d3.selectAll(".item-node")
                .transition()
                .duration(500)
                .attr("r", 7)
                .attr("fill", (d, i) => wineColor(0.25 + 0.001 * i))
                .attr("stroke", (d, i) => wineColor(0.25 + 0.001 * i))
                .attr("stroke-width", 0)
            d3.selectAll(".material-path")
                .attr("class", "material-path")
                .transition()
                .duration(500)
                .attr("opacity", 1)
            d3.selectAll(".material-node")
                .attr("class", "material-node")
                .transition()
                .duration(500)
                .attr("r", 7)
                .attr("opacity", 0.1)

            //改变中间图片
            wineImage.attr("xlink:href", `wine/${d.pic}.png`)

            wineName.text(d.name)
                .attr("x", transformX - d.name.length * 18 / 2)
            //显示材料
            let node = []
            let svg = []
            let index = []
            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 13)
                .attr("fill", "rgb(244,169,79)")
                .attr("stroke", "white")
                .attr("stroke-width", 3)

            d.material.forEach((item) => {
                index.push(materialData.totalX.indexOf(item))
            })
            index.forEach(item => {
                node.push(materialNode.nodes()[item])
                svg.push(materialSvgG.nodes()[item])
            })
            //node进行变化
            node.forEach((item, index) => {
                d3.select(item)
                    .attr("class", "material-node active")
                    .transition()
                    .duration(500)
                    .attr("r", 15)
                    .attr("opacity", 0.5)
            })
            svg.forEach(item => {
                d3.select(item)
                    .attr("class", "material-path active")
                    .transition()
                    .duration(500)
                    .attr("opacity", 1)
            })
        })
        .transition()
        .duration(300)
        .delay((d, i) => i * 20)
        .attr("r", (d, i) => i == cur * 5 ? 13 : 7)
        .attr("fill", (d, i) => i == cur * 5 ? "rgb(244,169,79)" : wineColor(0.25 + 0.001 * i))
        .attr("stroke", (d, i) => i == cur * 5 ? "white" : wineColor(0.25 + 0.001 * i))
        .attr("stroke-width", (d, i) => i == cur * 5 ? 3 : 0)
    let flavorRadius = 25;
    //中间香型节点
    let flavorNode = svg.append("g")
        .attr("class", "flavor-container")
        .selectAll("circle")
        .data(materialData.total)
        .enter()
        .append("circle")
        .attr("class", "flavor-node")
        .attr('fill', `rgb(221, 204, 171)`)
        .attr("r", 0)
        .attr("cx", (d, i) => d.x)
        .attr("cy", (d, i) => d.y)
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .attr("r", (d, i) => flavorRadius)
        .transition()
        .duration(500)
        .delay(700)
        .attr("class", (d, i) => i == cur ? "flavor-node active" : "flavor-node")
        .attr("r", (d, i) => i == cur ? flavorRadius * 1.2 : flavorRadius)

    let flavor_des = svg.append("g")
        .selectAll("image")
        .data(materialData.total)
        .enter()
        .append("image")
        .attr("class", 'des-flavor')
        .attr("width", 0)
        .attr("height", 0)
        .attr("xlink:href", 'svg/des_1.svg')
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr('transform', `translate(${-(flavorRadius * 2 - 50) / 2},${-(flavorRadius * 2 - 50) / 2})`)
        .on("click", function (d, i) {
            that.renderIndex = i
            d3.selectAll(".flavor-node")
                .attr("class", "flavor-node")
                .attr("r", flavorRadius)
            let flavorNodeList = flavorNode.nodes()
            d3.select(flavorNodeList[i]).attr("class", "flavor-node active")
                .attr("r", flavorRadius * 1.2)
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .attr("width", (flavorRadius * 2 - 5))
        .attr("height", (flavorRadius * 2 - 5))
        .attr('transform', `translate(${-(flavorRadius * 2 - 5) / 2},${-(flavorRadius * 2 - 5) / 2})`)

    let flavor_short = svg.append("g")
        .selectAll("text")
        .data(materialData.total)
        .enter()
        .append("text")
        .attr('class', 'flavor-short')
        .text((d) => d.short)
        .attr("font-size", 28)
        .attr("font-family", "STXingkai")
        .attr('fill', 'rgb(45, 44, 41)')
        .attr('opacity', 0)
        .attr('x', (d) => d.x - 14)
        .attr("y", (d) => d.y + 10)
        .on("click", function (d, i) {
            that.renderIndex = i
            d3.selectAll(".flavor-node")
                .attr("class", "flavor-node")
                .attr("r", flavorRadius)
            let flavorNodeList = flavorNode.nodes()
            d3.select(flavorNodeList[i])
                .attr("class", "flavor-node active")
                .attr("r", flavorRadius * 1.2)

            d3.selectAll(".item-node")
                .transition()
                .duration(500)
                .attr("r", 7)
                .attr("fill", (d, i) => wineColor(0.25 + 0.001 * i))
                .attr("stroke", (d, i) => wineColor(0.25 + 0.001 * i))
                .attr("stroke-width", 0)
            d3.selectAll(".material-path")
                .transition()
                .duration(500)
                .attr("opacity", 1)
            d3.selectAll(".material-node")
                .transition()
                .duration(500)
                .attr("r", 7)
                .attr("opacity", 0.1)
            //改变中间图片
            wineImage.attr("xlink:href", `wine/${d.wine[0].pic}.png`)
            wineName.text(d.wine[0].name)
                .attr("x", transformX - d.wine[0].name.length * 18 / 2)

            let node = []
            let svg = []
            let index = []
            d.material.forEach((item) => {
                index.push(materialData.totalX.indexOf(item))
            })
            index.forEach(item => {
                node.push(materialNode.nodes()[item])
                svg.push(materialSvgG.nodes()[item])
            })
            //材料 node进行变化
            node.forEach((item, index) => {
                d3.select(item)
                    .transition()
                    .duration(500)
                    .attr("r", 15)
                    .attr("opacity", 0.6)
            })
            svg.forEach(item => {
                d3.select(item)
                    .transition()
                    .duration(500)
                    .attr("opacity", 1)
            })
            d3.select(wineNode.nodes()[i * 5])
                .transition()
                .duration(500)
                .attr("r", 13)
                .attr("fill", "rgb(244,169,79)")
                .attr("stroke", "white")
                .attr("stroke-width", 3)
                .attr("z-index", 100)
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .attr('opacity', 1)

    // 获取所有材料以及去重
    // let temp = []
    // materialData.total.forEach((item, index) => {
    //     item.wine.forEach((e) => {
    //         console.log(e.material);
    //         temp = temp.concat(e.material)
    //     })
    // })
    // let newA = [...new Set(temp)]
    // console.log(newA);
}