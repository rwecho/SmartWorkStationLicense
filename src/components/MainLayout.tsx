"use client";
import React from "react";
import Image from "next/image";
import { Layout, Menu, Space, theme, Dropdown, Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { DownOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const items = [
  {
    key: "1",
    label: "激活码管理",
    router: "/",
  },
];
const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userMenuItems = [
    {
      key: "profile",
      label: "个人信息",
      onClick: () => router.push("/profile"),
    },
    {
      key: "logout",
      label: "退出登录",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  return (
    <div className="bg-white flex w-full items-center px-2 md:px-4">
      <div className="flex-shrink-0 mr-2 md:mr-4">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
      </div>

      <div className="hidden md:flex flex-1">
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          onClick={({ key }) => {
            const item = items.find((item) => item.key === key);
            if (item) {
              router.push(item.router);
            }
          }}
          style={{ flex: 1, minWidth: 0, border: "none" }}
        />
      </div>

      <div className="ml-auto flex items-center">
        {status === "loading" ? (
          <div className="text-sm text-gray-500">加载中...</div>
        ) : session?.user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="hidden sm:inline text-sm md:text-base">
                {session.user.name || session.user.email}
              </span>
              <DownOutlined className="text-xs" />
            </Space>
          </Dropdown>
        ) : (
          <Button
            type="link"
            onClick={() => router.push("/login")}
            className="text-sm md:text-base"
          >
            登录
          </Button>
        )}
      </div>
    </div>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="h-full">
      <Header
        className="bg-transparent sticky top-0 z-10 w-full flex items-center p-0"
        style={{ background: colorBgContainer, padding: 0 }}
      >
        <NavBar></NavBar>
      </Header>
      <Content className="w-full px-4 md:px-8">
        <div className="mt-4 p-4 md:p-6 rounded-lg content-card bg-white">
          {children}
        </div>
      </Content>
      <Footer className="text-center text-xs md:text-sm py-4">
        Sws License ©{new Date().getFullYear()} Created by rwecho
      </Footer>
    </Layout>
  );
};

export default MainLayout;
