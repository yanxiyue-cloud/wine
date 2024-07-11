import personMessage from '@/assets/data/part4/personMessage.json'
import * as d3 from "d3";

export function drawMarvelLine(cur) {
    personMessage.sort((a, b) => a.birth - b.birth)
    let peopleData = personMessage[cur]
    let width = document.querySelector(".marvel-line").offsetWidth,
        height = document.querySelector(".marvel-line").offsetHeight,
        margin = width / 20
    let svg = d3.select(".marvel-line")
        .append("svg")
        .attr("class", "marvel-svg")
        .attr("width", width)
        .attr("height", height)
    let book = peopleData.book.sort((a, b) => a.time - b.time)
    let achievement = peopleData.achievement.sort((a, b) => a.time - b.time)
    //设置书和成就的数据
    book.forEach(item => {
        item.type = "book"
        item.time = parseInt(item.time)
        item.color = "rgb(146,162,126)"
    });
    achievement.forEach(item => {
        item.type = "achievement"
        item.time = parseInt(item.time)
        item.color = "rgb(216,121,67)"
    })
    let event = book.concat(achievement).sort((a, b) => a.time - b.time)
    let eventStartTime = event[0].time - event[0].time % 10 - 20
    let eventScale = 0.8
    let eventLen = (width - margin * 2) / (eventScale * event.length + (1 - eventScale)),
        eventIntervalY = (height - margin * 2) / (event.length + 1)
    event.forEach((item, index) => {
        let short = 0.2
        item.x1 = margin + eventLen * (1 - short) * index
        item.x2 = margin + eventLen * (1 - short) * (index + 1) + eventLen * short
        item.y = height * (1 - short) - eventIntervalY * index
    })
    let eventG = svg.append("g")
    let experienceDiv = d3.select(".experience")
    let bookDiv = d3.select(".book")
    eventG.selectAll("path")
        .data(event)
        .enter()
        .append("path")
        .attr("class", (d, i) => `path-${d.type} people-path path-${d.type}-${i}`)
        .attr("stroke-width", 5)
        .attr("stroke-linecap", "round")
        .attr("stroke", (d) => d.color)
        .attr("d", (d, i) => `M${d.x1},${d.y} H${d.x1}`)
        .on("mouseover", function (d, i) {
            d3.selectAll(`.path-${d.type}`)
                .transition()
                .attr("stroke", (d) => d.color)
                .attr("stroke-width", 5)
            d3.selectAll(".book-rect")
                .transition()
                .attr("stroke-width", 2)
                .attr("stroke", "grey")
            d3.select(this)
                .transition()
                .attr("stroke", "rgb(105,120,175)")
                .attr("stroke-width", 7)
            d3.select(`.book-rect-${i}`)
                .transition()
                .attr("stroke", "rgb(105,120,175)")
                .attr("stroke-width", 7)
            if (d.type != "book") {
                experienceDiv.select(".experience-time").text(`${d.time}年`)
                experienceDiv.select(".experience-name").text(d.name)
                experienceDiv.select(".experience-text").text(d.text)
            } else {
                bookDiv.select(".book-time").text(`${d.time}年`)
                bookDiv.select(".book-name").text(d.name)
                bookDiv.select(".book-text").text(d.text)
            }
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .attr("d", (d, i) => `M${d.x1},${d.y} H${d.x2}`)

    eventG.selectAll("text")
        .data(event)
        .enter()
        .append("text")
        .attr("font-size", 30)
        .attr("x", (d, i) => i % 2 ? (d.x2) : d.x1 + 40)
        .attr("y", (d, i) => d.y + 12 + (i % 2 ? 20 : -20))
        .attr("fill", (d) => d.color)
        .attr("opacity", 0)
        .text((d) => d.time)
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .attr("opacity", 1)
        .attr("x", (d, i) => i % 2 ? (d.x2 - 40) : d.x1)

    let bookWidth = 60
    let bookHeight = 80
    event.forEach((item, index) => {
        let dir = index % 2 ? -1 : 1
        let bookTranslateX = dir * eventLen / 8
        let bookTranslateY = dir * 30
        if (item.type == "book") {
            eventG.append("path")
                .datum(item)
                .attr("stroke-width", 2)
                .attr("stroke", "grey")
                .attr("stroke-dasharray", "5 5")
                .attr("fill", "none")
                .attr("opacity", 0)
                .attr("d", (d) =>
                    `M${(d.x1 + d.x2) / 2 + bookTranslateX * 2},${d.y} V${d.y + bookTranslateY}
                     M${(d.x1 + d.x2) / 2 + bookTranslateX},${d.y + bookTranslateY} H${(d.x1 + d.x2) / 2 + bookTranslateX + dir * bookWidth}`
                )
                .transition()
                .duration(500)
                .delay(index * 50)
                .attr("opacity", 1)
            eventG.append("image")
                .datum(item)
                .attr("x", (d) => dir == -1 ? (d.x1 + d.x2) / 2 + dir * bookWidth + bookTranslateX : (d.x1 + d.x2) / 2 + bookTranslateX)
                .attr("y", (d) => dir == -1 ? d.y + bookTranslateY - bookHeight + 10 : d.y + bookTranslateY - 10)
                .attr("width", bookWidth)
                .attr("height", bookHeight)
                .attr("xlink:href", "people/book.png")
                .attr("opacity", 0)
                .on("mouseover", function (d) {
                    d3.selectAll(`.path-${d.type}`)
                        .transition()
                        .attr("stroke", (d) => d.color)
                        .attr("stroke-width", 5)
                    d3.selectAll(".book-rect")
                        .transition()
                        .attr("stroke-width", 2)
                        .attr("stroke", "grey")
                    d3.select(`.path-${d.type}-${index}`)
                        .transition()
                        .attr("stroke", "rgb(105,120,175)")
                        .attr("stroke-width", 7)
                    d3.select(this)
                        .transition()
                        .attr("stroke", "rgb(105,120,175)")
                        .attr("stroke-width", 7)
                    bookDiv.select(".book-time").text(Number(2008)+'年')
                    bookDiv.select(".book-name").text(d.name)
                    bookDiv.select(".book-text").text(d.text)
                })
                .transition()
                .duration(500)
                .delay(index * 50)
                .attr("opacity", 1)
        }
    })
    //添加图例
    svg.append("path")
        .attr("stroke", "rgb(146, 162, 126)")
        .attr("stroke-width", 5)
        .attr("stroke-linecap", "round")
        .attr("d", `M${margin},${height - 35} H${margin + 100}`)
    svg.append("text")
        .attr("x", margin + 10)
        .attr("y", height - 10)
        .attr("font-size", 20)
        .attr("font-family", "KaiTi")
        .text("出版书籍")
    svg.append("path")
        .attr("stroke", "rgb(216,121,67)")
        .attr("stroke-width", 5)
        .attr("stroke-linecap", "round")
        .attr("d", `M${margin * 3},${height - 35} H${margin * 3 + 100}`)
    svg.append("text")
        .attr("x", margin * 3 + 10)
        .attr("y", height - 10)
        .attr("font-size", 20)
        .attr("font-family", "KaiTi")
        .text("生平经历")
    svg.append("path")
        .attr("stroke", "rgb(105,120,175)")
        .attr("stroke-width", 7)
        .attr("stroke-linecap", "round")
        .attr("d", `M${margin * 5},${height - 35} H${margin * 5 + 100}`)
    svg.append("text")
        .attr("x", margin * 5 - 40)
        .attr("y", height - 10)
        .attr("font-size", 20)
        .attr("font-family", "KaiTi")
        .text("当前选中书籍或经历")
}