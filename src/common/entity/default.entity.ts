import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * @description createdAt, updatedAt - DateTime
 */
export class DefaultEntity {
    @ApiProperty({
        example: 1,
        description: 'PK',
        required: true,
    })
    @PrimaryGeneratedColumn({ name: 'no', type: 'int' })
    no: number;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
}

/**
 * @description createdAt - Date, updatedAt - DateTime
 */
export class DefaultEntity2 {
    @ApiProperty({
        example: 1,
        description: 'PK',
        required: true,
    })
    @PrimaryGeneratedColumn({ name: 'no', type: 'int' })
    no: number;

    @CreateDateColumn({ name: 'created_at', type: 'date' })
    createdAt: any;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
}