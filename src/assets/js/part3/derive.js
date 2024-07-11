import * as d3 from "d3"

export function derive(that) {
    let width = document.querySelector(".derive").offsetWidth,
        height = document.querySelector(".derive").offsetHeight
    let widthSmell = document.querySelector(".smell").offsetWidth
    let radius = widthSmell / 2.5
    let intervalX = width / 5, intervalY = height / 4
    let divWidth = 80
    let div = d3.select(".derive")
    let svg = div.append("svg").attr("width", width).attr("height", height)
    let flavorClass = ["浓", "酱", "清", "米", "芝", "兼", "豉", "白", "馥", "凤", "特", "药"]
    let arc = d3.arc()
        .innerRadius((d) => d.depth == 1 ? 0 : d.radius - radius / 3)
        .outerRadius((d) => d.radius)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle)
    let arcActive = d3.arc()
        .innerRadius((d) => d.depth == 1 ? 0 : d.radius - radius / 3)
        .outerRadius((d) => d.radius + 20)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle)
    let flavor = [
        [
            {
                name: "白",
                x: intervalX * 1.5,
                color: "rgb(231, 227, 226)"
            }, {
                name: "芝",
                x: intervalX * 3.5,
                color: "rgb(231, 227, 226)"
            }
        ],
        [
            {
                name: "豉",
                x: intervalX,
                color: "rgb(231, 227, 226)"
            }, {
                name: "馥",
                x: intervalX * 2.5,
                color: "rgb(231, 227, 226)"
            }, {
                name: "特",
                x: intervalX * 3.5,
                color: "rgb(231, 227, 226)"
            }
        ],
        [
            {
                name: "米",
                x: intervalX,
                link: [[1, 0], [3, 0]],
                color: "rgb(233,236,255)"
            }, {
                name: "清",
                x: intervalX * 2,
                link: [[0, 0], [1, 1], [3, 1]],
                color: "rgb(233,236,255)"
            }, {
                name: "浓",
                x: intervalX * 3,
                link: [[1, 1], [1, 2], [3, 1], [3, 2]],
                color: "rgb(233,236,255)"
            }, {
                name: "酱",
                x: intervalX * 4,
                link: [[0, 1], [1, 2], [3, 2]],
                color: "rgb(233,236,255)"

            },
        ],
        [
            {
                name: "药",
                x: intervalX,
                color: "rgb(231, 227, 226)"
            }, {
                name: "凤",
                x: intervalX * 2.5,
                color: "rgb(231, 227, 226)"
            }, {
                name: "兼",
                x: intervalX * 3.5,
                color: "rgb(231, 227, 226)"
            },
        ]
    ]
    let cnt = 0
    flavor.forEach((item, index) => {
        item.forEach((item1) => {
            item1.y = intervalY * (index + 0.5) - divWidth / 2
            item1.id = cnt
            cnt++
        })
    })
    cnt = 0
    flavor.forEach((item, index) => {
        item.forEach((item1) => {
            if (item1.link) {
                svg.append("g")
                    .selectAll("path")
                    .data(item1.link)
                    .enter()
                    .append("path")
                    .attr("fill", "rgb(230,222,201)")
                    .attr("stroke-width", 3)
                    .attr("d", (d) => {
                        let dir = item1.id > flavor[d[0]][d[1]].id ? 1 : -1
                        let arrowX = 5, arrowY = 20
                        let lx = flavor[d[0]][d[1]].x,
                            ly = flavor[d[0]][d[1]].y + divWidth / 2 + dir * divWidth / 2
                        return `M${item1.x},${item1.y + divWidth / 2 - dir * divWidth / 2} L${lx - arrowX},${ly + arrowY * dir} L${lx},${ly} L${lx + arrowX},${ly + arrowY * dir} L${item1.x},${item1.y + divWidth / 2 - dir * divWidth / 2}`
                    })
            }
            let container = div.append("div")
                .datum(item1)
                .attr('class', (d) => `derive-flavor derive-flavor-${flavorClass.indexOf(d.name)}`)
                .style("width", `${divWidth}px`)
                .style("height", `${divWidth}px`)
                .style("left", (d) => `${d.x - divWidth / 2}px`)
                .style("top", (d) => `${d.y}px`)
                .style("background-color", (d) => flavorClass.indexOf(d.name) == that.cur ? "rgb(240, 192, 180)" : d.color)
                .text((d) => d.name)
                .on("click", function (d) {
                    that.cur = flavorClass.indexOf(d.name)
                    d3.selectAll(".derive-flavor")
                        .classed("active", false)
                        .style("background-color", (d) => d.color)
                    d3.select(this)
                        .classed("active", true)
                        .style("background-color", (d) => "rgb(240, 192, 180)")
                })
            cnt++
        })
    })
}