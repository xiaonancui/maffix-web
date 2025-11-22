# shadcn/ui 快速参考指南

## 🚀 快速开始

### 添加新组件

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

常用组件：
- `button` `input` `label` `textarea`
- `card` `badge` `avatar`
- `table` `form` `dialog` `select`
- `dropdown-menu` `popover` `tooltip`
- `tabs` `accordion` `alert`
- `progress` `slider` `switch`

---

## 📚 常用组件示例

### 1. Button

```tsx
import { Button } from '@/components/ui/button'

// 基础用法
<Button>Click me</Button>

// 不同变体
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// 不同尺寸
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// 禁用状态
<Button disabled>Disabled</Button>
```

### 2. Card

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### 3. Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 4. Form (with react-hook-form + zod)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### 5. Dialog

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 6. Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### 7. Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## 🎨 主题定制

### 使用 CSS 变量

所有 shadcn/ui 组件都使用 CSS 变量，可以在 `globals.css` 中自定义：

```css
.dark {
  --primary: 0 72% 66%;  /* #FF5656 */
  --background: 0 0% 3.9%;  /* #0a0a0a */
  --card: 0 0% 10.2%;  /* #1a1a1a */
  /* ... */
}
```

### 使用 Tailwind 类

```tsx
<Button className="bg-red-500 hover:bg-red-600">Custom Color</Button>
```

---

## 🛠️ 工具函数

### cn() - 类名合并

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  condition && 'conditional-class',
  'another-class'
)} />
```

---

## 📖 更多资源

- **官方文档：** https://ui.shadcn.com
- **组件库：** https://ui.shadcn.com/docs/components
- **主题定制：** https://ui.shadcn.com/themes
- **测试页面：** http://localhost:3000/admin/ui-test

