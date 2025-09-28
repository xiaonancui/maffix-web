import { NextAuthOptions } from 'next-auth';

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'user' | 'admin';
  diamondBalance: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLoginAt?: string;
  emailVerified?: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    prizeWins: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showStats: boolean;
  };
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  diamondReward: number;
  difficulty: TaskDifficulty;
  category: string;
  tags: string[];
  requirements?: TaskRequirement[];
  timeLimit?: number; // in minutes
  maxCompletions?: number;
  currentCompletions: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export type TaskType =
  | 'survey'
  | 'social'
  | 'review'
  | 'referral'
  | 'daily'
  | 'special';
export type TaskStatus =
  | 'draft'
  | 'active'
  | 'completed'
  | 'expired'
  | 'cancelled';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface TaskRequirement {
  type:
    | 'url_visit'
    | 'form_submission'
    | 'file_upload'
    | 'social_follow'
    | 'code_verification';
  description: string;
  data?: Record<string, any>;
  isRequired: boolean;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionData?: Record<string, any>;
  reviewNotes?: string;
  diamondsAwarded: number;
  completedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Prize and Gacha types
export interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type: PrizeType;
  rarity: PrizeRarity;
  value?: number;
  category: string;
  isActive: boolean;
  stock?: number;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export type PrizeType =
  | 'physical'
  | 'digital'
  | 'voucher'
  | 'discount'
  | 'experience';
export type PrizeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Banner {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: BannerType;
  costPerSpin: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  prizes: BannerPrize[];
  totalSpins: number;
  createdAt: string;
  updatedAt: string;
}

export type BannerType = 'standard' | 'premium' | 'limited' | 'event';

export interface BannerPrize {
  prizeId: string;
  prize: Prize;
  dropRate: number; // percentage (0-100)
  maxWins?: number;
  currentWins: number;
}

export interface GachaSpin {
  id: string;
  userId: string;
  bannerId: string;
  prizeId?: string;
  prize?: Prize;
  diamondsCost: number;
  result: 'win' | 'lose';
  spinAt: string;
}

export interface UserPrize {
  id: string;
  userId: string;
  prizeId: string;
  prize: Prize;
  bannerId: string;
  banner: Banner;
  wonAt: string;
  claimedAt?: string;
  status: 'pending' | 'claimed' | 'shipped' | 'delivered';
  trackingInfo?: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface TaskForm {
  title: string;
  description: string;
  type: TaskType;
  diamondReward: number;
  difficulty: TaskDifficulty;
  category: string;
  tags: string[];
  timeLimit?: number;
  maxCompletions?: number;
  expiresAt?: string;
  requirements?: TaskRequirement[];
}

export interface PrizeForm {
  name: string;
  description: string;
  imageUrl?: string;
  type: PrizeType;
  rarity: PrizeRarity;
  value?: number;
  category: string;
  stock?: number;
  metadata?: Record<string, any>;
}

export interface BannerForm {
  name: string;
  description: string;
  imageUrl: string;
  type: BannerType;
  costPerSpin: number;
  startDate: string;
  endDate?: string;
  prizes: {
    prizeId: string;
    dropRate: number;
    maxWins?: number;
  }[];
}

// Navigation types
export interface NavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: NavItem[];
  roles?: ('user' | 'admin')[];
}

export interface Breadcrumb {
  title: string;
  href?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'task_completed'
  | 'prize_won'
  | 'diamonds_earned'
  | 'system_announcement'
  | 'account_update';

// Statistics types
export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalDiamonds: number;
  totalPrizes: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: string;
  lastActive: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalPrizes: number;
  totalSpins: number;
  revenue: number;
}

// Extended NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: 'user' | 'admin';
      diamondBalance: number;
    };
  }

  interface User {
    id: string;
    role: 'user' | 'admin';
    diamondBalance: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
    diamondBalance: number;
  }
}
