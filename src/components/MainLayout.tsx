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
    <div className="bg-white flex w-full items-center">
      <div className="mx-2">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
      </div>

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
        style={{ flex: 1, minWidth: 0 }}
      />

      <div className="ms-auto me-4">
        {status === "loading" ? (
          <div>加载中...</div>
        ) : session?.user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>{session.user.name || session.user.email}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        ) : (
          <Button type="link" onClick={() => router.push("/login")}>
            登录
          </Button>
        )}
      </div>
    </div>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="h-full">
      <Header
        style={{
          backgroundColor: "transparent",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <NavBar></NavBar>
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <div
          className="mt-4"
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Sws License ©{new Date().getFullYear()} Created by rwecho
      </Footer>
    </Layout>
  );
};

export default MainLayout;
