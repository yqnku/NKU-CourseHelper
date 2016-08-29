/*************************************************************************
    > File Name: js/content_script.js
    > Author: quicy
    > Mail: xiqian013@live.com 
    > Created Time: 2015-10-27 00:01:15
 ************************************************************************/

'use strict';

//给选课系统的网页中的usercode,userpwd,checkcode加上相应的ID,
//使得能够正确调用选课系统里的javascript代码，
//从而进行登录。
function addID() 
{
    var forms = ['checkcode_text','usercode_text','userpwd_text'];
    for (var i in forms)
    {
        var ele = document.getElementsByName(forms[i]);
        if (ele.length !== 0)
        {
            ele[0].id = forms[i];
        }
    }
}

//二值化图像，用于识别验证码
function binaryzationImageData(imgData)
{
    for (var i = 0 ; i < imgData.width * imgData.height ; i++)
    {
        var r = imgData.data[i * 4 + 0];
        var g = imgData.data[i * 4 + 1];
        var b = imgData.data[i * 4 + 2];
        var gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if(gray <= 130)
        {
            gray = 0;
        }
        else
        {
            gray = 255;
        }
        imgData.data[i * 4 + 0] = imgData.data[i * 4 + 1] = imgData.data[i * 4 + 2] = gray;
    }
    return imgData;
}

//将图片颜色矩阵进行转置，并将255映射为1，返回长度为1750的数组
function transformImageData(imgData)
{
    var array = new Array(1750);
    var data = imgData.data;
    for (var i = 0 ; i < 1750 ; i++)
    {
        var row = i % 25;
        var col = parseInt(i / 25);
        array[i] = data[(70 * row + col) * 4];
        if (array[i] === 255)
        {
            array[i] = 1;
        }
    }
    return array;
}

//判断图像第i列是否有0,black
function imageColHasBlack(i,array)
{
    for (var j = 0 ; j < 25 ; j++)
    {
        if (array[25*i+j] === 0)
        {
            return true;
        }
    }
    return false;
}

//分割图像
function splitImage(array)
{
    var sp = new Array(8);
    var j = 0;
    for (var i = 1 ; i < 70 ; i++)
    {
        if (imageColHasBlack(i,array) !== imageColHasBlack(i-1,array))
        {
            sp[j] = i;
            j++;
        }
    }
    return sp;
}

//得到验证码中的0,1数据
function getValidBit(array,sp)
{
    var out = new Array(4);
    for (var i = 0 ; i < 4 ; i++)
    {
        var message = '';
        for (var j = sp[2 * i] ; j < sp[2 * i + 1] ; j++)
        {
            for (var k = 0 ; k < 25 ; k++)
            {
                message += array[25 * j + k].toString();
            }
            
        }
        out[i] = message;
    }
    return out;
}

//计算编辑距离，初始化矩阵
function initDistance(str1,str2)
{
    var distance = [];
    for (var row = 0 ; row < str1.length ; row++)
    {
        var tmp = [];
        for (var col = 0 ; col < str2.length ; col++)
        {
            tmp.push(-1);
        }
        distance.push(tmp);
    }
    if (str1[0] === str2[0])
    {
        distance[0][0] = 0;
        for (var i = 0 ; i < str1.length ; i++)
        {
            distance[i][0] = i;
        }
        for(var j = 0 ; j < str2.length ; j++)
        {
            distance[0][j] = j;
        }
    }
    else
    {
        distance[0][0] = 1;
        for (var i = 0 ; i < str1.length ; i++)
        {
            distance[i][0] = i + 1;
        }
        for(var j = 0 ; j < str2.length ; j++)
        {
            distance[0][j] = j + 1;
        }
    }
    return distance;
}

//编辑距离，递归算法
function editDistance(str1,str2,distance,pos_x,pos_y)
{
    if (distance[pos_x][pos_y] !== -1)
    {
        return distance[pos_x][pos_y];
    }
    var min_dis = Math.min(editDistance(str1 , str2 , distance , pos_x , pos_y-1) , editDistance(str1 , str2 , distance , pos_x-1 , pos_y)) + 1;
    var replace_dis = 0;
    if (str1[pos_x] !== str2[pos_y])
    {
		replace_dis = 1;
	}
	min_dis = Math.min(min_dis , editDistance(str1 , str2 , distance , pos_x-1 , pos_y-1) + replace_dis);
	distance[pos_x][pos_y] = min_dis;
	return min_dis;
}

