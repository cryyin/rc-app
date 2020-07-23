import {useState} from "react";
import queryString from "query-string";

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

    return {getFixedParams}
}

export default useRcPageNav;