"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonXpath = void 0;
var CommonXpath;
(function (CommonXpath) {
    //筛选条件
    CommonXpath["CHECKBOX1"] = "(//android.widget.CheckBox[@content-desc=\"\u5168\u9009\"])[1]";
    CommonXpath["CHECKBOX2"] = "(//android.widget.CheckBox[@content-desc=\"\u5168\u9009\"])[2]";
    //完成按钮
    CommonXpath["OK"] = "//android.widget.Button[@content-desc=\"\u5B8C\u6210\"]";
    //重置按钮
    CommonXpath["RESETTING"] = "//android.widget.Button[@content-desc=\"\u91CD\u7F6E\"]";
    //订单号文本框
    CommonXpath["ORDERTEXT"] = "//android.webkit.WebView[@content-desc=\"Ionic App\"]/android.widget.EditText";
    //扫码按钮
    CommonXpath["QR"] = "//android.widget.Button[@content-desc=\"qr scanner\"]";
    //申请退货
    CommonXpath["RETURNS"] = "//android.widget.Button[@content-desc=\"\u7533\u8BF7\u9000\u8D27\"]";
    //关闭
    CommonXpath["CLOSE"] = "//android.widget.Button[@content-desc=\"\u5173\u95ED\"]";
    //取消
    CommonXpath["CANCEL"] = "//android.widget.Button[@content-desc=\"\u53D6\u6D88\"]";
    //订单详情第一项
    CommonXpath["ORDER"] = "(//android.widget.Image[@content-desc=\"clipboard\"])[1]";
    //确定
    CommonXpath["DETERMINE"] = "//android.widget.Button[@content-desc=\"\u786E\u5B9A\"]";
})(CommonXpath = exports.CommonXpath || (exports.CommonXpath = {}));
