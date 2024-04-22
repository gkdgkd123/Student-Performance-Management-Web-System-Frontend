import { getScore, updateScore } from '@/services/api/score';

import { PageContainer, ProForm, ProFormText, ProFormInstance,ProFormDigit } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState, useRef } from 'react';
export default () => {
  const [searchParams] = useSearchParams();
  const form = useRef<ProFormInstance>(null);
  const id: any = searchParams.get('id') || '';
  const [score, setScore] = useState<API.ScoreDTO>();

  useEffect(() => {
    getScore({ id }).then((result) => {
      setScore(result || {});
      form?.current?.setFieldsValue(result);
    });
  }, []);
  const onFinish = async (values: any) => {
    const { studentId, chineseScore, mathScore, englishScore, semester, schoolYear } = values;
    const data: API.ScoreDTO = {
      id: props.detailData?.id, // 假设这是在编辑信息时使用的已有ID
      studentId,
      chineseScore,
      mathScore,
      englishScore,
      entryDate: props.detailData?.entryDate, // 假设 entryDate 是不通过表单修改的数据，而是从已有信息中获取，或者是另有途径输入的
      semester,
      schoolYear,
    }

    try {
      await updateScore(data, { throwError: true });
      message.success('保存成功');
      history.push('/base/score');
    } catch (ex) {
      return true;
    }
    return true;
  };
  return (
    <PageContainer>
      <ProForm formRef={form} onFinish={(values) => onFinish(values)}>
      <ProFormText
  name="studentId"
  label="学生ID"
  rules={[
    {
      required: true,
      message: '请输入学生ID！',
    },
  ]}
/>

<ProForm.Group>
  <ProFormDigit
    name="chineseScore"
    label="语文成绩"
    min={0}
    max={100}
    rules={[
      {
        required: true,
        message: '请输入语文成绩！',
      },
    ]}
  />
  <ProFormDigit
    name="mathScore"
    label="数学成绩"
    min={0}
    max={100}
    rules={[
      {
        required: true,
        message: '请输入数学成绩！',
      },
    ]}
  />
  <ProFormDigit
    name="englishScore"
    label="英语成绩"
    min={0}
    max={100}
    rules={[
      {
        required: true,
        message: '请输入英语成绩！',
      },
    ]}
  />
</ProForm.Group>

<ProFormText
  name="semester"
  label="学期"
  rules={[
    {
      required: true,
      message: '请输入学期！',
    },
  ]}
/>

<ProFormText
  name="schoolYear"
  label="学年"
  rules={[
    {
      required: true,
      message: '请输入学年！',
    },
  ]}
/>

        <ProFormText name="description" label="备注" />
      </ProForm>
    </PageContainer>
  );
};
