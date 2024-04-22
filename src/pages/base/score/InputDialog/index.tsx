import { ModalForm, ProForm, ProFormInstance, ProFormText,ProFormDigit } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addScore, updateScore } from '@/services/api/score';


interface InputDialogProps {
  detailData?: API.ScoreDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

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
      if (props.detailData) {
        await updateScore(data, { throwError: true });
      } else {
        await addScore(data, { throwError: true });
      }
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('保存成功');
    return true;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.detailData ? '修改成绩' : '新增成绩'}
      open={props.visible}
    >
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
    </ModalForm>
  );
}
