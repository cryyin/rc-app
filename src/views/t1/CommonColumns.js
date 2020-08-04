// 应收账款列
export const getArColumns = (title, render) => {
    // noinspection DuplicatedCode
    return {
        title,
        children: [
            {
                title: '应收账款余额(万元)',
                dataIndex: 'nAr',
                width: 100,
                key: 'nAr'
            },
            {
                title: '风险评级',
                dataIndex: 'vRiskLvl',
                width: 100,
                key: 'vRiskLvl'
            }, {
                title: '可视化报告',
                width: 160,
                dataIndex: 'vVisualReport',
                key: 'vVisualReport',
                render
            }, {
                title: '90天以上应收比例',
                width: 160,
                dataIndex: 'n3mAccountAmtPct',
                key: 'n3mAccountAmtPct'
            }, {
                title: '应收0天(万元)',
                dataIndex: 'nAr0',
                width: 100,
                key: 'nAr0'
            }, {
                title: '应收1-30天(万元)',
                width: 160,
                dataIndex: 'nAr1',
                key: 'nAr1'
            },
            {
                title: '应收31-45天(万元)',
                dataIndex: 'nAr2',
                width: 100,
                key: 'nAr2'
            }, {
                title: '应收46-60天(万元)',
                width: 100,
                dataIndex: 'nAr3',
                key: 'nAr3'
            }, {
                title: '应收61-90天(万元)',
                dataIndex: 'nAr4',
                width: 100,
                key: 'nAr4'
            }, {
                title: '应收91-120天(万元)',
                width: 160,
                dataIndex: 'nAr5',
                key: 'nAr5'
            },
            {
                title: '应收121-180天(万元)',
                dataIndex: 'nAr6',
                width: 100,
                key: 'nAr6'
            }, {
                title: '应收181-360天(万元)',
                width: 100,
                dataIndex: 'nAr7',
                key: 'nAr7'
            }, {
                title: '应收361-720天（万元）',
                width: 160,
                dataIndex: 'nAr8',
                key: 'nAr8'
            },
            {
                title: '应收721-1080天（万元)',
                dataIndex: 'nAr9',
                width: 100,
                key: 'nAr9'
            }, {
                title: '应收1080天以上（万元）',
                width: 100,
                dataIndex: 'nAr10',
                key: 'nAr10'
            }
        ]
    }
}

// 客户名称width
export const customerNameWidth = 270
export const orgNameWidth = 270