import { ModalForm, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addClass, updateClass } from '@/services/api/klass';

interface InputDialogProps {
  detailData?: API.ClassDTO;
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
    const { className } = values;
    const data: API.ClassDTO = {
      id: props.detailData?.id,
      className,
    };

    try {
      if (props.detailData) {
        await updateClass(data, { throwError: true });
      } else {
        await addClass(data, { throwError: true });
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
      title={props.detailData ? '修改班级' : '新建班级'}
      open={props.visible}
    >
      <ProFormText
        name="className"
        label="班级名称"
        rules={[
          {
            required: true,
            message: '请输入班级名称！',
          },
        ]}
      />
      <ProFormText name="description" label="备注" />
    </ModalForm>
  );
}
