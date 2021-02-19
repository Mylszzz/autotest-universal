const ExceptionCode = {
  LOGIN_FAILURE: 'A0001',
  UNKNOWN_EXCEPTION: 'A9999',
};

export class BasicException extends Error {
    protected map: Map<string, string>;
    protected code: string = '';
    protected msg: string | undefined = '';
    protected detail: string = '';
    constructor(code:string = 'A9999', detail:string = '') {
        super();
        this.map = new Map();
        this.detail = detail;

    }

    // 获取错误状态码
    public getCode():string  {
        return this.code;
    }

    //获取错误码中文描述
    public getMsg():string|undefined{
        return this.msg;
    }

    //获取错误明细(错误明细是抛出错误时手动传入的)
    public getDetail():string  {
        return this.detail;
    }

    public toString():string {
        return this.getCode();
    }

}