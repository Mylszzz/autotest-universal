## AUTOTEST-UNIVERSAL
###配置文件位置
测试用例:src/static/test.csv\
机器配置:globalconfig_a8.json\
机器配置命名规范:globalconfig_机器名小写.json\
改IP地址:src/static/driverConfig.ts\
退货文件:\


###如果更新了支付方式:
最大滑动次数可能要改动

###扩展此项目: 
不同功能模块下具体写明了如何扩展\
扩展需要的功能无需改动已有功能模块\
在src/testactions/deviceActions.ts下完成对新设备功能的导入\
