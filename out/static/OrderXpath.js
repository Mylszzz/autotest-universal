"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderXpath_a8 = void 0;
var OrderXpath_a8;
(function (OrderXpath_a8) {
    //查询/退货按钮
    OrderXpath_a8["search"] = "//android.widget.Button[@content-desc=\"list box \u67E5\u8BE2/\u9000\u8D27\"]";
    //筛选按钮
    OrderXpath_a8["funnel"] = "//android.widget.Button[@content-desc=\"funnel\"]";
    //扫码按钮
    OrderXpath_a8["qr"] = "//android.widget.Button[@content-desc=\"qr scanner\"]";
    //订单号文本框
    OrderXpath_a8["orderText"] = "//android.webkit.WebView[@content-desc=\"Ionic App\"]/android.widget.EditText";
    //筛选条件
    OrderXpath_a8["checkBox1"] = "(//android.widget.CheckBox[@content-desc=\"\u5168\u9009\"])[1]";
    OrderXpath_a8["checkBox2"] = "(//android.widget.CheckBox[@content-desc=\"\u5168\u9009\"])[2]";
    //完成按钮
    OrderXpath_a8["ok"] = "//android.widget.Button[@content-desc=\"\u5B8C\u6210\"]";
    //重置按钮
    OrderXpath_a8["resetting"] = "//android.widget.Button[@content-desc=\"\u91CD\u7F6E\"]";
    //返回
    OrderXpath_a8["return1"] = "//android.widget.Button[@content-desc=\"\u8FD4\u56DE\"]";
    OrderXpath_a8["back"] = "//android.widget.Button[@content-desc=\"arrow back \"]";
    //申请退货
    OrderXpath_a8["returns"] = "//android.widget.Button[@content-desc=\"\u7533\u8BF7\u9000\u8D27\"]";
    //关闭
    OrderXpath_a8["close"] = "//android.widget.Button[@content-desc=\"\u5173\u95ED\"]";
    //取消
    OrderXpath_a8["cancel"] = "//android.widget.Button[@content-desc=\"\u53D6\u6D88\"]";
    //订单详情第一项
    OrderXpath_a8["order"] = "(//android.widget.Image[@content-desc=\"clipboard\"])[1]";
})(OrderXpath_a8 = exports.OrderXpath_a8 || (exports.OrderXpath_a8 = {}));
