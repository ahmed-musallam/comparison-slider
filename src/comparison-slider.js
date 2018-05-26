(function () {
    var px = 'px';
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
        this.$imgLeft = this.$container.querySelector('.ba-img-left');
        this.$imgRight = this.$container.querySelector('.ba-img-right');

        // make sure both images fit containers width
        this.$imgLeft.style.width = '100%';
        this.$imgRight.style.width = '100%';

        var slider = this;

        // initialize slider and left image
        slider.resetSlider();

        // initialize event handlers
        this.initDraggerEvents();
        this.initOnResize();

    };

    // Define prototype methods
    Slider.prototype  = {
        /**
         * initialze slider location
         */
        resetSlider: function () {
            var moverWidth = this.$dragger.getBoundingClientRect().width,
                rect =  this.$container.getBoundingClientRect();
            // initialize slider and left image
            this.$dragger.style.left = rect.width / 2 - moverWidth / 2 + px;
            this.$imgLeft.style.clip = this.getRect(rect.width / 2, rect.height);
        },
        /**
         * Returns a rect css declaration from width and height
         * @param {*} w width
         * @param {*} h height
         */
        getRect: function (w, h) {
            return 'rect(0, ' + w + px+', ' + h + px +', 0)';
        },
        /**
         * Initialize dragging events for desktop and touch devices
         */
        initDraggerEvents: initDraggerEvents = function () {
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
                    this.style.left = parseInt(this.style.left) + (clientX - X) + px;
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
    
            // Attach all events
            Object.keys(handlers).forEach(function (event) {
                slider.$dragger.addEventListener(event, handlers[event]);
            });
        },
        initOnResize: function () {
            var slider = this,
                currentWindowWidth = window.outerWidth;
            
            // debounced resize handler
            var handleResize = debounce(function() {
                var newWindowWidth = window.outerWidth;
                // only re-adjust slider is wiindow width changed
                if(newWindowWidth!== currentWindowWidth){
                    slider.resetSlider();
                    currentWindowWidth = newWindowWidth;
                }
            }, 100);

            // handle browser resize with a debounce
            window.addEventListener("resize", handleResize);
        }
    };
    
    // expose Slider. You can skip this or rename it to fit your project/namespace needs
    window.Slider = Slider;
})();