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
    <div className="max-w-4xl mx-auto px-2 md:px-4">
      <Card 
        title={<span className="text-base md:text-lg">个人信息</span>}
        className="shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          {user?.image && (
            <Avatar 
              src={user.image} 
              size={{ xs: 64, sm: 72, md: 80 }}
              className="flex-shrink-0"
            />
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-1">{user?.name}</h2>
            <p className="text-sm md:text-base text-gray-500 break-all">{user?.email}</p>
          </div>
        </div>

        <Descriptions 
          bordered 
          column={{ xs: 1, sm: 1, md: 1 }}
          size="small"
          className="[&_.ant-descriptions-item-label]:text-xs [&_.ant-descriptions-item-label]:md:text-sm [&_.ant-descriptions-item-content]:text-xs [&_.ant-descriptions-item-content]:md:text-sm"
        >
          <Descriptions.Item label="姓名">{user?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <span className="break-all">{user?.email || '-'}</span>
          </Descriptions.Item>
          <Descriptions.Item label="头像">
            {user?.image ? "已设置" : "未设置"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
