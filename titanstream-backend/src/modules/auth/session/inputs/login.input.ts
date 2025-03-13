import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MinLength, IsString, IsEmail, Matches } from "class-validator";

@InputType()
export class LoginInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    public login: string


    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string


}

