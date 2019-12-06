let menuTemp = false;
$(document).ready(function() {
    $('.menu-bth').on('click', function(e) {
        menuTemp = menuTemp ? false : true;
        e.preventDefault();
        $(this).toggleClass('menu-bth-active');
        if ($(window).width() <= '800') {
            $('body').toggleClass('close-body');
        }
        $("body").toggleClass('over-hidden');
        let menu = document.getElementById("menu");
        let container = document.getElementById("main-wrap");
        let bar = document.getElementById("bar");
        //делаем тоггл класса у меню, меню сдвигается на 300 пикселей.
        if (bar) {
            bar.classList.toggle("bar-open");
            if (typeof fillBar === "function") fillBar();
        }
        menu.classList.toggle("menu-open");
        container.classList.toggle("main-wrap-open");

        let user = document.getElementById("chat-user");
        let sendForm = document.getElementById("send-form");
        if (user && sendForm) {
            user.classList.toggle("chat-user-open");
            sendForm.classList.toggle("send-form-open");
        }
    });
});

$(window).resize(function() {
    if (menuTemp && $(window).width() <= '800') {
        $('body').toggleClass('close-body');
    } else if (menuTemp && $(window).width() > '800') {
        $('body').toggleClass('close-body');
    }
});
