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
	            {greeting: "hello"},
	            function(response) 
	            {    
	                if (response === undefined)
	                    alert("这个只能在选课系统-已修课程那里用哦～");
	                else
	                {
                        if (response.error === "error")
                        {
                            alert("这个只能在选课系统-已修课程那里用哦～");
                        }
	                }
	                    
	            }
	        ); 
	    }
	);	
}



//用来查询课程信息的函数
function Search()
{   
    $.getJSON
    (
        "course.json",
        function(course)
        {
            var xkxh = document.getElementById("xkxh").value;
            if (xkxh === "")
                document.getElementById("ms").innerText = "";
            else
            {
                var message = course[xkxh];
                if (message === undefined)
                    document.getElementById("ms").innerText = "查询失败！";
                else
                    document.getElementById("ms").innerText = "课程名称："+message[0]+"\n"+"任课教师："+message[1]+"\n"+"上课时间："+message[2]+"\n"+"上课地点："+message[3]+"\n"+"开课单位："+message[4];
                $("#ms").hide(0);
                $("#ms").show(1000);
            }
        }
    );
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

function Load()
{
	var F = document.getElementById("sta");
	F.onclick = AddFunCalc;
	var G = document.getElementById("query");
	G.onclick = Search;
	var H = document.getElementById("xkxh");
	H.onkeydown = EnterHandler;
}
window.onload = Load;
