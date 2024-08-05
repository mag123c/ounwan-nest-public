import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EUserExerciseLike } from "../entity/user-like.entity";

@Injectable()
export class UserExerciseLikeRepository extends Repository<EUserExerciseLike> {
    constructor(private dataSource: DataSource) {
        super(EUserExerciseLike, dataSource.createEntityManager());
    }

}