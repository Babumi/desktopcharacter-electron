import * as FileIO from '../utility/FileIO'

export default class Texture
{
    ImageObject = null; //!< JavaScriptでのImage
    TextureObject = null; //!< OpenGLのテクスチャオブジェクト
    OpenGLDevice = null; //!< GLDevice
    IsCompleted = false; //!< 完了フラグ

    constructor(glDevice)
    {
        this.OpenGLDevice = glDevice;
    }
    
    create(filePath, isPremultipliedAlpha)
    {
        (function ( file, isPremultipliedAlpha, obj )
        {
            var fr = new FileReader();
            fr.onload = function(evt) 
            {
                obj.ImageObject = new Image();
                obj.ImageObject.src = evt.target.result;
                obj.ImageObject.onload = function() {
                    console.log("Image load complite!");
                    //!< GL用のテクスチャを作成
                    obj.createGLTexture(isPremultipliedAlpha);
                    //!< 完了した
                    obj.IsCompleted = true;
                }
                obj.ImageObject.onerror = function() {
                    console.log("Failed to load image");
                }
            }
            //!< ファイルを読み込んでbyte列へ変換
            var buf = FileIO.loadFile(file);
            //!< blobを介してURL化させる そうするとImageとして読み込める
            var blob = new Blob([buf], { type: "image/png" });
            fr.readAsDataURL(blob);
        })( filePath, isPremultipliedAlpha, this );
    }
    
    createGLTexture(isPremultipliedAlpha)
    {
        var gl = this.OpenGLDevice
        this.TextureObject = gl.createTexture();
        if ( !this.TextureObject ) { return; }
    
        // 乗算済アルファテクスチャ以外の場合
        if(isPremultipliedAlpha == false)
        {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D , this.TextureObject);
        gl.texImage2D(gl.TEXTURE_2D , 0 , gl.RGBA , gl.RGBA , gl.UNSIGNED_BYTE , this.ImageObject);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D , null);
    }

    getObject()
    {
        return this.TextureObject;
    }
    
    isCompleted()
    {
        return this.IsCompleted;
    }
};
