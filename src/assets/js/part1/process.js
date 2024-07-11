import * as d3 from "d3"

function like(tar, arr) {
    let t = arr.some(function (item) {
        return item == tar;
    });
    return t;
}

export function lines(Pdata) {
    let Ddata = Pdata.steps;
    let width = document.querySelector(".process").offsetWidth,
        height = document.querySelector(".process").offsetHeight + 200;
    let margin = width / 7;
    let translateX = 0;
    let mainStep = ["选料", "发酵", "蒸馏", "贮存"]
    let svg = d3
        .select(".process")
        .append("svg")
        .attr("class", "process-svg")
        .attr("transform", "translate(" + 0 + "," + (-100) + ")")
        .attr("width", width)
        .attr("height", height)
    //两个半圆
    let arcR = height / 8.5
    let arc1 = d3.arc()
        .innerRadius(arcR)
        .outerRadius(arcR)
        .startAngle(0)
        .endAngle(Math.PI / 4)
    let arc2 = d3.arc()
        .innerRadius(arcR)
        .outerRadius(arcR)
        .startAngle(Math.PI / 4 * 7)
        .endAngle(Math.PI * 2)

    svg
        .append("path")
        .attr("class", "scircle")
        .attr('d', arc1())
        .attr("stroke-width", 3)
        .attr('transform', `translate(${width - margin * 1.25 + translateX},${height / 6 * 2})`)
    svg
        .append("path")
        .attr("class", "scircle")
        .attr('d', arc2())
        .attr("stroke-width", 3)
        .attr('transform', `translate(${margin * 1.25 + translateX},${height / 6 * 4})`)

    svg
        .append("path")
        .attr("class", "scircle")
        .attr('d', `M0,-133 A133,133,0,0,1,0,133 H${0} L0,130 L-20,133 L0,136 V130`)
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr('opacity', 0)
        .attr('transform', `translate(${width - margin * 1.25 + translateX},${height / 6 * 2})`)
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('d', `M0,-133 A133,133,0,0,1,0,133 H${-margin / 2} L${0 - margin / 2},130 L${-10 - margin / 2},133 L${0 - margin / 2},136 V130`)
        .attr("stroke-width", 5)

    svg
        .append("path")
        .attr("class", "scircle")
        .attr('d', `M0,-133 A133,133,0,1,0,0,133 H${0} L0,130 L10,133 L0,136 V130`)
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr('opacity', 0)
        .attr('transform', `translate(${margin * 1.25 + translateX},${height / 6 * 4})`)
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('d', `M0,-133 A133,133,0,1,0,0,133 H${margin / 2} L${0 + margin / 2},130 L${10 + margin / 2},133 L${0 + margin / 2},136 V130`)
        .attr("stroke-width", 5)

    //添加流程指示箭头
    svg.append('path')
        .attr('d', ``)
        .attr("fill", "none")

    for (var k = 0; k < Ddata.length; k++) {
        //画第k条线
        let data = Ddata[k];
        //因为第二条是从右到左，所以画第二条时翻转一下数组
        if (k % 2) {
            data.steps.reverse();
        }
        //返回坐标数据，是一个json数组
        let tdata = d3.range(data.steps.length).map(function (i) {
            return { x: data.steps[i], y: 0 };
        });

        //设置横坐标的起始位置，第一条更靠近左边，所以起始位置更小
        let start;
        if (k == 0) {
            //margin - height / 8;
            start = margin;
        } else {
            start = margin;
        }

        //初始化一个range数组以及每段的长度，用于画下面的离散比例尺
        let range = [start],
            bandwidth = (width - margin * 2) / (data.steps.length - 1);

        //因为第一条的长度更长，同时要保证末尾和第二条对齐，因此第一条每段宽度需要重新计算
        if (k == 0) {
            let temp = bandwidth;
            bandwidth = (width - margin * 2) / (data.steps.length - 1)
        } else if (k == 2) {
            //第三条比较短，也需重新设置每段宽度
            bandwidth = (width - margin * 2) / 10;
        }

        for (var i = 1; i < data.steps.length; i++) {
            range.push(start + i * bandwidth);
        }

        //设置x比例尺
        let x = d3.scaleOrdinal().range(range).domain(data.steps);

        let line = d3
            .line()
            .x(function (d) {
                // 根据比例尺计算x
                return x(d.x) + translateX;
            })
            .y((height / (Ddata.length + 3)) * (2 * k + 1));
        //给svg绑定数据，svg中用到的d就是绑定的数据
        let tsvg = svg.append("g").data([tdata]);

        if (k == 0) {
            let x_2 = x("选料")
            let y_2 = (height / (Ddata.length + 3)) * (2 * k + 1)
            svg.append("path")
                .attr("d", `M${x_2},${y_2} H${x_2}`)
                .attr('stroke', 'grey')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '10 5')
                .attr('fill', 'none')
                .transition()
                .duration(1000)
                .attr("d", `M${x_2},${y_2} H${0}`)
        }

        if (k == 1) {
            let x_2 = x("发酵")
            let y_2 = (height / (Ddata.length + 3)) * (2 * k + 1)
            svg.append("path")
                .attr("d", `M${x_2},${y_2} V${y_2} H${x_2}`)
                .attr('stroke', 'grey')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '10 5')
                .attr('fill', 'none')
                .transition()
                .duration(500)
                .attr("d", `M${x_2},${y_2} V${y_2 - 40} H${x_2}`)
                .transition()
                .duration(1000)
                .attr("d", `M${x_2},${y_2} V${y_2 - 40} H${width}`)
        }

        if (k == 2) {
            let x_2 = x("贮存")
            let y_2 = (height / (Ddata.length + 3)) * (2 * k + 1)
            svg.append("path")
                .attr("d", `M${x_2},${y_2} V${y_2} H${x_2}`)
                .attr('stroke', 'grey')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '10 5')
                .attr('fill', 'none')
                .transition()
                .duration(500)
                .attr("d", `M${x_2},${y_2} V${y_2 - 40} H${x_2}`)
                .transition()
                .duration(1000)
                .attr("d", `M${x_2},${y_2} V${y_2 - 40} H${width}`)
        }

        //添加文字
        tsvg
            .append("g")
            .attr("transform", "translate(" + start + "," + 0 + ")")
            .selectAll(".step")
            // 这里是给上面append的g绑定数据
            .data(tdata)
            .enter()
            .append("text")
            .attr("class", function (d) {
                return mainStep.includes(d.x) ? "step main" : "step";
            })
            .text(function (d) {
                return d.x;
            })
            //设置动画开始前文字位置
            .attr("x", function (d, i) {
                return mainStep.includes(d.x) ? i * bandwidth - (d.x.length * 30) / 2 + translateX : i * bandwidth - (d.x.length * 20) / 2 + translateX;
            })
            .attr("y", (height / (Ddata.length + 3)) * (2 * k + 1) + 46)
            .attr("opacity", 0)
            .transition()
            .duration(500)
            //设置动画结束时文字位置，与上同理
            .attr("x", function (d, i) {
                return mainStep.includes(d.x) ? i * bandwidth - (d.x.length * 30) / 2 + translateX : i * bandwidth - (d.x.length * 20) / 2 + translateX;
            })
            .attr("y", (height / (Ddata.length + 3)) * (2 * k + 1) + 40)
            .attr("opacity", 1);


        //添加横线
        tsvg
            .append("path")
            .attr("class", "line")
            .attr("d", line)
            .attr("opacity", 0)
            .transition()
            .duration(300)
            .attr("opacity", 1);

        //添加小刻度
        tsvg
            .selectAll(".mark")
            .data(tdata)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return like(d.x, data.main) ? "longM" : "shortM";
            })
            .attr("d", function (d) {
                return (
                    "M" +
                    (x(d.x) + translateX) +
                    "," +
                    (height / (Ddata.length + 3)) * (2 * k + 1) +
                    "L" +
                    (x(d.x) + translateX) +
                    "," +
                    (height / (Ddata.length + 3)) * (2 * k + 1)
                );
            })
            .transition()
            .duration(500)
            .attr("d", function (d) {
                if (like(d.x, data.otext.tips.step)) {
                    return (
                        "M" +
                        (x(d.x) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 10) +
                        "L" +
                        (x(d.x) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) - 30)
                    );
                } else if (like(d.x, data.main)) {
                    return (
                        "M" +
                        (x(d.x) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) - 20) +
                        "L" +
                        (x(d.x) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 20)
                    );
                } else {
                    return (
                        "M" +
                        (x(d.x) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) - 10) +
                        "L" +
                        (x(d.x) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 10)
                    );
                }
            });

        //添加圆
        tsvg
            .selectAll(".dot")
            .data(tdata)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                let temp = like(d.x, data.main) ? "dot main" : "dot";
                if (like(d.x, Pdata.click.node)) {
                    temp += " " + "active";
                }
                return temp;
            })
            //添加圆心坐标
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("opacity", 0)
            .transition()
            .duration(function (d) {
                if (like(d.x, Pdata.click.node)) {
                    return 1000;
                } else {
                    return 600;
                }
            })
            .delay(500)
            .attr("opacity", 1)
            .attr("r", 10);

        //上方小圆
        tsvg
            .selectAll(".tips")
            .data(data.otext.tips.step)
            .enter()
            .append("circle")
            .attr("class", "dot tips")
            .attr("cx", function (d) {
                return x(d) + translateX;
            })
            .attr("cy", (height / (Ddata.length + 3)) * (2 * k + 1) - 30)
            .transition()
            .duration(700)
            .delay(300)
            .attr("r", 5);

        tsvg
            .selectAll(".tipstext")
            .data(data.otext.tips.step)
            .enter()
            .append("text")
            .attr("class", "step tipstext")
            .text(function (d, i) {
                return data.otext.tips.supply[i];
            })
            .attr("x", function (d) {
                return x(d) - (this.innerHTML.length * 22) / 2 + translateX;
            })
            .attr("y", (height / (Ddata.length + 3)) * (2 * k + 1) - 52)
            .attr("opacity", 0)
            .transition()
            .duration(500)
            .attr("x", function (d) {
                return x(d) - (this.innerHTML.length * 22) / 2 + translateX;
            })
            .attr("y", (height / (Ddata.length + 3)) * (2 * k + 1) - 44)
            .attr("opacity", 1);

        //画连接线
        if (data.otext.link[0].start) {
            let lprocess = data.otext.link[0];
            let lbandwidth =
                (x(lprocess.end) - x(lprocess.start)) /
                (lprocess.process.length + 1);
            let lrange = [];
            for (let i = 0; i < lprocess.process.length; i++) {
                lrange.push(x(lprocess.start) + (i + 1) * lbandwidth);
            }

            let lx = d3.scaleOrdinal().range(lrange).domain(lprocess.process);

            tsvg
                .selectAll(".processtext")
                .data(lprocess.process)
                .enter()
                .append("text")
                .attr("class", "processtext")
                .attr("font-size", 18)
                .style("font-family", 'KaiTi')
                .text(function (d) {
                    return d;
                })
                .attr("x", function (d) {
                    return lx(d) - (this.innerHTML.length * 18) / 2 + translateX;
                })
                .attr("y", (height / (Ddata.length + 3)) * (2 * k + 1) + 92)
                .attr("opacity", 0)
                .transition()
                .duration(500)
                .attr("x", function (d) {
                    return lx(d) - (this.innerHTML.length * 18) / 2 + translateX;
                })
                .attr("y", (height / (Ddata.length + 3)) * (2 * k + 1) + 84)
                .attr("opacity", 1);

            tsvg
                .selectAll(".links")
                .data([lprocess])
                .enter()
                .append("path")
                .attr("class", "line link")
                .attr("d", function (d) {
                    return (
                        "M" +
                        (x(d.start) + (x(d.end) - x(d.start)) / 2 + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.start) + (x(d.end) - x(d.start)) / 2 + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60)
                    );
                })
                .transition()
                .duration(500)
                .attr("d", function (d) {
                    return (
                        "M" +
                        (x(d.start) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.end) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "M" +
                        (x(d.start) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.start) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "," +
                        "M" +
                        (x(d.end) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.end) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60)
                    );
                })
                .transition()
                .duration(500)
                .attr("d", function (d) {
                    return (
                        "M" +
                        (x(d.start) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.end) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "M" +
                        (x(d.start) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.start) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 40) +
                        "," +
                        "M" +
                        (x(d.end) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 60) +
                        "L" +
                        (x(d.end) + translateX) +
                        "," +
                        ((height / (Ddata.length + 3)) * (2 * k + 1) + 40)
                    );
                });

            tsvg
                .selectAll(".pcirle")
                .data(lprocess.process)
                .enter()
                .append("circle")
                .attr("class", function (d) {
                    let temp = "dot process";
                    if (like(d, Pdata.click.node)) {
                        temp += " active";
                    }
                    return temp;
                })
                .attr("cx", function (d) {
                    return lx(d) + translateX;
                })
                .attr("cy", (height / (Ddata.length + 3)) * (2 * k + 1) + 60)
                .transition()
                .duration(700)
                .delay(300)
                .attr("r", 7);
        }
        if (k % 2) {
            data.steps.reverse();
        }
    }



    let cactive = document.querySelectorAll(".process-svg .dot.active");
    let tooltip = d3.select(".process .tooltip");
    let init = tooltip.select(".init")
    init.style("display", "flex")

    let after = tooltip.select(".after")

    let curDes = svg.append("g")
        .append("image")
        .attr("class", "cur-process")
        .attr("xlink:href", "process/curProcess.png")
        .attr("width", "40px")
        .attr("height", "40px")
        .attr("x", 0)
        .attr("y", 0)
        .attr("opacity", 0)

    cactive.forEach(function (item, index) {
        item.addEventListener("click", function () {
            d3.selectAll(".after-text")
                .remove()
            let text = after.select('.text .active-text')
                .append("text")
                .attr("class", "after-text")
            let title = after.select('.text .title')
                .append("text")
                .attr("class", "after-text")
            curDes.attr("x", this.cx.baseVal.value - 20)
                .attr("y", this.cy.baseVal.value - 20)
                .attr("opacity", 1)
            cactive.forEach(function (item) {
                item.classList.remove("selected");
            });
            item.classList.add("selected")
            text.text(Pdata.click.describe[index])
            title.text(Pdata.click.node[index])
            init.style('display', 'none');
            after.style('display', 'flex');
        });
    });
}