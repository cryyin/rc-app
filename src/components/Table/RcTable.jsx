import React, {Component} from "react"
import {Table, Pagination, Form, Select, Button} from "antd"
import { SearchOutlined } from '@ant-design/icons';

import request from '@/utils/request'
const { Option } = Select;
class RcTable extends Component {
    _isMounted = false; // 这个变量是用来标志当前组件是否挂载
    state = {
        list: [],
        orgList:[],
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
        const params = {current, size, ...this.state.listQuery};
        request.get(url, {params}).then((response) => {
            this.setState({loading: false});
            const list = response.data.dataList;
            const total = response.data.total;
            if (this._isMounted) {
                this.setState({list, total});
            }
        });
    };
    // 公司名称
    fetchOrgList = () => {
        request.get('/org').then(r => {
            this.setState({orgList : r.data.dataList});
        })
    };
    // 一般在组件挂载后异步获取数据
    componentDidMount() {
        this._isMounted = true;
        this.fetchOrgList();
        this.fetchData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changePage = (pageNumber) => {
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
    filterOrgChange = (value) => {
        this.setState((state) => ({
            listQuery: {
                ...state.listQuery,
                userOrgId:value,
            }
        }));
    };
    render() {
        const {columns} = this.props;
        const {list, orgList} = this.state;
        const options = orgList.map(d => <Option value={d.id} key={d.id}>{d.orgName}</Option>);

        return (
            <div className='app-container'>
                {/* 查询区域 */}
                <div className='filter-container'>
                    <Form layout='inline'>
                        <Form.Item label="公司名称:">
                            <Select
                                style={{ width: 120 }}
                                onChange={this.filterOrgChange}>
                                {options}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" icon={<SearchOutlined/>} onClick={this.fetchData}>
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {/* 表格区域 */}
                <Table
                    rowKey='id'
                    loading={this.state.loading}
                    columns={columns}
                    dataSource={list}
                    pagination={false}
                />
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
