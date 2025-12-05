"use client";
import { useSession } from "next-auth/react";
import { Card, Descriptions, Avatar, Spin } from "antd";
import { redirect } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="个人信息">
        <div className="flex items-center gap-4 mb-6">
          {user?.image && <Avatar src={user.image} size={80} />}
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="姓名">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="头像">
            {user?.image ? "已设置" : "未设置"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
