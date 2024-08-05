import moment from "moment-timezone";

export const getCurrentDate = (): Date => {
    return moment.tz("Asia/Seoul").toDate();
}

export const getCurrentTimeStringFormat = (): string => {
    return moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
}

export const extractToYmd = (date: Date): string => {
    return moment(date).tz("Asia/Seoul").format("YYYY-MM-DD");
}

export const subtractMonth = (month: number): string => {    
    return moment().tz("Asia/Seoul").subtract(month, 'months').format('YYYY-MM-DD');
}

export const subtractYear = (year: number): string => {
    return moment().tz("Asia/Seoul").subtract(year, 'years').format('YYYY-MM-DD');
}
