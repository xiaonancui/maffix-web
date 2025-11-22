# 颜色替换映射表

**日期：** 2025-11-22  
**扫描结果：** 472 处硬编码颜色需要替换

---

## 📊 扫描统计

```bash
grep -r "bg-\[#0a0a0a\]\|bg-\[#1a1a1a\]\|bg-\[#FF5656\]\|#FF5656\|border-red-500" src --include="*.tsx" --include="*.ts" | wc -l
# 结果: 472 处
```

---

## 🎨 颜色替换映射

### **1. 背景颜色**

| 当前颜色 | 替换为 | 用途 |
|---------|--------|------|
| `bg-[#0a0a0a]` | `bg-background` | 主背景 |
| `bg-[#1a1a1a]` | `bg-card` | 卡片背景 |
| `bg-black` | `bg-background` | 主背景 |
| `bg-gray-900` | `bg-card` | 卡片背景 |
| `bg-gray-800` | `bg-secondary` | 次要背景 |

### **2. 主色（红色 → Zinc）**

| 当前颜色 | 替换为 | 用途 |
|---------|--------|------|
| `bg-[#FF5656]` | `bg-primary` | 主色按钮 |
| `bg-[#FF5656]/90` | `bg-primary/90` | 主色按钮悬停 |
| `bg-[#FF5656]/20` | `bg-primary/20` | 主色背景（半透明） |
| `bg-[#FF5656]/10` | `bg-primary/10` | 主色背景（更透明） |
| `text-[#FF5656]` | `text-primary` | 主色文字 |
| `border-[#FF5656]` | `border-primary` | 主色边框 |
| `#FF5656` | `hsl(var(--primary))` | CSS 中的主色 |

### **3. 边框颜色**

| 当前颜色 | 替换为 | 用途 |
|---------|--------|------|
| `border-red-500` | `border-primary` | 主色边框 |
| `border-red-500/20` | `border-border` | 半透明边框 |
| `border-red-500/30` | `border-border` | 半透明边框 |
| `border-gray-800` | `border-border` | 默认边框 |
| `border-gray-700` | `border-border` | 默认边框 |

### **4. 文字颜色**

| 当前颜色 | 替换为 | 用途 |
|---------|--------|------|
| `text-white` | `text-foreground` | 主要文字 |
| `text-gray-400` | `text-muted-foreground` | 次要文字 |
| `text-gray-300` | `text-foreground` | 主要文字 |
| `text-gray-500` | `text-muted-foreground` | 次要文字 |

### **5. 保留的颜色（不替换）**

