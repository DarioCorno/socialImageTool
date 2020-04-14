class textWriterClass {
    constructor(destcanv, destctx) {
        this.destcanv = destcanv;
        this.destctx = destctx;
    }

    writeString(text, params) {
        if(text.length == 0)
            return false;
            
        this.destctx.fillStyle = getComputedStyle( fontCol ).backgroundColor;
        this.destctx.globalAlpha = 1;

        CanvasTextWrapper(this.destcanv,text, {
            font: params.fontStr,
            textAlign: 'center',
            verticalAlign: 'middle',
            strokeText: params.stroke,
            strokeCol: params.strokeCol,
            shadow: params.shadow,
            paddingX: parseInt(params.padding),
            paddingY: parseInt(params.padding),
            spacing: parseInt(params.lineHeight),
            offsetx: params.offsetX,
            offsety: params.offsetY,
            lineBreak: 'auto'
        });	
    }
}


