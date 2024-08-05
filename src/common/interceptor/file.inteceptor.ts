import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RequestHandler } from 'express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import multer, { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { FileNotFoundError } from '../error/domain/file';
import { winstonLogger } from '../logger/winston';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
    private upload: RequestHandler;

    constructor(
    ) {
        this.upload = multer({
            storage: diskStorage({
                destination: async (req, file, callback) => {
                    const uploadDir = './static';
                    if (!existsSync(uploadDir)) {
                        try {
                            mkdirSync(uploadDir, { recursive: true });
                        } catch (error) {
                            winstonLogger.error('디렉토리 생성 실패:', error);
                        }
                    }
                    callback(null, uploadDir);
                },
                filename: (_, file, callback) => {
                    return callback(null, file.originalname);
                    // return callback(null, `${uniqueName}.${type}`);
                },
            }),
        }).single('file')
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        try {
            const req = context.switchToHttp().getRequest();
            return new Observable(observer => {
                this.upload(req, null, async (err: any) => {
                    if (err) {
                        observer.error(err);
                    }
                    else {
                        const file = req.file;
                        if (!file && req.method != 'PUT') throw new FileNotFoundError();
                        
                        if (file?.originalname === 'blob') {
                            this.convertBlobToImage(file);
                        }
                        next.handle().subscribe(observer);
                    }
                });
            })
        }
        catch (e) {
            throw e;
        }
    }

    private convertBlobToImage(file: Express.Multer.File): void {
        const imageBuffer = Buffer.from(file.buffer as ArrayBuffer);
        if (file.mimetype.includes('image')) {
            const imagePath = `./image/${this.uuidv4()}.${file.mimetype.split('/')[1]}`;
            writeFileSync(imagePath, imageBuffer);
        }
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
