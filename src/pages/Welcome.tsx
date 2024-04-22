import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {  theme } from 'antd';
import { Card, Typography } from 'antd';
const { Title, Paragraph } = Typography;
import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
const getGreetingByTime = () => {
  const hour = new Date().getHours(); // 获取当前小时数(0-23)
  if (hour < 6) {
    return '深夜了，注意休息噢~';
  } else if (hour < 12) {
    return '早上好,又是活力满满！';
  } else if (hour < 18) {
    return '下午好，饮茶了没？';
  } else {
    return '晚上好，人是一棵能思想的苇草';
  }
};
/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
              
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        跳转至相应界面 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const [greeting, setGreeting] = useState('');
  const { initialState } = useModel('@@initialState');
  const [currentTime, setCurrentTime] = useState(new Date()); // 设置当前时间的状态

  useEffect(() => {
    // 设置定时器每秒更新时间
    const timerId = setInterval(() => {
      setGreeting(getGreetingByTime());

      setCurrentTime(new Date()); // 更新时间状态为当前时间
    }, 1000);

    // 清除定时器
    return () => clearInterval(timerId);
  }, []);
  
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '50px',
              color: token.colorTextHeading,
              textAlign: 'center',
            }}
          >
            欢迎使用 SDU学生成绩管理系统
          </div>
          
          <div className="logo-wrapper">
            <img
              src="/sdu-logo.png"
              alt="Logo"
              style={{ display: 'block', margin: '0 auto', maxWidth: '800px' }}
            />
                    <Card
          style={{ maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}
          bordered={true}
        >
          <Title level={4} style={{ color: '#52c41a' }}>
            现在时间：{currentTime.toLocaleDateString()}{' '}
            {currentTime.toLocaleTimeString()}
          </Title>
          <Paragraph style={{ fontSize: '20px', color: '#595959' }}>
            {greeting}
          </Paragraph>
        </Card>
          
          </div>
          <p
            style={{
              fontSize: '18px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              // width: '65%',
              // textAlign: 'right',
            }}
          >
            
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="http://localhost:8000/class"
              title="班级管理"
              desc="本程序实现了班级的增删改查功能，方便您对班级进行管理。"
            />
            <InfoCard
              index={2}
              title="学生管理"
              href="http://localhost:8000/student"
              desc="本程序实现了学生的增删改查功能，方便您对学生进行管理。"
            />
            <InfoCard
              index={3}
              title="成绩管理"
              href="http://localhost:8000/score"
              desc="本程序实现了成绩的增删改查功能，方便您对成绩进行管理。"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
