"use client";

import { useState } from "react";
import { Button, Card, Form, Input, Typography, message, Divider } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: {
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("注册成功！请登录");
        router.push("/login");
      } else {
        message.error(data.error || "注册失败");
      }
    } catch (error) {
      message.error("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center ">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <Title level={2}>创建账号</Title>
          <Paragraph type="secondary">注册 SWS License 账号</Paragraph>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item name="name" label="姓名" rules={[{ required: false }]}>
            <Input prefix={<UserOutlined />} placeholder="请输入姓名（可选）" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少需要6位" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码（至少6位）"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="h-12"
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">已有账号？</Text>
        </Divider>

        <div className="text-center">
          <Link href="/login">
            <Button type="link" size="large">
              立即登录
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
