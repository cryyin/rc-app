import React, {Component} from "react"
import {Table, Pagination} from "antd"
import request from '@/utils/request'
import {Scrollbars} from "react-custom-scrollbars";

class RcTable extends Component {
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
    // 异步获取数据
    fetchData = () => {
        const {url} = this.props
        this.setState({loading: true});
        const {pageNumber: current, pageSize: size} = this.state.listQuery;
        const params = {current, size};
        request.get(url, {params}).then((response) => {
            this.setState({loading: false});
            const list = response.data.dataList;
            const total = response.data.total;
            if (this._isMounted) {
                this.setState({list, total});
            }
        });
    };

    // 一般在组件挂载后异步获取数据
    componentDidMount() {
        this._isMounted = true;
        this.fetchData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changePage = (pageNumber, pageSize) => {
        this.setState(
            (state) => ({
                listQuery: {
                    ...state.listQuery,
                    pageNumber,
                },
            }),
            () => {
                this.fetchData();
            }
        );
    };
    changePageSize = (current, pageSize) => {
        this.setState(
            (state) => ({
                listQuery: {
                    ...state.listQuery,
                    pageNumber: 1,
                    pageSize,
                },
            }),
            () => {
                this.fetchData();
            }
        );
    };

    render() {
        const {columns} = this.props;
        const {list} = this.state;
        return (
            <div>
                {/* 查询区域 */}
                {/* 表格区域 */}
                <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    style={{height: '700px'}}
                >
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                    />
                </Scrollbars>
                <br/>
                {/* 分页区域 */}
                <Pagination
                    total={this.state.total}
                    pageSizeOptions={["10", "20", "40"]}
                    showTotal={(total) => `共${total}条数据`}
                    onChange={this.changePage}
                    current={this.state.listQuery.pageNumber}
                    onShowSizeChange={this.changePageSize}
                    showSizeChanger
                    showQuickJumper
                    hideOnSinglePage={true}
                />
            </div>
        )
    }
}

export default RcTable;
