/******************************************
南开大学选课系统通用补丁
将以下代码保存到书签栏中即可
 ******************************************/
javascript:((function(){
    var forms = ['checkcode_text','usercode_text','userpwd_text'];
    for (var i in forms)
    {
        if (document.getElementsByName(forms[i])[0] !== undefined)
        {
            document.getElementsByName(forms[i])[0].id = forms[i];
        }
    }
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
    var mf = window.top.document.getElementsByName("mainFrame")[0];
    if (mf !== undefined)
    {
        mf = mf.contentDocument;
        if (mf.location.pathname === "/xsxk/selectedAction.do")
        {
            var centerList = mf.getElementsByTagName("center");
            if ((centerList.length !== 1) && centerList[1].innerText.indexOf('冲突') !== -1)
            centerList[1].innerText = "";
            var center=mf.getElementsByTagName('center')[0];
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
        if ((mf.location.pathname === "/xsxk/selectMianInitAction.do") || (mf.location.pathname === "/xsxk/swichAction.do"))
        {
            var xkxh = new Array(4);
            for (var i = 1 ; i < 5 ; i++)
            {
                xkxh[i-1] = mf.getElementsByName('xkxh'+i)[0].value;
            }
            setInterval(function(){
                var mfc = window.top.document.getElementsByName("mainFrame")[0];
                mfc=mfc.contentDocument;
                for (var i = 1 ; i < 5 ; i++)
                {
                    mfc.getElementsByName('xkxh'+i)[0].value = xkxh[i-1];
                }
                var submit = mfc.getElementsByName('xuanke')[0];
                submit.click();
            },3000);
       }
    }
})())