//编辑距离
function ed(str1,str2)
{
    var distance = initDistance(str1,str2);
    return editDistance(str1 , str2 , distance , str1.length - 1 , str2.length - 1);
}

//识别验证码
function ocr(out)
{
    var valid = '';
    for (var i = 0 ; i < 4 ; i++)
    {
        var mini = '2';
        for (var c in code)
        {
            if (ed(out[i],code[c]) < ed(out[i],code[mini]))
            {
                mini = c;
            }
        }
        valid += mini;
    }
    return valid;
}

//填充验证码
function fillValidCode(valid)
{
    var check_code = document.getElementsByName('checkcode_text');
    if (check_code.length !== 0)
    {
        check_code[0].value = valid;
    }
}

//自动识别并填充验证码
function fillValid()
{
    var imgs = document.getElementsByTagName('img');
    if ((imgs.length !== 0) && (imgs[2] !== undefined))
    {
        var im = imgs[2];
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 150;
        canvas.height = 25;
        ctx.drawImage(im,0,0);
        var imgData = ctx.getImageData(0,0,70,25);
        imgData = binaryzationImageData(imgData);
        var array = transformImageData(imgData);
        var sp = splitImage(array);
        var out = getValidBit(array,sp);
        var valid = ocr(out);
        fillValidCode(valid);
    }
}

//这部分用来修复登陆选课系统以后，左侧边栏的显示，需要把visibility参数由hidden改为visible
function leftFrameVisible()
{
    var lf = window.top.document.getElementsByName("leftFrame")[0];
    if (lf !== undefined)
    {
        lf = lf.contentDocument;
        for (var i = 0 ; i < 21 ; i++)
        {
            var tmp = lf.getElementById("MFX"+i);
            if (tmp)
            {
                var px = 110 + 12 * i;
                tmp.style["top"] = px+"px";
                if (window.navigator.userAgent.indexOf("Window") != -1)
                    tmp.style["left"] = "15px";
                else
                    tmp.style["left"] = "5px";
                if (i % 2 === 0)
                {
                    tmp.style["visibility"] = "visible";
                }
            }
        }
    }
}

//修复选课时无法翻页的问题
function patchForPage(mfc)
{
    var script = mfc.createElement('script');
    script.type = 'text/javascript';
    script.onload = function () { };
    script.src = chrome.extension.getURL('/js/selectMianInitAction.js');
    mfc.getElementsByTagName('head')[0].appendChild(script);
}

//这个函数用来判断当前页面是否是学生选课页面
function isSelectCoursePage(mfc)
{
    if ((mfc.location.pathname === "/xsxk/selectMianInitAction.do") || (mfc.location.pathname === "/xsxk/swichAction.do"))
    {
        return true;
    }
    return false;
}

//这个函数用来判断现在的时间，以判断是否调用自动填充选课页面的信息
function isSelectCourseTime()
{
    var date = new Date();
    if ((date.getFullYear() === year) && (date.getMonth() <= month))
        return true;
    else
        return false;
}

//这个函数用来判断当前页面是否是已选课程页面，以及课程是否冲突
function isKebiao(mfc)
{
    if ((mfc.location.pathname === "/xsxk/selectedAction.do"))
    {
        var centerList = mfc.getElementsByTagName("center");
        if (centerList.length === 1)
            return false;
        if (centerList[1].innerText.indexOf('冲突') === -1)
            return false;
        centerList[1].innerText = "";
        return true;
    }
    return false;   
}

//这个函数用来判断当前页面是否是评教页面
function isPingjiao(mfc)
{
    if ((mfc.location.pathname === "/evaluate/stdevatea/queryTargetAction.do"))
    {
        return true;
    }
    return false; 
}

//修改限选剩余名额和计划内剩余名额的按钮宽度
function changeWidth(mfc)
{
    var btn = mfc.getElementsByName('xuanke');
    if (btn[1] !== undefined)
    {
        btn[1].style.width = "110px";
    }
    if (btn[2] !== undefined)
    {
        btn[2].style.width = "95px";
    }
}

