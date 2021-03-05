/**
 * 通用设置：脚本是否运行下列模块
 * true：运行
 * false：不运行
 */
export const generalSettings = {
    enableLoginModule: true,  // 登录模块：这个需要开启
    enableVipLoginModule: true,  // 登录vip(销售时)
    enableSaleModule: true,  // 销售模块
    enableRefundModule: true,  // 退货模块
    enableUploadLogModule: false,  // 上传日志
    enableRefreshModule: false,  // 刷新店铺
    enableLogoutModule: false,  // 退出登录
    enableCancelReturnsModule: false,  // 取消退货
};

export const runTimeSettings = {
    generalPauseTime: 1000,  // 普通操作的默认等待时间, 单位: ms
    longPauseTime: 5000,
    shortPauseTime: 500,
};
