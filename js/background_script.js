/*************************************************************************
    > File Name: background_script.js
    > Author: yq
    > Mail: xiqian013@live.com 
    > Created Time: 2015-10-28 12:44:25
 ************************************************************************/

'use strict';



//用来计算学分绩的函数
function AddFunCalc()
{
	chrome.tabs.query
	(
	    {
	        active: true, 
	        currentWindow: true
	    }, 
	    function(tabs) 
	    {  
	        chrome.tabs.sendMessage
	        (
	            tabs[0].id, 
	            {greeting: "gpa"},
	            function(response) 
	            {    
	                if (response === undefined)
	                    alert("undefined这个只能在选课系统-已修课程那里用哦～");
	                else
	                {
                        if (response.error === "error")
                        {
                            alert("error这个只能在选课系统-已修课程那里用哦～");
                        }
	                }
	                    
	            }
	        ); 
	    }
	);	
}
//课程信息

//用来查询课程信息的函数
function Search()
{   
    var message = course[$("#xkxh").val()];
    if (message === undefined)
        document.getElementById("ms").innerText = "查询失败！";
    else
        document.getElementById("ms").innerText = "课程名称："+message[0]+"\n"+"任课教师："+message[1]+"\n"+"上课时间："+message[2]+"\n"+"上课地点："+message[3]+"\n"+"开课单位："+message[4];
        $("#ms").hide(0);
        $("#ms").show(500);
}

function Pay()
{
    var html = '';
    html += '<p>南开选课系统helper本身是免费的，但开发和维护都需要时间和精力来完成。如果您觉得此插件对您有帮助，您可以通过支付宝或微信来对开发者进行打赏，鼓励开发者写出更好的软件。您也可以关注我的微信公众号，获取最新的资讯。</p>';
    html += '<br/><hr/><br/>';
    html += '<p>用支付宝扫一扫打赏</p>';
    html += '<div align="center"><img src="../img/alipay.jpg"></div>';
    html += '<p>用微信扫一扫打赏</p>';
    html += '<div align="center"><img src="../img/weixinpay.jpg"></div>';
    html += '<p>个人微信公众号</p>';
    html += '<div align="center"><img src="../img/weixin.jpg"></div>';
    $('#showPay').html(html);
}

//响应enter键
function EnterHandler()
    {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (keyCode == 13)
    {
        var G = document.getElementById("query");
        G.click()
    }
}

$(document).ready
(
    function()
    {
        $("#sta").click(AddFunCalc);
        $("#query").click(Search);
        $('#pay').click(Pay);
        $("#xkxh").keydown(EnterHandler);
    }
);
