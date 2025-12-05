"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Space,
  Typography,
  Divider,
  Form,
  Input,
  message,
  Tabs,
} from "antd";
import {
  GithubOutlined,
  GoogleOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleEmailLogin = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth 返回的错误信息
        console.log(result);
        if (result.error === "CredentialsSignin") {
          message.error("邮箱或密码错误");
        } else {
          message.error("登录失败：" + result.error);
        }
      } else if (result?.ok) {
        message.success("登录成功！");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      message.error("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const socialLoginButtons = (
    <Space direction="vertical" size="middle" className="w-full">
      <Button
        type="primary"
        size="large"
        icon={<GithubOutlined />}
        onClick={() => handleSocialLogin("github")}
        block
        className="h-10 md:h-12 text-sm md:text-base"
        style={{
          background: "#24292e",
          borderColor: "#24292e",
        }}
      >
        使用 GitHub 登录
      </Button>

      <Button
        type="default"
        size="large"
        icon={<GoogleOutlined />}
        onClick={() => handleSocialLogin("google")}
        block
        className="h-10 md:h-12 text-sm md:text-base"
      >
        使用 Google 登录
      </Button>
    </Space>
  );

  const emailLoginForm = (
    <Form
      form={form}
      name="login"
      onFinish={handleEmailLogin}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ]}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="邮箱" 
          className="h-10 md:h-12"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="密码" 
          className="h-10 md:h-12"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          className="h-10 md:h-12 text-sm md:text-base"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-4 md:mb-6">
          <Title level={2} className="!text-xl md:!text-2xl !mb-2">
            欢迎使用 SWS License
          </Title>
          <Paragraph type="secondary" className="text-sm md:text-base">
            选择您的登录方式
          </Paragraph>
        </div>

        <Tabs
          defaultActiveKey="social"
          centered
          items={[
            {
              key: "social",
              label: <span className="text-sm md:text-base">社交登录</span>,
              children: (
                <>
                  {socialLoginButtons}
                  <Divider className="my-4" />
                  <Paragraph type="secondary" className="text-center text-xs md:text-sm">
                    登录即表示您同意我们的服务条款和隐私政策
                  </Paragraph>
                </>
              ),
            },
            {
              key: "email",
              label: <span className="text-sm md:text-base">邮箱登录</span>,
              children: emailLoginForm,
            },
          ]}
        />
      </Card>
    </div>
  );
}
