export class Position {

    // 支付供应商位置，从左往右，从上往下
    public static pay = [
        {x: 484, y: 165}, //1
        {x: 879, y: 165},//2
        {x: 480, y: 311},//3
        {x: 879, y: 311},//4
        {x: 480, y: 445},//5
        {x: 879, y: 453},//6
    ];

    // 退出账号关联坐标
    public static exit_account = [
        {x: 1693, y: 230},//退出账号按钮坐标
        {x: 948, y: 933},//确定
        {x: 948, y: 1025},//取消
    ];

    // 关机按钮坐标
    public static shut_down = {x: 1805, y: 227};
}
