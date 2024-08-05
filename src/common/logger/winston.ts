import moment from 'moment-timezone';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const appendTimestamp = winston.format((info, opts) => {
    if (opts.tz) {
        info.timestamp = moment().tz(opts.tz).format();
    }
    return info;
})

const dailyOption = (level?: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(process.env.NODE_ENV, { colors: false, prettyPrint: true }),
        ),
    };

};

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: () => '[' + moment().tz('Asia/Seoul').format('YYYY년MM월DD일 HH시mm분ss초') + ']'
                }),
                utilities.format.nestLike(process.env.NODE_ENV, { colors: true, prettyPrint: true }),
            ),
            handleExceptions: true,
        }),
        new winstonDaily(dailyOption('info')),
        new winstonDaily(dailyOption('error')),
        new winstonDaily(dailyOption('warn')),
        new winstonDaily(dailyOption('debug')),
        new winston.transports.File({
            level: 'info',
            filename: `./logs/${moment().format('YYYY-MM-DD')}/${moment().format('YYYY-MM-DD')}.log`,
            maxFiles: 30,
            zippedArchive: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                utilities.format.nestLike(process.env.NODE_ENV, { colors: true, prettyPrint: true }),
                winston.format.printf((info) => {
                    return `${info.timestamp} - ${info.level} [${process.pid}: ${info.message}]`
                })
            ),
        }),
    ],

    format: winston.format.combine(
        appendTimestamp({ tz: 'Asia/Seoul' }),
        winston.format.json(),
        winston.format.printf((info) => {
            return `${info.timestamp} - ${info.level} [${process.pid}: ${info.message}]`
        })
    )
});
