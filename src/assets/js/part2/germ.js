import * as d3 from "d3";
import kojiMicrobe from '@/assets/data/part2/kojiMicrobe.json'
import microbeAffect from '@/assets/data/part2/microbeAffect.json'
import flavor from "@/assets/data/part2/flavor.json";

export function drawChart(cur) {
    d3.select('.germ-svg').remove()
    let width = document.querySelector(".germ .chart").offsetWidth,
        height = document.querySelector(".germ .chart").offsetHeight
    let svg = d3.select(".germ .chart")
        .append("svg")
        .attr("class", "germ-svg")
        .attr("width", width)
        .attr("height", height)
    let mainNode = [
        {
            "name": "霉菌",
            "relative": [],
            "link": [3, 1, 2, 7, 15, 24, 14, 4, 19, 43],
            "detail": "霉菌在白酒生产中主要起启动因子作用，能够为发酵提供大量的酶系（淀粉酶、糖化酶，蛋白酶、纤维素酶、半纤维素酶、脂肪酶和果胶酶等），是糖化酶和酸性蛋白酶的主要来源。"
        },
        {
            "name": "酵母",
            "relative": [],
            "link": [23, 4, 13, 33, 29, 8, 18],
            "detail": "酵母菌有酿酒酵母、毕赤酵母、汉逊酵母、球拟酵母和假丝酵母等，为专性或兼性厌氧菌，在白酒发酵中扮演着很重要的角色，起到产酒和生香的作用。"
        },
        {
            "name": "细菌",
            "relative": [],
            "link": [5, 1, 22, 8, 4, 11, 7, 16, 13, 17, 18, 26],
            "detail": "代谢产物对白酒、黄酒和葡萄酒的香型和风味具有特殊作用。在发酵酿酒过程中，适当引入细菌还能克服白酒后味不足的缺点。",
        }
    ]
    let kojiMicrobeClass = []
    let deltaHeight = height / 4  //等边三角形中心到每个顶点的距离
    let deltaCenter = (height - deltaHeight * 1.5) / 2 //让三角形居中所需要在y轴上移动的距离
    //计算中心三个节点的位置
    mainNode.forEach((item, index) => {
        if (index == 0) {
            item.x = width / 2
            item.y = deltaCenter
        } else {
            let temp = deltaHeight * Math.cos(Math.PI / 6)
            item.y = deltaHeight * 1.5 + deltaCenter
            item.x = width / 2 - temp + temp * 2 * (index - 1)
        }
        item.contain = []
    })
    //把每个曲的同类微生物放在一起
    kojiMicrobe.forEach((item, index) => {
        item.microbe.forEach((item1, index1) => {
            mainNode[index1].contain = mainNode[index1].contain.concat(item1.contain)
        })
        kojiMicrobeClass.push(item.name)
    })
    let mainColor = ["rgb(191,211,184)", "rgb(169,128,178)", "rgb(197,164,132)"]
    mainNode.forEach((item, index) => {
        //每个曲的同种微生物放一起后去重
        let obj = {}
        let newArr = []
        for (let i = 0; i < item.contain.length; i++) {
            if (!obj[item.contain[i].name]) {
                newArr.push(item.contain[i])
                obj[item.contain[i].name] = true
            }
        }
        item.contain = newArr
        // item.contain = kojiMicrobe[0].microbe[index].contain
        //计算每个微生物的位置
        let smallRadius = height / 8 * item.contain.length / 15 //环绕的半径
        let intervalAngle = Math.PI * 2 / item.contain.length //间隔角度
        item.contain.forEach((item1, index1) => {
            item1.angle = intervalAngle * index1
            item1.x = item.x + smallRadius * Math.sin(item1.angle)
            item1.y = item.y + smallRadius * Math.cos(item1.angle)
            item1.type = item.name
        })
    })
    let link = svg.append("g")
        .selectAll("path")
        .data(mainNode)
        .enter()
        .append("path")
        .attr("d", (d, i) => {
            let next = i + 1
            if (i + 1 == 3) {
                next = 0
            }
            return `M${d.x},${d.y} L${mainNode[next].x},${mainNode[next].y}`
        })
        .attr("stroke", "grey")
        .attr("stroke-width", 1)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "5 10")
    let mainCircle = svg.append("g")
        .selectAll("circle")
        .data(mainNode)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 15)
        .attr("fill", (d, i) => mainColor[i])
        .on("mouseover", function (d) {
            console.log(cur);
            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", 14)
                .attr("fill", "rgb(255,114,86)");
            let link = d.link
            link.forEach((item) => {
                d3.select(`.word-${item}`)
                    .transition()
                    .duration(300)
                    .attr("r", 12)
                    .attr("fill", "rgb(238,154,73)")
            })
            d3.select('.microbe-text').append('text').text(d.detail)
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .attr("fill", (d, i) => mainColor[i])
            d.link.forEach((item) => {
                d3.select(`.word-${item}`)
                    .transition()
                    .duration(300)
                    .attr("r", 10)
                    .attr("fill", "rgb(135,153,184)")
            })
            d3.select('.microbe-text').text("")

        })
        .style("z-index", "10")
    let mainText = svg.append("g")
        .selectAll("text")
        .data(mainNode)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr("font-size", 24)
        .attr("font-family", "kaiTi")
        .attr('fill', 'rgb(45, 44, 41)')
        .attr('x', (d) => d.x - 20)
        .attr("y", (d) => d.y + 40)

    let smallCircle = svg.append("g")
    mainNode.forEach((item, index) => {
        //筛选每个曲用到的微生物，并添加class
        item.contain.forEach((item1, index1) => {
            item1.class = 'microbe'
            kojiMicrobe.forEach((item2, index2) => {
                item2.microbe[index].contain.forEach((item3, index3) => {
                    if (item3.name == item1.name) {
                        item1.class += ` koji-${index2}`
                    }
                })
            })
        })
        //添加三类微生物的小节点
        smallCircle.append("g")
            .selectAll("circle")
            .data(item.contain)
            .enter()
            .append("circle")
            .attr("class", (d) => d.class)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 0)
            .attr("fill", d => {
                if (d.effect == "good") {
                    return "rgb(141,193,73)"
                } else if (d.effect == "bad") {
                    return "rgb(133,133,133)"
                } else {
                    return mainColor[index]
                }
            })
            .on("mouseover", function (d) {
                // console.log(d);
                let tooltip = d3.select(".germ-tooltip")
                tooltip.select(".text-describe").text(d.name)
                tooltip.style("opacity", 1)
                tooltip.style("left", d3.event.layerX + 10 + "px")
                tooltip.style("top", d3.event.layerY + 80 + "px")
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("r", 12)
                    .attr("fill", "rgb(241,110,27)")
            })
            .on("mouseout", function (d, i) {
                let tooltip = d3.select(".germ-tooltip")
                tooltip.select(".text-describe").text("")
                tooltip.style("opacity", 0)
                tooltip.style("left", 0)
                tooltip.style("top", 0)
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("r", (d) => {
                        let arr = d.class.split(" ")
                        let r = 5
                        flavor[cur].koji.forEach((item, index) => {
                            if (arr.includes(`koji-${kojiMicrobeClass.indexOf(item)}`)) {
                                r = 10
                            }
                        })
                        return r
                    })
                    .attr("fill", d => {
                        if (d.effect == "good") {
                            return "rgb(141,193,73)"
                        } else if (d.effect == "bad") {
                            return "rgb(133,133,133)"
                        } else {
                            return mainColor[index]
                        }
                    })
            })
            .transition()
            .duration(500)
            .attr("r", (d) => {
                let arr = d.class.split(" ")
                let r = 5
                flavor[cur].koji.forEach((item, index) => {
                    if (arr.includes(`koji-${kojiMicrobeClass.indexOf(item)}`)) {
                        r = 10
                    }
                })
                return r
            })
    })
    //有害有益图例
    let legend = d3.select(".germ .chart")
        .append("svg").attr('class', 'germ-legend')
    let legendWidth = document.querySelector(".germ .chart").offsetWidth,
        legendHeight = document.querySelector(".germ .chart").offsetHeight,
        //第一图例坐标
        circleX = legendWidth * 0.05,
        circleY = legendHeight * 0.05
    legend.append('circle')
        .attr("cx", circleX)
        .attr("cy", circleY)
        .attr("r", 8)
        .attr("fill", "rgb(141,193,73)")
    legend.append('text')
        .text('有益菌')
        .attr("font-size", 18)
        .attr("font-family", "kaiTi")
        .attr('fill', 'rgb(45, 44, 41)')
        .attr('x', circleX + 20)
        .attr("y", circleY + 8)
    legend.append('circle')
        .attr("cx", circleX)
        .attr("cy", (circleY + 8) * 2)
        .attr("r", 8)
        .attr("fill", "rgb(133,133,133)")
    legend.append('text')
        .text('有害菌')
        .attr("font-size", 18)
        .attr("font-family", "kaiTi")
        .attr('fill', 'rgb(45, 44, 41)')
        .attr('x', circleX + 20)
        .attr("y", (circleY + 8) * 2 + 8)
    legend.append('circle')
        .attr("cx", circleX)
        .attr("cy", (circleY + 8) * 3)
        .attr("r", 8)
        .attr("fill", "rgb(219,220,220)")
    legend.append('text')
        .text('曲中微生物')
        .attr("font-size", 18)
        .attr("font-family", "kaiTi")
        .attr('fill', 'rgb(45, 44, 41)')
        .attr('x', circleX + 20)
        .attr("y", (circleY + 8) * 3 + 8)
}