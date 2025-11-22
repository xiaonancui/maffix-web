# Development Server Management Standards

## Critical Rules

### ⚠️ NEVER Launch Multiple Dev Servers

**Maximum Rule:** Only ONE dev server should be running at a time for this project.

---

## Required Workflow

### Before Starting Any Dev Server

**ALWAYS follow this checklist:**

1. **Check for existing processes:**
   ```bash
   # Use list-processes tool to check for running dev servers
   ```

2. **If a dev server is already running:**
   - ✅ Check its status and port number
   - ✅ Reuse the existing server (inform user of the port)
   - ✅ Only kill and restart if absolutely necessary:
     - Configuration changes (next.config.js, tsconfig.json)
     - Package updates (npm install, package.json changes)
     - Environment variable changes (.env files)
     - Build errors that require restart

3. **If port conflicts occur:**
   - ✅ Use `kill-process` to terminate the conflicting process
   - ✅ Wait 2-3 seconds for port to be released
   - ✅ Then launch new dev server

4. **If no dev server is running:**
   - ✅ Launch new dev server
   - ✅ Wait for "Ready" message
   - ✅ Inform user of the port number

---

## Common Scenarios

### Scenario 1: User Asks to Test Changes

**Wrong Approach:**
```bash
# ❌ DON'T DO THIS
npm run dev  # Launches new server without checking
```

**Correct Approach:**
```bash
# ✅ DO THIS
1. Run list-processes
2. If dev server exists on port 3000:
   - Inform user: "Dev server already running on http://localhost:3000"
   - Tell user to refresh browser
3. If no dev server:
   - Launch new one
   - Inform user of port
```

---

### Scenario 2: Code Changes Made

**Wrong Approach:**
```bash
# ❌ DON'T DO THIS
npm run dev  # Launches new server, causing port conflict
```

**Correct Approach:**
```bash
# ✅ DO THIS
1. Run list-processes
2. If dev server exists:
   - Inform user: "Changes will auto-reload on existing server at http://localhost:3000"
   - No restart needed (Next.js has hot reload)
3. If no dev server:
   - Launch new one
```

---

### Scenario 3: Configuration Changes

**Examples of changes that REQUIRE restart:**
- `next.config.js` modifications
- `tsconfig.json` modifications
- `.env` or `.env.local` changes
- `package.json` dependency changes (after npm install)
- Prisma schema changes (after prisma generate)

**Correct Approach:**
```bash
# ✅ DO THIS
1. Run list-processes
2. If dev server exists:
   - Kill it: kill-process <terminal_id>
   - Wait 2-3 seconds
   - Launch new one
3. Inform user: "Restarted dev server due to [reason]"
```

---

### Scenario 4: Port Conflicts

**Symptoms:**
- Error: "Port 3000 is in use, trying 3001 instead"
- Multiple servers running on different ports

**Correct Approach:**
```bash
# ✅ DO THIS
1. Run list-processes
2. Identify all dev servers
3. Kill ALL dev servers except the one you want to keep
4. If keeping none, kill all and start fresh
5. Inform user of cleanup action
```

---

## Process Management Commands

### Check Running Processes
```typescript
list-processes
// Returns: List of all processes with terminal IDs and status
```

### Kill a Process
```typescript
kill-process({ terminal_id: 15 })
// Terminates the process with terminal ID 15
```

### Launch Dev Server
```typescript
launch-process({
  command: 'npm run dev',
  wait: false,
  max_wait_seconds: 30,
  cwd: '/Users/xiaonan/Projects/web/maffix-web'
})
// Returns: Terminal ID of new process
```

### Read Process Output
```typescript
read-process({
  terminal_id: 15,
  wait: true,
  max_wait_seconds: 30
})
// Returns: Output from the process
```

---

## Communication with User

### When Reusing Existing Server
```
✅ Dev server already running on http://localhost:3000
   Your changes will auto-reload. Just refresh your browser!
```

### When Starting New Server
```
🚀 Starting dev server...
   [wait for Ready message]
✅ Dev server ready on http://localhost:3000
```

### When Restarting Server
```
🔄 Restarting dev server due to [configuration changes/package updates/etc.]
   [kill old server]
   [start new server]
✅ Dev server restarted on http://localhost:3000
```

### When Cleaning Up Multiple Servers
```
🧹 Cleaning up multiple dev servers...
   Killed server on port 3001 (terminal 13)
   Killed server on port 3002 (terminal 15)
✅ Starting fresh dev server on http://localhost:3000
```

---

## Current Session Issue (Example)

**What Happened:**
During the current session, dev servers were launched on ports 3000, 3001, and 3002 without closing previous ones.

**Why This Is Bad:**
- ❌ Wastes system resources (CPU, memory)
- ❌ Causes confusion about which port to use
- ❌ Can cause port conflicts
- ❌ Makes debugging harder

**What Should Have Happened:**
1. First launch: Start on port 3000
2. Subsequent requests: Check if port 3000 is running, reuse it
3. If restart needed: Kill port 3000, restart on port 3000

---

## Checklist for AI Agent

Before ANY dev server operation:

- [ ] Run `list-processes` to check for existing servers
- [ ] If server exists, determine if restart is needed
- [ ] If restart not needed, inform user to use existing server
- [ ] If restart needed, kill old server first
- [ ] After launching, wait for "Ready" message
- [ ] Inform user of the port number
- [ ] Never have more than 1 dev server running

---

**Last Updated:** 2025-11-21  
**Applies To:** All development work on maffix-web project

