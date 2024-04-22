import { ModalForm, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addStudent, updateStudent } from '@/services/api/student';

interface InputDialogProps {
  detailData?: API.StudentDTO;
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
    const { name, studentNumber, gender, parentName,parentPhone,classId } = values;
    const data: API.StudentDTO = {
      id: props.detailData?.id,
      name, studentNumber, gender, parentName,parentPhone,classId
    };

    try {
      if (props.detailData) {
        await updateStudent(data, { throwError: true });
      } else {
        await addStudent(data, { throwError: true });
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
      title={props.detailData ? '修改学生信息' : '新增学生信息'}
      open={props.visible}
    >
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
    </ModalForm>
  );
}
