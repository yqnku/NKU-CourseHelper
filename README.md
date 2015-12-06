# NKU-CourseHelper
临时修复南开选课系统提示密码错误无法登录的问题, 如需安装，请往下看

针对近期出现的南开选课系统提示密码错误无法正常登录的问题，制作了 Chrome 拓展。

该问题是由登录页面的 HTML 标签属性错误导致的，该 Chrome 拓展仅修复了 HTML 的问题，不会对用户信息做出任何修改或记录。

另外修复了左侧边栏在 Chrome 中的显示问题。

加入了计算ABC,BCD,ABCD,ABCDE学分绩的功能。

加入了通过选课序号列出课程信息的功能

# 安装
1. [下载 Chrome 拓展](https://github.com/yqnku/NKU-CourseHelper/releases/download/V1.4/NKU-CourseHelper-ForChrome-V1.4.crx)
2. 新版本的 Chrome 会拒绝安装不是来自官方商店的拓展，因此需要手动安装：

        1) 打开 Chrome 设置 -> [拓展程序](chrome://extensions/)

        2) 将下载的 crx 文件拖拽至 Chrome 窗口进行安装
        
        or 
        
        2')下载源码zip并解压，打开开发者模式 -> 加载已解压的拓展程序
        
## 注意

由于选课手册一年会有三次更新，所以在选课手册更新后请及时更新该拓展

## 更新历史

V1.4

主要更新：

加入了关于页面，快速跳转至本页面。

V1.3

主要更新：

加入了响应Enter事件。

V1.2

主要更新：

1.将开课单位的序号改为院系名称加序号。

2.改变了界面布局。

V1.1

主要更新

1.加入了excel版选课手册的超链接。

V1.0 

NKU-Course-Helper 正式发布！

主要功能：

1.修复选课系统无法正常登录的问题。

2.计算ABC，ABCD，BCD，ABCDE学分绩。

3.加入了通过选课序号定位课程名称上课地点等信息。

## Thanks to

[Neon4o4](https://github.com/Neon4o4)

[nkucodingcat](https://github.com/nkucodingcat)

