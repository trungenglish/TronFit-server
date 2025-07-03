import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  MODERATOR = 'moderator',
  CONTENT_MANAGER = 'content_manager',
  SUPPORT = 'support',
  USER = 'user',
}

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email format is invalid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role is invalid' })
  role?: UserRole = UserRole.USER;

  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, {
    message: 'First name can only contain letters and spaces',
  })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, {
    message: 'Last name can only contain letters and spaces',
  })
  lastName: string;

  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]+$/, {
    message: 'Full name can only contain letters and spaces',
  })
  fullName: string;

  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(13, { message: 'Age must be at least 13 years old' })
  @Max(100, { message: 'Age must not exceed 100 years old' })
  age?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Birthday format is invalid (YYYY-MM-DD)' })
  birthday?: Date;

  @IsEnum(Gender, { message: 'Gender is invalid' })
  gender?: Gender;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Height must be a decimal number' },
  )
  @Min(100, { message: 'Height must be at least 100cm' })
  @Max(250, { message: 'Height must not exceed 250cm' })
  height?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Weight must be a decimal number' },
  )
  @Min(30, { message: 'Weight must be at least 30kg' })
  @Max(300, { message: 'Weight must not exceed 300kg' })
  weight?: number;
}
