"use client";

import { ReactNode } from "react";
import { Layout, Menu, Avatar, Badge, Dropdown, Button } from "antd";
import {
  DashboardOutlined,
  TrophyOutlined,
  GiftOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Gem } from "lucide-react";

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Overview</Link>,
    },
    {
      key: "2",
      icon: <TrophyOutlined />,
      label: <Link href="/dashboard/tasks">Tasks</Link>,
    },
    {
      key: "3",
      icon: <GiftOutlined />,
      label: <Link href="/dashboard/gacha">Gacha</Link>,
    },
    {
      key: "4",
      icon: <StarOutlined />,
      label: <Link href="/dashboard/prizes">My Prizes</Link>,
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">Settings</Link>,
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

  return (
    <Layout className="min-h-screen">
      <Sider
        width={256}
        className="bg-white shadow-sm"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="border-b border-gray-200 p-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Gem className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TenTenTen</span>
          </Link>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Diamond Balance */}
            <div className="flex items-center space-x-2 rounded-full bg-diamond-50 px-3 py-1">
              <Gem className="h-4 w-4 text-diamond-600" />
              <span className="text-sm font-medium text-diamond-700">
                {(session?.user as any)?.diamondBalance?.toLocaleString() ||
                  "0"}
              </span>
            </div>

            {/* Notifications */}
            <Badge count={3} size="small">
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
                  {session?.user?.name || "User"}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
