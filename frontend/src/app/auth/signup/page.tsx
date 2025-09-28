'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Divider, Alert, Space, Checkbox } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { z } from 'zod';

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine(val => val === true, 'You must accept the terms and conditions'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: SignUpFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      const validatedData = signUpSchema.parse(values);

      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccess(true);

      // Auto sign in after successful registration
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: validatedData.email,
          password: validatedData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard');
        }
      }, 2000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setError(`Failed to sign up with ${provider}`);
      }
    } catch (err) {
      setError(`An error occurred during ${provider} sign up`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='space-y-4 text-center'>
        <div className='text-6xl'>🎉</div>
        <h1 className='text-2xl font-bold text-gray-900'>
          Welcome to TenTenTen!
        </h1>
        <p className='text-gray-600'>
          Your account has been created successfully. You're being signed in...
        </p>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>
          Create Account
        </h1>
        <p className='text-gray-600'>
          Join TenTenTen and start earning diamonds today
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message={error}
          type='error'
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

      {/* OAuth Buttons */}
      <Space direction='vertical' className='w-full' size='middle'>
        <Button
          type='default'
          icon={<GoogleOutlined />}
          size='large'
          block
          onClick={() => handleOAuthSignIn('google')}
          loading={loading}
        >
          Continue with Google
        </Button>
        <Button
          type='default'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.33 6.33 0 0 0 10.86-4.43V7.83a8.24 8.24 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.26z' />
            </svg>
          }
          size='large'
          block
          onClick={() => handleOAuthSignIn('tiktok')}
          loading={loading}
        >
          Continue with TikTok
        </Button>
      </Space>

      <Divider>Or create account with email</Divider>

      {/* Sign Up Form */}
      <Form
        form={form}
        name='signup'
        onFinish={handleSubmit}
        layout='vertical'
        size='large'
      >
        <Form.Item
          name='name'
          label='Full Name'
          rules={[
            { required: true, message: 'Please enter your name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder='Enter your full name'
            autoComplete='name'
          />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder='Enter your email'
            autoComplete='email'
          />
        </Form.Item>

        <Form.Item
          name='password'
          label='Password'
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Create a password'
            autoComplete='new-password'
          />
        </Form.Item>

        <Form.Item
          name='confirmPassword'
          label='Confirm Password'
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder='Confirm your password'
            autoComplete='new-password'
          />
        </Form.Item>

        <Form.Item
          name='terms'
          valuePropName='checked'
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error('You must accept the terms and conditions')
                    ),
            },
          ]}
        >
          <Checkbox>
            I agree to the{' '}
            <Link href='/terms' className='text-blue-600 hover:text-blue-500'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/privacy' className='text-blue-600 hover:text-blue-500'>
              Privacy Policy
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            block
            loading={loading}
            size='large'
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>

      {/* Sign In Link */}
      <div className='text-center'>
        <span className='text-gray-600'>Already have an account? </span>
        <Link
          href='/auth/signin'
          className='font-medium text-blue-600 hover:text-blue-500'
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
