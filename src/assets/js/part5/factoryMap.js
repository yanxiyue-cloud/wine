import * as d3 from "d3"
import factory from "@/assets/data/part5/factory.json"
import f_f from "@/assets/data/part5/factory_flavor.json"

export function factoryMap(that) {
    let width = document.querySelector(".factory-map").offsetWidth,
        height = document.querySelector(".factory-map").offsetHeight
    let southWidth = document.querySelector(".south-sea").offsetWidth,
        southHeight = document.querySelector(".south-sea").offsetHeight
    // 香型颜色  [浓,酱,清,兼,米,药,白,芝,馥,特,凤,豉,其他]
    let pointColor = ['rgb(247,129,52)', 'rgb(206,48,46)', 'rgb(80,197,183)', 'rgb(125,133,114)', 'rgb(214,168,118)', 'rgb(140,51,100)', 'rgb(161,113,150)', 'rgb(180,130,69)', 'rgb(246,144,111)', 'rgb(85,134,204)', 'rgb(38,151,70)', 'rgb(184,19,18)', 'rgb(251,180,61)']
    let svg = d3.select(".factory-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    let southSvg = d3.select(".south-sea")
        .append("svg")
        .attr("width", southWidth)
        .attr("height", southHeight)
    let map = svg.append("g")
    let point = svg.append("g")
    let factoryPoint = {
        "type": "FeatureCollection",
        "features": []
    }
    factory.sort((a, b) => a.birth - b.birth)
    factory.forEach((item, index) => {
        if (item.point) {
            factoryPoint.features.push({
                type: "Feature",
                properties: {
                    ...item,
                },
                geometry: {
                    coordinates: item.point,
                    type: "Point",
                },
            })
        }
    })
    let colorScale = d3.scaleLinear()
        .range(["rgb(200,175,124)", "rgb(254,169,154)"])
        .domain([0, 1])
    let cnt = 0
    factoryPoint.features.forEach((item, index) => {
        f_f.forEach((item1, index) => {
            let key = Object.keys(item1)
            item1[key[0]].forEach((item2) => {
                if (item2 == item.properties.name) {
                    item.properties.flavorColor = pointColor[index]
                    item.properties.flavorIndex = index
                    item.properties.flavor = key
                }
            })
        })
    })
    d3.json("map/china.json").then((data) => {
        //设置投影
        let projection = d3.geoMercator()
            .fitSize([width, height], data)
            .scale(900)
            .translate([width / 2 + 50, height / 2])
            .center([108, 38])
        //地图投影
        let mapPathData = d3.geoPath()
            .projection(projection)
        //设置南海地图投影配置以及进行投影
        let southProjection = d3.geoMercator()
            .fitSize([southWidth, southHeight], data)
            .scale(400)
            .center([114, 14])
        let southMapPathData = d3.geoPath()
            .projection(southProjection)
        //地图线条粗细
        let mapInitWidth = 0.5
        //需要渲染的数组
        let pathArr = []
        let dropPath = mapPathData(data.features[0]).split("Z")[1]
        //去除地图最外侧边框
        data.features.forEach((item, index) => {
            let d = mapPathData(item)
            let arr = d.split("Z")
            let temp = ""
            arr.forEach((item1, index1) => {
                if (item1 == dropPath) {
                    return
                }
                temp += (item1 + "Z")
            })
            pathArr.push({
                d: temp,
                ...item
            })
        });
        //绘制地图
        let tooltip = document.querySelector('.map-tooltip')
        map.selectAll("path")
            .data(pathArr)
            .enter()
            .append("path")
            .attr("class", "map-path")
            .attr("d", (d) => d.d)
            .attr('fill', 'rgba(157,156,149,0.1)')
            .attr('stroke', 'grey')
            .attr('stroke-width', mapInitWidth)
            .on("mousemove", function (d) {
                tooltip.style.opacity = 1;
                tooltip.style.left = d3.event.offsetX + 'px'
                tooltip.style.top = d3.event.offsetY + 'px'
                tooltip.innerHTML = d.properties.name
                d3.select(this)
                    .classed("active", true)
            })
            .on("mouseleave", function (d) {
                tooltip.style.opacity = 0;
                tooltip.style.left = 0 + 'px'
                tooltip.style.top = 0 + 'px'
                tooltip.innerHTML = ''
                d3.select(this)
                    .classed("active", false)
            })
        //绘制南海地图
        southSvg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", (d) => {
                let path = southMapPathData(d)
                return path
            })
            .attr('fill', 'transparent')
            .attr('stroke', 'grey')
            .attr('stroke-width', mapInitWidth)
        return projection
    }).then((projection) => {
        let pointMapData = d3.geoPath()
            .projection(projection)
        factoryPoint.features.forEach((item, index) => {
            let circlePath = pointMapData(item)
            let circleArr = circlePath.split("m")[0].split("M")[1].split(",")
            for (let i = 0; i < 2; i++) {
                circleArr[i] = parseFloat(circleArr[i])
            }
            item.properties.x = circleArr[0]
            item.properties.y = circleArr[1]
        })
        point.selectAll("circle")
            .data(factoryPoint.features)
            .enter()
            .append("circle")
            .attr("class", (d, i) => `factory-map factory-map-${i} factory-map-flavor-${d.properties.flavorIndex}`)
            .attr("cx", (d) => d.properties.x)
            .attr("cy", (d) => d.properties.y)
            .attr("r", 5)
            .attr("stroke", "rgb(255,255,255)")
            .attr("stroke-width", 1)
            .attr("fill", (d) => d.properties.flavorColor)
            .on("click", function (d, i) {
                that.factory = factory[i]
                that.ani = false
                //南海部分设置透明
                d3.select(".south-sea")
                    .transition()
                    .style("opacity", 0)
                d3.select(".factory-total")
                    .transition()
                    .style("opacity", 0)
                d3.select(".factory-map-title")
                    .transition()
                    .style("opacity", 0)
                //给地图添加偏移
                let node = d3.select(this)
                let mapCenter = [width / 2, height / 2]
                svg.selectAll("g")
                    .transition()
                    .duration(1000)
                    .attr("transform", () => {
                        let scale = 2
                        let cx = node.node().cx.baseVal.value,
                            cy = node.node().cy.baseVal.value
                        return `translate(${mapCenter[0] - cx * scale},${mapCenter[1] - cy * scale}),scale(${scale})`
                    })
                //地图上所有节点变成默认样式
                d3.selectAll(".factory-map")
                    .transition()
                    .attr("opacity", 0.1)
                    .attr("r", 5)
                node.transition()
                    .attr("r", 10)
                    .attr("stroke", "rgb(255,255,255)")
                    .attr("stroke-width", 3)
                    .attr("opacity", 1)
                //所有历史节点恢复原样
                d3.selectAll(".factory-history")
                    .transition()
                    .attr("fill", (d) => d ? d.data.color : "")
                    .attr("r", 5)
                //时间轴上对应节点变色
                d3.select(`.factory-history-${i}`)
                    .transition()
                    .attr("fill", (d) => d ? d.data.flavorColor : "")
                    .attr("r", 10)
            })
            .on("dblclick", function (d, i) {
                that.factory = ""
                that.ani = true
                //南海部分恢复
                d3.select(".south-sea")
                    .transition()
                    .style("opacity", 1)
                d3.select(".factory-total")
                    .transition()
                    .style("opacity", 1)
                d3.select(".factory-map-title")
                    .transition()
                    .style("opacity", 1)
                //地图恢复偏移
                let map = d3.select(".factory-map").select("svg")
                map.selectAll("g")
                    .transition()
                    .duration(1000)
                    .attr("transform", `translate(0,0),scale(1)`)
                //地图上所有节点恢复默认样式
                d3.selectAll(".factory-map")
                    .transition()
                    .attr("opacity", 1)
                    .attr("r", 5)
                    .attr("stroke", "rgb(255,255,255)")
                    .attr("stroke-width", 1)
                //时间轴上所有节点恢复默认样式
                d3.selectAll(".factory-history")
                    .transition()
                    .attr("fill", (d) => d ? d.data.color : "")
                    .attr("r", 5)
            })
    })
}