import { deleteScores, listScores } from '@/services/api/score';
import { getStudent, listStudents } from '@/services/api/student';
import { getClass } from '@/services/api/klass';
import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';
import { downloadFile } from '@/utils/download-utils';
import { Link } from '@umijs/max';
import ImportDialog from './ImportDialog';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [importVisible, setImportVisible] = useState(false);
  const [score, setScore] = useState<API.ScoreVO>();
  const [searchProps, setSearchProps] = useState<API.ScoreQueryDTO>({});
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [studentDetails, setStudentDetails] = useState<Record<number, API.StudentDTO>>({});
  const [classNames, setClassNames] = useState<Record<number, String>>({});
  // const [classNames, setClassNames] = useState<Record<number, string>>({});


  const columns: ProColumns<API.ScoreVO>[] = [
    // {
    //   title: '成绩ID',
    //   dataIndex: 'id',
    //   width: 80, 
    //   search: false,
    // },
    {
      title: '学生ID',
      dataIndex: 'studentId',
      width: 100, 
      search: true,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setScore(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setScore(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    
      
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      // render: (_, record) => studentDetails[record.studentId]?.studentNumber || '---',
    },

    {
      title: '班级名称',
      dataIndex: 'className',
      // render: (_, record) => classNames[record.classId]?? '---',
      //   // 打印检查每条记录中的classId值
      //   // console.log('Rendering classId:', record.classId);
    },
    {
      title: '语文成绩',
      dataIndex: 'chineseScore',
      width: 100, 
      search: false,
    },
    {
      title: '数学成绩',
      dataIndex: 'mathScore',
      width: 100, 
      search: false,
    },
    {
      title: '英语成绩',
      dataIndex: 'englishScore',
      width: 100, 
      search: false,
    },
    {
      title: '平均成绩',
      dataIndex: 'avgScore',
      width: 100, 
      search: false,
    },
    {
      title: '录入日期',
      dataIndex: 'entryDate',
      width: 150, 
      valueType: 'date',
      search: true,
    },
    {
      title: '学期',
      dataIndex: 'semester',
      width: 100, 
      search: true,
    },
    {
      title: '学年',
      dataIndex: 'schoolYear',
      width: 100, 
      search: true,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<Link to={`/base/score/detail?id=${record.id}`}>修改</Link>],
    },
  ];

  // const handleTableRequest = async (params, sorter, filters) => {
  //   const searchParams = {
  //     current: params.current || 1, // 如果params.current未定义，则默认为1
  //     pageSize: params.pageSize || 20, // 如果params.pageSize未定义或为0，则默认为10
  //     orderBy: orderBy(sorter), 
  //   };
  //   const resultList = await listScores(searchParams); // 获取成绩列表
  //   const scoreData = convertPageData(resultList);

  //   // 异步加载所有学生详情
  //   const fetchDetails = async () => {
  //     const details = {};
  //     const klassNames = {};
  //     const fetchedClassIds = new Set();  // 使用 Set 来记录已经获取过的 classId
    
  //     const studentPromises = scoreData.data.map(async (score) => {
  //       const studentInfo = await getStudent({ id: score.studentId });
  //       details[score.studentId] = studentInfo;
    
  //       if (studentInfo && studentInfo.classId && !fetchedClassIds.has(studentInfo.classId)) {
  //         // 如果 klassNames 中还没有 classId 的班级信息并且没有请求过这个 classId
  //         fetchedClassIds.add(studentInfo.classId);  // 标记为已请求
  //         const classInfo = await getClass({ id: studentInfo.classId });
  //         // console.log("Class names before set:", classInfo);
  //         klassNames[studentInfo.classId] = classInfo.className;
          
  //       }
  //     });
    
  //     await Promise.all(studentPromises);
  //     console.log("Class names before set:", klassNames);
  //     return { details, klassNames };
  //   };
    
  //   const { details, klassNames } = await fetchDetails();
  //   setStudentDetails(details);
  //   setClassNames(klassNames);
  //   console.log("State after set:", klassNames);
  //   console.log("scoreData:", scoreData);
  //   const processedData = scoreData.data.map((item) => {
  //     const studentDetail = details[item.studentId];
  //     const classId = studentDetail ? studentDetail.classId : undefined;
  //     console.log("Class ID is:", classId);
  //     return {
  //       ...item,
  //       classId,
  //       className: classId ? klassNames[classId] ?? '---' : '---',
  //     };
  //   });
  //   console.log("Processed data:", processedData);
  //   return {
  //     data:  processedData,
  //     total: scoreData.total,
  //     success: true,
  //   };
  // };

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteScores(selectedRowKeys);
      refAction.current?.reload();
    });
  };

  const handleExport = () => {
    setDownloading(true);
    downloadFile(`/api/score/exportScore`, searchProps, '学生成绩导出表.xls').then(() => {
      waitTime(1000).then(() => setDownloading(false));
    });
  };

  return (
    <PageContainer>
      <ProTable<API.ScoreVO>
        actionRef={refAction}
        rowKey="id"
         // request={handleTableRequest}
         request={async (params = {}, sort) => {
          const props = {
            ...params,
            orderBy: orderBy(sort),
          };
          setSearchProps(props);
          return convertPageData(await listScores(props));
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="new"
            onClick={() => {
              setScore(undefined);
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
        detailData={score}
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
