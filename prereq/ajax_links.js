const request = new XMLHttpRequest();
// для универсальной обработки событий, включая тач: 
// var clickEvent = "ontouchstart" in window ? "touchend" : "click";
// у этого способа есть недостаток — при жесте маштабирование\прокрутки, если touchend приходится на ссылку, событие срабатывает

request.addEventListener("readystatechange", () => {
    if (request.readyState === 4 && request.status === 200) {
        history.replaceState(null, "", request.responseURL);                                                                                //заменяем главу в истории браузера
        document.getElementsByTagName("title")[0].outerHTML = request.responseText.match(/\<title\>[\s\S]+\<\/title\>/)[0];                 //заменяем заголовок страницы,
        document.getElementsByTagName("meta")[3].outerHTML = request.responseText.match(/\<meta name="description" content=".+?"\>/)[0];    //её краткое описание
        document.querySelector('div.expando div.usertext-body').innerHTML;
        let tempBody = document.createElement('body');
        tempBody.outerHTML = request.responseText;
        document.getElementById("ajaxable").innerHTML = tempBody.querySelector('div.expando div.usertext-body').innerHTML;             //и весь материал
    }
});

function initiateShift (e) {
    if (e.target.className === "ajax") {
        e.preventDefault();
        let url = e.target.href;
        request.open('GET', url);
        request.setRequestHeader('Content-Type', 'application/x-www-form-url');
        request.send(); //Не сработает на локальном файле, ибо CORS policy …
        return false;
    }
}

document.body.addEventListener(clickEvent, initiateShift, false);