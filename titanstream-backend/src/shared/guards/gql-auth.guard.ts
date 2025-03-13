import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class GqlAuthGuard implements CanActivate {
    public constructor(private readonly prismaService: PrismaService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req

        if (typeof request.session.UserId === "undefined"){
            throw new UnauthorizedException("Пользователь не авторизован")
        }
        

        const user = await this.prismaService.user.findUnique({
            where:{
                id: request.session.UserId
            }
        })
        request.user = user
        return true
    }
}