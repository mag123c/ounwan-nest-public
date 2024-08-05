import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Jwt } from 'src/common/decorator/jwt-user.decorator';
import { EnumPipe } from 'src/common/pipe/enum';
import { PostResponse } from 'src/common/response/response';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { EUser } from '../user/db/entity/user.entity';
import { EBodyInfo } from './db/entity/bodyinfo.entity';
import { ChangeBodyInfo, SaveBodyInfoDto } from './dto/request.dto';
import { BodyInfo } from './dto/response.dto';
import { EPeriod } from './enum/body.enum';
import { IBodyService } from './service/core/bodyITF.service';

@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/body')
export class BodyController {

    constructor(
        @Inject('BodyService')
        private bodyService: IBodyService,
    ) { }

    @ApiOperation({ summary: '유저 체중 관련 정보' })
    @ApiOkResponse({ type: BodyInfo })
    @ApiQuery({ name: 'period', required: false, description: '기간 (30일, 90일, 1년, 전체기간)', enum: EPeriod})    
    @Get()
    async getBodyInfo(@Jwt() user: EUser, @Query('period', new EnumPipe<typeof EPeriod>(EPeriod)) period: string): Promise<BodyInfo> {        
        return await this.bodyService.getBodyInfo(user.no, period);
    }

    @ApiOperation({ summary: '유저의 바디 정보 저장' })
    @ApiOkResponse({ type: PostResponse })
    @Post()
    async saveBodyInfo(@Jwt() user: EUser, @Body() bodyInfo: SaveBodyInfoDto): Promise<PostResponse<EBodyInfo>> {
        return await this.bodyService.saveBodyInfo(user, bodyInfo);
    }

    @ApiOperation({ summary: '유저의 바디 정보 수정' })
    @ApiOkResponse({ type: PostResponse })
    @Put(':no')
    async putBodyInfo(@Jwt() user: EUser, @Body() bodyInfo: ChangeBodyInfo): Promise<PostResponse<EBodyInfo[]>> {
        console.log(bodyInfo)
        return await this.bodyService.putBodyInfo(user, bodyInfo);
    }

    @ApiOperation({ summary: '유저의 바디 정보 삭제' })
    @ApiOkResponse({ type: PostResponse })
    @Delete(':no')
    async deleteBodyInfo(@Jwt() user: EUser, @Param('no', ParseIntPipe) no: number): Promise<PostResponse<EBodyInfo[]>> {
        return await this.bodyService.deleteBodyInfo(user, no);
    }

}
