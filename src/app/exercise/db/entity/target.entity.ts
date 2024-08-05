import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity } from "typeorm";

@Entity('target', { database: 'ounwan' })
export class ETarget extends DefaultEntity {

    @ApiProperty({
        description: '타겟부위',
        example: '가슴',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Column({ name: 'name', type: 'varchar', length: 40 })
    name: string;   

}