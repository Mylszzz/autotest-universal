/**
 * 自定义基本异常类
 */
export class AutoTestException extends Error {
    protected map: Map<string, string>;  // [code, msg]
    protected code: string = '';  // 错误代码
    protected msg: string | undefined = '';
    protected detail: string = '';

    /**
     * 构造函数，如果子类继承了该基类，请在子类构造器中依次执行super()、this.appendMap(map)、this.check(code,detail
     * @param {string} code 错误代码
     * @param {string} detail  错误详情
     */
    constructor(code:string = 'A9999', detail:string = '') {
        super();
        this.map = new Map([
            ['A0001', '未找到相关控件'],
            ['A0002', '输入数据异常'],
            ['A9999', '未知错误'],
        ]);
        this.detail = detail;
    }

    /**
     * 追加错误码Map,用于子类继承基类后,在构造器中执行super()后调用
     * @param map
     */
    protected appendMap(map: Map<string, string>) {
        this.map = new Map<string, string>([...this.map, ...map]);
    }

    /**
     * 检查错误码是否存在,存在提取错误状态码明细并赋值,如果不存在,则为未处理的错误。如果是子类，请在构造器中执行super()、super.appendMap(map)后调用
     * @param code 业务状态码
     * @param detail 错误明细
     */
    protected check(code: string = 'A9999', detail: string = '')
    {
        this.detail = detail;
        if (this.map.has(code)) {
            this.code = code;
            this.msg = this.map.get(code);
        } else {
            this.code = 'A9999';  // 未知错误
            this.msg = this.map.get(code);
        }
    }


    // 获取错误状态码
    public getCode():string  {
        return this.code;
    }

    // 获取错误码描述
    public getMsg():string|undefined{
        return this.msg;
    }

    // 获取错误明细(错误明细是抛出错误时手动传入的)
    public getDetail():string  {
        return this.detail;
    }

    public toString() {
        return `code:${this.code}, msg:${this.msg}, detail:${this.detail}`;  // 拼接字符串
    }
}

/**
 * 登录中的异常
 */
export class LoginException extends AutoTestException {
    constructor(code:string = 'A9999', detail:string = '') {
        super(code, detail);

        super.appendMap(new Map([
            ['L0001', '登录错误'],
        ]));

        this.check(code, detail);
    }
}