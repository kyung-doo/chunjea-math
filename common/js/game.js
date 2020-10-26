
var quizLength = 3;
var quizCount = 0;
var lifeCount = 3;
var targetQuiz;

(function ( $ ) {
    'use strict';

    // 게임 init
    $(window).on("init", function (){

        startQuiz();

        $(".home-btn").on(click, function () {
            alert("홈 이동 학년 : "+$("body").data("grade")+", 학기 : "+$("body").data("term")+", 단원 : "+$("body").data("lesson"));
        });

    });

    // 에니메이션 종료
    $(window).on("animation-finish", function (e, state) {
        targetQuiz.find(".list-con .list").removeClass("active");
        targetQuiz.find("input[type='text']").val("");
        if(state == "clear") {
            quizCount++;
            if(quizCount == quizLength) {
                location.href = "../ending_cat/clear.html?grade="+$("body").data("grade")+"&term="+$("body").data("term")+"&lesson="+$("body").data("lesson");
            } else {
                startQuiz();
            }
        } else {
            if(lifeCount == 0){
                location.href = "../ending_cat/failed.html?grade="+$("body").data("grade")+"&term="+$("body").data("term")+"&lesson="+$("body").data("lesson");
            } else {
                startQuiz();
            }
        }
    });   
    

    /*
    *   퀴즈 시작
    */
    function startQuiz () {
        $(".quiz-con").removeClass("disable");
        targetQuiz = $(".quiz-con .quiz").eq(quizCount);
        $(".quiz-con .quiz").hide();
        targetQuiz.show();

        if(targetQuiz.is(".quiz-ox")) {
            // ox 형
            var answer = targetQuiz.data("answer");
            targetQuiz.find(".list-con .list").off(click).on(click, function ( e ) {
                $(".quiz-con").addClass("disable");
                if(($(this).index() == 0 && answer == "o") || $(this).index() == 1 && answer == "x") {
                    $(this).addClass("active");
                    correctQuiz();
                } else {
                    wrongQuiz();
                }
            });
        } else if(targetQuiz.is(".quiz-choice")) {
            // 선택 형
            var answer = targetQuiz.data("answer");
            targetQuiz.find(".list-con .list").off(click).on(click, function ( e ) {
                $(".quiz-con").addClass("disable");
                if(answer == $(this).index()+1) {
                    $(this).addClass("active");
                    correctQuiz();
                } else {
                    wrongQuiz();
                }
            });

        } else if(targetQuiz.is(".quiz-input")) {
            // 입력 형
            var answer = targetQuiz.data("answer").split("|");
            targetQuiz.find("input[type='text']").focus();
            targetQuiz.find(".enter-btn").off(click).on(click, function ( e ) {
                $(".quiz-con").addClass("disable");
                if($.inArray(targetQuiz.find("input[type='text']").val(), answer) > -1) {
                    correctQuiz();
                } else {
                    wrongQuiz();
                }
            });
        }   
    }

    function correctQuiz() {
        $(window).trigger("quiz-correct", [quizCount]);
    }

    function wrongQuiz() {
        lifeCount--;
        if(lifeCount == 2) {
            $(".life-con .life").eq(0).addClass("off");
        } else if(lifeCount == 1) {
            $(".life-con .life").eq(1).addClass("off");
        } else {
            $(".life-con .life").eq(2).addClass("off");   
        }
        $(window).trigger("quiz-wrong", [quizCount]);
    }

})( jQuery );
