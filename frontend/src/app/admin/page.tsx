"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  List,
  Avatar,
  Tag,
} from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  GiftOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { formatRelativeTime, formatNumber, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboardPage() {
  // Fetch recent users
  const {
    query: { data: usersData, isLoading: usersLoading },
  } = useList({
    resource: "users",
    pagination: { current: 1, pageSize: 5 } as any,
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  // Fetch recent tasks
  const {
    query: { data: tasksData, isLoading: tasksLoading },
  } = useList({
    resource: "tasks",
    pagination: { current: 1, pageSize: 5 } as any,
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const systemStats = [
    {
      title: "Total Users",
      value: 1247,
      prefix: <UserOutlined className="text-blue-600" />,
      suffix: <ArrowUpOutlined className="text-green-500" />,
      valueStyle: { color: "#3b82f6" },
    },
    {
      title: "Active Tasks",
      value: 89,
      prefix: <TrophyOutlined className="text-green-600" />,
      suffix: <ArrowUpOutlined className="text-green-500" />,
      valueStyle: { color: "#10b981" },
    },
    {
      title: "Total Prizes",
      value: 156,
      prefix: <GiftOutlined className="text-purple-600" />,
      valueStyle: { color: "#8b5cf6" },
    },
    {
      title: "Revenue",
      value: 12450,
      formatter: ((value: number) => formatCurrency(value)) as any,
      prefix: <DollarOutlined className="text-yellow-600" />,
      suffix: <ArrowUpOutlined className="text-green-500" />,
      valueStyle: { color: "#f59e0b" },
    },
  ];

  const recentActivityData = [
    {
      id: 1,
      user: "John Doe",
      action: "Completed task",
      task: "Daily Survey",
      time: "2 minutes ago",
      type: "task_completed",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Won prize",
      task: "Premium Headphones",
      time: "5 minutes ago",
      type: "prize_won",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Registered",
      task: "New user signup",
      time: "10 minutes ago",
      type: "user_registered",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "Purchased diamonds",
      task: "1000 diamonds",
      time: "15 minutes ago",
      type: "purchase",
    },
  ];

  const topUsersColumns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center space-x-2">
          <Avatar src={record.avatar} icon={<UserOutlined />} size="small" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Tasks Completed",
      dataIndex: "tasksCompleted",
      key: "tasksCompleted",
      sorter: true,
    },
    {
      title: "Diamonds",
      dataIndex: "diamonds",
      key: "diamonds",
      render: (value: number) => formatNumber(value),
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <Link href={`/admin/users/${record.id}`}>
          <EyeOutlined className="cursor-pointer text-blue-600" />
        </Link>
      ),
    },
  ];

  const topUsersData = [
    {
      id: 1,
      name: "Alice Johnson",
      tasksCompleted: 45,
      diamonds: 12500,
      status: "active",
    },
    {
      id: 2,
      name: "Bob Smith",
      tasksCompleted: 38,
      diamonds: 9800,
      status: "active",
    },
    {
      id: 3,
      name: "Carol Davis",
      tasksCompleted: 32,
      diamonds: 8200,
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <Row gutter={[16, 16]}>
        {systemStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                formatter={stat.formatter}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={stat.valueStyle}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and Analytics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="System Health" className="h-full">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between">
                  <span>Server CPU Usage</span>
                  <span>45%</span>
                </div>
                <Progress percent={45} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <span>Memory Usage</span>
                  <span>68%</span>
                </div>
                <Progress percent={68} strokeColor="#faad14" />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <span>Database Load</span>
                  <span>32%</span>
                </div>
                <Progress percent={32} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="mb-2 flex justify-between">
                  <span>API Response Time</span>
                  <span>120ms</span>
                </div>
                <Progress percent={25} strokeColor="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Recent Activity" className="h-full">
            <List
              dataSource={recentActivityData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor:
                            item.type === "task_completed"
                              ? "#52c41a"
                              : item.type === "prize_won"
                                ? "#722ed1"
                                : item.type === "user_registered"
                                  ? "#1890ff"
                                  : "#faad14",
                        }}
                        icon={
                          item.type === "task_completed" ? (
                            <TrophyOutlined />
                          ) : item.type === "prize_won" ? (
                            <GiftOutlined />
                          ) : item.type === "user_registered" ? (
                            <UserOutlined />
                          ) : (
                            <DollarOutlined />
                          )
                        }
                        size="small"
                      />
                    }
                    title={
                      <span>
                        <strong>{item.user}</strong> {item.action}
                      </span>
                    }
                    description={`${item.task} • ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Users and Recent Data */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Top Users"
            extra={<Link href="/admin/users">View All</Link>}
          >
            <Table
              dataSource={topUsersData}
              columns={topUsersColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Recent Users"
            extra={<Link href="/admin/users">View All</Link>}
          >
            {usersLoading ? (
              <div>Loading...</div>
            ) : (
              <List
                dataSource={usersData?.data?.slice(0, 5) || []}
                renderItem={(user: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={user.avatar}
                          icon={<UserOutlined />}
                          size="small"
                        />
                      }
                      title={user.name || user.email}
                      description={`Joined ${formatRelativeTime(user.createdAt)}`}
                    />
                    <Tag color={user.role === "admin" ? "red" : "blue"}>
                      {user.role?.toUpperCase() || "USER"}
                    </Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
