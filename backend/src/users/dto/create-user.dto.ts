import { IsEmail, IsNotEmpty, IsEnum, Length, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(6, 60, { message: 'Name must fall perfectly between 6 and 60 characters.' })
  name!: string; 

  @IsEmail({}, { message: 'Provide a fully authentic standard email structure.' })
  email!: string; 

  @IsNotEmpty()
  @Length(1, 400, { message: 'Address maximum upper ceiling limit is 400 characters.' })
  address!: string;

  @IsNotEmpty()
  @Length(8, 16, { message: 'Password framework metrics demand 8 to 16 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: 'Password requires minimum 1 structural uppercase letter and 1 explicit special character.',
  })
  password!: string; 

  @IsOptional()
  @IsEnum(['Admin', 'User', 'Owner'])
  role?: string; 
}