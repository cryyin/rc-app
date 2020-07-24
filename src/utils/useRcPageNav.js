import React, {useCallback, useEffect, useMemo, useState} from "react";
import queryString from "query-string";
import {Button, Modal} from "antd";
import {openNewTab} from "@/utils/index";

const useRcPageNav = (props={}) => {
    // 对象，modal对应状态隐藏或者显示
    const [curRecord, setCurRecord] = useState({})
    // {modalA: false}
    const [modals, setModals] = useState({})


    const showModal = (record, modalId) => {
        setCurRecord(record)
        setModals(prevState => {
            return {
                ...prevState, [modalId]: true
            }
        })
    }

    /**
     * 隐藏所有对话框
     */
    const hideModal = () => {
        // 需要全部隐藏
        setModals({})
    }

    const getModal = (child, id) =>{
        return (
            <Modal
                width='80%'
                onCancel={hideModal}
                onOk={hideModal}
                visible={modals[id]}
            >
                {child}
            </Modal>
        )
    }

    // useMemo相当于vue的计算属性,依赖props
    const fixedParams = useMemo(()=> {
        const {fixedParams, location} = props
        // 路由参数
        const locationParams = queryString.parse(location.search)
        return {...fixedParams, ...locationParams}
    },[props])

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

    /**
     * 返回一个图标，点击会显示模态框。注意modalId应该唯一
     * @param {string} text 文本
     * @param {object} record 文本
     * @param {component} icon Icon
     * @param {string} modalId 模态框id
     * @return {*}
     */
    const getModalIcon = (text, record,icon, modalId) => {
        return (
            <span>
                {text}
                <Button
                    style={{border: 'none'}}
                    onClick={()=>{showModal(record,modalId)}}
                    size='small'
                    icon={icon}
                />
            </span>
        )
    }

    return {getPageIcon, fixedParams, getModal, getModalIcon, curRecord}
}

export default useRcPageNav;