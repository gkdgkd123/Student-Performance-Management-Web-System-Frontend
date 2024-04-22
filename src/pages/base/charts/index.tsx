// 假设我们有一个 API 服务模块 api/score
import CardChart, { ChartData, ChartType } from '@/components/CardChart';
import { avgScores } from '@/services/api/score'; 
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { convertPageDataForAvg, orderBy, waitTime } from '@/utils/request';


import { useEffect, useState } from 'react';
import message from 'antd/es/message';

export default () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [avgScoresData, setAvgScoresData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    const fetchAvgScores = async () => {
      // try {
        const avgListResp = await avgScores({ schoolYear: '2021-2022', semester: '1' });
        console.log(avgListResp);
    // 转换原始数据为标准格式
      const response = convertPageDataForAvg(avgListResp);
      console.log(response);
        // 使用 POST 请求获取每个班的各科平均成绩
        // const response: API.AvgDTO<API.AvgVO[]> = await avgScores({ schoolYear: '2021-2022', semester: '1' });

        if (response.success && response.data) {
          const chineseScores: ChartData[] = response.data.map(item => ({
            name: `班级${item.classId}的语文平均成绩`,
            value: item.avgChineseScore,
          }));

          const mathScores: ChartData[] = response.data.map(item => ({
            name: `班级${item.classId}的数学平均成绩`,
            value: item.avgMathScore,
          }));

          const englishScores: ChartData[] = response.data.map(item => ({
            name: `班级${item.classId}的英语平均成绩`,
            value: item.avgEnglishScore,
          }));

          // 组合数据以在图表中显示
          setAvgScoresData([
            ...chineseScores,
            ...mathScores,
            ...englishScores
          ]);
          console.log(avgScoresData);
        } else {
          message.error('获取平均成绩数据失败');
        }
      // } catch (error) {
      //   message.error('请求后端服务出错');
      // }
    };

    fetchAvgScores();
  }, []);

  // CardChart组件可能需要根据实际数据结构进行调整，所以我们假设CardChart可以接受上面构建的数据结构

  return (
    <PageContainer>
      <ProCard
        title="班级各科平均成绩图表"
        // ...其他props
      >
        {/* 假设CardChart用于展示来自state的数据 */}
        <CardChart id="mycharts1" chartType={chartType} data={avgScoresData} height={500} />
      </ProCard>
    </PageContainer>
  );
};