function addCourseClass(mfc,trs)
{
    var tr = trs[3];
    var forms = ["任课教师","上课时间","起止周次","上课地点","开课单位"];
    if (tr !== undefined)
    {
        for (var i = 0 ; i < 5 ; i++)
        {
            var cell = tr.insertCell();
            cell.innerText = forms[i];
            cell.align="center";
            cell.className="NavText style1";
        }
    }
}

//将上课地点显示为八里台或者津南
function changePlaceName(trs,i)
{
    var place = trs[i].getElementsByTagName('td')[6];
    if (place !== undefined)
    {
        if (place.innerText === "校本部")
        {
            place.innerText = "八里台";
        }
        else if (place.innerText === "")
        {
            place.innerText = "津南";
        }
    }
}

//增加选课中的课程信息
function addInfo(trs,i)
{
    var xkxh = trs[i].getElementsByTagName('td')[1].innerText;
    var message = course[xkxh];
    if (message !== undefined)
    {
        var forms = [message[1],message[2],message[3],message[4],message[5]];
        for (var j = 0 ; j < 5 ; j++)
        {
            var cell = trs[i].insertCell();
            cell.innerText = forms[j];
            cell.align = "center";
            cell.className = "NavText";
        }   
    }
    else
    {
        var forms = ["","","","",""];
        for (var j = 0 ; j < 5 ; j++)
        {
            var cell = trs[i].insertCell();
            cell.innerText = forms[j];
            cell.align="center";
            cell.className="NavText";
        }   
    }
}

//添加课程信息
function addCourseInformation(mfc)
{
    var trs=mfc.getElementsByTagName('tr');
    addCourseClass(mfc,trs);
    for (var i = 4; i < trs.length-1; i++)
    {
        changePlaceName(trs,i);
        addInfo(trs,i);
    }
    changeWidth(mfc); 
}

//修复课程冲突不能显示课表的问题
function patchForKebiao(mfc)
{
    var center=mfc.getElementsByTagName('center')[0];
    var font1 = document.createElement('font');
    var font2 = document.createElement('font');
    font1.className='RedText';
    font2.className='RedText';
    var a1 = document.createElement('a');
    var a2 = document.createElement('a');
    a1.innerText = '生成课表（大学期）';
    a1.href = "selectedAction.do?operation=kebiao";
    a2.innerText = '生成课表（小学期）';
    a2.href = "selectedAction.do?operation=kebiao1";
    center.appendChild(font1);
    center.appendChild(font2);
    font1.appendChild(a1);
    font2.appendChild(a2);
}

//修复无法评教的问题
function patchForPingjiao(mfc)
{
    var opinion = mfc.getElementsByName('opinion');
    if (opinion.length !== 0)
    {
        opinion[0].id = 'opinion';
    }
}

//用于修复Mainframe中的一些问题
function patchForMF()
{
    var mf = window.top.document.getElementsByName("mainFrame")[0];
    var mfc = mf.contentDocument;
    if (isSelectCoursePage(mfc)) 
    {
        patchForPage(mfc);
        if (isSelectCourseTime())
        {
            addCourseInformation(mfc);
        }
    }
    if(isKebiao(mfc))
    {
        patchForKebiao(mfc);
    }
    if(isPingjiao(mfc))
    {
        patchForPingjiao(mfc);
    }
}
//用来修复选课系统的一些问题
function Patch()
{
    addID();
    fillValid();
    leftFrameVisible();
    var mf = window.top.document.getElementsByName("mainFrame")[0];
    if (mf !== undefined)
    {                 
        mf.onload = patchForMF;
    }
}

//这个函数用来判断当前页面是否是查看已修课程的成绩
function isGPAPage(mfc)
{
    if ((mfc.location.pathname === "/xsxk/studiedAction.do") || (mfc.location.pathname === "/xsxk/studiedPageAction.do"))
        return true;
    return false;
}


//这个函数用来获取成绩页面的总页码数
function GetPageNum(mfc)
{
    var pageNum = mfc.getElementsByClassName("NavText style1")[8].innerHTML[2];
    return pageNum;
}

