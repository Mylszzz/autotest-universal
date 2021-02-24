
export enum CommonXpath {
    //筛选条件
    CHECKBOX1 = '(//android.widget.CheckBox[@content-desc="全选"])[1]',
    CHECKBOX2 = '(//android.widget.CheckBox[@content-desc="全选"])[2]',
    //完成按钮
    OK = '//android.widget.Button[@content-desc="完成"]',
    //重置按钮
    RESETTING = '//android.widget.Button[@content-desc="重置"]',
    //订单号文本框
    ORDERTEXT = '//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText',
    //扫码按钮
    QR = '//android.widget.Button[@content-desc="qr scanner"]',
    //确认
     CONFIRM ='//android.widget.Button[@content-desc="确认"]',
    //申请退货
    RETURNS = '//android.widget.Button[@content-desc="申请退货"]',
    //关闭
    CLOSE = '//android.widget.Button[@content-desc="关闭"]',
    //取消
    CANCEL = '//android.widget.Button[@content-desc="取消"]',
    //订单详情第一项
    ORDER = '(//android.widget.Image[@content-desc="clipboard"])[1]',

    DETERMINE = '//android.widget.Button[@content-desc="确定"]',
}
