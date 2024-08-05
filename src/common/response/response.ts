/**
 * @description
 * 엔터티 객체를 활용한 클라이언트에 응답을 보내기 위한 클래스
 * @property {number} status status code
 * @property {string} message message
 * @property {T} data 엔터티 객체
 * @method constructor constructor(status: number, message: string, data: T)
 * @example new PostResponse(200, 'Success', data)
 * @returns {PostResponse<T>} 
 */
export class PostResponse<T> {
    status: number;
    message: string;
    data: T;

    constructor(status: number, message: string, data: T) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}


export class ResponseMessage {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}