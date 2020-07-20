const ChartData = {

    'A': {
        'legend': ['收入', '应收账款'],
        'axis': ['201907', '201908', '201909', '201910', '201911', '201912', '202001', '202002', '202003', '202004'],
        'data': [[10.34, 30.34, 201.34, 45.45, 190.22, 20.34, 102.34, 101.34, 133.45, 290.22], [20.34, 302.34, 301.34, 33.45, 390.22, 20.34, 302.34, 301.34, 33.45, 390.22]]
    },
    'B': {
        'legend': ['应收账款周转率'],
        'axis': ['201907', '201908', '201909', '201910', '201911', '201912', '202001', '202002', '202003', '202004'],
        'data': [[10.34, 30.34, 201.34, 45.45, 190.22, 20.34, 102.34, 101.34, 133.45, 290.22]]
    },
    'C': {
        'legend': ['其他外运公司', '外运公司A'],
        'axis': ['应收0天', '应收1-30天', '应收31-45天', '应收46-60天', '应收61-90天', '应收91-120天', '应收121-180天', '应收181-220天', '应收221-260天', '应收261-290天',],
        'data1': [20.34, 302.34, 301.34, 33.45, 390.22, 20.34, 302.34, 301.34, 33.45, 390.22],
        'data2': [20.34, 302.34, 301.34, 33.45, 390.22, 20.34, 302.34, 301.34, 33.45, 390.22]
    }
}

// noinspection ES6ModulesDependencies
export const getBarOptions = (barData) => {
    return {
        color: ['rgba(0, 241, 244, 1)', 'rgba(0, 134, 244, 1)'],
        legend: {
            data: barData.legend,
            bottom: 5
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '3%',
            top: '5%',
            bottom: '20%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'value',
                axisLine: {show: false, lineStyle: {color: '#B5B2B5',}},
                axisLabel: {show: true, textStyle: {color: "#666666", fontSize: 12},},
                splitLine: {show: true, lineStyle: {color: "#B5B2B5", type: 'dashed'}},
                axisTick: {show: false},
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: barData.axis,
                boundaryGap: true,
                axisPointer: {type: 'shadow'},
                axisLine: {lineStyle: {color: '#B5B2B5'}},
                splitLine: {show: false, lineStyle: {color: "#B5B2B5"}},
                axisLabel: {
                    interval: 0,
                    textStyle: {color: "#666666", fontSize: 12},
                },
                axisTick: {show: true, alignWithLabel: true},
            }
        ],
        series: [
            {
                name: barData.legend[0],
                type: 'bar',
                stack: 'two',
                barWidth: "20%",
                data: barData.data1
            },
            {
                name: barData.legend[1],
                type: 'bar',
                stack: 'two',
                barWidth: "20%",
                data: barData.data2
            }

        ]
    };
}

export const getLineOptions = lineData => {
    let series = [];
    for (let i = 0; i < lineData.legend.length; i++) {
        series.push({
            name: lineData.legend[i],
            type: 'line',
//          smooth: true,
            symbol: 'circle',
            stack: '总量',
            data: lineData.data[i]
        });
    }
    return  {
        grid: {
            left: '5%',
            right: '5%',
            top: '5%',
            bottom: '15%',
            containLabel: true
        },
        legend: {
            data: lineData.legend,
            bottom: 5
        },
        tooltip: {
            trigger: 'axis'
        },
        color: ['#0067FF', '#FFA718', 'rgba(181,61,14,1)'],
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                axisLine: {lineStyle: {color: '#B5B2B5'}},
                axisTick: {show: true, alignWithLabel: true},
                splitLine: {show: false},
                axisLabel: {
                    interval: 0,
                    textStyle: {color: "#666666", fontSize: '12'},
                    rotate: 40,
                },
                data: lineData.axis
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick: {show: false},
                splitLine: {show: true, lineStyle: {type: 'dashed'}},
                axisLabel: {
                    show: true,
                    color: "#666666",
                    textStyle: {
                        fontSize: '12'
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "#666666",
                    }
                },
            }
        ],
        series: series
    };
}
export default ChartData;
