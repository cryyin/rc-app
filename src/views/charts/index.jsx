import React, {useState} from "react";
import { Row, Col } from 'antd';
import DefaultChartData, {getBarOptions, getLineOptions} from './chartData';
import './index.less'

// 全部引入
// import ReactEcharts from "echarts-for-react";
// 按需引入减少包体积
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

/**
 * ReactEcharts使用
 * @see "https://github.com/hustcc/echarts-for-react"
 * @returns {*}
 * @constructor
 */
const Visualization = () => {
    const [chartData, setChartData] = useState(
        {...DefaultChartData}
    );
    return (
        <div className='chart-container'>
            <div className="container">
                <span className="page-title">客户A关于外运公司A的可视化报告</span>
                <Row >
                    <Col span={6}>
                        <div className="d_block db01">
                            <span className="txt">近3个月累计收入(万元)</span>
                            <span className="num">37435.4</span>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="d_block db02">
                            <span className="txt">近3个月平均应收账款(万元)</span>
                            <span className="num">37435.4</span>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="d_block db03">
                            <span className="txt">授信期</span>
                            <span className="num">37435.4</span>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="d_block db04">
                            <span className="txt">授信额(万元)</span>
                            <span className="num">37435.4</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <div className="conbox m_t15">
                            <div className="conbox_top">
                                <label>应收账款与收入变化趋势图</label>
                            </div>
                            <ReactEchartsCore
                                echarts={echarts}
                                option={getLineOptions(chartData.A)}
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
                                option={getLineOptions(chartData.B)}
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
                                option={getBarOptions(chartData.C)}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Visualization;
