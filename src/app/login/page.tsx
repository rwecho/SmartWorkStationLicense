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
        className="h-12 text-base"
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
        className="h-12 text-base"
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
        <Input prefix={<MailOutlined />} placeholder="邮箱" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          className="h-12"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className=" flex items-center justify-center  ">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <Title level={2}>欢迎使用 SWS License</Title>
          <Paragraph type="secondary">选择您的登录方式</Paragraph>
        </div>

        <Tabs
          defaultActiveKey="social"
          centered
          items={[
            {
              key: "social",
              label: "社交登录",
              children: (
                <>
                  {socialLoginButtons}
                  <Divider />
                  <Paragraph type="secondary" className="text-center text-xs">
                    登录即表示您同意我们的服务条款和隐私政策
                  </Paragraph>
                </>
              ),
            },
            {
              key: "email",
              label: "邮箱登录",
              children: emailLoginForm,
            },
          ]}
        />
      </Card>
    </div>
  );
}
