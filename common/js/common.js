/** 전역  */
var user_agent = navigator.userAgent.toLowerCase(),
	isMac = (user_agent.indexOf("mac") > -1),
	isIOS = ((user_agent.indexOf("applewebkit") > -1 ) && isMac) || user_agent.indexOf("ipad") > -1 || (user_agent.indexOf("iphone") > -1 || user_agent.indexOf("ipod") > -1),	
	isAndroid = (user_agent.indexOf("android") > -1),	
	isChrome = ( (user_agent.indexOf("applewebkit") > -1 ) && !isMac),
	isFireFox = user_agent.indexOf("firefox") >-1,
	isMobile = false;
	isIE = !isChrome && !isMac && !isFireFox;
	

if(isIOS || isAndroid) isMobile = true; 

var touchstart = "mousedown";
var touchmove = "mousemove";
var touchend = "mouseup";
var click = "click";

if( isMobile ) {
	touchstart = "touchstart";
	touchmove = "touchmove";
    touchend = "touchend";
}



/*
*	Class 구현
*/
(function () {
    var initializing = false, fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    };

    Class.extend = function (prop) {

        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]) : prop[name];
        };

        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        };

        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;

        return Class;
	};

})();


/*
*	제이쿼리 확장
*/
(function ( $ ) {
    'use strict'

    $.extend({

        getUrlVars: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        getUrlVar: function(name) {
            return $.getUrlVars()[name];
        },

        makeRandom : function ( randomNum, arNum ) {
            var randomAr = new Array();
            var rand = new Array();
            var temp = new Array();
            var r,p,i;
            
            for(i = 0; i<randomNum; i++) {
                temp[i] = i;
            }
            
            for(i = 0; i<randomNum; i++) {
                r = Math.floor(Math.random() * (randomNum - i));
                p = temp[r];
                randomAr[i] = p;
                for(var j = r; j<randomNum - i- 1; j++) {
                    temp[j] = temp[j + 1];
                }
            }
            
            for (i = 0; i < arNum; i++ ) {
                rand[i] = randomAr[i];
            }
            
            return rand;
        }
    });

})( jQuery );



/*
*	카운터
*/
(function () {
    "use strict";

	var CounterUtils  = CounterUtils  || ( function ()
    {

        /** @private 카운트 생성
         */
        function initCounter()
        {
            Date.prototype.YYYYMMDDHHMMSS = function()
            {
                var yyyy = this.getFullYear().toString();
                var mm = (this.getMonth() + 1).toString();
                var dd = this.getHours().toString();
                var hh = this.getDate().toString();
                var m = this.getMinutes().toString();
                var s = this.getSeconds().toString();

                return yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]) + (hh[1] ? hh : '0'+hh[0]) + (m[1] ? m : '0'+m[0]) + (s[1] ? s : '0'+s[0]);
            }
        }

        /** @private 현재시간 받기
         */
        function now() {
            return (new Date()).getTime();
        }

        /** @private 앞에 0
         */
        function pad(num, size) {
            var s = "0000" + num;
           return s.substr(s.length - size);
        }

        return Class.extend({

            /** @public init
             *  @param {audio} audio 엘리먼트
             *  @param {json} 옵션
             */
            init : function ()
            {
                this.startAt = 0;
                this.lapTime = 0;
                initCounter.call(this);
            },

            /** @public 시작
             */
            start : function () {
                this.startAt = this.startAt ? this.startAt : now();
            },

            /** @public 멈춤
             */
            stop : function () {
                this.lapTime = this.startAt ? this.lapTime + now() - this.startAt : this.lapTime;
				this.startAt	= 0;
            },


            /** @public 리셋
             */
            reset : function () {
                this.lapTime = this.startAt = 0;
            },


            /** @public 시간 받기
             */
            time : function () {
                return this.lapTime + (this.startAt ? now() - this.startAt : 0);
            },

            /** @public 시간 포맷 받기
             */
            getFormat : function () {
                var time = this.time();
                var h = 0; 
                var m = 0; 
                var s = 0;
                var ms = 0;

                h = Math.floor( time / (60 * 60 * 1000) );
                time = time % (60 * 60 * 1000);
                m = Math.floor( time / (60 * 1000) );
                time = time % (60 * 1000);
                s = Math.floor( time / 1000 );
				ms = time % 1000;
				
                return pad(h, 2)+" "+pad(m, 2)+" "+pad(s, 2)+" "+pad(ms, 2);  
            }

        });

    })();

    window.CounterUtils  = CounterUtils ;

})();




/*
*	오디오 컨트롤
*/
(function ( $ ) {
	'use strict';
	
	var AudioControl = AudioControl || (function () {

		function initAudio() {
			this.audio = $("<audio><source src='"+this.source+"' type='audio/mpeg' /></audio>")[0];
			$("body").append($(this.audio));
		}

		function onUpdate() {

			if(this.audio.currentTime >= this.audio.duration) {
				this.audio.pause();
				this.audio.currentTime = 0;
				if(this.options.onFinish) this.options.onFinish( this.audio );
				clearInterval(this.timer);
			} else {
				var percent = this.audio.currentTime/this.audio.duration;
				if(this.options.onUpdate) this.options.onUpdate( this.audio, percent);
			}
		}
		
		return Class.extend({

			init : function ( source, options ) {
				this.audio;
				this.source = source;
				this.timer;
				this.options = {onFinish:null, onUpdate:null}
				$.extend(this.options, options);
				initAudio.call(this);
			},

			play : function ( seek ) {
				if( this.audio.paused ) {
					if(seek) this.audio.currentTime = seek;
					this.audio.play();
					this.timer = setInterval($.proxy(onUpdate, this), 1000/30);
					onUpdate.call(this);
				}
			},

			pause : function () {
				if(!this.audio.paused) {
                    this.audio.pause();
                    clearInterval(this.timer);
                }
			},

			stop : function () {
				if(!this.audio.paused) {
					this.audio.pause();
					this.audio.currentTime = 0;
					clearInterval(this.timer);
				}
			},

			destroy : function () {
				$(this.audio).remove();
				this.audio = null;
				clearInterval(this.timer);
			}
		});

	})();

	window.AudioControl = AudioControl;

})(jQuery);







