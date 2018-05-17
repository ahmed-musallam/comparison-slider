(function () {
    // simple debounce function based on: https://github.com/jgarber623/javascript-debounce
    function debounce (callback, delay) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;

            clearTimeout(timeout);

            timeout = setTimeout(function() {
                callback.apply(context, args);
            }, delay);
        };
    }

    /**
     * Heavily based on: https://github.com/Paul-Browne/image-comparison-slider/blob/master/image-comparison-slider.js
     * @param {HTMLElement} sliderEl 
     */
    var Slider = function Slider(sliderEl) {
        // initialize dom elements
        this.$container = sliderEl;
        this.$dragger = this.$container.querySelector('.ba-mover');
        this.$imgLeft = this.$dragger.nextElementSibling;
        // calculate initial values
        var width = this.$imgLeft.getBoundingClientRect().width;
        var height = this.$imgLeft.getBoundingClientRect().height;
        var moverWidth = this.$dragger.getBoundingClientRect().width;
        // initialize slider and left image
        this.$dragger.style.left = width / 2 - moverWidth / 2 + 'px';
        this.$imgLeft.style.clip = this.getRect(width / 2, 999);
        // initialize event handlers
        this.initDraggerEvents();
        this.initOnResize();

    };
    // Shortcut
    var SliderPrototype = Slider.prototype;
    /**
     * Returns a rect css declaration from width and height
     * @param {*} w width
     * @param {*} h height
     */
    SliderPrototype.getRect = function (w, h) {
        return "rect(0px, " + w + "px, " + h + "px, 0px)";
    };

    /**
     * Initialize dragging events for desktop and touch devices
     */
    SliderPrototype.initDraggerEvents = function () {
        var slider = this,
            isDown = 0, // mouse is down or touch is down
            X = null;
        
        function resetDown(e) {
            isDown = 0;
        }
        // get's clientX value from a desktop or touch event
        function getClientX(e){
            if(e.clientX || e.clientX === 0) return e.clientX;
            else if (e.touches && e.touches[0]) return e.touches[0].clientX;
        }

        // Drag start event handler
        function start(e) {
           X = getClientX(e);
           isDown = 1;
        }
        // Dragging event handler
        function move(e){
            e.preventDefault(); // prevent screen from moving on touch devices
            if (isDown) {
                var clientX = getClientX(e);
                this.style.left = parseInt(this.style.left) + (clientX - X) + "px";
                X = clientX;
                var w = this.getBoundingClientRect().width / 2 + parseInt(this.style.left),
                    h = this.getBoundingClientRect().height;
                this.nextElementSibling.style.clip = slider.getRect(w, h);
            }
        }
        // initialize all events/handlers
        var handlers = {
            mouseup: resetDown,
            mouseout: resetDown,
            touchend: resetDown,
            mousedown: start,
            touchstart: start,
            touchmove: move,
            mousemove: move
        };

        // Register all
        Object.keys(handlers).forEach(function (event) {
            slider.$dragger.addEventListener(event, handlers[event]);
        });
    };
    
    SliderPrototype.initOnResize = function () {
        var slider = this;
        var handleResize = debounce(function() {
            var moverWidth = slider.$dragger.getBoundingClientRect().width;
            var imgLeft = slider.$dragger.nextElementSibling;
            var width = slider.$imgLeft.getBoundingClientRect().width;
            var height = slider.$imgLeft.getBoundingClientRect().height;
            slider.$dragger.style.left = width / 2 - moverWidth / 2 + 'px';
            slider.$imgLeft.style.clip = slider.getRect(width / 2, height);
        }, 100);
        var resizeTimer;
        // handle browser resize with a debounce
        window.addEventListener("resize", handleResize);
    };
    window.Slider = Slider;
})();