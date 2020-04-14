"use strict";

class layerClass {
    constructor(imgcnv, imgctx, layercnv) {
        //this.imageData = null;
        this.destctx = imgctx;

        this.layercanv = layercnv;
        this.layerctx = this.layercanv.getContext("2d");

        this.img_width = null;
        this.img_height = null;
        this.img_ratio = null;
        this.imglayer = null;
        this.layer_width = null;
        this.layer_height = null;
        this.layer_ratio = null;

        this.layerLoaded = false;
        this.url = "";
        this.doneResize = false;

        this.scale = 1;
        this.position = 'LR';
        this.alpha = 80;

        return this;
    }

    setSourceImageData(image) {
        let sizes = image.getSizes();
        this.img_width = sizes.img_width;
        this.img_height = sizes.img_height;
        this.img_ratio = sizes.img_ratio;

        this.resizeLayer();

        return this;
    }

    resizeLayer() {
        if(this.layerLoaded == false) 
            return false;

        if(this.doneResize == true)
            return false;

        let maxw  =this.img_width;
        let maxh = this.img_height;

        //resize the layer so it fits inside the image canvas
        var ratioX = maxw / this.layer_width;
        var ratioY = maxh / this.layer_height;
        var ratio = Math.min(ratioX, ratioY);
    
        var newWidth = this.layer_width * ratio;
        var newHeight = this.layer_height * ratio;

        this.layer_width = Math.round(newWidth);
        this.layer_height = Math.round(newHeight);

        this.layer_ratio = this.layer_width / this.layer_height;

        let tmpCanv = document.createElement("canvas");
        let tmpCtx = tmpCanv.getContext("2d");
        tmpCanv.setAttribute("width", this.layer_width);
        tmpCanv.setAttribute("height", this.layer_height);
        tmpCanv.style.width = "100%";
        tmpCanv.style.height = "auto";
        tmpCtx.drawImage(this.layercanv, 0, 0, this.layer_width, this.layer_height);


        this.layercanv.setAttribute("width",this.layer_width);
        this.layercanv.setAttribute("height", this.layer_height);
        this.layercanv.style.width = "100%";
        this.layercanv.style.height = "auto";
        this.layerctx.drawImage(tmpCanv, 0, 0, this.layer_width, this.layer_height);

        tmpCanv = null;
        this.doneResize = true;
    }

    setScale(val) {
        this.scale = (val / 100);
        return this;
    }

    setPosition(val) {
        this.position = val;
        return this;
    }

    setAlpha(val) {
        this.alpha = (val / 100);
        return this;
    }

    loadLayer(url) {
        this.imgloadlayer = new Image();
        this.imgloadlayer.src = url;
        this.url = url;
        this.imgloadlayer.onload = () => {
            
            this.layer_width = this.imgloadlayer.width;
            this.layer_height = this.imgloadlayer.height;
            this.layer_ratio = this.layer_width / this.layer_height;
            this.layercanv.setAttribute("width",this.layer_width);
            this.layercanv.setAttribute("height", this.layer_height);
            this.layercanv.style.width = "100%";
            this.layercanv.style.height = "auto";
            this.layerctx.drawImage(this.imgloadlayer, 0, 0, this.layer_width, this.layer_height);
            this.layerLoaded = true;	//defined in index.html 
            this.doneResize = false;   
        }    
    }

    rebuild() {
        this.doneResize = false;
        this.loadLayer(this.url);
    }

    markImage() {
        if(this.layerLoaded == false)
            return false;
            let h = 0;
            let w = 0;
            if(this.layer_width > this.layer_height) {
                w = this.img_width * this.scale;
                h = (this.img_width * this.scale)/ this.layer_ratio;
            } else {
                w = this.img_height * this.scale;
                h = (this.img_height * this.scale) * this.layer_ratio;
            }
            let x, y;
            let pos = this.position;
            if(pos == "LR") {
                x = this.img_width - w;
                y = this.img_height - h;
            } else if (pos == "LL") {
                x = 0;
                y = this.img_height - h;
            } else if (pos == "TR") {
                x = this.img_width - w;
                y = 0;
            } else if (pos == "TL") {
                x = 0;
                y = 0;
            }
            this.destctx.globalAlpha = this.alpha;
            this.destctx.drawImage(this.layercanv, x, y, w, h);    
        }
}

