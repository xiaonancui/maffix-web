-- Create test users for Maffix Web
-- Run this in Supabase SQL Editor

-- Password for all users: password123
-- Bcrypt hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIvAprzZ3.

-- Create regular test user
INSERT INTO "User" (
  id, 
  email, 
  name, 
  password, 
  role, 
  "diamonds", 
  points, 
  level, 
  "createdAt", 
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'user@maffix.com',
  'Test User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIvAprzZ3.',
  'USER',
  500,
  100,
  1,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create admin user
INSERT INTO "User" (
  id, 
  email, 
  name, 
  password, 
  role, 
  "diamonds", 
  points, 
  level, 
  "createdAt", 
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'admin@maffix.com',
  'Admin User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIvAprzZ3.',
  'ADMIN',
  10000,
  5000,
  10,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create artist user
INSERT INTO "User" (
  id, 
  email, 
  name, 
  password, 
  role, 
  "diamonds", 
  points, 
  level, 
  "createdAt", 
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'artist@maffix.com',
  'Artist User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIvAprzZ3.',
  'ARTIST',
  1000,
  500,
  5,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verify users were created
SELECT id, email, name, role, "diamonds", points, level 
FROM "User" 
WHERE email IN ('user@maffix.com', 'admin@maffix.com', 'artist@maffix.com');

