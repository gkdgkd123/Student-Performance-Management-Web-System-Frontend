import Footer from '@/components/Footer';
import { login } from '@/services/api/authentication';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [verifyInput, setVerifyInput] = useState(''); // 新状态用于存储用户输入的验证码
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
  );
  // ...其他状态和函数

  const toggleBackgroundImage = () => {
    const newBackgroundImage = backgroundImage.includes('hhh.jpg')
      ? "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')"
      : "url('/hhh.jpg')";
    setBackgroundImage(newBackgroundImage);
  };

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: backgroundImage,
      // `url('/hhh.jpg')`,
      // "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentToken: userInfo,
        }));
      });
    }
  };
useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      // 使用历史记录的替换方法进行页面跳转，这样不会在浏览器历史记录中留下上一个页面的痕迹
      const response = await fetch('/api/authentication/checkSession', {
        credentials: 'include',
      });
      if (response.ok) {
        // 用户已经登录，重定向到欢迎页
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '已登录！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        // 用户未登录，可以在这里设置一些状态，表示登录表单可以被渲染
      }
    } catch (error) {
      // 错误处理逻辑...
      console.error('Error checking login status:', error);
    }
  };
    
  checkLoginStatus();

  },[]);


  useEffect(() => {
    // 更新验证码URL
    setCaptchaUrl(`http://localhost:9311/Code/getVerify?random=${Date.now()}`);

  }, []);

  const captchaImage = (
    <img
      src={captchaUrl}
      onClick={() => setCaptchaUrl(`http://localhost:9311/Code/getVerify?random=${Date.now()}`)}
      alt="验证码"
      style={{ cursor: 'pointer', height: '32px', marginLeft: '8px' }}
    />
  );



  const handleSubmit = async (values: any) => {
    
    const response = await fetch('http://localhost:9311/Code/checkVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 修改Content-Type
      },
      credentials: 'include',
      body: new URLSearchParams({
        verifyInput: values.verifyInput,
      }).toString(), // 将对象转换为查询字符串形式
    });
    const result = await response.json();
    console.log(result);
    if (result.data) {
      try {
        // 登录
        const msg = await login({ userId: values.username!, password: values.password! });
        if (!msg) return;

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } catch (error: any) {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: '登录失败，请重试！',
        });
        setCaptchaUrl(`http://localhost:9311/Code/getVerify?random=${Date.now()}`);
        message.error(error?.message || defaultLoginFailureMessage);
      }
    } else {
      message.error('验证码错误，请重新输入！');
      // 刷新验证码
      setCaptchaUrl(`http://localhost:9311/Code/getVerify?random=${Date.now()}`);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="SDU学生成绩管理系统"
          // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <div className="logo-wrapper">
            <img
              src="/sdu-logo.png"
              alt="Logo"
              style={{ display: 'block', margin: '0 auto', maxWidth: '250px' }}
            />
          </div>

          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.username.placeholder',
              defaultMessage: '用户名: admin or user',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
              defaultMessage: '密码: password',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />
          <ProFormText
            name="verifyInput"
            fieldProps={{
              size: 'large',
              addonAfter: captchaImage, // 使用 addonAfter 属性添加验证码图片
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.captcha.placeholder',
              defaultMessage: '请输入验证码',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.login.captcha.required',
                  defaultMessage: '请输入验证码!',
                }),
              },
            ]}
          />

          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
            </div>
            <div>
              <Button onClick={toggleBackgroundImage} type="primary">
                切换背景图
              </Button>
            </div>
          </div>
        </LoginForm>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
