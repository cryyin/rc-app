import React from "react";
import Icon, {FileTextOutlined, FundOutlined} from "@ant-design/icons"
// 目前引入自定义图标需要这样写，可能是craco的问题
import {ReactComponent as LawsuitSvg} from '@/assert/icon/lawsuit.svg'
import {ReactComponent as AccountBook} from '@/assert/icon/account-book.svg'

export const CustomerDetailIcon = <Icon style={{color:'#1296db'}} component={FileTextOutlined}/>
export const LawsuitIcon = <Icon style={{color:'#6eb512'}} component={LawsuitSvg}/>
export const ReportIcon = <Icon style={{color:'#6eb512'}} component={FundOutlined}/>
export const AccountBookIcon = <Icon component={AccountBook}/>