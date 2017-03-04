import * as FileIO from '../utility/FileIO'
import Texture from './Texture'

export default class Model
{
    
    live2DModel = null; //!< Live2Dモデル
    Textures = [];
    IsCreated = false; //!< 作成関数を通った？
    IsCompleted = false; //!< 完了フラグ
    
    OpenGLDevice = null; //!< GLDevice

    ModelFormat = null; //!< ロードした時のフォーマットデータ
    
    constructor()
    {
    }
    
    create(modelFormat)
    {
        //!< 作成フォーマットの受け渡しは必ずする    
        if(modelFormat != null)
        {
            this.ModelFormat = modelFormat;
        }
        
        //!< GLDeviceがない場合は作成しない
        if(this.OpenGLDevice == null)
        {
            return;
        }

        //!< 完了してるなら通らない
        if(this.IsCreated)
        {
            return;
        }
 
        // mocファイルからLive2Dモデルのインスタンスを生成
        var buf = FileIO.loadFile(this.ModelFormat.getModelFilePath());
        this.live2DModel = window.Live2DModelWebGL.loadModel(buf);

        //var animmang = new window.MotionQueueManager();
        //console.log(animmang)
        
        //!< テクスチャを作成
        for(var i = 0; i < this.ModelFormat.getTextureFileSize(); i++)
        {
            this.Textures[ i ] = new Texture(this.OpenGLDevice);
            this.Textures[ i ].create(this.ModelFormat.getTextureFilePath(i), this.live2DModel.isPremultipliedAlpha());
        }
        
        this.IsCreated = true;
        console.log("create finish")
    }

    drawSetup()
    {
        //!< create後に実行される関数
        if(this.IsCompleted)
        {    
            // 画像からWebGLテクスチャを生成し、モデルに登録
            for(var i = 0; i < this.ModelFormat.getTextureFileSize(); i++)
            {
                this.live2DModel.setTexture(i, this.Textures[ i ].getObject()); //モデルにテクスチャをセット
            }
    
            // 表示位置を指定するための行列を定義する
            var s = 2.0 / this.live2DModel.getCanvasWidth(); //canvasの横幅を-1..1区間に収める
            var matrix4x4 = [
                s, 0, 0, 0,
                0,-s, 0, 0,
                0, 0, 1, 0,
               -1, 1, 0, 1
            ];
            this.live2DModel.setMatrix(matrix4x4);
        }
    }

    setOpenGLDevice(glDevice)
    {
        this.OpenGLDevice = glDevice;
    }

    isCompleted()
    {
        if(!this.live2DModel){
            return false;
        }
        if(!this.IsCompleted)
        {
            for(var i = 0; i < this.ModelFormat.getTextureFileSize(); i++)
            {
                this.IsCompleted = this.Textures[ i ].isCompleted();
                if(this.IsCompleted){
                    break;
                }
            }
        }
        return this.IsCompleted;
    }

    initialize()
    {
        this.live2DModel = null;
        this.Textures = [];
        this.IsCompleted = false;
        this.ModelFormat = null;
        this.IsCreated = false;
    }

    getModel()
    {
        return this.live2DModel;
    }
}