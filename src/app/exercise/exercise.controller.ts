import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Jwt } from 'src/common/decorator/jwt-user.decorator';
import { exerciseLogger } from 'src/common/logger/api.logger';
import { ResponseMessage } from 'src/common/response/response';
import { CustomFileInterceptor } from '../../common/interceptor/file.inteceptor';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { EUser } from '../user/db/entity/user.entity';
import { AdminExercise, DoneExercise } from './dto/request.dto';
import { ExerciseResponse } from './dto/response.dto';
import { IExerciseService } from './service/core/exerciseITF.service';

@ApiTags('exercise')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/exercise')
export class ExerciseController {

    constructor(
        @Inject('ExerciseService')
        private exerciseService: IExerciseService,
    ) { }

    @ApiOperation({ summary: '운동 리스트 조회' })
    @ApiOkResponse({ type: ExerciseResponse, isArray: true })
    @ApiQuery({ name: 'sort', required: false, description: '정렬' })
    @ApiQuery({ name: 'target', required: false, description: '타겟' })
    @Get()
    async getExerciseList(@Jwt() user: EUser, @Query('sort') sort: string, @Query('target') target: string): Promise<ExerciseResponse[]> {
        return await this.exerciseService.getExerciseList(user.no);
    }
    // @ApiQuery({ name: 'period', required: false, description: '기간 (30일, 90일, 1년, 전체기간)', enum: EPeriod})    
    // @Query('period', new EnumPipe<typeof EPeriod>(EPeriod)) period: string

    @ApiOperation({ summary: '관리자 - 운동 등록하기', description: '운동 사진, 이름, 타겟부위 등록' })
    @ApiOkResponse({ type: ResponseMessage })
    @UseInterceptors(CustomFileInterceptor)
    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @Post()
    async createExercise(@UploadedFile() file: Express.Multer.File, @Req() req: any, @Res() res: any) {
        try {
            const { name, targets } = req.body;
            if (!name) throw new BadRequestException('운동 이름을 입력해주세요');
            if (!targets) throw new BadRequestException('운동 타겟을 입력해주세요');

            this.exerciseService.createExercise(file.filename, name, targets);
            res.status(201).send({
                status: 201,
                message: '운동 등록 성공'
            });
        }
        catch (e) {
            throw e;
        }
    }

    @ApiOperation({ summary: '관리자 - 운동 수정하기', description: '운동 사진, 이름, 타겟부위 등록' })
    @ApiOkResponse({ type: ResponseMessage })
    @UseInterceptors(CustomFileInterceptor)
    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @Put('/:no')
    async modifyExercise(@UploadedFile() file: Express.Multer.File, @Param('no') no: number, @Req() req: any, @Res() res: any) {
        try {
            this.exerciseService.modifyExercise(file?.filename, JSON.parse(req.body.exercise));

            res.status(200).send({
                status: 200,
                message: '운동 수정 성공'
            });
        }
        catch (e) {
            throw e;
        }
    }

    @ApiOperation({ summary: '관리자 - 운동 삭제하기' })
    @ApiParam({ name: 'no', required: true, description: '운동 번호' })
    @ApiOkResponse({ type: ResponseMessage })
    @Roles(['admin'])
    @UseGuards(RoleGuard)
    @Delete('/:no')
    async deleteExercise(@Param('no') no: number, @Res() res: any, @Body('exercise') exercise: AdminExercise) {
        try {
            await this.exerciseService.deleteExercise(no, exercise.path)
                .then(() => {
                    return res.status(200).send({
                        status: 200,
                        message: '운동 삭제 성공'
                    })
                })
                .catch((e) => {
                    throw e;
                });
        }
        catch (e) {
            exerciseLogger('error', `[Exercise] 운동 삭제 실패(${e})`);
            return res.status(500).send({
                status: 500,
                message: '운동 삭제 실패'
            })
        }
    }


    @ApiOperation({ summary: '운동 즐겨찾기' })
    @ApiOkResponse({ type: ResponseMessage })
    @ApiParam({ name: 'no', required: true, description: '운동 번호' })
    @Put('favorite/:no')
    async changeExerciseFavorite(@Jwt() user: EUser, @Param('no') no: number): Promise<ResponseMessage> {
        return await this.exerciseService.changeExerciseFavorite(user.no, no);
    }

    @ApiOperation({ summary: '수행한 운동 등록하기', description: '날짜 선택까지 고려해서 param = date의 수행 운동 등록' })
    @ApiOkResponse({ type: ResponseMessage })
    @Post(':date')
    async recordDoneExercise(@Jwt() user: EUser, @Param('date') date: string, @Body('recordDetail') doneExerciseDto: DoneExercise | DoneExercise[]): Promise<ResponseMessage> {
        const doneExercises = Array.isArray(doneExerciseDto) ? doneExerciseDto : [doneExerciseDto];
        return await this.exerciseService.recordDoneExercise(user.no, date, doneExercises);
    }

}
