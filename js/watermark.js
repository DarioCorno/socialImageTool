class watermarkClass {
    constructor(imgcnv, imgctx, logocnv) {
        this.imageData = null;
        this.destctx = imgctx;

        this.logocanv = logocnv;
        this.logoctx = this.logocanv.getContext("2d");

        this.img_width = null;
        this.img_height = null;
        this.img_ratio = null;
        this.imglogo = null;
        this.logo_width = null;
        this.logo_height = null;
        this.logo_ratio = null;

        this.scale = 1;
        this.position = 'LR';
        this.alpha = 80;

        let logoTmp = JSON.parse( localStorage.getItem("logoImage"));
        if( (typeof logoTmp !== 'undefined') && (logoTmp != null) )
            this.loadLogo(logoTmp.data,false);

        return this;
    }

    setSourceImage(image) {
        let sizes = image.getSizes();
        this.img_width = sizes.img_width;
        this.img_height = sizes.img_height;
        this.img_ratio = sizes.img_ratio;

        //this.imageData = image.getImageData();

        return this;
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

    loadLogo(url,save) {
        this.imglogo = new Image();
        this.imglogo.src = url;
        this.imglogo.onload = () => {
    
            this.logo_width = this.imglogo.width;
            this.logo_height = this.imglogo.height;
            this.logo_ratio = this.logo_width / this.logo_height;
            this.logocanv.setAttribute("width",this.logo_width);
            this.logocanv.setAttribute("height", this.logo_height);
            //logocanv.style.width = (400*logo_ratio) + "px";
            //logocanv.style.height = "400px";
            this.logocanv.style.width = "100%";
            this.logocanv.style.height = "auto";
            this.logoctx.drawImage(this.imglogo, 0, 0, this.logo_width, this.logo_height);
            this.logoLoaded = true;	//defined in index.html
    
            if(save)
                this.saveLogo( this.logocanv.toDataURL("image/png") );
        }    
    }

    saveLogo(_data) {
        localStorage.setItem("logoImage", JSON.stringify({ data: _data }));
    }

    markImage() {
        const w = this.img_width * this.scale;
        const h = (this.img_width * this.scale)/ this.logo_ratio;
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
        //this.destctx.globalAlpha = 1;
        //this.destctx.putImageData(this.imageData, 0, 0);
        this.destctx.globalAlpha = this.alpha;
        this.destctx.drawImage(this.logocanv, x, y, w, h);    
    }

}



let logoinput = document.getElementById("logoinput");


let toggleLogoIcon = document.getElementById("toggleLogoIcon");
toggleLogoIcon.addEventListener('click', (e) => {
	e.preventDefault();
	logoImgContainer = document.getElementById("logoImgContainer");

	if(logoImgContainer.style.height == '0px') {
		logoImgContainer.style.height = 'auto';
	} else {
		logoImgContainer.style.height = '0px';				
	}
	return false;

});


/* function markImage() {
	const w = img_width * scale;
	const h = (img_width *scale)/ logo_ratio;
	let x, y;
	if(pos == "LR") {
		x = img_width - w;
		y = img_height - h;
	} else if (pos == "LL") {
		x = 0;
		y = img_height - h;
	} else if (pos == "TR") {
		x = img_width - w;
		y = 0;
	} else if (pos == "TL") {
		x = 0;
		y = 0;
	}
	imgctx.globalAlpha = 1;
	imgctx.putImageData(imageData, 0, 0);
	imgctx.globalAlpha = alpha;
	imgctx.drawImage(logocanv, x, y, w, h);
} */

