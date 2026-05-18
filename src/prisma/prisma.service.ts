// src/prisma/prisma.service.ts
/*
import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}*/

// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static pool: Pool;

  constructor() {
    // 1. pg 라이브러리로 DB 커넥션 풀 생성
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Prisma v7 전용 PostgreSQL 어댑터 생성
    const adapter = new PrismaPg(pool);

    // 3. 부모 PrismaClient에 어댑터 주입
    super({ adapter });
    
    PrismaService.pool = pool;
  }

  async onModuleInit() {
    // 서버가 켜질 때 DB 연결 활성화
    await this.$connect();
  }

  async onModuleDestroy() {
    // 서버가 꺼질 때 커넥션 풀을 안전하게 닫아줌
    await PrismaService.pool.end();
  }
}