import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EnumPipe<T> implements PipeTransform {

    constructor(private readonly enumType: T) { }

    transform(value: any): T[keyof T] {
        const enumValues = Object.values(this.enumType) as unknown as string[];
        if (!enumValues.includes(value)) {
            throw new BadRequestException('Invalid Request Value');
        }

        const enumKey = Object.keys(this.enumType).find(key => this.enumType[key] === value);
        return this.enumType[enumKey as keyof T];
    }
}