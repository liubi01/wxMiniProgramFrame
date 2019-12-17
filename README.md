# wxMiniProgramFrame
小程序开发框架:基于gulp构建工具+less
(组件化开发参考了[IviewUI](https://github.com/TalkingData/iview-weapp))
(小程序文档请参考[https://developers.weixin.qq.com/miniprogram/dev/framework/](https://developers.weixin.qq.com/miniprogram/dev/framework/))
## Introduction
### 框架基本实现：
1. less的使用
2. 公共组件，公共样式（通过app全局设置pixelRatio变量实现@2x与@3x背景图的切换）
3. [input的双向数据绑定(讨巧的方法)](https://github.com/liubi01/wxMiniProgramFrame/blob/master/mixins/commonMixin.js#L2)
4. [token的续期](https://github.com/liubi01/wxMiniProgramFrame/blob/master/app.js#L103)
5. [请求的promise封装](https://github.com/liubi01/wxMiniProgramFrame/blob/master/utils/req.js#L96)
6. aes加密
7. [配置文件](https://github.com/liubi01/wxMiniProgramFrame/tree/master/config)
### 未实现功能：
1. 静默登录
...
--- 
## 目录结构
 waiting...
## 使用
1. 
```bash
   # install dependencies 
   $ npm i # or npm install 

   # run 
   $ npm run dev
```
2. tips:在路由/组件同级文件加下直接创建.less文件，将自动创建wxss同级文件 

### 小程序开发工具
1. 本地开发关闭https校验
2. 开启es5转换
### 您需修改配置文件
1. config目录下 -- api.js
```bash
   const Config = require('./config.js');
   const erpUrl = "/api/web/business"; # 需修改为自己系统地址
   module.exports = {
    LoginUrl: Config.BASEURL + erpAuthUrl + '/oauth/token', #系统登录 需修改为自己系统地址
```
2. config目录下 -- config.js
```bash
    BASEURL:"https://xxxx.com", #需修改全局请求地址
    BASEIMG:"../../assets/image",  # BASEIMG:"http://img.xxx.com",可修改为网络地址
```
## 参考文档
[小程序的input双向数据绑定](https://blog.csdn.net/lizhen_software/article/details/81632229)

[微信小程序 自定义头部导航栏 navigationStyle - 简书](https://www.jianshu.com/p/7393c800ba09)

[小程序 组件 与 组件间的通信](https://blog.csdn.net/weixin_34128237/article/details/87964148)

[小程序 request封装与静默登录](https://developers.weixin.qq.com/community/develop/article/doc/000cac14f44e70059368f3c1b5bc13?highline=request%20)

[小程序登录+系统业务登录流程](http://yj1438.github.io/2017/03/07/mini_program.html)

   