| 颜色 | 用途 | 原因 |
|------|------|------|
| `neon.cyan` (#00f5ff) | 霓虹灯效果 | Marketing 页面特效 |
| `neon.magenta` (#ff00ff) | 霓虹灯效果 | Marketing 页面特效 |
| `neon.yellow` (#ffff00) | 霓虹灯效果 | Marketing 页面特效 |
| `neon.green` (#39ff14) | 霓虹灯效果 | Marketing 页面特效 |
| `from-yellow-400 to-orange-500` | 稀有度渐变 | Gacha 系统 LEGENDARY |
| `from-amber-400 to-yellow-500` | 稀有度渐变 | Gacha 系统 SSR |
| `from-purple-400 to-pink-500` | 稀有度渐变 | Gacha 系统 EPIC |
| `from-blue-400 to-cyan-500` | 稀有度渐变 | Gacha 系统 RARE |
| `bg-green-500` | 成功状态 | 状态指示 |
| `bg-yellow-500` | 警告状态 | 状态指示 |
| `bg-red-500` | 错误状态 | 状态指示（非主色） |
| `bg-blue-500` | 信息状态 | 状态指示 |

---

## 📁 需要替换的文件（按优先级）

### **高优先级（核心组件）**

1. **Admin 组件**
   - `src/components/admin/AdminHeader.tsx` - 已添加 ThemeToggle ✅
   - `src/components/admin/AdminSidebar.tsx` - 需要替换
   - `src/components/admin/StatusBadge.tsx` - 需要替换
   - `src/components/admin/DataTable.tsx` - 需要替换

2. **Dashboard 组件**
   - `src/components/dashboard/DashboardNav.tsx` - 已添加 ThemeToggle ✅
   - `src/components/dashboard/GachaResultModal.tsx` - 需要替换（保留稀有度渐变）
   - `src/components/dashboard/PremiumPackCard.tsx` - 需要替换
   - `src/components/dashboard/MerchandiseCard.tsx` - 需要替换

3. **Auth 页面**
   - `src/app/(auth)/login/page.tsx` - 需要替换
   - `src/app/(auth)/register/page.tsx` - 需要替换

### **中优先级（功能页面）**

4. **Dashboard 页面**
   - `src/app/(dashboard)/dashboard/page.tsx`
   - `src/app/(dashboard)/gacha/page.tsx`
   - `src/app/(dashboard)/store/page.tsx`
   - `src/app/(dashboard)/missions/[id]/page.tsx`
   - `src/app/(dashboard)/tasks/page.tsx`

5. **Admin 页面**
   - `src/app/(admin)/admin/users/page.tsx`
   - `src/app/(admin)/admin/prizes/page.tsx`
   - `src/app/(admin)/admin/missions/page.tsx`

### **低优先级（Marketing 页面）**

6. **Marketing 页面**
   - `src/app/(marketing)/page.tsx` - 保留霓虹灯效果
   - `src/app/(marketing)/features/page.tsx` - 保留霓虹灯效果
   - `src/app/(marketing)/about/page.tsx` - 保留霓虹灯效果
   - `src/app/(marketing)/how-it-works/page.tsx` - 保留霓虹灯效果
   - `src/app/(marketing)/membership/page.tsx` - 保留霓虹灯效果

---

## 🔧 批量替换命令

### **替换背景颜色**
```bash
# bg-[#0a0a0a] → bg-background
find src -name "*.tsx" -type f -exec sed -i '' 's/bg-\[#0a0a0a\]/bg-background/g' {} +

# bg-[#1a1a1a] → bg-card
find src -name "*.tsx" -type f -exec sed -i '' 's/bg-\[#1a1a1a\]/bg-card/g' {} +
```

### **替换主色**
```bash
# bg-[#FF5656] → bg-primary
find src -name "*.tsx" -type f -exec sed -i '' 's/bg-\[#FF5656\]/bg-primary/g' {} +

# text-[#FF5656] → text-primary
find src -name "*.tsx" -type f -exec sed -i '' 's/text-\[#FF5656\]/text-primary/g' {} +
```

### **替换边框颜色**
```bash
# border-red-500/20 → border-border
find src -name "*.tsx" -type f -exec sed -i '' 's/border-red-500\/20/border-border/g' {} +

# border-red-500/30 → border-border
find src -name "*.tsx" -type f -exec sed -i '' 's/border-red-500\/30/border-border/g' {} +
```

---

## ⚠️ 注意事项

### **1. Marketing 页面特殊处理**
Marketing 页面使用了大量的 `bg-[#FF5656]` 作为视觉强调，这些颜色在亮色主题下可能需要保留或调整。

### **2. 状态颜色不替换**
成功（绿色）、警告（黄色）、错误（红色）、信息（蓝色）等状态颜色应保持不变。

### **3. Gacha 稀有度渐变不替换**
Gacha 系统的稀有度渐变色是游戏机制的一部分，应保持不变。

### **4. 霓虹灯效果不替换**
Marketing 页面的霓虹灯效果（cyan, magenta, yellow, green）应保持不变。

---

## 📈 替换进度

- [ ] 阶段 4.1: 扫描所有硬编码颜色 ✅
- [ ] 阶段 4.2: 创建颜色替换映射表 ✅
- [ ] 阶段 4.3: 批量替换背景颜色
- [ ] 阶段 4.4: 批量替换主色
- [ ] 阶段 4.5: 批量替换边框颜色

---

## 🎯 建议

由于有 472 处硬编码颜色，建议采用**渐进式替换**策略：

1. **第一阶段：** 替换核心组件（Admin, Dashboard）
2. **第二阶段：** 替换功能页面
3. **第三阶段：** 替换 Marketing 页面（需要特殊处理）

每个阶段完成后进行测试，确保视觉效果正常。

