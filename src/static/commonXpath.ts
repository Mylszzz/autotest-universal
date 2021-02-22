
export enum CommonXpath {
    //筛选条件
    checkBox1 = '(//android.widget.CheckBox[@content-desc="全选"])[1]',
    checkBox2 = '(//android.widget.CheckBox[@content-desc="全选"])[2]',
    //完成按钮
    ok = '//android.widget.Button[@content-desc="完成"]',
    //重置按钮
    resetting = '//android.widget.Button[@content-desc="重置"]',
    //订单号文本框
    orderText = '//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText',
    //扫码按钮
    qr = '//android.widget.Button[@content-desc="qr scanner"]',
    //确认
     confirm ='//android.widget.Button[@content-desc="确认"]',
    //申请退货
    returns = '//android.widget.Button[@content-desc="申请退货"]',
    //关闭
    close = '//android.widget.Button[@content-desc="关闭"]',
    //取消
    cancel = '//android.widget.Button[@content-desc="取消"]',
    //订单详情第一项
    order = '(//android.widget.Image[@content-desc="clipboard"])[1]',

    determine = '//android.widget.Button[@content-desc="确定"]',
}
