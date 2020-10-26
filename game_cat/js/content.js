(function ( $ ) {
    'use strict';
    
    // 게임 init
    $(window).on("init", function (){
        exportRoot.defaultAni.play();
    });

    // 에니메이션 종료
    $(window).on("animation-finish", function (e, state ) {
        if(quizCount < quizLength && lifeCount > 0 ) {
            if(state == "clear") {
                exportRoot.clearAni.gotoAndStop(0);
            } else {
                exportRoot.failedAni.gotoAndStop(0);
            }
            exportRoot.defaultAni.gotoAndPlay(1);
        }
    });

    // 퀴즈 정답 num = 퀴즈 번호
    $(window).on("quiz-correct", function () {
        exportRoot.defaultAni.gotoAndStop(0);
        exportRoot.clearAni.gotoAndPlay(1);
    });

    // 퀴즈 오답 num = 퀴즈 번호
    $(window).on("quiz-wrong", function () {
        exportRoot.defaultAni.gotoAndStop(0);
        exportRoot.failedAni.gotoAndPlay(1);
    });

})( jQuery );