//这个函数用来跳到指定的页面
function GoToPage(i)
{
    var mf = window.top.document.getElementsByName("mainFrame")[0];
    var mfc = mf.contentDocument;
    var nts = mfc.getElementsByClassName("NavText style1")[10];
    var index = nts.getElementsByTagName("input")[0];
    var submit = nts.getElementsByTagName("input")[1];
    index.value = i;
    submit.click();
}

//把网页中的成绩学分课程等信息放到一个二维列表中
function SaveToArray(arr)
{
    var mf = window.top.document.getElementsByName("mainFrame")[0];
    var mfc = mf.contentDocument;
    var array = mfc.getElementsByClassName("NavText");
    //array数组的前八个和后七个均不是我们需要的
    var length = (array.length - 15) / 8;
    //8i+2----课程名称,8i+3------课程类型,8i+4------课程成绩,8i+5------课程学分
    for (var i = 1 ; i <= length ; i++)
    {
        //如果成绩为“通过”等，不参与计算学分绩
        if (isNaN(array[8*i+4].innerText))
            continue;
        //如果成绩小于60，则按照重修成绩60分计算
        if (parseInt(array[8*i+4].innerText) < 60)
            array[8*i+4].innerHTML = '60';
        var d = {"A":0,"B":1,"C":2,"D":3,"E":4};
        for(var item in d)
        {
            if (array[8 * i + 3].innerHTML.indexOf(item) !== -1)
            {
                arr[d[item]].push(array[8 * i + 2].innerHTML);
                arr[d[item]].push(array[8 * i + 4].innerHTML);
                arr[d[item]].push(array[8 * i + 5].innerHTML);
            }
        }
    }
}

//这个函数用来计算每一类课的平均学分绩和总的学分
function calcClass(F)
{
    if (F.length === 0)
        return [0,0];
    var num = F.length / 3;
    var GradeSum = 0;
    var CreditSum = 0;
    for (var i = 0 ; i < num ; i++)
    {
        if (F[3 * i + 1].indexOf("未评价") === -1)
        {
            GradeSum += Number(F[3 * i + 1]) * Number(F[3 * i + 2]);
            CreditSum += Number(F[3 * i + 2]); 
        }
        
    }
    var Arr = [];
    Arr.push(GradeSum);
    Arr.push(CreditSum);
    return Arr;
}
//这个函数用来计算学分绩
function Calc(arr)
{
    //将ABC学分绩，BCD学分绩，ABCD学分绩，ABCDE学分绩保存到下面的列表中
    var res = [];
    var A = calcClass(arr[0]);
    var B = calcClass(arr[1]);
    var C = calcClass(arr[2]);
    var D = calcClass(arr[3]);
    var E = calcClass(arr[4]);
    var ABC = (A[0] + B[0] + C[0]) / (A[1] + B[1] + C[1]);
    var BCD = (B[0] + C[0] + D[0]) / (B[1] + C[1] + D[1]);
    var ABCD = (A[0] + B[0] + C[0] + D[0]) / (A[1] + B[1] + C[1] + D[1]);
    var ABCDE = (A[0] + B[0] + C[0] + D[0] + E[0]) / (A[1] + B[1] + C[1] + D[1] + E[1]);
    res.push(ABC);
    res.push(BCD);
    res.push(ABCD);
    res.push(ABCDE);
    return res;
}
//这个函数用来显示GPA
function Show(arr)
{
    try
    {
        var mf = document.getElementsByName("mainFrame")[0];
        mf = mf.contentDocument;
        var nameText = mf.getElementsByClassName("BlueBigText")[0].innerText;
        var index = nameText.indexOf("姓名");
        var name = "";
        for (var i = index+3 ; i < nameText.length ; i++)
            name += nameText[i];
        var str = "欢迎你，"+name+"\n\n"+"你的ABC学分绩为："+arr[0].toFixed(3)+"\n"+"你的BCD学分绩为："+arr[1].toFixed(3)+"\n"+"你的ABCD学分绩为："+arr[2].toFixed(3)+"\n"+"你的ABCDE学分绩为："+arr[3].toFixed(3)+"\n\n    "+"学分绩计算可能因为网络问题或其他原因而计算错误，请核对该插件计算出来的ABC学分绩与系统的ABC学分绩是否匹配来判断，如果出错请重新计算学分绩（重修成绩按60计算）！";
        alert(str);
    }
    catch (e)
    {
        var str = "你的ABC学分绩为："+arr[0].toFixed(3)+"\n\n    "+"你的BCD学分绩为："+arr[1].toFixed(3)+"\n"+"你的ABCD学分绩为："+arr[2].toFixed(3)+"\n"+"你的ABCDE学分绩为："+arr[3].toFixed(3)+"\n"+"学分绩计算可能因为网络问题或其他原因而计算错误，请核对该插件计算出来的ABC学分绩与系统的ABC学分绩是否匹配来判断，如果出错请重新计算学分绩（重修成绩按60计算）！";
        alert(str);
    }
    
}

