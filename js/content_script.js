/*************************************************************************
    > File Name: js/patch.js
    > Author: yq
    > Mail: xiqian013@live.com 
    > Created Time: 2015-10-27 00:01:15
 ************************************************************************/

'use strict';

//这个函数用来修复选课系统的一些问题
function Patch()
{
    //这部分用来给选课系统的网页中的usercode,userpwd,checkcode加上相应的ID,使得能够正确调用选课系统里的javascript代码，从而进行登陆。
    var forms = ['checkcode_text','usercode_text','userpwd_text'];
    for (var i in forms)
    {
        if (document.getElementsByName(forms[i])[0] !== undefined)
        {
            document.getElementsByName(forms[i])[0].id = forms[i];
        }
    }

    //这部分用来修复登陆选课系统以后，左侧边栏的显示，需要把visibility参数由hidden改为visible
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
                tmp.style["left"] = "5px";
                if (i % 2 === 0)
                {
                    tmp.style["visibility"] = "visible";
                }
            }
        }
    }
    
       
    //这部分用来在选课页面增加课程上课时间地点等信息
    var mf = window.top.document.getElementsByName("mainFrame")[0];
    //
    if ((mf !== undefined))
    {
        mf.onload = function()
        {
            //test
            if (isGPAPage())
            {
                var mfc = mf.contentDocument;
                var tr=mfc.getElementsByTagName('tr')[2];
                //tr.getElementsByClassName('NavText')[2];
                var cell = tr.insertCell();
                cell.innerText="233333";
                cell.align="center";
                //cell.className="NavText style1";
                cell.className="NavText";
            }
        }
    }
}

//这个函数用来判断当前页面是否是查看已修课程的成绩
function isGPAPage()
{
    var mf = document.getElementsByName("mainFrame")[0];
    if (mf !== undefined)
    {
        mf = mf.contentDocument;
        if ((mf.location.pathname === "/xsxk/studiedAction.do") || (mf.location.pathname === "/xsxk/studiedPageAction.do"))
            return true;
    }
    return false;
}

//这个函数用来判断当前页面是否是学生选课页面
function isSelectCoursePage()
{
    var mf = document.getElementsByName("mainFrame")[0];
    if (mf !== undefined)
    {
        mf = mf.contentDocument;
        if ((mf.location.pathname === "/xsxk/selectMianInitAction.do") || (mf.location.pathname === "/xsxk/swichAction.do"))
            return true;
    }
    return false;
}

//这个函数用来获取成绩页面的总页码数
function GetPageNum()
{
    var mf = document.getElementsByName("mainFrame")[0];
    if (mf !== undefined)
    {
        mf = mf.contentDocument;
        var pageNum = mf.getElementsByClassName("NavText style1")[8].innerHTML[2];
        return pageNum;
    }
    return 0;
}

//这个函数用来跳到指定的页面
function GoToPage(i)
{
    var mf = document.getElementsByName("mainFrame")[0];
    if (mf !== undefined)
    {
        mf = mf.contentDocument;
        var nts = mf.getElementsByClassName("NavText style1")[10];
        var index = nts.getElementsByTagName("input")[0];
        var submit = nts.getElementsByTagName("input")[1];
        index.value = i;
        submit.click();
    }
}

//把网页中的成绩学分课程等信息放到一个二维列表中
function SaveToArray(arr)
{
    var mf = document.getElementsByName("mainFrame")[0];
    mf = mf.contentDocument;
    var array = mf.getElementsByClassName("NavText");
    var length = (array.length - 15) / 8;
    //array数组的前八个和后七个均不是我们需要的
    //8i+2----课程名称,8i+3------课程类型,8i+4------课程成绩,8i+5------课程学分
    for (var i = 1 ; i <= length ; i++)
    {
        if (array[8*i+3].innerHTML.indexOf("A") !== -1)
        {
            arr[0].push(array[8*i+2].innerHTML);
            arr[0].push(array[8*i+4].innerHTML);
            arr[0].push(array[8*i+5].innerHTML);
        }
        if (array[8*i+3].innerHTML.indexOf("B") !== -1)
        {
            arr[1].push(array[8*i+2].innerHTML);
            arr[1].push(array[8*i+4].innerHTML);
            arr[1].push(array[8*i+5].innerHTML);
        }
        if (array[8*i+3].innerHTML.indexOf("C") !== -1)
        {
            arr[2].push(array[8*i+2].innerHTML);
            arr[2].push(array[8*i+4].innerHTML);
            arr[2].push(array[8*i+5].innerHTML);
        }
        if (array[8*i+3].innerHTML.indexOf("D") !== -1)
        {
            arr[3].push(array[8*i+2].innerHTML);
            arr[3].push(array[8*i+4].innerHTML);
            arr[3].push(array[8*i+5].innerHTML);
        }
        if (array[8*i+3].innerHTML.indexOf("E") !== -1)
        {
            arr[4].push(array[8*i+2].innerHTML);
            arr[4].push(array[8*i+4].innerHTML);
            arr[4].push(array[8*i+5].innerHTML);
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
        if (F[3*i+1].indexOf("未评价") === -1)
        {
            GradeSum += Number(F[3*i+1]) * Number(F[3*i+2]);
            CreditSum += Number(F[3*i+2]); 
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
    var ABC = (A[0]+B[0]+C[0]) / (A[1]+B[1]+C[1]);
    var BCD = (B[0]+C[0]+D[0]) / (B[1]+C[1]+D[1]);
    var ABCD = (A[0]+B[0]+C[0]+D[0]) / (A[1]+B[1]+C[1]+D[1]);
    var ABCDE = (A[0]+B[0]+C[0]+D[0]+E[0]) / (A[1]+B[1]+C[1]+D[1]+E[1]);
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
        var str = "欢迎你，"+name+"\n\n"+"你的ABC学分绩为：       "+arr[0].toFixed(2)+"\n"+"你的BCD学分绩为：       "+arr[1].toFixed(2)+"\n"+"你的ABCD学分绩为：    "+arr[2].toFixed(2)+"\n"+"你的ABCDE学分绩为： "+arr[3].toFixed(2);
        alert(str);
    }
    catch (e)
    {
        var str = "你的ABC学分绩为：       "+arr[0].toFixed(2)+"\n"+"你的BCD学分绩为：       "+arr[1].toFixed(2)+"\n"+"你的ABCD学分绩为：    "+arr[2].toFixed(2)+"\n"+"你的ABCDE学分绩为： "+arr[3].toFixed(2);
        alert(str);
    }
    
}
//接收
chrome.runtime.onMessage.addListener
(
    function (request, sender, sendResponse) 
    {
        if (isGPAPage())
        {
            //用来保存五类课的课程名称课程成绩和学分
            var result = [[],[],[],[],[]];
            var pageNum = GetPageNum();
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
                    GoToPage(5);
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
                    //就不回调了吧。。。
                    sendResponse({page:pageNum});
                    Show(res);
                },
                3500
            );  
        }
        else
        {
            sendResponse({error:"error"});
        }       
    }
);

window.onload = Patch;
