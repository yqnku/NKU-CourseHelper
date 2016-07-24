#NKU CourseHelper For Chrome

临时修复南开选课系统提示密码错误无法登录的问题, 如需安装，请往下看：

针对近期出现的南开选课系统提示密码错误无法正常登录的问题，制作了 Chrome 拓展。

该问题是由登录页面的 HTML 标签属性错误导致的，该 Chrome 拓展仅修复了 HTML 的问题，不会对用户信息做出任何修改或记录。

该插件只能Chrome浏览器使用，其他可能兼容Chrome插件的浏览器有可能因为没有相应的API而导致部分功能无法使用。

Firefox,Safari浏览器插件以及手机端请点击[这里](https://github.com/Everything-in-NKU/Patch-for-Elective-System-of-NKU-FF/tree/master/Greasemonkey)

#主要功能

1.修复chrome浏览器无法登录选课系统的问题

2.修复登录后左边侧栏消失的问题

3.修复选课页面无法点击上下页的问题

4.修复课程冲突时无法显示课表的问题

5.修复无法评教的问题

6.在选课页面添加课程上课时间地点等信息

7.提供通过选课序号查询课程上课时间地点等信息的功能

8.提供excel版选课手册

9.计算ABC,BCD,ABCD,ABCDE学分绩

10.本版本不包括抢课功能，需要抢课功能请移步[抢课插件](https://github.com/Everything-in-NKU/Patch-for-Elective-System-of-NKU)

11.本版本不包括评教功能，需要评教功能请移步[一键评教](https://github.com/yqnku/One-Key-To-Evaluation)

##示例图片

![image](https://github.com/yqnku/NKU-CourseHelper/raw/master/img/example1.png)

![image](https://github.com/yqnku/NKU-CourseHelper/raw/master/img/example2.png)
![image](https://github.com/yqnku/NKU-CourseHelper/raw/master/img/example3.png)

# 安装
1. [下载 Chrome 拓展](https://github.com/yqnku/NKU-CourseHelper/releases)

也可通过[Chrome应用商店下载](https://chrome.google.com/webstore/detail/%E5%8D%97%E5%BC%80%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9Fhelper/fafmabciiflcglhmcdbhbgenngacdmdb?utm_source=chrome-ntp-icon)

2. 新版本的 Chrome 会拒绝安装不是来自官方商店的拓展(若是商店里下载安装可跳过这步)，因此需要手动安装：

        0) 打开 Chrome 设置 -> 拓展程序（或在地址栏中输入以下链接 chrome://extensions/）

        1) 将下载的 crx 文件拖拽至 Chrome 窗口进行安装(如果chrome自动移除插件，请看方法2)
        
        2)下载源码zip并解压，打开开发者模式 -> 加载已解压的拓展程序，然后选择刚刚的文件夹（不嫌麻烦的可以看方法3）
        
        3)在地址栏中输入以下链接 chrome://version/ ，找到个人资料路径，然后进入extension文件夹，找到刚刚的插件对应的文件夹，再通过开发者模式，加载已解压的扩展程序，到刚刚那个文件夹就好。
        
## 注意

由于选课手册一年会有三次更新，所以在选课手册更新后请及时更新该拓展。我一直都想加入查看某个课程多少学分的功能，无奈一直找不到相应的数据，如果大家谁有这样的数据的话麻烦发一份给我邮箱(xiqian013@live.com),以及有什么功能性的建议，bug的反馈等等，也欢迎发送到我邮箱(xiqian013@live.com)

## 更新历史

V2.3

主要更新：

1.在选课页面加入了起止周次信息

2.将校区显示项更改为八里台和津南

V2.2

主要更新：

1.更改了在线选课手册的链接

V2.1

主要更新：

1.学分绩成绩显示改为保留三位小数。

2.2016-2017第一学年选课手册

V2.0

主要更新：

1.将课程信息单独写入到js，以后只需更改课程信息即可。

2.应用jquery，改进了插件页面。

3.修复了有重修成绩时计算学分绩的问题，更改为重修一律60分。

4.修复了选课页面，剩余名额按钮显示不全的问题。

V1.9

主要更新：

1.修复课程冲突时无法显示课表的问题。

2.自动清除验证码的值。

3.修复了无法评教的问题。

4.修复了一些Bug。

V1.8

主要更新：

1.Bug修复，修复了选课系统成绩中显示“通过”或“未评价”时学分绩计算的问题。

V1.7

主要更新：

1.改进了插件页面，以及加入了在课表冲突情况下显示课表的超链接。

V1.6

主要更新：

1.修复选课页面无法点击上下页的问题

2.在选课页面（已选课程）添加了课程上课时间地点等信息

3.计划内剩余名额及限选剩余名额需等正选时（2016.1.5）再测试此功能。

V1.5

主要更新：

1.加入了跳转到课程查询的页面。

2.加入了2015-2016学年第二学期选课手册

V1.4

主要更新：

1.加入了关于页面，快速跳转至本页面。

V1.3

主要更新：

1.加入了响应Enter事件。

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

