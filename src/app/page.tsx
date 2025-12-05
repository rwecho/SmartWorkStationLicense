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
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
      responsive: ["md"],
    },
    {
      title: "电脑指纹",
      dataIndex: "fingerprint",
      key: "fingerprint",
      responsive: ["md"],
    },
    {
      title: "注册信息",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            danger={true}
            size="small"
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
          <Button type="link" size="small" onClick={() => handleCopy(record)}>
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
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <Table
          columns={columns}
          dataSource={licenses}
          bordered
          title={() => (
            <>
              <Space>
                <Button type="primary" onClick={handleCreate} className="!px-8">
                  创建注册码
                </Button>
              </Space>

              <CreateOrUpdateLicenseModal
                isOpen={isModalOpen}
                onClose={(license) => handleLicenseCreated(license)}
              ></CreateOrUpdateLicenseModal>
            </>
          )}
        />
      )}
    </>
  );
};

export default HomePage;
