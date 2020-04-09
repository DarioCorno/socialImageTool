"use strict";

var vApp = new Vue({
    el: '#vapp-container',
    data: {
        curVisiblePanel: 'image',

        imageLoaded: false,
        logoLoaded: false,

        imgcanv: null,
        imgctx: null,

        logocanv: null,

        sliderPicker: null,
        showColorPicker: false,
        curPickerElem: null,
        curColor: 'rgba(255,255,255,1)',

        textOffsetX : 0,
        textOffsetY: 0,
        fontSize: 60,
        padding: 40,
        color: 'rgba(256,256,256,1)',
        stroke: false,
        strokeColor: 'rgba(0,0,0,1)',
        shadow: false,
        lineHeight: 0,
        textToWrite: '',

        scale: 30,
        position: 'LR',
        opacity: 80,
        fontIndex : 2,
        old_fonts : [
            "Georgia",
            "Palatino Linotype",
            "Book Antiqua",
            "Palatino",
            "Times New Roman",
            "Times",
            "Arial", 
            "Helvetica",
            "Arial Black",
            "Gadget",
            "Comic Sans MS",
            "Impact", 
            "Charcoal",
            "Lucida Sans Unicode",
            "Lucida Grande",
            "Tahoma", 
            "Trebuchet MS",
            "Helvetica",
            "Verdana", 
            "Geneva",
            "Courier New",
            "Courier",
            "Lucida Console",
            "Monaco"
        ],
        fonts : [
            { name: 'Roboto', loaded: false },
            { name: 'Gotu', loaded: false },
            { name: 'Open Sans', loaded: false },
            { name: 'Lato', loaded: false },
            { name: 'Montserrat', loaded: false },
            { name: 'Oswald', loaded: false },
            { name: 'Roboto Mono', loaded: false },
            { name: 'Poppins', loaded: false },
            { name: 'Roboto Slab', loaded: false },
            { name: 'Girassol', loaded: false }
        ]
    },

    watermark: null,
    image: null,

    mounted: function() {
        this.imgcanv = this.$refs.imgcanv;
        this.imgctx = this.imgcanv.getContext("2d");
        this.logocanv = this.$refs.logocanv;
        this.colPickContainer = this.$refs.colPickContainer;
        this.sliderPicker = new iro.ColorPicker("#colorPicker", {
            width: 300,
            color: "rgb(255, 0, 0)",
            borderWidth: 1,
            borderColor: "#fff",
            layout: [
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'hue'
                    }
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'saturation'
                    }
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'value'
                    }
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'alpha'
                    }
                },
            ]
        });

        this.watermark = new watermarkClass(this.imgcanv, this.imgctx, this.logocanv);
        this.image = new imageClass(this.$refs.cropSrcImg, this.imgctx, this.imgcanv)
        this.textWriter = new textWriterClass(this.imgcanv, this.imgctx);

    },
    methods: {
        loadFont(_okCallback, _errCallback) {
            if( this.fonts[ this.fontIndex].loaded == false) {
                let neededFonts = [];
                neededFonts.push( this.fonts[ this.fontIndex].name );
                this.fonts[ this.fontIndex].loaded = true;
                WebFont.load({
                    google: {
                        families:  neededFonts
                    },
                    active: _okCallback,
                    inactive: _errCallback,
                    fontactive: _okCallback,
                    fontinactive: _errCallback,
                    classes:false
                });    
            } else {
                _okCallback();
            }
        },
        updateResult() {
            if(this.image.imageLoaded) {
                if(this.watermark.logoLoaded) {
                    this.watermark.setSourceImage( this.image );
                    this.watermark.setScale( this.scale ).setPosition( this.position).setAlpha( this.opacity );
                    this.watermark.markImage();
                }

                this.loadFont( () => {
                    this.strokeCol = getComputedStyle(this.$refs.fontStrokeCol).backgroundColor;

                    let params = {
                        fontStr: this.fontSize + 'px ' + this.fonts[ this.fontIndex].name,
                        stroke: this.stroke,
                        strokeCol: this.strokeCol,
                        shadow: this.shadow,
                        padding: parseInt(this.padding),
                        lineHeight: parseInt(this.lineHeight),
                        offsetX : this.textOffsetX,
                        offsetY : this.textOffsetY                            
                    }
                    this.textWriter.writeString(this.textToWrite, params);
    
                }, () => {
                    console.log("Cannot laod font.")
                });
            }
        },

        pickColor(e) {
            this.curPickerElem = e.target;
            this.curColor = getComputedStyle( e.target ).backgroundColor;
            this.sliderPicker.color.rgbaString = this.curColor;
            this.showColorPicker = true;
        },

        okColorPick() {
            this.showColorPicker = false;
            this.curPickerElem.style.backgroundColor = this.sliderPicker.color.rgbaString;
            this.updateResult();
        },

        cancelColorPick() {
            this.showColorPicker = false;
        },
        handleImageInputClick(evt) {
            var myURL = window.webkitURL || window.URL;
            var url = myURL.createObjectURL(evt.target.files[0]);
            this.image.loadFileFromURL(url);     
        },
        handleLogoFileInput(evt) {
            var URL = window.webkitURL || window.URL;
            var url = URL.createObjectURL(evt.target.files[0]);
            this.watermark.loadLogo(url, true);
        },
        handleCropClick(evt) {
            let new_values =  this.image.doCrop();
            this.watermark.setSourceImage( this.image );
            this.updateResult();
        },
        handleMouseDown(evt) {
            let canvas = evt.target;
            let rect = canvas.getBoundingClientRect(), // abs. size of element
		    scaleX = this.imgcanv.width / rect.width,    // relationship bitmap vs. element for X
		    scaleY = this.imgcanv.height / rect.height;  // relationship bitmap vs. element for Y

		    let curX = (evt.clientX - rect.left);
		    let curY = (evt.clientY - rect.top);
		    let offCenterX = curX - (rect.width / 2);
		    let offCenterY = curY - (rect.height / 2);
			let mousePos =  {
		    	x: curX * scaleX,   // scale mouse coordinates after they have
		    	y: curY * scaleY,     // been adjusted to be relative to element
		    	offCenterX: offCenterX * scaleX,
		    	offCenterY: offCenterY * scaleY
		  	};
            this.textOffsetX = mousePos.offCenterX;
            this.textOffsetY = mousePos.offCenterY;
            this.updateResult();
        }
    }
})