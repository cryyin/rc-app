import React, {Component} from "react"
import {Table, Pagination, Form, Select, Button, Modal} from "antd"
import { SearchOutlined, FileTextOutlined, LineChartOutlined } from '@ant-design/icons';

import request from '@/utils/request'
import RoleTable from "@/components/Table/RoleTable";

const { Option } = Select;
class RcTable extends Component {
    _isMounted = false; // 这个变量是用来标志当前组件是否挂载
    state = {
        list: [],
        orgList:[],
        userList:[],
        selectedUser: null,
        loading: false,
        chartModalVisible: false,
        roleModalVisible: false,
        total: 0,
        listQuery: {
            pageNumber: 1,
            pageSize: 10
        },
    };
    userColumns = [
        {
            title: '用户信息',
            fixed: 'left',
            children: [
                {
                    title: '序号',
                    width: 100,
                    dataIndex: 'id',
                    fixed: 'left',
                    key: 'id'
                }, {
                    title: '用户名',
                    width: 100,
                    dataIndex: 'username',
                    fixed: 'left',
                    key: 'username',
                    render: (text, record)=> {
                        return (
                            <span>
                                {text}
                                <Button
                                    style={{border: 'none'}}
                                    onClick={()=>{this.handleShowRole(record.id)}}
                                    size='small'
                                    icon={<FileTextOutlined />}
                                />
                                <Button
                                    style={{border: 'none'}}
                                    onClick={()=>{this.handleChartRole(record.id)}}
                                    size='small'
                                    icon={<LineChartOutlined />}
                                />
                            </span>
                        )
                    }
                }, {
                    title: '别名',
                    width: 100,
                    dataIndex: 'nickname',
                    key: 'nickname'
                }, {
                    title: '机构',
                    width: 100,
                    dataIndex: 'userOrgName',
                    key: 'userOrgName'
                }, {
                    title: '邮箱',
                    width: 100,
                    dataIndex: 'email',
                    key: 'email'
                },
            ]
        },
        {
            title: '审计信息',
            children: [
                {
                    title: '修改时间',
                    width: 100,
                    dataIndex: 'utcModified',
                    key: 'utcModified'
                },
                {
                    title: '类型',
                    width: 50,
                    dataIndex: 'userType',
                    key: 'userType'
                }, {
                    title: '状态',
                    width: 50,
                    dataIndex: 'userStatus',
                    key: 'userStatus'
                }, {
                    title: '修改人',
                    dataIndex: 'modifier',
                    width: 100,
                    key: 'modifier'
                }
            ]
        }
    ];
    // 异步获取数据
    // noinspection DuplicatedCode
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
    filterUsername = (value) => {
        this.setState((state) => ({
            listQuery: {
                ...state.listQuery,
                username:value,
            }
        }));
    };
    handleShowRole = id => {
        this.setState({
            selectedUser: id,
            roleModalVisible: true
        })
    };
    handleChartRole = id => {
        this.setState({
            selectedUser: id,
            chartModalVisible: true
        })
    }
    // 用户名模糊搜索
    handleSearch = value => {
        if (value) {
            request.get(`/user?username=${value}`).then(r=>{
                this.setState({userList: r.data.dataList})
            })
        } else {
            this.setState({ userList: [] });
        }
    };
    hideModal = () => {
        this.setState({
            roleModalVisible : false,
            chartModalVisible : false
        })
    }
    render() {
        const columns = this.userColumns;
        const {list, orgList, userList} = this.state;
        const options = orgList.map(d => <Option value={d.id} key={d.id}>{d.orgName}</Option>);

        return (
            <div className='app-container'>
                {/* 查询区域 */}
                <div className='filter-container'>
                    <Form layout='inline'>
                        <Form.Item label="公司名称:">
                            <Select
                                allowClear
                                style={{ width: 120 }}
                                onChange={this.filterOrgChange}>
                                {options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="用户名称:">
                            <Select
                                showSearch
                                allowClear
                                style={{ width: 120 }}
                                onSearch={this.handleSearch}
                                onChange={this.filterUsername}>
                                {userList.map(d => <Option value={d.username} key={d.id}>{d.username}</Option>)}
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
                {/*详情*/}
                <Modal
                    visible={this.state.roleModalVisible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    onClose={this.hideModal}
                    width='88%'
                >
                    <RoleTable url={`/user/${this.state.selectedUser}/role`} />
                </Modal>
                {/*可视化*/}
                <Modal
                    visible={this.state.chartModalVisible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    onClose={this.hideModal}
                    width='88%'
                >
                    <RoleTable url={`/user/${this.state.selectedUser}/role`} />
                </Modal>
            </div>
        )
    }
}

export default RcTable;
