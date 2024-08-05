import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UnsupportedSizeError, UnsupportedTypeError } from "src/common/error/domain/file";
import { CustomFileInterceptor } from "../../common/interceptor/file.inteceptor";

@Module({
    imports: [
        MulterModule.register({
            fileFilter: (req, file, callback) => {
              if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new UnsupportedTypeError(), false);
              }
              if (file.size > 1024 * 1024 * 10) {
                return callback(new UnsupportedSizeError(), false);
              }
              callback(null, true);
            }
          }),
    ],
    providers: [        
        CustomFileInterceptor,
    ],
    exports: [
        CustomFileInterceptor,       
    ]
})

export class FileModule{}