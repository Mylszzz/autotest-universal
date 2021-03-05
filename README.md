## AUTOTEST-UNIVERSAL
###配置文件位置
测试用例:src/static/test.csv\
机器配置:globalconfig_a8.json\
机器配置命名规范:globalconfig_机器名小写.json\
改IP地址:src/static/driverConfig.ts\
退货文件:无需(以销售的输出作为退货的输入)\
运行及系统设置:src/static/settings.ts\
csv配置文件:src/utils/csvOptions.ts

###扩展此项目: 
不同功能模块下具体写明了如何扩展\
扩展需要的功能无需改动已有代码\
在src/testactions/deviceActions.ts下完成对新设备功能的导入\
在src/driver.ts下完成对新设备配置的导入\
在src/static/buttonXPaths.ts等XPaths文件下添加控件\
在src/static/driverConfig.ts下添加机器的配置信息\
在src/static/inputCoordinates.ts下添加触摸输入需要的坐标\

###运行此项目
1. 在src/static/settings.ts下进行运行设置
2. 在main.ts最下面执行脚本Main.runScript(设备名); e.g.a8

###如果更新了支付方式:
可以直接适配
