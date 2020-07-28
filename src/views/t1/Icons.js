import React from "react";
import Icon from "@ant-design/icons"
// 目前引入自定义图标需要这样写，可能是craco的问题
import {ReactComponent as CustomerDetail} from '@/assert/icon/customerDetail.svg'
import {ReactComponent as LawsuitSvg} from '@/assert/icon/lawsuit.svg'
import {ReactComponent as Report} from '@/assert/icon/report.svg'
import {ReactComponent as Ar} from '@/assert/icon/ar.svg'
import {ReactComponent as CustomerCode} from '@/assert/icon/customerCode.svg'
import {ReactComponent as Corp} from '@/assert/icon/corp.svg'

export const CustomerDetailIcon = <Icon style={{color:'#1296db'}} component={CustomerDetail}/>
export const LawsuitIcon = <Icon style={{color:'#6eb512'}} component={LawsuitSvg}/>
export const ReportIcon = <Icon style={{color:'#6eb512'}} component={Report}/>
export const ArIcon = <Icon component={Ar}/>
export const CustomerCodeIcon = <Icon component={CustomerCode}/>
export const CorpIcon = <Icon component={Corp}/>