/**
 * 시퀀스
 */
(function ($){
    'use strict';

    var Sequence = Sequence || (function () {

        function initSequence() {      
            var owner = this;   
            this.image = $('<img src="' + this.options.source + '/'+this.options.name+pad(this.currentFrame+1, this.options.padNum)+'.'+this.options.fileName+'">');
            this.element.append(this.image);
            if(this.options.preload) preloadImages.call(this);
            owner.startTimer = setTimeout(function (){
                if(owner.options.autoPlay)owner.play();
            }, 500);
        }

        function pad(num, size) {
			 var s = "0000" + num;
			return s.substr(s.length - size);
        }

        function preloadImages() {
            var owner = this;
            var count = 0;
            for(var i=0; i<this.options.totalFrames-1; i++) {
                var image = new Image();
                image.src = this.options.source + '/'+this.options.name + pad(i+1, this.options.padNum)+'.'+this.options.fileName;
                this.images.push(image);
                $(image).one("load error", function ( e ) {
                    count++;
                    if(count == owner.options.totalFrames-1) {
                        owner.element.trigger("init");
                    }
                });
            }
        }

        function unloadImages() {
            for(var i=0; i<this.images.length; i++) {
                this.images[i].src = "";
                this.images[i] = null;
            }
            this.images = [];
        }
        
        function onUpdate() {
            this.currentFrame++;
            this.element.trigger("update", [this.currentFrame, this.options.totalFrames]);
			if(this.currentFrame >= this.options.totalFrames-1) {	
                this.element.trigger("finish", [this.currentFrame, this.options.totalFrames]);
				if(this.options.loop) {
                    this.currentFrame = 0;
				} else {
                    clearInterval(this.timer);
                }
            }
            setImageSrc.call(this);
        }
        
        function setImageSrc () {
            this.image.attr("src", this.options.source + '/'+this.options.name + pad(this.currentFrame+1, this.options.padNum) +'.'+ this.options.fileName);
        }


        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.timer;
                this.startTimer;
                this.currentFrame = 0;
                this.images = [];
                initSequence.call(this);
            },

            play: function () {
                if(this.currentFrame >= this.options.totalFrames) {
                    this.currentFrame = 0;
                }
                clearInterval(this.timer);
                this.timer = setInterval($.proxy(onUpdate, this), 1000/this.options.fps);
            },

            pause: function () {
                clearTimeout(this.startTimer);
                clearInterval(this.timer);
            },

            stop: function () {
                clearTimeout(this.startTimer);
                clearInterval(this.timer);
                this.currentFrame = 0;
                setImageSrc.call(this);
            },

            gotoAndPlay: function ( frame ) {
                clearInterval(this.timer);
                this.currentFrame = parseInt(frame);
                if(this.currentFrame < 0) this.currentFrame = 0;
                if(this.currentFrame > this.options.totalFrames-1) this.currentFrame = this.options.totalFrames-1;
                setImageSrc.call(this);
                this.timer = setInterval($.proxy(onUpdate, this), 1000/this.options.fps);
            },

            gotoAndStop: function ( frame ) {
                clearInterval(this.timer);
                this.currentFrame = parseInt(frame);
                if(this.currentFrame < 0) this.currentFrame = 0;
				if(this.currentFrame > this.options.totalFrames-1) this.currentFrame = this.options.totalFrames-1;
                setImageSrc.call(this);
            },

            destory: function () {
                clearTimeout(this.startTimer);
                unloadImages.call(this);
                clearInterval(this.timer);
            }
        });
    })();

	Sequence.DEFAULT = {
        source: "", 
        name: "",
        totalFrames: 0,
        fps: 30, 
        loop: false,
        autoPlay: false,
        fileName: "png",
        padNum: 4,
        preload: false
    };

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('sequence');
            var options =  $.extend({}, Sequence.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('sequence', (data = new Sequence($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.Sequence = Sequence;
    $.fn.sequence = Plugin;
    $.fn.sequence.Constructor = Sequence;
    
})(jQuery);







//documentReady
$(function () {

	//리사이징 처리
	var contentWidth = 1280;
	var contentHeight = 720;
    var scale;


    gsap.set($("#game-content"), {transformOrigin:"top left"});
	$(window).on("resize", function ( e ) {
		var winWidth = $(window).width();
		var winHeight = $(window).height(); 
		var scaleX = winWidth/contentWidth;
		var scaleY = winHeight/contentHeight;
		scale = Math.min(scaleX, scaleY);
		var left = (winWidth-(contentWidth*scale))/2;
		var top = (winHeight-(contentHeight*scale))/2;
		gsap.set($("#game-content"), {scaleX:scale, scaleY:scale, left:left, top:top});
		gsap.set($("#container"), {height:(contentHeight*scale)+top});
		window.scale = 1/scale;
	});

	$(window).trigger("resize");

	setTimeout(function () {
		$(window).trigger("resize");
    }, 100);

    // button
    $(".button").on(touchstart, function ( e ) {
        $(this).addClass("down");
    });
    
    $(".button").on(touchend + " " + click, function ( e ) {
        $(this).removeClass("down");
    });

});