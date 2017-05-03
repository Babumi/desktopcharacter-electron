/**
*  Sample.js
*
*  You can modify and use this source freely
*  only for the development of application related Live2D.
*
*  (c) Live2D Inc. All rights reserved.
*/
require('../live2d/lib/live2d.min.js')
const manager = window.ActionPacketManager;

export default class Canvas
{
    RequestID = null; //!< 更新リクエスト
    GLView = null;  //!< レンダリングビュー
    OpenGLDevice = null; //!< OpenGLのデバイス
    
    constructor() {
        // Live2Dの初期化
        window.Live2D.init();
    
        // canvasオブジェクトを取得
        var glView = document.getElementById("glcanvas");
    
        // コンテキストを失ったとき
        glView.addEventListener("webglcontextlost", function(e) {    
            var cancelAnimationFrame =
                window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame;
            cancelAnimationFrame(this.RequestID); //アニメーションを停止
    
            e.preventDefault();
        }, false);
    
        // コンテキストが復元されたとき
        glView.addEventListener("webglcontextrestored" , function(e){
            this.initialize(glView);
        }, false);

        this.initialize(glView)

    };

    initialize(glView)
    {
        this.GLView = glView;
    
        this.OpenGLDevice = this.getWebGLContext(this.GLView);
        if (!this.OpenGLDevice) {
            return;
        }
    
        //!< OpenGLのコンテキストをセット
        window.Live2D.setGL(this.OpenGLDevice);
        manager.setGLDevice(this.OpenGLDevice);

        //!< 更新処理
        this.tick();
    }
        
    tick ()
    {
        var gl = this.OpenGLDevice
        
        //!< レンダリングターゲットをクリアー
        gl.clearColor( 0.0 , 0.0 , 0.0 , 0.0 );
        gl.clear(gl.COLOR_BUFFER_BIT);

        //!< パケットから描画処理をしていく
        var packet = manager.getPacket(0);
        if(packet != null)
        {
            //!< 開始
            packet.begin()
            //!< 描画
            packet.drawModel();
            //!< 終了
            packet.finish();
        }

        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
            this.RequestID = requestAnimationFrame( this.tick.bind(this), this.GLView );// 一定時間後に自身を呼び出す
    }
    
    /*
    * WebGLのコンテキストを取得する
    */
    getWebGLContext (glView)
    {
        var NAMES = [ "webgl" , "experimental-webgl" , "webkit-3d" , "moz-webgl"];
    
        var param = {
            alpha : true,
            premultipliedAlpha : true
        };
    
        for( var i = 0; i < NAMES.length; i++ ){
            try{
                var ctx = glView.getContext( NAMES[i], param );
                if( ctx ) return ctx;
            }
            catch(e){}
        }
        return null;
    };
}

