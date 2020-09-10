const request = new XMLHttpRequest();
// для универсальной обработки событий, включая тач: 
// var clickEvent = "ontouchstart" in window ? "touchend" : "click";
// у этого способа есть недостаток — при жесте маштабирование\прокрутки, если touchend приходится на ссылку, событие срабатывает

request.addEventListener("readystatechange", () => {
    if (request.readyState === 4 && request.status === 200) {
        let responseObj = JSON.parse(request.response);
        let postObj = responseObj[0].data.children[0].data;
        //console.log(postObj);
        document.getElementsByTagName("title")[0].innerHTML = postObj.title;
        document.getElementsByTagName("meta")[3].innerHTML = postObj.url;
        let tempHtml = postObj.selftext_html;
        tempHtml = tempHtml.replace(/&lt;/g, "<");
        tempHtml = tempHtml.replace(/&gt;/g, ">");
        tempHtml = tempHtml.replace(/&amp;nbsp;/g, " ");
        tempHtml = tempHtml.replace(/<a href=([\S]+)reddit/g, "<a class =\"ajax\" href=$1reddit");
        document.getElementById("header").innerHTML = postObj.title;
        document.getElementById("whereTo").value = postObj.url;
        document.getElementById("ajaxable").innerHTML = tempHtml;
        document.getElementById("whereTo").focus();
    }
});

function initiateShift (e) {
    if (e.target.className === "ajax") {
        e.preventDefault();
        let url = e.target.href || document.getElementById('whereTo').value; // Somewhy getting JSON is not forbidden by CORS?
        request.open('GET', url + "/.json");
        //request.setRequestHeader('Content-Type', 'application/x-www-form-url');
        request.send();
        return false;
    }
}

document.body.addEventListener(clickEvent, initiateShift, false);