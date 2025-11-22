# Quick Test URLs - Issue 3 Features

Copy and paste these URLs into your browser to quickly navigate through all admin pages.

---

## 🔐 Login First

**Admin Account:**
- URL: http://localhost:3000/auth/signin
- Email: `admin@maffix.com`
- Password: `password123`

---

## 📋 Admin Pages to Test

### 1. Mission Management
```
http://localhost:3000/admin/missions
http://localhost:3000/admin/missions/new
```

### 2. Release Management
```
http://localhost:3000/admin/releases
http://localhost:3000/admin/releases/new
```

### 3. Gacha Management
```
http://localhost:3000/admin/gacha
http://localhost:3000/admin/gacha/items/new
```

### 4. Merchandise Management
```
http://localhost:3000/admin/merchandise
http://localhost:3000/admin/merchandise/new
```

### 5. Premium Packs Management
```
http://localhost:3000/admin/packs
http://localhost:3000/admin/packs/new
```

### 6. User Management
```
http://localhost:3000/admin/users
```

### 7. Prize Management
```
http://localhost:3000/admin/prizes
http://localhost:3000/admin/prizes/new
```

### 8. Analytics Dashboard
```
http://localhost:3000/admin/analytics
```

### 9. Admin Home
```
http://localhost:3000/admin
```

---

## 🧪 Testing Workflow

### Quick Smoke Test (5 minutes)
1. Open each URL above
2. Verify page loads without errors
3. Check browser console for errors
4. Verify data displays correctly

### Full Feature Test (30-60 minutes)
Follow the comprehensive guide: `docs/testing/MANUAL_TESTING_GUIDE.md`

---

## 🐛 Common Issues to Check

- [ ] Console errors (F12 → Console tab)
- [ ] Network errors (F12 → Network tab)
- [ ] Missing images
- [ ] Broken links
- [ ] Validation errors
- [ ] API errors (check 403, 404, 500 responses)
- [ ] Layout issues (responsive design)
- [ ] Loading states
- [ ] Empty states

---

## 📊 Browser DevTools Checklist

### Console Tab
- [ ] No red errors
- [ ] No yellow warnings (acceptable if minor)

### Network Tab
- [ ] All API calls return 200/201
- [ ] No 403 Forbidden (if logged in as admin)
- [ ] No 404 Not Found
- [ ] No 500 Server Error
- [ ] Response times < 1s

### Elements Tab
- [ ] Styles applied correctly
- [ ] No layout shifts
- [ ] Responsive design works

---

## ✅ Quick Verification

Run through this checklist for each page:

1. **Page Loads:** Does the page load without errors?
2. **Data Displays:** Does data show correctly?
3. **Search Works:** Can you search/filter?
4. **Actions Work:** Can you create/edit/delete?
5. **Responsive:** Does it work on mobile?

---

## 🚀 Next Steps After Testing

1. Document any issues in `MANUAL_TESTING_GUIDE.md`
2. Create GitHub issues for bugs
3. Prioritize fixes (Critical → High → Medium → Low)
4. Retest after fixes

