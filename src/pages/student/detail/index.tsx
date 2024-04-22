import { getStudent, updateStudent } from '@/services/api/student';

import { PageContainer, ProForm, ProFormText, ProFormInstance } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState, useRef } from 'react';
export default () => {
  const [searchParams] = useSearchParams();
  const form = useRef<ProFormInstance>(null);
  const id: any = searchParams.get('id') || '';
  const [student, setStudent] = useState<API.StudentDTO>();

  useEffect(() => {
    getStudent({ id }).then((result) => {
      setStudent(result || {});
      form?.current?.setFieldsValue(result);
    });
  }, []);
  const onFinish = async (values: any) => {
    const { name, studentNumber, gender, parentName,parentPhone,classId } = values;
    const data: API.StudentDTO = {
      id,name, studentNumber, gender, parentName,parentPhone,classId
    };

    try {
      await updateStudent(data, { throwError: true });
      message.success('保存成功');
      history.push('/student');
    } catch (ex) {
      return true;
    }
    return true;
  };
  return (
    <PageContainer>
      <ProForm formRef={form} onFinish={(values) => onFinish(values)}>
      <ProForm.Group>
      <ProFormText
        name="name"
        label="姓名"
        rules={[
          {
            required: true,
            message: '请输入姓名！',
          },
        ]}
      />
      <ProFormText
        name="classId"
        label="班级ID"
        rules={[
          {
            required: true,
            message: '请输入班级ID！',
          },
        ]}
      />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="studentNumber"
          label="学号"
          rules={[
            {
              required: true,
              message: '请输入学号！',
            },
          ]}
        />
        <ProFormText
          name="gender"
          label="性别"
          rules={[
            {
              required: true,
              message: '请输入性别！',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="parentName"
          label="联系人"
          rules={[
            {
              required: true,
              message: '请输入联系人！',
            },
          ]}
        />
        <ProFormText
          name="parentPhone"
          label="联系电话"
          rules={[
            {
              required: true,
              message: '请输入联系电话！',
            },
          ]}
        />
      </ProForm.Group>
        <ProFormText name="description" label="备注" />
      </ProForm>
    </PageContainer>
  );
};
