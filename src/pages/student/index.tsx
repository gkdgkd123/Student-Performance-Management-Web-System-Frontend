import { deleteStudents, listStudents } from '@/services/api/student';
import { convertPageData, orderBy, waitTime } from '@/utils/request';
// import { listClass,getClass } from '@/services/api/klass';
import { downloadFile } from '@/utils/download-utils';
import { openConfirm } from '@/utils/ui';
import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link, useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import ImportDialog from './ImportDialog';
import InputDialog from './InputDialog';

export default () => {
  const [searchParams] = useSearchParams();
  const classId: any = searchParams.get('classId') || '';
  const id: any = searchParams.get('studentId') || '';
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [importVisible, setImportVisible] = useState(false);
  const [student, setStudent] = useState<API.StudentVO>();
  const [searchProps, setSearchProps] = useState<API.StudentQueryDTO>({});
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  // const [classNames, setClassNames] = useState<Record<number, String>>({});
  console.log('classid:', id);
  const columns: ProColumns<API.StudentVO>[] = [
    // {
    //   title: '学生ID',
    //   dataIndex: 'id',
    //   width: 100,
    //   search: false,
    // },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      
    },
    {
      title: '姓名',
      dataIndex: 'name',
      
      search: true,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setStudent(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      
      search: true,
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      // render: (_, record) => classNames[record.classId]?? '---',
      //   // 打印检查每条记录中的classId值
      //   // console.log('Rendering classId:', record.classId);
    },
    {
      title: '联系人',
      dataIndex: 'parentName',
      search: true,
    },
    {
      title: '联系电话',
      dataIndex: 'parentPhone',
      search: true,
    },
    // {
    //   title: '班级ID',
    //   dataIndex: 'classId',
    //   width: 100,
    //   search: false,
    // },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/student/detail?id=${record.id}`}>修改</Link>],
    },
    {
      title: '成绩信息',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/score?studentId=${record.id}`}>成绩信息</Link>],
    },
  ];

  // const fetchAllClassNames = async () => {
  //   const response = await listClass({ current: 1, pageSize: 999 }); // 假设这将返回所有班级
  //   const classData = convertPageData(response);
  //   if (classData && classData.data) {
  //     const names = classData.data.reduce((acc, currentClass) => {
  //       acc[currentClass.id] = currentClass.className; // 假设每个班级对象都有 id 和 className
  //       return acc;
  //     }, {});
  //     setClassNames(names);
  //   }
  // };

  // // 在组件加载时调用 fetchAllClassNames
  // useEffect(() => {
  //   fetchAllClassNames();
  // }, []);

  // const handleTableRequest = async (params, sorter, filters) => {
  //   const searchParams = {
  //     current: params.current || 1, // 如果params.current未定义，则默认为1
  //     pageSize: params.pageSize || 20, // 如果params.pageSize未定义或为0，则默认为10
  //     orderBy: orderBy(sorter),
  //   };
  //   const resultList = await listStudents(searchParams); // 获取成绩列表
  //   const studentData = convertPageData(resultList);

  //   // console.log("State after set:", classData.data.className);

  //   const processedData = studentData.data.map((item) => {
  //     // const studentDetail = details[item.studentId];
  //     // const classId = studentDetail ? studentDetail.classId : undefined;
  //     return {
  //       ...item,
  //       className: classNames[item.classId] ?? '---' ,
  //     };
  //   });

  //   console.log("Processed data:", processedData);
  //   return {
  //     data:  processedData,
  //     total: studentData.total,
  //     success: true,
  //   };
  // };

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteStudents(selectedRowKeys);
      refAction.current?.reload();
    });
  };

  const handleExport = () => {
    setDownloading(true);
    downloadFile(`/api/student/exportStudent`, searchProps, '学生信息导出表.xls').then(() => {
      waitTime(1000).then(() => setDownloading(false));
    });
  };

  return (
    <PageContainer>
      <ProTable<API.StudentVO>
        actionRef={refAction}
        rowKey="id"
        // request={handleStudentTableRequest}
        request={async (params = {}, sort) => {
          let props = { ...params };

          if (id !== null && id !== '' && id !== undefined) {
            props.id = id;
          }

          if (classId !== null && classId !== '' && classId !== undefined) {
            props.classId = classId;
          }

          props.orderBy = orderBy(sort);

          setSearchProps(props);

          return convertPageData(await listStudents(props));
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="new"
            onClick={() => {
              setStudent(undefined);
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
            disabled={!selectedRowKeys?.length}
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
        detailData={student}
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
