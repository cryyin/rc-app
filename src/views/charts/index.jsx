import React, {useEffect, useState} from "react";
import {Row, Col, Spin} from 'antd';
import DefaultChartData, {getBarOptions, getLineOptions} from './chartData';
import './index.less'
import {filterParams, filterProcedureName} from "@/views/charts/ReportConfig";
// 全部引入
// import ReactEcharts from "echarts-for-react";
// 按需引入减少包体积
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import {getProcedureConfig} from "@/utils/queryUtils";
import {range} from 'lodash'
import {call} from "@/api";

const {sql, params} = getProcedureConfig(filterProcedureName, filterParams, true)

/**
 * 可视化报告页面
 * 使用了 Echarts和 ReactEcharts
 * @see "https://github.com/hustcc/echarts-for-react"
 * @returns {*}
 * @constructor
 */
const Visualization = (props) => {
    const {fixedParams} = props
    const [chartData, setChartData] = useState(
        {...DefaultChartData}
    );
    const [loading, setLoading] = useState(false)
    // fixed: Can't perform a React state update on an unmounted component
    // @see "https://stackoverflow.com/a/60907638"
    useEffect(() => {
        let _mounted = true; // note this flag denote mount status
        // 需要确保参数正确
        if (!fixedParams) return;
        const {IN_ID, IN_SEG_ORG_KEY, IN_CAL_AREA} = fixedParams
        if (IN_ID && IN_SEG_ORG_KEY && IN_CAL_AREA) {
            setLoading(true)
            // 1,2,3,4迭代,后端返回数据格式不一样，只能手工处理
            range(1, 5).forEach(i => {
                const requestParams = {...params, IN_PARM: i, IN_ID, IN_SEG_ORG_KEY, IN_CAL_AREA}
                console.log('可视化报告参数')
                console.log(sql)
                console.log(requestParams)
                call(sql, requestParams).then(r => {
                    let result = r.data.OUT_DATASET
                    const axis = []
                    const data1 = [], data2 = [];
                    if (i === 1) {
                        // 图一
                        result = result[0]
                    } else if (i === 2) {
                        // 图二
                        result.forEach(e => {
                            axis.push(e.nMonth6Key)
                            data1.push(e.nIncomeAmCny || 0)
                            data2.push(e.ar || 0)
                        });
                        result = {axis, data: [data1, data2], legend: DefaultChartData[2].legend}
                    } else if (i === 3) {
                        // 图三
                        result.forEach(e => {
                            axis.push(e.vX)
                            data1.push(e.nRtrRecent3m || 0)
                        });
                        result = {axis, data: [data1], legend: DefaultChartData[3].legend}
                    } else if (i === 4) {
                        // 图四, 排序
                        // https://stackoverflow.com/a/31102605
                        const realData = result[0] || []
                        Object.keys(realData).sort().forEach(k => {
                            // self
                            const value = realData[k] || 0
                            if (k.endsWith('f')) {
                                data1.push(value)
                            } else {
                                data2.push(value)
                            }
                        })
                        result = {data1, data2, axis: DefaultChartData[4].axis, legend: DefaultChartData[4].legend}
                    }
                    if (_mounted) {
                        setChartData(prevState => {
                            return {...prevState, [i]: result}
                        });
                        setLoading(false)
                    }
                })
            })
        }
        return () => {
            _mounted = false
        };
    }, [fixedParams])

    const c1 = chartData[1] || {}
    if (c1) {
        chartData[4].legend[1] = c1.vOperateUnit
    }
    return (
        <div className='chart-container'>
            <Spin spinning={loading}>
                <div className="container">
                    <span className="page-title">{`客户${c1.vCustomerName}关于外运公司${c1.vOperateUnit}的可视化报告`}</span>
                    <Row gutter={16}>
                        <Col span={6}>
                            <div className="d_block db01">
                                <span className="txt">近3个月累计收入(万元)</span>
                                <span className="num">{c1.n3mIncome}</span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="d_block db02">
                                <span className="txt">近3个月平均应收账款(万元)</span>
                                <span className="num">{c1.n3mArAvg}</span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="d_block db03">
                                <span className="txt">授信期</span>
                                <span className="num">
                                {c1.nCreditPeriod ? ('$' + c1.nCreditPeriod) : '--'}
                            </span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="d_block db04">
                                <span className="txt">授信额(万元)</span>
                                <span className="num">{c1.nCreditAmount || '--'}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div className="conbox m_t15">
                                <div className="conbox_top">
                                    <label>应收账款与收入变化趋势图</label>
                                </div>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getLineOptions(chartData[2])}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="conbox m_t15">
                                <div className="conbox_top">
                                    <label>应收账款周转率趋势图</label>
                                </div>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getLineOptions(chartData[3])}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div className="conbox">
                                <div className="conbox_top">
                                    <label>应收账款分账龄分布情况</label>
                                </div>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    option={getBarOptions(chartData[4])}
                                />
                            </div>

                        </Col>
                    </Row>
                </div>
            </Spin>
        </div>
    )
}

export default Visualization;
