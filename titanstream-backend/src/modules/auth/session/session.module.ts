import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [SessionResolver, SessionService, PrismaService, ConfigService],
  exports: [SessionService]
})
export class SessionModule {}