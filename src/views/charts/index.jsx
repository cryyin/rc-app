import React, {useState} from "react";
import DefaultChartData from './chartData';
import './index.less'

const Visualization = () => {
    const [chartData, setChartData] = useState(
        {...DefaultChartData}
    );
    return (
        <div className='chart-container'>
            <div className="container">
                <span className="page-title">客户A关于外运公司A的可视化报告</span>
                <div className="row">
                    <div className="col-md-3 col-sm-3">
                        <div className="d_block db01">
                            <span className="txt">近3个月累计收入(万元)</span>
                            <span className="num">37435.4</span>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3">
                        <div className="d_block db02">
                            <span className="txt">近3个月平均应收账款(万元)</span>
                            <span className="num">37435.4</span>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3">
                        <div className="d_block db03">
                            <span className="txt">授信期</span>
                            <span className="num">37435.4</span>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3">
                        <div className="d_block db04">
                            <span className="txt">授信额(万元)</span>
                            <span className="num">37435.4</span>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="conbox m_t15">
                            <div className="conbox_top">
                                <label>应收账款与收入变化趋势图</label>
                            </div>
                            <div className="ech_box01" id="ech_a"/>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="conbox m_t15">
                            <div className="conbox_top">
                                <label>应收账款周转率趋势图</label>
                            </div>
                            <div className="ech_box01" id="ech_b"/>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12">
                        <div className="conbox">
                            <div className="conbox_top">
                                <label>应收账款分账龄分布情况</label>
                            </div>
                            <div className="ech_box02" id="ech_c"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Visualization;