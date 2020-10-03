"use strict";

const request = new XMLHttpRequest();
// для универсальной обработки событий, включая тач: 
// var clickEvent = "ontouchstart" in window ? "touchend" : "click";
// у этого способа есть недостаток — при жесте маштабирование\прокрутки, если touchend приходится на ссылку, событие срабатывает

function parseToHTML(selftext_html) {
    let parsed = selftext_html;
    parsed = parsed.replace(/(&amp;|&)lt;/g, "<");
    parsed = parsed.replace(/(&amp;|&)gt;/g, ">");
    parsed = parsed.replace(/(&amp;|&)#39;/g, "'");
    parsed = parsed.replace(/(&amp;|&)quot;/g, "\"");
    parsed = parsed.replace(/(&amp;|&)nbsp;/g, " ");
    parsed = parsed.replace(/(&amp;|&)(#8203|ZeroWidthSpace);/g, " ");
    
    parsed = parsed.replace(/(&amp;)/g, "&");


    parsed = parsed.replace(/<([/]?)script.*?>/g, "&lt;$1SCRIPT&gt;"); // basic script sanitizing

    parsed = parsed.replace(/<a href=([\S]+)reddit/g, "<a class =\"ajax\" href=$1reddit"); // replacing local reddit links to ajax reader
    parsed = parsed.replace(/<a href=([\S]+?)(?!reddit.com)>/g, "<a target =\"_blank\" href=$1>"); // forcing non-reddit links to open in a new window

    return parsed;
}

request.addEventListener("readystatechange", () => {
    if (request.readyState === 4 && request.status === 200) {
        let responseObj = JSON.parse(request.response);
        let postObj = responseObj[0].data.children[0].data;

        document.getElementsByTagName("title")[0].innerHTML = postObj.title;
        document.getElementsByTagName("meta")[3].innerHTML = postObj.url;

        document.getElementById("whereTo").value = postObj.url;

        let header = document.getElementById("header");
        header.innerText = postObj.title;
        header.href = postObj.url;
        document.body.scrollIntoView(header);

        let content = document.getElementById("ajaxable");
        content.innerHTML = parseToHTML(postObj.selftext_html);
        content.classList.remove("loading");
    }
});

function initiateShift (e) {
    if (e.target.className === "ajax") {
        e.preventDefault();
        let url = e.target.href || document.getElementById('whereTo').value; // Somewhy getting JSON is not forbidden by CORS?
        request.open('GET', url + "/.json");
        //request.setRequestHeader('Content-Type', 'application/x-www-form-url');
        document.getElementById("ajaxable").classList.add("loading");
        request.send();
        return false;
    }
}

document.body.addEventListener(clickEvent, initiateShift, false);