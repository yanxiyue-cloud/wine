import * as d3 from "d3"
import event from "@/assets/data/part5/china_event.json"
import factory from "@/assets/data/part5/factory.json"
import f_f from "@/assets/data/part5/factory_flavor.json"

export function factoryHistory(that) {
    let width = document.querySelector(".factory-history").offsetWidth,
        height = document.querySelector(".factory-history").offsetHeight
    let mapWidth = document.querySelector(".factory-map").offsetWidth,
        mapHeight = document.querySelector(".factory-map").offsetHeight,
        mapCenter = [mapWidth / 2, mapHeight / 2]
    let pointColor = ['rgb(247,129,52)', 'rgb(206,48,46)', 'rgb(80,197,183)', 'rgb(125,133,114)', 'rgb(214,168,118)', 'rgb(140,51,100)', 'rgb(161,113,150)', 'rgb(180,130,69)', 'rgb(246,144,111)', 'rgb(85,134,204)', 'rgb(38,151,70)', 'rgb(184,19,18)', 'rgb(251,180,61)']
    let margin = width / 20
    let svg = d3.select(".factory-history")
        .append("svg")
        .attr("class", "factory-history-svg")
        .attr("width", width)
        .attr("height", height)

    let minTime = d3.min(factory, (d) => d.birth),
        maxTime = new Date().getFullYear()
    minTime = minTime - minTime % 100
    //时间轴比例尺
    let timeScale = d3.scaleLinear()
        .range([margin, width - margin])
        .domain([minTime, maxTime])
    //中间时间段文字
    let timeText = svg.append("g")
    let timeArr = [], tempTime = minTime
    for (let i = 1; i < parseInt((maxTime - minTime) / 10); i++) {
        tempTime += 10
        timeArr.push(tempTime)
    }
    let smallText = timeText.append("g")
        .selectAll("text")
        .data(timeArr)
        .enter()
        .append("text")
        .attr("font-size", 20)
        .attr("x", (d) => timeScale(d) - 20)
        .attr("y", height / 4 * 3 + 30)
        .text((d) => d)
        .style("user-select", "none")
    //最大时间文字
    let largerText = timeText.append("g")
    largerText.append("text")
        .attr("font-size", 32)
        .attr("x", margin - 32)
        .attr("y", height / 4 * 3 + 40)
        .text(minTime)
        .style("user-select", "none")
    largerText.append("text")
        .attr("font-size", 32)
        .attr("x", width - margin - 32)
        .attr("y", height / 4 * 3 + 40)
        .text(maxTime)
        .style("user-select", "none")
    //主时间轴
    let timePath = svg.append("path")
        .attr("stroke-width", 5)
        .attr("stroke", "rgb(253,174,82)")
        .attr("stroke-linecap", "round")
        .attr("d", `M${margin},${height / 10 * 7} H${width - margin}`)
    //添加主时间轴上的中国大事件
    let eventG = svg.append("g")
        .selectAll("circle")
        .data(event)
        .enter()
        .append("circle")
        .attr("r", (d) => d.name == "开国大典" ? 10 : 8)
        .attr("fill", (d) => d.name == "开国大典" ? "#de2910ff" : "#BDB76B")
        .attr("cy", height / 10 * 7)
        .attr("cx", (d) => timeScale(d.time))
        .on("mouseover", function (d) {
            let tooltip = d3.select(".cur-factory-tooltip")
            tooltip.style("left", (timeScale(d.time) - d.name.length * 21 / 2) + "px")
                .style("top", height / 10 * 7 + "px")
                .style("opacity", 1)
            tooltip.select(".time")
                .text(d.time)
            tooltip.select(".name")
                .text(d.name)
            d3.select(this)
                .transition()
                .attr("r", (d) => d.name == "开国大典" ? 12 : 10)
        })
        .on("mouseleave", function (d) {
            let tooltip = d3.select(".cur-factory-tooltip")
            tooltip.style("left", 0)
                .style("top", 0)
                .style("opacity", 0)
            tooltip.select(".time")
                .text("")
            tooltip.select(".name")
                .text("")
            d3.select(this)
                .transition()
                .attr("r", (d) => d.name == "开国大典" ? 10 : 8)
        })
    //酒厂排序
    let colorScale = d3.scaleLinear()
        .range(["rgb(200,175,124)", "rgb(254,169,154)"])
        .domain([0, 1])
    let cnt = 0
    factory.sort((a, b) => a.birth - b.birth)
    factory.forEach((item, index) => {
        f_f.forEach((item1, index) => {
            let key = Object.keys(item1)
            item1[key[0]].forEach((item2) => {
                if (item2 == item.name) {
                    item.color = colorScale(cnt * 0.005)
                    item.flavorColor = pointColor[index]
                    item.flavorIndex = index
                    item.flavor = key
                    cnt++
                }
            })
        })
    });
    //添加时间轴上酒厂节点
    let n = parseInt((maxTime - minTime) / 10 + ((maxTime - minTime) % 10 ? 1 : 0))
    //初始化每段日期的结构
    let factoryArr = []
    for (let i = 0; i < n; i++) {
        factoryArr.push({
            name: `time_${i}`,
            children: []
        })
    }
    //遍历酒厂，根据时期放入不同阶段数组
    factory.forEach((item) => {
        let i = parseInt((item.birth - minTime) / 10)
        factoryArr[i].children.push(item)
    })
    //遍历数组设置节点布局
    let curveBG = svg.append("g")
    let timeNode = svg.append("g")
    let node = []
    let nodeY = height / 10 * 3.5
    factoryArr.forEach((item, index) => {
        let root = d3.hierarchy(item)
            .sum(function (d) { return d ? 1 : 0 })
        let pack = d3.pack(root)
            .radius((d) => 7)
            .padding(3)
        let time = pack(root).descendants().slice(1)
        let minClose = d3.packEnclose(time)
        //计算能包裹当前数组所有圆的最小半径
        let r = minClose ? minClose.r : 0
        //设置上下两条曲线的控制点
        item.curveY1 = nodeY - (r ? (r + 5) : 0)
        item.curveY2 = nodeY + (r ? (r + 5) : 0)
        item.curveX = timeScale(minTime + (index + 1) * 10 - 5)
        //遍历设置每个点的偏移值
        time.forEach((item1, index1) => {
            item1.data.timeX = timeScale(minTime + (index + 1) * 10 - 5)
            item1.data.timeY = nodeY
        })
        //添加每组最大的圆
        timeNode.append("circle")
            .attr("r", r)
            .attr("cx", timeScale(minTime + (index + 1) * 10 - 5))
            .attr("cy", nodeY)
            .attr("fill", "rgba(255,231,147,0.4)")
        //将所有node合并
        node = node.concat(time)
    })
    //添加曲线背景
    let curve1 = d3.line()
        .x((d) => d.curveX)
        .y((d) => d.curveY1)
        .curve(d3.curveBasis)
    let curve2 = d3.line()
        .x((d) => d.curveX)
        .y((d) => d.curveY2)
        .curve(d3.curveBasis)
    curveBG.append("path")
        .attr("stroke-width", 2)
        .attr("stroke", "rgba(128,128,128,0.1)")
        .attr("fill", "rgba(128,128,128,0.1)")
        .attr("d", curve1(factoryArr))
    curveBG.append("path")
        .attr("stroke-width", 2)
        .attr("stroke", "rgba(128,128,128,0.1)")
        .attr("fill", "rgba(128,128,128,0.1)")
        .attr("d", curve2(factoryArr))
    //添加时间轴上节点
    timeNode.append("g")
        .selectAll("circle")
        .data(node)
        .enter()
        .append("circle")
        .attr("class", (d, i) => `factory-history factory-history-${i} factory-history-${d.flavorIndex}`)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", (d, i) => d.data.color)
        .attr("transform", (d) => `translate(${d.data.timeX},${d.data.timeY})`)
        .on("click", function (d, i) {
            if (d3.select(`.factory-map-${i}`).node()) {
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
                //所有历史节点恢复原样
                d3.selectAll(".factory-history")
                    .transition()
                    .attr("fill", (d) => d ? d.data.color : "")
                    .attr("r", 5)
                //当前节点变色
                d3.select(this)
                    .transition()
                    .attr("fill", (d) => d.data.flavorColor)
                    .attr("r", 10)
                //地图上所有节点变成默认样式
                d3.selectAll(".factory-map")
                    .transition()
                    .attr("opacity", 0.1)
                    .attr("r", 5)
                //地图上当前节点变成选中样式
                let node = d3.select(`.factory-map-${i}`)
                node.transition()
                    .attr("r", 10)
                    .attr("stroke", "rgb(255,255,255)")
                    .attr("stroke-width", 3)
                    .attr("opacity", 1)
                //给地图添加偏移
                let map = d3.select(".factory-map").select("svg")
                map.selectAll("g")
                    .transition()
                    .duration(1000)
                    .attr("transform", () => {
                        let scale = 2
                        let cx = node.node().cx.baseVal.value,
                            cy = node.node().cy.baseVal.value
                        return `translate(${mapCenter[0] - cx * scale},${mapCenter[1] - cy * scale}),scale(${scale})`
                    })
            }
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
                .attr("fill", function (d) {
                    if (d) {
                        return d.data.color
                    }
                })
                .attr("r", 5)
        })
        .transition()
        .duration(700)
        .delay((d, i) => i * 10)
        .attr("r", (d) => d.r)

    //添加图例 香型颜色  [浓,酱,清,兼,米,药,白,芝,馥,特,豉,其他]
    let flavorClass = ["浓", "酱", "清", "兼", "米", "药", "白", "芝", "馥", "特", "凤", "豉", "其他"]
    let example = svg.append("g")
    example.selectAll("circle")
        .data(pointColor)
        .enter()
        .append("circle")
        .attr("class", (d, i) => `factory-example factory-example-${i}`)
        .attr("fill", (d, i) => d)
        .attr("cy", 15)
        .attr("cx", (d, i) => width / 4 * 3 + 30 * i)
        .attr("r", 10)
        .on("click", function (d, i) {
            if (d3.select(`.factory-map-${i}`).node()) {
                that.factory = ""
                that.ani = false
                //所有历史节点恢复原样
                d3.selectAll(".factory-history")
                    .transition()
                    .attr("fill", (d) => d ? d.data.color : "")
                    .attr("r", 5)
                //地图上所有节点变成默认样式
                d3.selectAll(".factory-map")
                    .transition()
                    .attr("opacity", 0.1)
                    .attr("r", 5)
                //地图上当前节点变成选中样式
                let node = d3.selectAll(`.factory-map-flavor-${i}`)
                node.transition()
                    .attr("r", 10)
                    .attr("stroke", "rgb(255,255,255)")
                    .attr("stroke-width", 3)
                    .attr("opacity", 1)
                d3.selectAll(".factory-example")
                    .transition()
                    .attr("opacity", 0.3)
                d3.selectAll(`.factory-example-${i}`)
                    .transition()
                    .attr("opacity", 1)
            }
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
                .attr("fill", function (d) {
                    if (d) {
                        return d.data.color
                    }
                })
                .attr("r", 5)
        })
    example.selectAll("text")
        .data(flavorClass)
        .enter()
        .append("text")
        .attr("class", (d, i) => `factory-example factory-example-${i}`)
        .attr("font-size", 20)
        .attr("font-family", "KaiTi")
        .attr("y", 45)
        .attr("x", (d, i) => width / 4 * 3 + 30 * i - d.length * 10)
        .text((d) => d)

    example.append("circle")
        .attr("class", `factory-total`)
        .attr("fill", 'rgb(181,152,48)')
        .attr("cy", 15)
        .attr("cx", width / 4 * 3 + 30 * 14)
        .attr("r", 10)
        .on("click", function (d, i) {
            if (d3.select(`.factory-map-${i}`).node()) {
                that.factory = ""
                that.ani = false
                //所有历史节点恢复原样
                d3.selectAll(".factory-history")
                    .transition()
                    .attr("fill", (d) => d ? d.data.color : "")
                    .attr("r", 5)
                //地图上当前节点变成选中样式
                let node = d3.selectAll(`.factory-map`)
                node.transition()
                    .attr("r", 5)
                    .attr("stroke", "rgb(255,255,255)")
                    .attr("stroke-width", 1)
                    .attr("opacity", 1)
                d3.selectAll(".factory-example")
                    .transition()
                    .attr("opacity", 1)
            }
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
                .attr("fill", function (d) {
                    if (d) {
                        return d.data.color
                    }
                })
                .attr("r", 5)
        })
    example.append("text")
        .attr("class", `factory-total-text`)
        .attr("font-size", 20)
        .attr("font-family", "KaiTi")
        .attr("y", 45)
        .attr("x", width / 4 * 3 + 30 * 14 - 4 * 10)
        .text('所有香型')
}