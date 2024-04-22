import { deleteClass, listClass } from '@/services/api/klass';
import { countStudents } from '@/services/api/student';
import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState ,useEffect } from 'react';
import InputDialog from './InputDialog';
import { downloadFile } from '@/utils/download-utils';
import { Link } from 'umi';
import ImportDialog from './ImportDialog';
// import { getStatusClassNames } from 'antd/es/_util/statusUtils';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [importVisible, setImportVisible] = useState(false);
  const [classes, setClasses] = useState<API.ClassDTO>();
  const [searchProps, setSearchProps] = useState<API.ClassQueryDTO>({});
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [classStudentCounts, setClassStudentCounts] = useState<Record<number, number>>({});


  
  const columns: ProColumns<API.ClassVO>[] = [
    {
      title: '班级ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      search: true,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setClasses(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '班级人数',
      dataIndex: 'id',
      search: false,  
      render: (text, record) => {
        const count = classStudentCounts[record.id];
        return count !== undefined ? count : '---';
      },
    },

    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/class/detail?id=${record.id}`}>修改</Link>],
    },
    {
      title: '班级学生详情',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/student?classId=${record.id}`}>学生详情</Link>],
    },
    {
      title: '班级成绩详情',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/score?classId=${record.id}`}>成绩详情</Link>],
    },

  ];


  const handleTableRequest = async (params, sorter, filters) => {
    // 包含分页和排序信息的请求参数
    const searchParams = {
      ...params,
      orderBy: orderBy(sorter), // sorter转换为API期望的排序参数
    };

    const classListResp = await listClass(searchParams);
    // 转换原始数据为标准格式
    const classListData = convertPageData(classListResp);

    // 更新班级的学生数量
    const studentCounts = new Map(); // 保存学生数量的映射关系
    for (const classInfo of classListData.data) {
      const count = await countStudents({ classId: classInfo.id });
      studentCounts.set(classInfo.id, count); // 保存每个班级的学生数量
    }
    setClassStudentCounts(Object.fromEntries(studentCounts)); // 使用对象保存id -> 学生数量的映射

    return {
      data: classListData.data,
      total: classListData.total,
      success: classListData.success,
    };
  };


  const handleDelete = async () => {
    if (!selectedRowKeys.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteClass(selectedRowKeys);
      refAction.current?.reload();
    });
  };

  const handleExport = () => {
    setDownloading(true);
    downloadFile(`/api/klass/exportClass`, searchProps, '班级导出表.xls').then(() => {
      waitTime(1000).then(() => setDownloading(false));
    });
  };

  return (
    <PageContainer>
      <ProTable<API.ClassVO>
        actionRef={refAction}
        rowKey="id"
        request={handleTableRequest}
        toolBarRender={() => [
          <Button
            type="primary"
            key="new"
            onClick={() => {
              setClasses(undefined);
              setVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          <Button
            type="primary"
            key="delete"
            danger
            onClick={handleDelete}
            disabled={!selectedRowKeys.length}
          >
            <DeleteOutlined /> 删除
          </Button>,
          <Button
            type="primary"
            key="import"
            icon={<PlusOutlined />}
            onClick={() => {
              setImportVisible(true);
            }}
          >
            导入
          </Button>,
          <Button type="default" onClick={handleExport} loading={downloading}>
            <ExportOutlined /> 导出
          </Button>,
        ]}
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />
      <InputDialog
        detailData={classes}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
      <ImportDialog
        visible={importVisible}
        onClose={(count) => {
          setImportVisible(false);
          if (count) {
            refAction.current?.reload();
          }
        }}
      />
    </PageContainer>
  );
};
