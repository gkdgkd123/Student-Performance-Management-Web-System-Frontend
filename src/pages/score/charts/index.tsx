import CardChart, { ChartData, ChartType } from '@/components/CardChart';
import { avgScores, listScores } from '@/services/api/score';
import { convertPageData, convertPageDataForAvg } from '@/utils/request';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import { TableOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { useEffect, useState } from 'react';
import { Space } from 'antd';

export default () => {
  const [currentScores, setCurrentScores] = useState<ChartData[]>([]);
  const [chineseScores, setChineseScores] = useState<ChartData[]>([]);
  const [mathScores, setMathScores] = useState<ChartData[]>([]);
  const [englishScores, setEnglishScores] = useState<ChartData[]>([]);
  const [totalScores, setTotalScores] = useState<ChartData[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [schoolYear, setSchoolYear] = useState<string>('2021-2022');
  const [semester, setSemester] = useState<string>('1');
  const [schoolYears, setSchoolYears] = useState<unknown[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('语文');

  // 获取初次数据
  useEffect(() => {
    fetchAvgScores();
  }, [schoolYear, semester]); // 监听学年和学期变化

  const fetchAvgScores = async () => {
    const avgListResp = await avgScores({ schoolYear, semester });
    const response = convertPageDataForAvg(avgListResp);
    console.log('response', response);

    const ssListResp = await listScores({ current: 1, pageSize: 999 });
    const ssResponse = convertPageData(ssListResp);

    console.log('ssResponse', ssResponse.data);
    const ssMap = ssResponse.data.map((item) => ({
      schoolYear: item.schoolYear,
      semester: item.semester,
      className: item.className,
    }));
    const uniqueSchoolYears = new Set();

    ssMap.forEach((item) => {
      uniqueSchoolYears.add(item.schoolYear);
    });
    

    // 将 Set 转换为数组
    const schoolYearsData = Array.from(uniqueSchoolYears);
    setSchoolYears(schoolYearsData);

    console.log(schoolYears);

    if (response && response.total > 0) {
      const newChineseScores = response.data.map((item) => ({
        name: item.className,
        value: item.avgChineseScore,
      }));

      const newMathScores = response.data.map((item) => ({
        name: item.className,
        value: item.avgMathScore,
      }));

      const newEnglishScores = response.data.map((item) => ({
        name: item.className,
        value: item.avgEnglishScore,
      }));
      const newTotalScores = response.data.map((item) => ({
        name: item.className,
        value: item.totalAvgScore,
      }));

      setChineseScores(newChineseScores);
      setCurrentScores(newChineseScores); // 设置默认显示语文分数
      setMathScores(newMathScores);
      setEnglishScores(newEnglishScores);
      setTotalScores(newTotalScores);
    } else {
      message.error('暂无数据');
    }
  };

  const handleSubjectChange = (subjectType: string) => {
    if (subjectType === '语文') {
      setCurrentScores(chineseScores);
      
    } else if (subjectType === '数学') {
      setCurrentScores(mathScores);
    } else if (subjectType === '英语') {
      setCurrentScores(englishScores);
    }else if (subjectType === '总分') {
      setCurrentScores(totalScores);
    }
    setSelectedSubject(subjectType);
  };

  const schoolYearOptions = schoolYears.map((year) => ({
    value: year,
    label: year,
  }));
  console.log("schoolYears", schoolYears);



  return (
    <PageContainer>
      <ProCard
        title={<h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>班级各科平均成绩图表</h2>}
        extra={[
          <Space split={'|'} wrap>
            <Space>
              <Select key="schoolYear" value={schoolYear} onChange={setSchoolYear}>
                {schoolYearOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Select key="semester" value={semester} onChange={setSemester}>
                <Select.Option value="1">第一学期</Select.Option>
                <Select.Option value="2">第二学期</Select.Option>
                <Select.Option value="3">第三学期</Select.Option>
                <Select.Option value="4">第四学期</Select.Option>
              </Select>
            </Space>
            <Space>
              <Button key="chinese" onClick={() => handleSubjectChange('语文')} style={{ backgroundColor: selectedSubject === '语文' ? '#1890ff' : 'initial' }} >
                语文
              </Button>
              <Button key="math" onClick={() => handleSubjectChange('数学')} style={{ backgroundColor: selectedSubject === '数学' ? '#1890ff' : 'initial' }}>
                数学
              </Button>
              <Button key="english" onClick={() => handleSubjectChange('英语')} style={{ backgroundColor: selectedSubject === '英语' ? '#1890ff' : 'initial' }}>
                英语
              </Button>
              <Button key="total" onClick={() => handleSubjectChange('总分')} style={{ backgroundColor: selectedSubject === '总分' ? '#1890ff' : 'initial' }}>
                总分
              </Button>
            </Space>
            <Space>
            <Button key="barChart" onClick={() => setChartType('bar')} style={{ backgroundColor: chartType === 'bar' ? 'yellow' : 'initial' }}>
                柱状图
              </Button>
              <Button key="lineChart" onClick={() => setChartType('line')} style={{ backgroundColor: chartType === 'line' ? 'yellow' : 'initial' }}>
                折线图
              </Button>
              
            </Space>
            <Link to={`/score/avg`}>
              <Button key="tableForm" type="primary" icon={<TableOutlined />} className="special-table-form-button">
                表格形式
              </Button>
            </Link>
          </Space>
        ]}
      >
        <CardChart id="mycharts1" chartType={chartType} data={currentScores} height={500}  />
      </ProCard>
    </PageContainer>
  );
};
