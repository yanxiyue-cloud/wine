import blendingData from '@/assets/data/part2/blendingData.json'
import * as d3 from "d3"

export function compositionAll(that) {
    d3.select(".composition-all-svg").remove()
    let width = document.querySelector('.compositionChart').offsetWidth,
        height = document.querySelector('.compositionChart').offsetHeight
    that.height = height
    that.width = width
    let svg = d3.select('.compositionChart')
        .append("svg")
        .attr('class', 'composition-all-svg')
        .attr("width", width)
        .attr("height", height)
    let radius = height * 0.4
    //圆
    let totalAngle = Math.PI * 2

    let total = [
        { type: 'acid', data: [], len: blendingData[0].acid.length },
        { type: 'ester', data: [], len: blendingData[0].ester.length },
        { type: 'alcohol', data: [], len: blendingData[0].alcohol.length }
    ]
    let totalLen = 0
    //总物质数量
    total.forEach(item => { totalLen += item.len })
    //每个物质占的角度
    let smallAngle = totalAngle / (totalLen + 6)
    that.smallAngle = smallAngle
    //当前角度，用于计算每类物质的起始角度和终止角度
    let curAngle = 0
    total.forEach((item, index) => {
        let max = 0;
        item.startAngle = curAngle
        item.endAngle = item.startAngle + item.len * smallAngle
        curAngle = item.endAngle + 2 * smallAngle
        let tempArc = d3.arc()
            .innerRadius(radius)
            .outerRadius(radius)
            .startAngle(item.startAngle)
            .endAngle(item.endAngle)
        item.d = tempArc()
        //遍历添加每个香型数据
        for (let i = 0; i < 12; i++) {
            //找出每类最大含量，方便后面画图
            if (blendingData[i].total[index] > max) {
                max = blendingData[i].total[index]
            }
            item.data.push({
                content: blendingData[i].total[index],
                name: blendingData[i].name,
                data: blendingData[i][item.type],
            })
        }
        item.max = max
    });
    total.forEach((item, index) => {
        let s = item.startAngle
        let e = (item.endAngle - item.startAngle) * 0.8 / item.max
        item.data.forEach((item1, index1) => {
            item1.startAngle = s
            item1.endAngle = s + e * item1.content
            //调整每根弧间距离
            item1.radius = radius * 0.5 + 14 * (index1 + 1)
            let arc = d3.arc()
                .innerRadius(item1.radius)
                .outerRadius(item1.radius)
                .startAngle(item1.startAngle)
                .endAngle(item1.endAngle)
            item1.d = arc()
        })
    })

    that.total = total
    that.rectR = radius * 1.2
    that.rect = svg.append("g")
    //三种颜色
    let mainColor = ["rgb(205,185,184)", "rgb(135,153,184)", "rgb(214,203,156)"]

    //每类物质的弧
    let mainArc = svg.append("g")
        .selectAll("path")
        .data(total)
        .enter()
        .append("path")
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr("d", (d) => d.d)
        .attr('fill', 'gray')
        .attr("stroke", "rgb(196,163,131)")
        .attr("stroke-width", 3)

    let flavorArc = svg.append("g")
    let indexTip = ['总酸', '总酯', '总醇']
    //添加每个香型的各类物质总含量的线
    total.forEach((item, index) => {
        flavorArc.append("g")
            .selectAll('path')
            .data(item.data)
            .enter()
            .append("path")
            .attr("class", (d, i) => `cps-flavor-${i}`)
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .attr("d", (d) => d.d)
            .attr('fill', 'white')
            .attr("stroke", (d, i) => i == that.cur ? "#EE9A49" : mainColor[index])
            .attr("stroke-width", 0)
            .attr('opacity', 0)
            .on("mousemove", function (d, i) {
                d3.selectAll(`.cps-flavor-${i}`)
                    .transition()
                    .attr('stroke', "#EE9A49")
                    .attr("stroke-width", 12)
                let tooltip = d3.select(".tooltip-cps")
                tooltip.select(".name").text(d.name + indexTip[index])
                tooltip.select(".value").text(d.content + 'mg/L')

                tooltip.style("opacity", 1)
                tooltip.style("left", d3.event.screenX + 20 + "px")
                tooltip.style("top", d3.event.screenY - 20 + "px")
            })
            .on("mouseleave", function (d, i) {
                let tooltip = d3.select(".tooltip-cps")
                tooltip.select(".name").text("")
                tooltip.select(".value").text("")
                tooltip.style("opacity", 0)
                tooltip.style("left", 0)
                tooltip.style("top", 0)
                if (i != that.cur) {
                    // console.log(i);
                    d3.selectAll(`.cps-flavor-${i}`)
                        .transition()
                        .attr("stroke", (d, i) => mainColor[i])
                        .attr("stroke-width", 8)
                }
            })
            .transition()
            .duration(500)
            .delay((d, i) => i * 50)
            .attr("stroke-width", (d, i) => i == that.cur ? 14 : 8)
            .attr('opacity', 1)
    })
    // d3.select(".flavorArc")
    //   .on("mouseover",d=>{
    //     console.log(d);
    //   })
}

export function computPos(total, smallAngle, cur) {
    let pos = [{ type: 'acid', data: [] }, { type: 'ester', data: [] }, { type: 'alcohol', data: [] }]
    total.forEach((item, index) => {
        item.data[cur].data.forEach((item1, index1) => {
            pos[index].data.push({
                name: item1.name,
                startAngle: item.startAngle + smallAngle * (index1 - 1),
                endAngle: item.startAngle + smallAngle * (index1 + 1),
                midAngle: item.startAngle + smallAngle * (index1),
                content: item1.num
            })
        })
    })
    return pos
}