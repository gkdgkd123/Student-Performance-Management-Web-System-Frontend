import { ModalForm, ProFormInstance } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useRef } from 'react';

interface InputDialogProps {
  visible: boolean;
  onClose: (result?: number) => void;
}

export default (props: InputDialogProps) => {
  const form = useRef<ProFormInstance>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onFinish = async (values: any) => {
    if (!inputFileRef?.current?.files?.length) {
      message.error('请选择文件');
      return;
    }
    const formData = new FormData();
    formData.append('file', inputFileRef.current.files[0], inputFileRef.current.files[0].name);

    const result = await fetch('/api/student/importStudent', {
      method: 'POST',
      body: formData,
    });

    const json = await result.json();

    if (json?.success) {
      message.success(`上传成功，共导入${json?.data || 0}条数据`);
      props.onClose(json?.data || 0);
      return true;
    }

    message.error(json?.errorMessage);
    return false;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      layout="horizontal"
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(undefined),
      }}
      title="导入学生数据"
      open={props.visible}
    >
      <Form.Item 
        label="Excel文件：" 
        rules={[{ required: true, message: '请选择上传文件' }]}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="file" 
            ref={inputFileRef} 
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              transition: 'border-color 0.3s',
            }} 
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#40a9ff'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#d9d9d9'}
          />
        </div>
      </Form.Item>
    </ModalForm>
  );
};
