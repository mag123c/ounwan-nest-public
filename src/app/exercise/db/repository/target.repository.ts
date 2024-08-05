import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ETarget } from "../entity/target.entity";

@Injectable()
export class TargetRepository extends Repository<ETarget> {
    constructor(private dataSource: DataSource) {
        super(ETarget, dataSource.createEntityManager())
    }

}