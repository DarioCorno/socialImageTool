class imageClass {
    constructor(cropSrcImg, destctx, imgcanv) {
        this.img = cropSrcImg;
        this.imgCropper = null;
        this.imageData = false;
        this.imgcanv = imgcanv;
        this.destctx = destctx;
        return this;
    }

    loadFileFromURL(url) {
        this.img.src = url;
        this.img.onload = () => {
    
            this.img_width = this.img.width;
            this.img_height = this.img.height;
            this.img_ratio = this.img_width / this.img_height;
            this.imgcanv.setAttribute("width",this.img_width);
            this.imgcanv.setAttribute("height", this.img_height);
            this.imgcanv.style.width = "100%";
            this.imgcanv.style.height = "auto";
            this.destctx.drawImage(this.img, 0, 0, this.img_width, this.img_height);
            this.imageData = this.destctx.getImageData(0,0,this.img_width,this.img_height);
            this.imageLoaded = true;
            if(this.imgCropper != null)
                this.imgCropper.destroy();

            this.imgCropper = new Croppr( this.img);
        }    
    }

    getSizes() {
        return {
            img_width: this.img_width,
            img_height: this.img_height,
            img_ratio: this.img_ratio
        }
    }

    getImageData() {
        return this.imageData;
    }

    doCrop() {
        var crop_values = this.imgCropper.getValue('real');
        let cnv = document.createElement('canvas');
        cnv.setAttribute("width",this.img.width);
        cnv.setAttribute("height", this.img.height);
        let cnvc = cnv.getContext('2d');
        cnvc.drawImage(this.img,0,0)
        this.imageData = cnvc.getImageData(crop_values.x, crop_values.y, crop_values.width, crop_values.height);
    
        this.img_width = crop_values.width;
        this.img_height = crop_values.height;
        this.img_ratio = this.img_width / this.img_height;
        this.imgcanv.setAttribute("width",this.img_width);
        this.imgcanv.setAttribute("height", this.img_height);
        this.imgcanv.style.width = "100%";
        this.imgcanv.style.height = "auto";
        this.destctx.putImageData(this.imageData, 0, 0);
        this.imageLoaded = true;

        return this.getSizes();
    }

    paint() {
        this.destctx.putImageData(this.imageData, 0, 0);
    }
}


/* imageinput.addEventListener('change', (e) => {
	var myURL = window.webkitURL || window.URL;
	var url = myURL.createObjectURL(e.target.files[0]);
	//img = new Image();
	img.src = url;
	img.onload = function() {

		img_width = img.width;
		img_height = img.height;
		img_ratio = img_width / img_height;
		imgcanv.setAttribute("width",img_width);
		imgcanv.setAttribute("height", img_height);
		//imgcanv.style.width = (400*img_ratio) + "px";
		//imgcanv.style.height = "400px";
		imgcanv.style.width = "100%";
		imgcanv.style.height = "auto";
		imgctx.drawImage(img, 0, 0, img_width, img_height);
		imageData = imgctx.getImageData(0,0,img_width,img_height);
		imageLoaded = true;
		img_crop = new Croppr(img);
	}
}) */

//cropBtn.addEventListener('click', (e) => {
//	e.preventDefault();
//	var crop_data = img_crop.getValue('real');
//	cropImage(crop_data);
//	updateResult();
//})

function cropImage(data) {
	let cnv = document.createElement('canvas');
	cnv.setAttribute("width",img.width);
	cnv.setAttribute("height", img.height);
	let cnvc = cnv.getContext('2d');
	cnvc.drawImage(img,0,0)
	imageData = cnvc.getImageData(data.x, data.y, data.width, data.height);

	img_width = data.width;
	img_height = data.height;
	img_ratio = img_width / img_height;
	imgcanv.setAttribute("width",img_width);
	imgcanv.setAttribute("height", img_height);
	imgcanv.style.width = "100%";
	imgcanv.style.height = "auto";
	imgctx.putImageData(imageData, 0, 0);
	imageLoaded = true;
}