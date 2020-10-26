(function ( $ ) {
    'use strict';

    var clearAudio = new AudioControl("./audio/clear.mp3");
    var failedAudio = new AudioControl("./audio/failed.mp3");
    
    // init
    $(window).on("init", function (){
        if($("body").is(".clear-ending")) {
            exportRoot.clearAni.play();
            clearAudio.play();
        } else {
            exportRoot.failedAni.play();
            failedAudio.play();
        }
        setTimeout(function (){
            $("#game-content").show();
        });

        $(".restart-btn").on(click, function () {
            alert("홈 이동 학년 : "+$.getUrlVar("grade")+", 학기 : "+$.getUrlVar("term")+", 단원 : "+$.getUrlVar("lesson"));
        });
    });

    

})( jQuery );
