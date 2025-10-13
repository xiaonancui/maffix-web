# Backend Architecture Migration Guide

## Overview

This document provides a comprehensive guide for migrating the TenTenTen backend from a simple Express.js server to a proper NestJS architecture with TypeScript.

## Current State Analysis

### Existing Structure
```
backend/
├── src/
│   └── server.js (194 lines - all routes in one file)
├── package.json (minimal dependencies)
└── prisma/ (empty)
```

### Current Issues
1. **No TypeScript**: Using plain JavaScript with ES modules
2. **Monolithic Structure**: All routes in a single file
3. **No Layered Architecture**: No separation of concerns
4. **Demo Data Only**: Hardcoded responses, no database
5. **No Validation**: No input validation or DTOs
6. **Minimal Error Handling**: Basic try-catch only
7. **No Dependency Injection**: Manual dependency management

## Target Architecture

### Desired Structure
```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── common/                    # Shared utilities
│   │   ├── filters/               # Exception filters
│   │   ├── interceptors/          # Response interceptors
│   │   ├── guards/                # Auth guards
│   │   ├── decorators/            # Custom decorators
│   │   └── pipes/                 # Validation pipes
│   ├── config/                    # Configuration module
│   │   ├── config.module.ts
│   │   └── configuration.ts
│   ├── auth/                      # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/            # Passport strategies
│   │   ├── guards/                # Auth guards
│   │   └── dto/                   # Auth DTOs
│   ├── users/                     # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── tasks/                     # Tasks module
│   │   ├── tasks.module.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── prizes/                    # Prizes module
│   │   ├── prizes.module.ts
│   │   ├── prizes.controller.ts
│   │   ├── prizes.service.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── gacha/                     # Gacha system module
│   │   ├── gacha.module.ts
│   │   ├── gacha.controller.ts
│   │   ├── gacha.service.ts
│   │   ├── entities/
│   │   └── dto/
│   └── database/                  # Database module
│       ├── database.module.ts
│       └── prisma.service.ts
├── test/                          # E2E tests
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
└── package.json
```

## Migration Steps

### Phase 1: Setup & Configuration (Est. 4-6 hours)

#### 1.1 Install NestJS Dependencies
```bash
cd backend
npm install --save @nestjs/common@^10.0.0 @nestjs/core@^10.0.0 @nestjs/platform-express@^10.0.0 reflect-metadata@^0.1.13 rxjs@^7.8.1
npm install --save @nestjs/config@^3.0.0 @nestjs/swagger@^7.0.0
npm install --save-dev @nestjs/cli@^10.0.0 @nestjs/schematics@^10.0.0 @nestjs/testing@^10.0.0
npm install --save-dev @types/express@^4.17.17 @types/node@^20.0.0
npm install --save-dev typescript@^5.3.0 ts-node@^10.9.0 ts-loader@^9.5.0
npm install --save-dev @typescript-eslint/eslint-plugin@^6.0.0 @typescript-eslint/parser@^6.0.0
```

#### 1.2 Configure TypeScript
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["src/*"],
      "@/common/*": ["src/common/*"],
      "@/config/*": ["src/config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

#### 1.3 Create NestJS CLI Configuration
Create `nest-cli.json`:
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": false
  }
}
```

### Phase 2: Core Application Setup (Est. 3-4 hours)

#### 2.1 Create Main Entry Point
Create `src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Security
  app.use(helmet());
  
  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TenTenTen API')
    .setDescription('TenTenTen Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 TenTenTen Backend API running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
```

#### 2.2 Create Root Module
Create `src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PrizesModule } from './prizes/prizes.module';
import { GachaModule } from './gacha/gacha.module';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
    PrizesModule,
    GachaModule,
  ],
})
export class AppModule {}
```

### Phase 3: Module Migration (Est. 8-12 hours)

#### 3.1 Auth Module
Migrate authentication logic from `server.js` lines 34-91 to:
- `auth/auth.controller.ts` - Handle login, register, OAuth endpoints
- `auth/auth.service.ts` - Business logic for authentication
- `auth/dto/login.dto.ts` - Validation for login
- `auth/dto/register.dto.ts` - Validation for registration

#### 3.2 Users Module
Migrate user logic from `server.js` lines 93-109 to:
- `users/users.controller.ts` - Handle user endpoints
- `users/users.service.ts` - User business logic
- `users/dto/update-user.dto.ts` - User update validation

#### 3.3 Tasks Module
Migrate tasks logic from `server.js` lines 111-149 to:
- `tasks/tasks.controller.ts` - Handle task endpoints
- `tasks/tasks.service.ts` - Task business logic
- `tasks/dto/create-task.dto.ts` - Task creation validation

#### 3.4 Dashboard Module
Migrate dashboard logic from `server.js` lines 151-169 to appropriate modules

### Phase 4: Update Package.json Scripts (Est. 30 minutes)

Update `backend/package.json`:
```json
{
  "name": "@tententen/backend",
  "version": "1.0.0",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

## Implementation Priority

### High Priority (Must Have)
1. ✅ TypeScript configuration
2. ✅ NestJS core setup (main.ts, app.module.ts)
3. ✅ Auth module with JWT
4. ✅ Users module
5. ✅ Tasks module
6. ✅ Global exception filters
7. ✅ Validation pipes

### Medium Priority (Should Have)
1. ⚠️ Prizes module
2. ⚠️ Gacha module
3. ⚠️ Swagger documentation
4. ⚠️ Request logging
5. ⚠️ Response interceptors

### Low Priority (Nice to Have)
1. ⏳ Advanced caching
2. ⏳ Rate limiting
3. ⏳ WebSocket support
4. ⏳ Background jobs

## Testing Strategy

1. **Unit Tests**: Test each service independently
2. **Integration Tests**: Test controller + service + database
3. **E2E Tests**: Test complete API flows
4. **Migration Tests**: Ensure backward compatibility

## Rollback Plan

1. Keep `server.js` as `server.js.backup`
2. Use feature flags to switch between old/new
3. Run both servers in parallel during transition
4. Monitor error rates and performance

## Success Criteria

- [ ] All existing endpoints work with new architecture
- [ ] TypeScript compilation succeeds with no errors
- [ ] All tests pass
- [ ] API documentation is complete
- [ ] Performance is equal or better than Express
- [ ] Code coverage > 70%

## Estimated Timeline

- **Phase 1**: 4-6 hours
- **Phase 2**: 3-4 hours
- **Phase 3**: 8-12 hours
- **Phase 4**: 30 minutes
- **Testing & Refinement**: 4-6 hours

**Total**: 20-28 hours (3-4 working days)

## Next Steps

1. Review and approve this migration plan
2. Set up development branch for migration
3. Begin Phase 1: Setup & Configuration
4. Implement modules incrementally
5. Test each module before moving to next
6. Deploy to staging for integration testing
7. Production deployment with rollback plan ready

