import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PostResponse } from "src/common/response/response";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";
import { ETarget } from "./db/entity/target.entity";
import { TargetService } from "./service/support/target.service";

@ApiTags('exercise')
@ApiBearerAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/target')
export class TargetController {

    constructor(
        private targetService: TargetService
    ){}

    @ApiOperation({ summary: '타겟 리스트 조회', description: '프론트 리스트쿼리에 사용할 타겟 전체 조회' })
    @ApiOkResponse({ type: PostResponse, isArray: true })    
    @Get()
    async getTargetList(): Promise<PostResponse<ETarget[]>> {
        return await this.targetService.getTargetList();
    }
}