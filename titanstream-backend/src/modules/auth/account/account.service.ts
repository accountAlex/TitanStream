import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async me(id: string){
        const user = await this.prismaService.user.findUnique({
            where:{
                id
            }
        })
    }

    public async create(input: CreateUserInput) {
        const {username, email, password} = input

        const IsUsernameExists = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if (IsUsernameExists) {
            throw new ConflictException('Это имя пользователя уже занято')
        }

        const IsEmailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (IsEmailExists) {
            throw new ConflictException('Аккаунт для данной почты уже имеется')
        }

        await this.prismaService.user.create({
            data: {
                username,
                email, 
                password: await hash(password),
                displayName: username
            }
        })

        return true
    }
}