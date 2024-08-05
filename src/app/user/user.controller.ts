import { Controller, Delete, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Jwt } from 'src/common/decorator/jwt-user.decorator';
import { ResponseMessage } from 'src/common/response/response';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserExerciseResponse, UserExerciseSortByDateResponse } from '../exercise/dto/response.dto';
import { EUser } from './db/entity/user.entity';
import { IUserService } from './service/core/user.service';

@ApiTags('user')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/user')
export class UserController {

    constructor(
        @Inject("UserService")
        private userService: IUserService,
    ) { }

    @ApiOperation({ summary: '유저 정보' })
    @ApiOkResponse({ type: EUser })
    @Get()
    async getUserInfo(@Jwt() user: EUser): Promise<EUser> {
        const eUser = await this.userService.getUserInfo(user.snsNo, user.userId);
        const role = await this.userService.getUserRole(user.no);        
        if (role) eUser.role = role;
        
        return eUser;
    }

    @ApiOperation({ summary: '유저 권한 확인', description: '관리자면 true 아니면 false' })
    @ApiOkResponse({ type: Boolean })
    @UseGuards(RoleGuard)
    @Roles(['admin'])   
    @Get('admin')
    isAdmin(): boolean {
        return true;
    }

    @ApiOperation({ summary: '해당 날짜의 내 운동 기록 가져오기'})
    @ApiOkResponse({ type: UserExerciseResponse, isArray: true})
    @ApiParam({ name: 'date', required: true, description: '날짜' })
    @Get('exercise/:date')
    async getMyExercise(@Jwt() user: EUser, @Param('date') date: string): Promise<UserExerciseResponse[]> {
        return await this.userService.getMyExercise(user.no, date);
    }

    @ApiOperation({ summary: '내 전체 운동기록 가져오기' })
    @ApiOkResponse({ type: UserExerciseSortByDateResponse, isArray: true})
    @ApiQuery({ name: 'date', required: true, description: '날짜' })
    @Get('exercises')
    async getAllMyExercise(@Jwt() user: EUser): Promise<UserExerciseSortByDateResponse[]> {
        return await this.userService.getMyExercises(user.no);
    }

    @ApiOperation({ summary: '운동기록 row 삭제' })
    @ApiOkResponse({ type: ResponseMessage })
    @ApiParam({ name: 'no', required: true, description: '내 운동기록 PK' })
    @Delete('exercise/:no')
    async deleteMyExercise(@Jwt() user: EUser, @Param('no') no: number, @Query('isRow') isRow: boolean): Promise<ResponseMessage> {
        return await this.userService.deleteMyExercise(user.no, no, isRow)
    }

}
