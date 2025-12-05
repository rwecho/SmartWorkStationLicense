"use client";
import { Button, Skeleton, Space, Table, TableProps, notification } from "antd";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { License } from "@/types/license";
import CreateOrUpdateLicenseModal from "@/components/CreateOrUpdateLicenseModal";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const HomePage = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [loading, setLoading] = useState(false);

  const [licenses, setLicenses] = useState<License[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleLicenseCreated = (license?: License) => {
    if (license) {
      setLicenses([license, ...licenses]);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const licenses = await fetch("/api/licenses");
        setLicenses(await licenses.json());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (license: License) => {
    //confirm before delete
    Modal.confirm({
      title: "确认删除",
      content: "删除后无法恢复",
      onOk: async () => {
        const res = await fetch(`/api/licenses/${license.id}`, {
          method: "DELETE",
        });
        if (res.status === 200) {
          setLicenses(licenses.filter((l) => l.id !== license.id));

          notification.success({
            message: "删除成功",
            showProgress: true,
            duration: 2,
          });
        }
      },
    });
  };

  const handleCopy = async (license: License) => {
    const licenseCode = license.license;

    navigator.clipboard.writeText(licenseCode);
    notification.success({
      message: "复制成功",
      description: licenseCode,
      showProgress: true,
    });
  };

  const columns: TableProps<License>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text) => <span className="text-xs md:text-sm">{text}</span>,
      responsive: ["lg"],
    },
    {
      title: "电脑指纹",
      dataIndex: "fingerprint",
      key: "fingerprint",
      ellipsis: true,
      render: (text) => <span className="text-xs md:text-sm">{text}</span>,
    },
    {
      title: "注册信息",
      dataIndex: "brand",
      key: "brand",
      ellipsis: true,
      render: (text) => (
        <span className="text-xs md:text-sm">{text || "-"}</span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (text) => (
        <span className="text-xs md:text-sm">
          {new Date(text).toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 120,
      render: (text, record) => (
        <Space size="small" className="flex-wrap">
          <Button
            type="link"
            danger={true}
            size="small"
            onClick={() => handleDelete(record)}
            className="text-xs md:text-sm p-0 h-auto"
          >
            删除
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleCopy(record)}
            className="text-xs md:text-sm p-0 h-auto"
          >
            复制
          </Button>
        </Space>
      ),
    },
  ];

  if (status === "loading") {
    return <Skeleton />;
  }

  return (
    <div className="w-full">
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold">激活码管理</h1>
            <Button
              type="primary"
              onClick={handleCreate}
              className="h-8 md:h-10 text-xs md:text-sm px-4 md:px-8"
            >
              创建注册码
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={licenses}
              rowKey="id"
              bordered
              scroll={{ x: "max-content" }}
              pagination={{
                responsive: true,
                showSizeChanger: true,
                showTotal: (total) => (
                  <span className="text-xs md:text-sm">共 {total} 条</span>
                ),
                className: "text-xs md:text-sm",
              }}
              className="[&_.ant-table]:text-xs [&_.ant-table]:md:text-sm"
            />
          </div>

          <CreateOrUpdateLicenseModal
            isOpen={isModalOpen}
            onClose={(license) => handleLicenseCreated(license)}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
