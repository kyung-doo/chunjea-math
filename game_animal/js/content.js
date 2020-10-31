(function ( $ ) {
    'use strict';
    var correctAudio = new AudioControl("./audio/correct.mp3");
    var wrongAudio = new AudioControl("./audio/wrong.mp3");

    // 게임 init
    $(window).on("init", function (){
        exportRoot.defaultAni1.play();
    });

    // 에니메이션 종료
    $(window).on("animation-finish", function (e, state ) {
        if(quizCount < quizLength && lifeCount > 0 ) {
            if(state == "clear") {
                exportRoot.clearAni1.gotoAndStop(0);
                exportRoot.clearAni2.gotoAndStop(0);
                exportRoot.clearAni3.gotoAndStop(0);
            } else {
                exportRoot.failedAni1.gotoAndStop(0);
                exportRoot.failedAni2.gotoAndStop(0);
                exportRoot.failedAni3.gotoAndStop(0);
            }
            exportRoot["defaultAni"+(quizCount+1)].gotoAndPlay(1);
        }
    });

    // 퀴즈 정답 num = 퀴즈 번호
    $(window).on("quiz-correct", function ( e ) {
        exportRoot["defaultAni"+(quizCount+1)].gotoAndStop(0);
        exportRoot["clearAni"+(quizCount+1)].gotoAndPlay(1);
        correctAudio.play();
    });

    // 퀴즈 오답 num = 퀴즈 번호
    $(window).on("quiz-wrong", function ( e ) {
        exportRoot["defaultAni"+(quizCount+1)].gotoAndStop(0);
        exportRoot["failedAni"+(quizCount+1)].gotoAndPlay(1);
        wrongAudio.play();
    });

    // 게임 종료
    $(window).on("game-finish", function ( e, state ) {
        if(state == "clear") {
            location.href = "../ending_animal/clear.html?grade="+$("body").data("grade")+"&term="+$("body").data("term")+"&lesson="+$("body").data("lesson");
        } else {
            location.href = "../ending_animal/failed.html?grade="+$("body").data("grade")+"&term="+$("body").data("term")+"&lesson="+$("body").data("lesson");
        }
    });

})( jQuery );