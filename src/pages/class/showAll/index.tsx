import { getClass, updateClass } from '@/services/api/klass';

import { PageContainer, ProForm, ProFormText, ProFormInstance } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState, useRef } from 'react';
export default () => {
  const [searchParams] = useSearchParams();
  const form = useRef<ProFormInstance>(null);
  const id: any = searchParams.get('id') || '';
  const [classes, setClasses] = useState<API.ClassDTO>();

  useEffect(() => {
    getClass({ id }).then((result) => {
      setClasses(result || {});
      form?.current?.setFieldsValue(result);
    });
  }, []);
  const onFinish = async (values: any) => {
    const { className } = values;
    const data: API.ClassDTO = {
      id,
      className,
    };

    try {
      await updateClass(data, { throwError: true });
      message.success('保存成功');
      history.push('/class');
    } catch (ex) {
      return true;
    }
    return true;
  };
  return (
    <PageContainer>
      <ProForm formRef={form} onFinish={(values) => onFinish(values)}>
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
      </ProForm>
    </PageContainer>
  );
};
