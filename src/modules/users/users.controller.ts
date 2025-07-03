import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//   @Post()
//   createUserToRole(@Body() createUserDto: CreateUserDto) {
//     return this.usersService.createUserToRole(createUserDto);
//   }

  @Get()
  findAllUser() {
    return this.usersService.findAllUser();
  }

  // @Get(':id')
  // findOne(@Param('id') email: string) {
  //   return this.usersService.findOneUserByEmail(email);
  // }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     return this.usersService.update(+id, updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.usersService.remove(+id);
//   }
}
