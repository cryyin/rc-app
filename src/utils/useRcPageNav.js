import React, {useCallback, useMemo, useState} from "react";
import queryString from "query-string";
import {Button, Modal} from "antd";
import {openNewTab} from "@/utils/index";
import {snakeCase} from 'lodash'

const useRcPageNav = (props = {}) => {
    // 对象，modal对应状态隐藏或者显示
    const [curRecord, setCurRecord] = useState({})
    const [curInParams, setCurInParams] = useState({})
    // {modalA: false}
    const [visible, setVisible] = useState({})

    // 显示特定modal
    const showModal = useCallback((record, modalId) => {
        setCurRecord(record)

        setVisible(prevState => {
            return {
                ...prevState, [modalId]: true
            }
        });

        const params = {}
        for (const [key, value] of Object.entries(record)) {
            const k = 'IN_' + snakeCase(key.substring(1)).toUpperCase()
            params[k] = value;
        }

        setCurInParams(params)
    }, [])

    /**
     * 隐藏所有对话框
     */
    const hideModal = useCallback(() => {
        // 需要全部隐藏
        setVisible({})
    }, [])

    /**
     * 返回一个被Modal包装的组件, 这就是所谓的HOC(高阶组件)
     * 注意，如果使用该组件，则每次都会返回一个新的组件，不会应用diff方法
     */
    const RcModal = (props) => {
        return (
            <Modal
                width='80%'
                onCancel={hideModal}
                onOk={hideModal}
                visible={visible[props.id]}
                title={props.title}
            >
                {props.children}
            </Modal>
        )
    }

    /**
     * useMemo相当于vue的计算属性,依赖props
     */
    const fixedParams = useMemo(() => {
        const {fixedParams, location} = props
        // 路由参数
        const locationParams = location && location.search ?
            queryString.parse(location.search) : {}
        return {...fixedParams, ...locationParams}
    }, [props])

    /**
     * 返回一个图标，点击会打开一个新的tab。注意modalId应该唯一
     * @param {string} text 文本
     * @param {component} icon Icon
     * @param {String} url 目标url
     * @param {String} tabNameAdorn 如果存在会加在标签名称后面
     * @param {String | undefined} newTabName 新标签名称，如果存在则直接设置为新标签名称
     * @return {component} 视图组件
     */
    const getPageIcon = useCallback((text, icon, url, tabNameAdorn='', newTabName=undefined) => {
        return (
            <span>
                {text}
                <Button
                    style={{border: 'none'}}
                    onClick={() => {
                        openNewTab(url, tabNameAdorn, newTabName)
                    }}
                    size='small'
                    icon={icon}
                />
            </span>
        )
    }, [])

    /**
     * 返回一个图标，点击会显示模态框。注意modalId应该唯一
     * @param {string} text 文本
     * @param {object} record 当前记录
     * @param {component} icon Icon
     * @param {string} modalId 模态框id
     * @return {component} 视图组件
     */
    const getModalIcon = useCallback((text, record, icon, modalId) => {
        return (
            <span>
                {text}
                <Button
                    style={{border: 'none'}}
                    onClick={() => {
                        showModal(record, modalId)
                    }}
                    size='small'
                    icon={icon}
                />
            </span>
        )
    }, [showModal])

    return {getPageIcon, fixedParams, getModalIcon, RcModal, visible, hideModal, curInParams, curRecord}
}

export default useRcPageNav;
