
var quizLength = 3;
var quizCount = 0;
var lifeCount = 3;
var targetQuiz;

(function ( $ ) {
    'use strict';

    // init
    $(window).on("init", function (){
        startQuiz();

        $(".home-btn").on(click, function () {
            if(parent.window.hasOwnProperty("goHome")) parent.window.goHome();
            //alert("홈 이동 학년 : "+$("body").data("grade")+", 학기 : "+$("body").data("term")+", 단원 : "+$("body").data("lesson"));
        });

        setTimeout(function (){
            $("#game-content").show();
        });

    });

    // 에니메이션 종료
    $(window).on("animation-finish", function (e, state) {
        targetQuiz.find(".list-con .list").removeClass("active");
        targetQuiz.find("input[type='text']").val("");
        if(state == "clear") {
            quizCount++;
            if(quizCount == quizLength) {
                $(window).trigger("game-finish", ["clear"]);
            } else {
                startQuiz();
            }
        } else {
            if(lifeCount == 0){
                $(window).trigger("game-finish", ["failed"]);
            } else {
                startQuiz( true );
            }
        }
    });   
    

    /*
    *   퀴즈 시작
    */
    function startQuiz ( failed ) {
        $(".quiz-con").removeClass("disable");
        targetQuiz = $(".quiz-con .quiz").eq(quizCount);
        $(".quiz-con .quiz").hide();
        if(!failed) targetQuiz.fadeIn(500);
        else        targetQuiz.show();

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
            // var answer = targetQuiz.data("answer");
            // console.log(answer)
            // targetQuiz.find(".list-con .list").off(click).on(click, function ( e ) {
            //     $(".quiz-con").addClass("disable");
            //     if(answer == $(this).index()+1) {
            //         $(this).addClass("active");
            //         correctQuiz();
            //     } else {
            //         wrongQuiz();
            //     }
            // });

            var answerArr = (new String(targetQuiz.data("answer")).indexOf('|') !== -1) ? targetQuiz.data("answer").split("|") : [targetQuiz.data("answer")];
            var answer = answerArr.map(Number);
            targetQuiz.find(".list-con .list").off(click).on(click, function ( e ) {
                $(".quiz-con").addClass("disable");
                if(answer.indexOf($(this).index()+1)!== -1 ) {
                    $(this).addClass("active");
                    correctQuiz();
                } else {
                    wrongQuiz();
                }
            });



        } else if(targetQuiz.is(".quiz-input")) {
            // 입력 형
            var answer = new String(targetQuiz.data("answer")).split("|");  // 숫자 입력값 오류 수정 
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
