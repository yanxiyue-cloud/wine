import * as d3 from "d3"
import storageData from "@/assets/data/part1/storageData.json"

export function storageAll(cur) {
    d3.select(".storage-all-svg").remove()
    let data = storageData,
        equipment = storageData.equipment,
        flavor = storageData.flavor,
        year = storageData.year,
        link = storageData.link
    let arrY = [], arrE = [], arrF = [];
    let shortClass = ["浓", "酱", "清", "米", "芝", "兼", "豉", "白", "馥", "凤", "特", "药",]
    let margin = 50;
    let width = document.querySelector(".storageAll .chart").offsetWidth - margin * 2;
    let height = document.querySelector(".storageAll .chart").offsetHeight;
    let rectHeight = height / 35;
    let eqWidth = width / 5;
    let flavorWidth = width / 13;
    let flavorY = height - 70,
        yearY = height / 2,
        equipmentY = 70;
    let svg = d3.select(".storageAll .chart")
        .append("svg")
        .attr('class', 'storage-all-svg')
        .attr('width', width)
        .attr('height', height);
    //每个设备、香型的起始和结束位置(平均)
    equipment.forEach((item, index) => {
        arrE.push(item.name);
        let len = data.equipment.length;
        item.flow = 0;
        item.width = eqWidth - rectHeight;
        item.start = index * (eqWidth + (width - eqWidth * len) / (len - 1));
        item.end = item.start + eqWidth;
        item.cur = item.start + rectHeight / 2;
    });
    flavor.forEach((item, index) => {
        let len = data.flavor.length;
        item.width = flavorWidth - rectHeight;
        item.start = index * (flavorWidth + (width - flavorWidth * len) / (len - 1));
        item.end = item.start + flavorWidth;
        item.cur = item.start + rectHeight / 2;
        item.short = shortClass[index];
        arrF.push(item.name)
    })
    //每个时期默认流量为0
    year.forEach((item) => {
        item.flow = 0;
        arrY.push(item.name);
    })
    //计算流量
    link.forEach((item, index) => {
        for (let i = 0; i < item.link.length; i++) {
            let j = arrY.indexOf(item.link[i].year),
                k = arrE.indexOf(item.link[i].equipment);
            year[j].flow += 1;
            equipment[k].flow += 1;
        }
    })
    //总流量
    let totalFlow = 0;
    storageData.year.forEach((item, index) => {
        totalFlow += item.flow;
    })
    let yearWidth = width / (totalFlow + 3);
    let temp = 0;
    //几个时期的起始和结束位置
    year.forEach((item, index) => {
        item.width = yearWidth * item.flow - rectHeight;
        item.start = temp * yearWidth;
        item.cur = item.start + rectHeight / 2;
        item.end = item.start + yearWidth * (item.flow);
        temp += item.flow + 1;
    })
    //计算每条link在对应设备、时间、香型上的位置
    link.forEach((item, index) => {
        for (let i = 0; i < item.link.length; i++) {
            item.link[i].flavor = item.name
            item.link[i].fx1 = flavor[index].cur;
            item.link[i].fx2 = item.link[i].fx1 + flavor[index].width / (item.link.length);
            flavor[index].cur = item.link[i].fx2;

            equipment.forEach((item1, index1) => {
                if (item1.name == item.link[i].equipment) {
                    item.link[i].ex1 = item1.cur;
                    item.link[i].ex2 = item.link[i].ex1 + item1.width / (item1.flow);
                    item1.cur = item.link[i].ex2;
                }
            })

            year.forEach((item2, index2) => {
                if (item2.name == item.link[i].year) {
                    item.link[i].yx1 = item2.cur;
                    item.link[i].yx2 = item.link[i].yx1 + (item2.width) / item2.flow;
                    item2.cur = item.link[i].yx2
                }
            })
        }
    })

    let tooltip = d3.select(".storage-tooltip")
    let flavorText = d3.select(".flavor-text")
    let equipText = d3.select(".equip-text")
    let yearText = d3.select(".year-text")

    let sankeyLink = svg.append("g")
        .attr('class', 'sankeyLink')
    link.forEach((item, index) => {
        sankeyLink.append('g')
            .selectAll('path')
            .data(item.link)
            .enter()
            .append('path')
            .attr('class', (d, i) => `link year_${arrY.indexOf(d.year)} eq_${arrE.indexOf(d.equipment)} flavor_${arrF.indexOf(item.name)}`)
            .attr('d', (d) => `M${d.fx1},${flavorY} 
            C${d.fx1},${flavorY - 50} ${d.yx1},${yearY + rectHeight + 50} ${d.yx1},${yearY + rectHeight},V${yearY} 
            C${d.yx1},${yearY - 50} ${d.ex1},${equipmentY + rectHeight + 50} ${d.ex1},${equipmentY + rectHeight} H${d.ex2}
            C${d.ex2},${equipmentY + rectHeight + 50} ${d.yx2},${yearY - 50} ${d.yx2},${yearY} V${yearY + rectHeight}
            C${d.yx2},${yearY + rectHeight + 50} ${d.fx2},${flavorY - 50} ${d.fx2},${flavorY}`)
            .attr('fill', 'rgb(221,204,171)')
            .attr('opacity', 0.2)
            .on("mousemove", function (d) {
                flavorText.text(`香型:${d.flavor}`)
                equipText.text(`贮存设备:${d.equipment}`)
                yearText.text(`贮存年份:${d.year}年`)
                tooltip.style('display', 'block');
                tooltip.style('opacity', 2);
                tooltip.style('top', (d3.event.layerY + 10) + 'px')
                    .style('left', (d3.event.layerX - margin) + 'px');
                d3.select(this)
                    .attr("opacity", 1)
                    .attr("fill", "rgb(210,168,95)")
            })
            .on("mouseout", function (d) {
                tooltip.style('opacity', 0);
                // tooltip.style("display", "none");
                d3.select(this)
                    .attr('fill', 'rgb(221,204,171)')
                    .attr('opacity', 0.2)

                d3.selectAll(`.flavor_${cur}`)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
                    .attr("fill", "#C5C1AA")
                tooltip.style('top', 0 + 'px')
                    .style('left', 0 + 'px');
            })
    })
    // 添加设备、香型、时间节点
    let flavorRect = svg.append("g")
        .selectAll('rect')
        .data(flavor)
        .enter()
        .append('rect')
        .attr('class', 'flavor-rect')
        .attr('width', flavorWidth)
        .attr('height', rectHeight)
        .attr('x', (d, i) => d.start)
        .attr('y', flavorY)
        .attr('rx', rectHeight / 2)
        .on('mouseover', function (d, i) {
            let index = arrF.indexOf(d.name)
            let node = document.querySelectorAll(`.flavor_${index}`);
            node.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 0.8)
            })
            d3.select(`.store-text-${i}`)
                .transition()
                .duration(300)
                .attr("opacity", 1)
        })
        .on('mouseleave', function (d, i) {
            let index = arrF.indexOf(d.name)
            if (index == cur) {
                return
            }
            let node = document.querySelectorAll(`.flavor_${index}`);
            node.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 0.1)
            })
            if (i == cur) {
                return
            }
            d3.select(`.store-text-${i}`)
                .transition()
                .duration(300)
                .attr("opacity", 0.3)
        })
    let equipmenRect = svg.append("g")
        .selectAll('rect')
        .data(equipment)
        .enter()
        .append('rect')
        .attr('class', 'equip-rect')
        .attr('width', eqWidth)
        .attr('height', rectHeight)
        .attr('x', (d, i) => d.start)
        .attr('y', equipmentY)
        .attr('rx', rectHeight / 2)
        .on('mouseover', function (d, i) {
            let index = arrE.indexOf(d.name)
            let node = document.querySelectorAll(`.eq_${index}`);
            node.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
            })
        })
        .on('mouseleave', function (d, i) {
            let index = arrE.indexOf(d.name)
            let node = document.querySelectorAll(`.eq_${index}`);
            node.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 0.1)
            })
            let activeNode = document.querySelectorAll(`.flavor_${cur}`)
            activeNode.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
            })
        })
    //设备上的图片
    let eqImage = svg.append("g")
        .selectAll('image')
        .data(equipment)
        .enter()
        .append('image')
        .attr('class', 'equip-img')
        .attr("width", 50)
        .attr("height", 50)
        .attr("xlink:href", d => d.img)
        .attr('x', (d, i) => d.start + 10)
        .attr('y', equipmentY - 55)
    let yearRect = svg.append("g")
        .selectAll('rect')
        .data(year)
        .enter()
        .append('rect')
        .attr('class', 'year-rect')
        .attr('width', (d) => d.end - d.start)
        .attr('height', rectHeight)
        .attr('x', (d, i) => d.start)
        .attr('y', yearY)
        .attr('rx', rectHeight / 2)
        .on('mouseover', function (d, i) {
            let index = arrY.indexOf(d.name)
            let node = document.querySelectorAll(`.year_${index}`);
            node.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
            })
        })
        .on('mouseleave', function (d, i) {
            let index = arrY.indexOf(d.name)
            let node = document.querySelectorAll(`.year_${index}`);
            node.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 0.1)
            })
            let activeNode = document.querySelectorAll(`.flavor_${cur}`)
            activeNode.forEach((item) => {
                d3.select(item)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
            })
        })

    let text = svg.append("g")
        .selectAll("text")
        .data(flavor)
        .enter()
        .append("text")
        .text((d) => d.short)
        .attr("class", (d, i) => `store-text-${i}`)
        .attr("font-size", 18)
        .attr('font-family', 'KaiTi')
        .attr('font-weight', 'bold')
        .attr("x", (d) => (d.start + d.end) / 2 - 9)
        .attr('y', flavorY + flavorWidth + 10)
        .attr('opacity', (d, i) => {
            if (i == cur) {
                return 1
            } else {
                return 0.3
            }
        })

    let node = document.querySelectorAll(`.flavor_${cur}`);
    node.forEach((item) => {
        d3.select(item)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr("fill", "#C5C1AA")
    })
}