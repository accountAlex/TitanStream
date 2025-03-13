import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserModel {
    @Field(() => ID)
    public id: String

    @Field(() => String)
    public email: String

    @Field(() => String)
    public password: String

    @Field(() => String)
    public username: String

    @Field(() => String)
    public displayName: String

    @Field(() => String, {nullable: true})
    public avatar: String

    @Field(() => String, {nullable: true})
    public bio: String

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date


}