//接收
//TODO 这里还没有很好的解决方案，先这样吧，以后再更改
chrome.runtime.onMessage.addListener
(
    function (request, sender, sendResponse) 
    {
        //return true;
        if (request.greeting === "gpa")
        {
            var mf = window.top.document.getElementsByName("mainFrame")[0];
            if (mf !== undefined)
            {                 
                var mfc = mf.contentDocument;
                if (isGPAPage(mfc))
                {
                    //用来保存五类课的课程名称课程成绩和学分
                    sendResponse({error:"noerror"});
                    var result = [[],[],[],[],[]];
                    var pageNum = GetPageNum(mfc);
                    setTimeout
                    (
                        function ()
                        {
                            GoToPage(1);
                        },
                        500               
                    );
                    setTimeout
                    (
                        function ()
                        {
                            GoToPage(2);
                            SaveToArray(result); 
                        },
                        1000
                    );
                    setTimeout
                    (
                        function ()
                        {
                            GoToPage(3);
                            if (pageNum >= 2)
                                SaveToArray(result); 
                        },
                        1500
                    );
                    setTimeout
                    (
                        function ()
                        {
                            GoToPage(4);
                            if (pageNum >= 3)
                                SaveToArray(result);
                        },
                        2000
                    );
                    setTimeout
                    (
                        function ()
                        {
                            GoToPage(5);
                            if (pageNum >= 4)
                                SaveToArray(result); 
                        },
                        2500
                    );
                    setTimeout
                    (
                        function ()
                        {
                            GoToPage(6);
                            if (pageNum >= 5)
                                SaveToArray(result);
                        },
                        3000
                    );
                    setTimeout
                    (
                        function ()
                        {
                            var res = Calc(result);
                            //sendResponse({page:pageNum});
                            Show(res);
                        },
                        3500
                    );
                }
            }
            sendResponse({error:"noerror"});
        }
        else if (request.greeting == "qiangke")
        {
            sendResponse({error:"noerror"});
        }
        else
        {
            sendResponse({error:"error"});
        }
    }
);

