import React from 'react';
import {Button, Form, Table, Input } from "antd"
import useDataApi from '../useDataApi'
import {SearchOutlined} from "@ant-design/icons";

const roleColumns = [
    {
        title: '角色信息',
        fixed: 'left',
        children: [
            {
                title: '序号',
                width: 100,
                dataIndex: 'id',
                fixed: 'left',
                key: 'id'
            }, {
                title: '名称',
                width: 100,
                dataIndex: 'roleName',
                fixed: 'left',
                key: 'roleName'
            }, {
                title: '描述',
                width: 100,
                dataIndex: 'roleDesc',
                key: 'roleDesc'
            }, {
                title: '类型',
                width: 100,
                dataIndex: 'roleType',
                key: 'roleType'
            }
        ]
    },
    {
        title: '审计信息',
        children: [
            {
                title: '修改人',
                dataIndex: 'modifier',
                width: 100,
                key: 'modifier'
            }, {
                title: '修改时间',
                width: 160,
                dataIndex: 'utcModified',
                key: 'utcModified'
            }
        ]
    }
];

const TableView = props => {
    const {list, doFetch,handleFilter, loading, getPagination} = useDataApi('/role');
    const handleRoleNameChange = (e) => {
        handleFilter('roleName', e.target.value )
    }
    return (
        <div>
            <Form layout='inline'>
                <Form.Item label='角色名'>
                    <Input onChange={handleRoleNameChange}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" icon={<SearchOutlined/>} onClick={doFetch}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
            <Table
                rowKey='id'
                loading={loading}
                pagination={false}
                columns={roleColumns}
                dataSource={list}
            />
            {getPagination()}
        </div>
    );
}

export default TableView


