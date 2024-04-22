import { listAvgScore } from '@/services/api/score';
import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { BarChartOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Badge, Button } from 'antd';
import { useRef, useState } from 'react';
import { downloadFile } from '@/utils/download-utils';
import { Link } from '@umijs/max';
import React from 'react';


export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [searchProps, setSearchProps] = useState<API.AvgQueryVO>({});
  const columns: ProColumns<API.AvgVO>[] = [
    {
      title: '班级ID',
      dataIndex: 'classId',
      width: 100,
      search: false,
      sorter: true,
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      width: 100,
      search: false,
      sorter: true,
    },
    {
      title: '语文平均分',
      dataIndex: 'avgChineseScore',
      
      search: false,
      sorter: true,
    },
    {
      title: '数学平均分',
      dataIndex: 'avgMathScore',
      search: false,
      sorter: true,
    },
    {
      title: '英语平均分',
      dataIndex: 'avgEnglishScore',
      
      search: false,
      sorter: true,
    },
    {
      title: '总分平均分',
      dataIndex: 'totalAvgScore',
      
      search: false,
      sorter: true,
    },
    {
      title: '及格率',
      dataIndex: 'passRate',
      search: false,
      sorter: true,
      valueType: 'percent',
      render: (_, record) => {
        const passRateVal = record.passRate * 100;
        const text = `${passRateVal.toFixed(0)}%`; // 转换为百分比
        if (passRateVal < 60) {
          return <Badge count={text} style={{ backgroundColor: '#f5222d' }} offset={[0, 0]} />;
        }
        if (passRateVal > 80) {
          return <Badge count={text} style={{ backgroundColor: '#2db7f5' }} offset={[0, 0]} />;
        }
        return text;
      },
    },
    {
      title: '高分率',
      dataIndex: 'highScoreRate',
      search: false,
      sorter: true,
      valueType: 'percent',
      render: (_, record) => {
        const highScoreRateVal = record.highScoreRate * 100;
        const text = `${highScoreRateVal.toFixed(0)}%`; // 转换为百分比
        if (highScoreRateVal > 60) {
          return <Badge count={text} style={{ backgroundColor: '#2db7f5' }} offset={[0, 0]} />;
        }
        if (highScoreRateVal < 40) {
          return <Badge count={text} style={{ backgroundColor: '#f5222d' }} offset={[0, 0]} />;
        }
        return text;
      },
    },
    {
      title: '学期',
      dataIndex: 'semester',
      width: 100,
      sorter: true,
      
    },
    {
      title: '学年',
      dataIndex: 'schoolYear',
      width: 100,
      sorter: true,
      
    },
    {
      title: '学生信息',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/student?classId=${record.classId}`}>学生信息</Link>],
    },

  ];


  // const handleExport = () => {
  //   setDownloading(true);
  //   downloadFile(`/api/score/exportScore`, searchProps, '部门导出表.xls').then(() => {
  //     waitTime(1000).then(() => setDownloading(false));
  //   });
  // };

  return (
    <PageContainer>
      <ProTable<API.AvgVO>
        
        actionRef={refAction}
        rowKey="id"
        request={async (params = {}, sort) => {
          const props = {
            ...params,
            orderBy: orderBy(sort),
          };
          setSearchProps(props);
          return convertPageData(await listAvgScore(props));
        }}
        toolBarRender={() => [
          

          <Link to={`/score/charts`}>
              <Button key="tableForm" type="primary" icon={<BarChartOutlined />} className="special-table-form-button">
  图表形式
</Button>
            </Link>,
        ]}
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />


    </PageContainer>
  );
};
