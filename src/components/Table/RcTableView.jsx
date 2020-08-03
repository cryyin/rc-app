import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import RcTableFilter from "@/components/Table/RcTableFilter";
import RcTableList from "@/components/Table/RcTableList";
import parseTableConfig from "@/utils/queryUtils";

/**
 * 通用Rc查询表组组件
 *
 * props:
 *    fixedParams用于组件间传值
 *    columns 列配置
 *    tableConfig 存储过程、筛选框配置，配置存储过程名称和查询参数
 *
 * @param props
 * @return {*} 针对RC项目实现的通用组件，使用要求应满足设计文档
 * @constructor
 */
const RcTableView = props => {
    console.log('RcTableView')
    const {columns, fixedParams, tableConfig} = props

    // 表格配置解析
    const { rowKey, showSearch, listSql, initListParams, filterSql, initFilterParams, filterItems} = useMemo(() => {
        if (tableConfig) {
            return parseTableConfig(fixedParams, tableConfig);
        }
        return {}
    }, [fixedParams, tableConfig])

    // 实际列表查询参数=初始参数+过滤条件参数
    const [actListParams, setActListParams] = useState(initListParams)

    return (
        <div className='rc-table'>
            {/*查询区域*/}
            <div className='filter-container'>
                <RcTableFilter
                    showSearch={showSearch}
                    filterSql={filterSql}
                    initFilterParams={initFilterParams}
                    filterItems={filterItems}
                    setActListParams={setActListParams}
                />
            </div>
            {/*表格及分页区域*/}
            <RcTableList
                sql={listSql}
                params={actListParams}
                columns={columns}
                rowKey={rowKey}
            />
        </div>
    );
}

// props类型检查
RcTableView.protoTypes = {
    columns: PropTypes.array.isRequired,
    tableConfig: PropTypes.object.isRequired,
    fixedParams: PropTypes.object
}

export default React.memo(RcTableView)


