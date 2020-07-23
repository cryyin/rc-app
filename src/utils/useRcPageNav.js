import React, {useState} from "react";
import queryString from "query-string";
import {Button} from "antd";
import {openNewTab} from "@/utils/index";
import {FileTextOutlined} from "@ant-design/icons";

const useRcPageNav = () => {
    // 对象，modal对应状态隐藏或者显示
    const [modalVisible, setModalVisible] = useState({})
    const [curRecord, setCurRecord] = useState({})
    const [modalArr, setModalArr] = useState([])

    const showModal = (record, modalName) => {
        setCurRecord(record)
        modalArr.filter(modal=>modal.name === modalName).forEach(m=>{
        })
    }

    const hideModal = () => {
        setModalVisible({})
    }

    const getModal = () =>{}

    const getFixedParams = (props) => {
        const {fixedParams, location} = props
        // 路由参数
        const locationParams = queryString.parse(location.search)
        return {...fixedParams, ...locationParams}
    }

    const getPageIcon = (text, icon, url) => {
        return (
            <span>
                {text}
                <Button
                    style={{border: 'none'}}
                    onClick={()=>{openNewTab(url)}}
                    size='small'
                    icon={icon}
                />
            </span>
        )
    }

    return {getPageIcon, getFixedParams}
}

export default useRcPageNav;