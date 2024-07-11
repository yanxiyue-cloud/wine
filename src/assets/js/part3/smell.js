import smellData from "@/assets/data/part3/smellData.json"
import * as d3 from "d3"

export function smellChart(that) {
  let width = document.querySelector(".smell").offsetWidth,
    height = document.querySelector(".smell").offsetHeight
  let flavorClass = ["浓", "酱", "清", "米", "芝", "兼", "豉", "白", "馥", "凤", "特", "药"]
  let radius = width / 2.5

  let svg = d3.select(".smell")
    .append("svg")
    .attr("class", "smell-svg")
    .attr('width', width)
    .attr('height', height)

  let smell = d3.hierarchy(smellData)
  smell.count()
  let angle = Math.PI * 2 / smell.value
  let curAngle = [0, 0, 0]
  smell.each((item) => {
    item.radius = radius / 3 * (3 - item.height)
    item.angle = item.value * angle
    item.startAngle = curAngle[item.depth - 1]
    item.endAngle = curAngle[item.depth - 1] + item.angle
    curAngle[item.depth - 1] = item.endAngle
  })
  let path = smell.descendants()
  path.shift()
  path.reverse()
  //动画后的弧
  let arc = d3.arc()
    .innerRadius((d) => d.depth == 1 ? radius / 6 : d.radius - radius / 3)
    .outerRadius((d) => d.radius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle)
  //动画前的弧
  let arcAnime = d3.arc()
    .innerRadius((d) => d.depth == 1 ? radius / 6 : d.radius - radius / 3)
    .outerRadius((d) => d.radius - 40)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle)
  //鼠标悬浮时的弧
  let arcActive = d3.arc()
    .innerRadius((d) => d.depth == 1 ? radius / 6 : d.radius - radius / 3)
    .outerRadius((d) => d.radius + 40)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle)
  //中间放图片的圆
  let imgCircle = svg.append("g")
  imgCircle.append('circle')
    .attr('r', radius / 6)
    .attr("fill", "transparent")
    .attr('cx', width / 2)
    .attr('cy', height / 2)
  let cenImage = imgCircle.append('image')
    .attr("width", radius / 3)
    .attr("height", radius / 3)
    .attr("x", width / 2 - radius / 6)
    .attr("y", height / 2 - radius / 6)
    .attr("xlink:href", `smell/白酒.svg`)
  //画弧
  // let color = d3.scaleSequential(d3.interpolateWarm);
  let arcColor = ['rgba(231,223,213)', 'rgba(230,222,197)']
  let colorScale = d3.scaleLinear().range(arcColor).domain([1, 10])
  let arcPath = svg.append("g")
  arcPath.append("g")
    .selectAll("path")
    .data(path)
    .enter()
    .append("path")
    .attr("class", (d, i) => {
      let temp = `smell-arc smell-arc-${i}`
      if (Object.prototype.toString.call(d.data.flavor) == "[object Array]") {
        d.data.flavor.forEach((item, index) => {
          temp += ` smell-class-${flavorClass.indexOf(item)}`
        })
      } else if (Object.prototype.toString.call(d.data.flavor) == "[object String]") {
        temp += ` smell-class-all`
      }
      return temp
    })
    .attr("stroke", "rgba(128,128,128,0)")
    .attr("stroke-width", 2)
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .attr("d", arcAnime)
    .attr("fill", "transparent")
    .on("mouseover", function (d, i) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("d", arcActive)
      d3.select(`.smell-text-${i}`)
        .transition()
        .duration(500)
        .attr("font-weight", "bold")
        .attr("font-size", 20)
      if (!d.data.children) {
        let image = new Image
        let src = `smell/${d.data.name}.png`
        image.src = src
        image.onload = function () {
          cenImage.attr("xlink:href", `smell/${d.data.name}.png`)
        }
        image.onerror = function () {
          cenImage.attr("xlink:href", `smell/白酒.svg`)
        }
        if (d.data.flavor) {
          //高亮对应香型
          if (d.data.flavor == "all") {
            d3.selectAll(".derive-flavor")
              .style("background-color", "rgb(240, 192, 130)")
          } else {
            d.data.flavor.forEach((item) => {
              d3.select(`.derive-flavor-${flavorClass.indexOf(item)}`)
                .style("background-color", "rgb(240, 192, 130)")
            })
          }
        }
      }
    })
    .on("mouseleave", function (d, i) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("d", (d) => {
          if (!d.data.flavor) {
            return arc(d)
          } else {
            if (d.data.flavor == "all" || d.data.flavor.includes(flavorClass[that.cur])) {
              return arcActive(d)
            } else {
              return arc(d)
            }
          }
        })
      d3.select(`.smell-text-${i}`)
        .transition()
        .duration(500)
        .attr("font-weight", "normal")
        .attr("font-size", 18)
      //左侧除当前香型全部复原
      d3.selectAll(".derive-flavor")
        .style("background-color", (d) => d.color)
      d3.select(`.derive-flavor-${that.cur}`)
        .style("background-color", "rgb(240, 192, 180)")
    })
    .transition()
    .duration(500)
    .delay((d, i) => (path.length - i) * 20)
    .attr("d", arc)
    .attr("stroke", "rgba(128,128,128,0.1)")
    .attr("fill", (d, i) => {
      if (d.data.children) {
        return d.data.itemStyle.color
      } else {
        if (d.data.flavor) {
          if (d.data.flavor == 'all') {
            return colorScale(10)
          } else {
            return colorScale(d.data.flavor.length)
          }
        }
        return "#DDEAD3"
      }
      // return d.data.itemStyle ? d.data.itemStyle.color : "transparent"
    })
  //添加文字
  arcPath.append("g")
    .selectAll("text")
    .data(path)
    .enter()
    .append("text")
    .attr("class", (d, i) => `smell-text-${i}`)
    .attr("font-size", 18)
    .text((d) => d.depth ? d.data.name : "")
    .attr("font-family", "KaiTi")
    .attr("x", (d) => d.depth ? arcAnime.centroid(d)[0] + width / 2 : 0)
    .attr("y", (d) => d.depth ? arcAnime.centroid(d)[1] + height / 2 : 0)
    .attr("font-weight", "normal")
    .attr("opacity", 0)
    .attr("transform", (d, i) => {
      if (!d.depth) {
        return
      }
      let center = arcAnime.centroid(d)
      let midAngle = (d.endAngle + d.startAngle) / 2 - Math.PI / 2
      let rotateAngle = midAngle / Math.PI * 180
      let translate = [0, 0]
      if (rotateAngle > 90) {
        rotateAngle += 180
        translate = [-d.data.name.length * 18, 0]
        return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${center[0] + d.data.name.length * 18 + width / 2},${center[1] + height / 2})`
      }
      return `translate(${translate[0]},${translate[1]}),rotate(${rotateAngle},${center[0] + width / 2},${center[1] + height / 2})`
    })
    .style("pointer-events", "none")
    .transition()
    .duration(500)
    .delay((d, i) => (path.length - i) * 20)
    .attr("opacity", 1)
    .attr("x", (d) => d.depth ? arcAnime.centroid(d)[0] + width / 2 : 0)
    .attr("y", (d) => d.depth ? arcAnime.centroid(d)[1] + height / 2 : 0)
  d3.selectAll(`.smell-class-${that.cur} ,.smell-class-all`)
    .transition()
    .delay(2000)
    .attr("d", arcActive)
}