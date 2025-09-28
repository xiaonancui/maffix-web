'use client';

import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Avatar,
  Button,
  Empty,
} from 'antd';
import {
  TrophyOutlined,
  StarOutlined,
  GiftOutlined,
  FireOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useList } from '@refinedev/core';
import Link from 'next/link';
import { formatRelativeTime, formatDiamonds } from '@/lib/utils';

export default function DashboardPage() {
  const { data: session } = useSession();

  // Fetch recent tasks
  const { data: tasksData, isLoading: tasksLoading } = useList({
    resource: 'tasks',
    pagination: { current: 1, pageSize: 5 },
    filters: [
      {
        field: 'userId',
        operator: 'eq',
        value: session?.user?.id,
      },
    ],
    sorters: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
  });

  // Fetch recent prizes
  const { data: prizesData, isLoading: prizesLoading } = useList({
    resource: 'prizes',
    pagination: { current: 1, pageSize: 3 },
    filters: [
      {
        field: 'userId',
        operator: 'eq',
        value: session?.user?.id,
      },
    ],
    sorters: [
      {
        field: 'wonAt',
        order: 'desc',
      },
    ],
  });

  const stats = [
    {
      title: 'Diamond Balance',
      value: session?.user?.diamondBalance || 0,
      formatter: formatDiamonds,
      prefix: <StarOutlined className='text-diamond-600' />,
      valueStyle: { color: '#f59532' },
    },
    {
      title: 'Tasks Completed',
      value: 24,
      suffix: <ArrowUpOutlined className='text-green-500' />,
      prefix: <TrophyOutlined className='text-blue-600' />,
      valueStyle: { color: '#3b82f6' },
    },
    {
      title: 'Prizes Won',
      value: 8,
      prefix: <GiftOutlined className='text-purple-600' />,
      valueStyle: { color: '#8b5cf6' },
    },
    {
      title: 'Current Streak',
      value: 7,
      suffix: 'days',
      prefix: <FireOutlined className='text-red-500' />,
      valueStyle: { color: '#ef4444' },
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white'>
        <h1 className='mb-2 text-2xl font-bold'>
          Welcome back, {session?.user?.name || 'User'}! 👋
        </h1>
        <p className='mb-4 text-blue-100'>
          You have {formatDiamonds(session?.user?.diamondBalance || 0)} diamonds
          ready to spend on the gacha!
        </p>
        <div className='flex space-x-4'>
          <Link href='/dashboard/tasks'>
            <Button type='primary' ghost>
              View Tasks
            </Button>
          </Link>
          <Link href='/dashboard/gacha'>
            <Button type='primary' ghost>
              Try Gacha
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
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

      {/* Progress Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title='Weekly Progress' className='h-full'>
            <div className='space-y-4'>
              <div>
                <div className='mb-2 flex justify-between'>
                  <span>Tasks Completed</span>
                  <span>15/20</span>
                </div>
                <Progress percent={75} strokeColor='#3b82f6' />
              </div>
              <div>
                <div className='mb-2 flex justify-between'>
                  <span>Diamonds Earned</span>
                  <span>750/1000</span>
                </div>
                <Progress percent={75} strokeColor='#f59532' />
              </div>
              <div>
                <div className='mb-2 flex justify-between'>
                  <span>Gacha Spins</span>
                  <span>3/5</span>
                </div>
                <Progress percent={60} strokeColor='#8b5cf6' />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title='Achievement Progress' className='h-full'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg bg-yellow-50 p-3'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100'>
                    🏆
                  </div>
                  <div>
                    <div className='font-medium'>Task Master</div>
                    <div className='text-sm text-gray-500'>
                      Complete 50 tasks
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium'>24/50</div>
                  <Progress percent={48} size='small' showInfo={false} />
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    💎
                  </div>
                  <div>
                    <div className='font-medium'>Diamond Collector</div>
                    <div className='text-sm text-gray-500'>
                      Earn 10,000 diamonds
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium'>2,450/10,000</div>
                  <Progress percent={24.5} size='small' showInfo={false} />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title='Recent Tasks'
            extra={
              <Link href='/dashboard/tasks'>
                <Button type='link'>View All</Button>
              </Link>
            }
          >
            {tasksLoading ? (
              <div>Loading...</div>
            ) : tasksData?.data?.length ? (
              <List
                dataSource={tasksData.data}
                renderItem={(task: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<TrophyOutlined />}
                          style={{
                            backgroundColor:
                              task.status === 'completed'
                                ? '#52c41a'
                                : '#1890ff',
                          }}
                        />
                      }
                      title={task.title}
                      description={`${task.diamondReward} diamonds • ${formatRelativeTime(
                        task.createdAt
                      )}`}
                    />
                    <div
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description='No tasks yet' />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title='Recent Prizes'
            extra={
              <Link href='/dashboard/prizes'>
                <Button type='link'>View All</Button>
              </Link>
            }
          >
            {prizesLoading ? (
              <div>Loading...</div>
            ) : prizesData?.data?.length ? (
              <List
                dataSource={prizesData.data}
                renderItem={(prize: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={prize.imageUrl}
                          icon={<GiftOutlined />}
                          style={{ backgroundColor: '#722ed1' }}
                        />
                      }
                      title={prize.name}
                      description={`Won ${formatRelativeTime(prize.wonAt)}`}
                    />
                    <div className='text-right'>
                      <div className='text-sm text-gray-500'>
                        {prize.rarity} rarity
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description='No prizes won yet' />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