window.onload = Patch;
//验证码识别中匹配的0-1序列
var code = {
'2':'11110111111110011111111111110111111110101111111111111011111110110111111111111101111110111011111111111110111111011101111111111111011111011110111111111111110111011111011111111111111100011111101111111111',
'3':'1111011111111011111111111111011110111110111111111111101111011111011111111111110111101111101111111111111011110111110111111111111101110101110111111111111111000111000111111111111',
'4':'111111111001111111111111111111111010111111111111111111111011011111111111111111110011101111111111111111110111110111111111111111110111111011111111111111110000000000001111111111111111111110111111111111111111111111011111111111111',
'5':'1111000000111101111111111111101111011111011111111111110111101111101111111111111011110111110111111111111101111101111011111111111110111110111011111111111111011111100011111111111',
'6':'11111111110000000111111111111111110111011101111111111111110111011111011111111111110111101111101111111111111011110111110111111111111101111011111011111111111110111110111011111111111111101111100011111111',
'7':'11011111111111111111111111101111111110011111111111110111111100111111111111111011111001111111111111111101111011111111111111111110110011111111111111111111010111111111111111111111100111111111111111111111',
'8':'111111111111110001111111111111111000110111111111111111111011100111110111111111111101111011111011111111111110111101111101111111111111011110111110111111111111101110011111011111111111111000110111011111111111111111111100011111111',
'9':'11111100011111011111111111111101110111110111111111111101111101111011111111111110111110111101111111111111011111011110111111111111101111101110111111111111111011101110111111111111111110000000111111111111',
'a':'1111111111111110001111111111111111110111011011111111111111110111011101111111111111111011101110111111111111111101110110111111111111111111000000001111111111111111111111110111111',
'b':'11111100000000000011111111111111111011111011111111111111111011111110111111111111111101111111011111111111111110111111101111111111111111011111110111111111111111110111110111111111111111111100000111111111',
'c':'1111111110000011111111111111111110111110111111111111111110111111101111111111111111011111110111111111111111101111111011111111111111110111111101111111111111111101111101111111111',
'd':'11111111000001111111111111111111011111011111111111111111011111110111111111111111101111111011111111111111110111111101111111111111111011111110111111111111111110111110111111111111110000000000001111111111',
'e':'1111111111000001111111111111111111011011011111111111111111011101110111111111111111101110111011111111111111110111011101111111111111111101101110111111111111111111000110111111111',
'f':'11111110111111111111111111111100000000000111111111111101101111111111111111111110110111111111111111111111011111111111111111111',
'g':'11111111000001111111111111111111011111011011111111111111011111110110111111111111101111111011011111111111110111111101101111111111111011111110110111111111111110111110110111111111111110000000000111111111',
'h':'1111000000000000111111111111111111011111111111111111111111011111111111111111111111011111111111111111111111101111111111111111111111110111111111111111111111111100000000111111111',
'j':'1111111111111111111101111111111111111111111110111111111111111111111111011111111111010000000000011111',
'k':'1111100000000000011111111111111111110111111111111111111111110101111111111111111111110111011111111111111111110111110111111111111111111111111101111111111111111111111111011111111',
'm':'11111111100000000011111111111111111011111111111111111111111011111111111111111111111101111111111111111111111110111111111111111111111111100000000111111111111111110111111111111111111111110111111111111111111111111011111111111111111111111101111111111111111111111111000000001111111',
'n':'1111111111000000000111111111111111111011111111111111111111111011111111111111111111111011111111111111111111111101111111111111111111111110111111111111111111111111100000000111111',
'p':'11111111100000000000011111111111111011111011111111111111111011111110111111111111111101111111011111111111111110111111101111111111111111011111110111111111111111110111110111111111111111111100000111111111',
'q':'11111111110000011111111111111111110111110111111111111111110111111101111111111111111011111110111111111111111101111111011111111111111110111111101111111111111111111111101111111111111111100000000000011111',
'r':'11111111100000000011111111111111111011111111111111111111111011111111111111111111111101111111111111111111111110111111111111111',
's':'11111111001111101111111111111111011011110111111111111111101110111011111111111111110111011101111111111111111011110001111111111',
't':'1111101111111111111111111111000000000011111111111111111011111110111111111111111101111111011111111111',
'u':'1111111100000000111111111111111111111111101111111111111111111111110111111111111111111111111011111111111111111111111011111111111111111111111011111111111111111100000000011111111',
'v':'111111110111111111111111111111111100111111111111111111111111100111111111111111111111111100111111111111111111111111100111111111111111111111001111111111111111111110011111111111111111111100111111111111111111111101111111111111111',
'w':'1111111101111111111111111111111111000111111111111111111111111100011111111111111111111111110011111111111111111111000111111111111111111110011111111111111111111100111111111111111111111111100111111111111111111111111100011111111111111111111111110011111111111111111111000111111111111111111100011111111111111111111101111111111111111',
'x':'11111011111110111111111111111110111110111111111111111111101110111111111111111111111000111111111111111111111100011111111111111111111101110111111111111111111101111101111111111111111101111111011111111111',
'y':'111110011111111111111111111111110011111111111111111111111110011111111111111111111111110011101111111111111111111110001111111111111111111100111111111111111111111001111111111111111111110011111111111111111111100111111111111111111',
'z':'1111101111110011111111111111110111110101111111111111111011110110111111111111111101110111011111111111111110110111101111111111111111010111110111111111111111100111111011111111111'
};
