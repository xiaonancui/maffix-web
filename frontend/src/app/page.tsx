'use client';

import Link from 'next/link';
import { Button } from 'antd';
import { ArrowRight, Gem, Trophy, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='container mx-auto px-4 py-6'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Gem className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold text-gray-900'>TenTenTen</span>
          </div>
          <div className='flex items-center space-x-4'>
            <Link href='/auth/signin'>
              <Button type='default'>Sign In</Button>
            </Link>
            <Link href='/auth/signup'>
              <Button type='primary'>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='mb-6 text-5xl font-bold text-gray-900'>
            Complete Tasks, <span className='text-blue-600'>Earn Diamonds</span>
            ,<br />
            Win Merchandise
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-600'>
            Complete tasks, collect diamonds, and spin the gacha for exciting
            prizes.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Link href='/auth/signup'>
              <Button
                type='primary'
                size='large'
                icon={<ArrowRight className='h-5 w-5' />}
                className='h-12 px-8 text-lg'
              >
                Start Earning Diamonds
              </Button>
            </Link>
            <Link href='/dashboard'>
              <Button size='large' className='h-12 px-8 text-lg'>
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className='mt-24 grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
              <Trophy className='h-8 w-8 text-blue-600' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>Complete Tasks</h3>
            <p className='text-gray-600'>
              Take on various tasks and challenges to earn diamonds.
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-diamond-100'>
              <Gem className='h-8 w-8 text-diamond-600' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>Collect Diamonds</h3>
            <p className='text-gray-600'>
              Earn diamonds for every completed task and use them to spin the
              gacha wheel.
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
              <Users className='h-8 w-8 text-green-600' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>Win Prizes</h3>
            <p className='text-gray-600'>
              Spin the gacha to win amazing prizes, from rewards to merchandise.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-24 rounded-lg bg-white p-8 shadow-sm'>
          <div className='grid gap-8 text-center md:grid-cols-4'>
            <div>
              <div className='mb-2 text-3xl font-bold text-blue-600'>
                1,000+
              </div>
              <div className='text-gray-600'>Active Users</div>
            </div>
            <div>
              <div className='mb-2 text-3xl font-bold text-diamond-600'>
                50K+
              </div>
              <div className='text-gray-600'>Tasks Completed</div>
            </div>
            <div>
              <div className='mb-2 text-3xl font-bold text-green-600'>10K+</div>
              <div className='text-gray-600'>Prizes Won</div>
            </div>
            <div>
              <div className='mb-2 text-3xl font-bold text-purple-600'>
                100K+
              </div>
              <div className='text-gray-600'>Diamonds Earned</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='mt-24 bg-gray-900 py-12 text-white'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Gem className='h-6 w-6' />
              <span className='text-xl font-bold'>TenTenTen</span>
            </div>
            <div className='text-gray-400'>
              © 2025 TenTenTen. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
