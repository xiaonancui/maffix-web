"use client";

import { ReactNode } from "react";
import { Layout, Menu, Avatar, Badge, Dropdown, Button, Alert } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  GiftOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  PictureOutlined,
  BarChartOutlined,
  TeamOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Shield } from "lucide-react";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();

  // Check if user has admin role
  const isAdmin = (session?.user as any)?.role === "admin";

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Overview</Link>,
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: <Link href="/admin/users">Users</Link>,
    },
    {
      key: "3",
      icon: <BarChartOutlined />,
      label: <Link href="/admin/tasks">Tasks</Link>,
    },
    {
      key: "4",
      icon: <GiftOutlined />,
      label: <Link href="/admin/prizes">Prizes</Link>,
    },
    {
      key: "5",
      icon: <PictureOutlined />,
      label: <Link href="/admin/banners">Banners</Link>,
    },
    {
      key: "6",
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Settings</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">User Dashboard</Link>,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600">
            You don&apos;t have permission to access the admin panel.
          </p>
          <Link href="/dashboard">
            <Button type="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        width={256}
        className="bg-gray-900"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="border-b border-gray-700 p-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-400" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </Link>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          theme="dark"
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <CrownOutlined className="text-lg text-yellow-500" />
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>

            {/* Notifications */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="flex items-center justify-center"
              />
            </Badge>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="flex cursor-pointer items-center space-x-2 rounded px-2 py-1 hover:bg-gray-50">
                <Avatar
                  src={session?.user?.image}
                  icon={<UserOutlined />}
                  size="small"
                />
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.name || "Admin"}
                </span>
                <CrownOutlined className="text-xs text-yellow-500" />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="bg-gray-50 p-6">
          {/* Admin Warning */}
          <Alert
            message="Admin Access"
            description="You are currently in the admin panel. Changes made here will affect all users."
            type="warning"
            showIcon
            className="mb-6"
          />

          <div className="mx-auto max-w-7xl">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
