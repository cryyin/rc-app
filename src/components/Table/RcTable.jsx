import React, { Component } from "react"
import {Table} from "antd"
import request from '@/utils/request'

class RcTable extends Component{
    _isMounted = false; // 这个变量是用来标志当前组件是否挂载
    state = {
        list: [],
        loading: false,
        total: 0,
        listQuery: {
            pageNumber: 1,
            pageSize: 10
        },
    }
    fetchData = () => {
        const {url} = this.props
        this.setState({ loading: true });
        request.get(url).then((response) => {
            this.setState({ loading: false });
            const list = response.data.dataList;
            const total = response.data.total;
            if (this._isMounted) {
                this.setState({ list, total });
            }
        });
    };
    componentDidMount() {
        this._isMounted = true;
        this.fetchData();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { columns } = this.props;
        const { list } = this.state;
        return(
            <div>
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={list}
                />
            </div>
        )
    }
}

export default RcTable;
