import { Injectable } from "@nestjs/common";
import { PostResponse } from "src/common/response/response";
import { ETarget } from "../../db/entity/target.entity";
import { TargetRepository } from "../../db/repository/target.repository";

@Injectable()
export class TargetService {
    constructor(
        private targetRepo: TargetRepository,
    ) { }

    async getTargetList(): Promise<PostResponse<ETarget[]>> {
        const targetList = await this.targetRepo.find({ select: ['name'] });
        return new PostResponse<ETarget[]>(200, 'Get Target List Success', targetList);
    }
}