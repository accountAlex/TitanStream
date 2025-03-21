import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config'
import { RedisService } from 'src/core/redis/redis.service';



@Injectable()
export class SessionService {
    public constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService, private readonly redisService: RedisService) {}

    public async login(req: Request, input: LoginInput) {
        const {login, password} = input

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {username: {equals: login}},
                    {email: {equals: login}}
                ]
            }

        })

        if(!user){
            throw new NotFoundException("Данный пользователь не был найден")
        }

        const isValidPassword = await verify(user.password, password)


        if(!isValidPassword){
            throw new UnauthorizedException("Неверный пароль")
        }

        return new Promise((resolve, reject) => {
            req.session.createdAt = new Date()
            req.session.userId = user.id

            req.session.save(err => {
                if (err) {
                    return reject (
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию'
                        )
                    )
                }
                resolve(user)
            })

        })
    }

    public async logout(req: Request) {
        return new Promise((resolve, reject) => {
          req.session.destroy(err => {
            if (err) {
              return reject(new InternalServerErrorException('Ошибка при удалении сессии'));
            }
    
            const sessionName = this.configService.getOrThrow<string>('SESSION_NAME');
            const sessionDomain = this.configService.getOrThrow<string>('SESSION_DOMAIN');
        
            req.res?.clearCookie(sessionName, {
              httpOnly: true,
              secure: false, // Совпадает с настройкой в bootstrap.ts
              sameSite: "lax", // Совпадает с настройкой в bootstrap.ts
              path: "/",
              domain: sessionDomain, // "localhost"
            });
        
            resolve(true);
          });
        });
      }
    }

