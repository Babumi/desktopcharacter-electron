var path = require('path');

export default class ModelFormat
{
    FileName = "" //!< ファイル名
    ModelFile = ""; //!< モデルファイル名
    PhysicsFile = ""; //!< 物理ファイル名
    TextureFiles = []; //!< テクスチャファイル名
    MotionFiles = []; //!< モーションファイル名
    
    ResourcePath = ""; //!< リソースパス
    
    constructor(mocPath) 
    {
        var fs = require('fs');
        var obj = JSON.parse(fs.readFileSync(mocPath, 'utf8'));

        //!< モデルを抜き出す
        if (obj.model == "")
        {
            console.log("Error");
        }
        this.ModelFile = obj.model;
        
        //!< リソースパス
        this.ResourcePath =  path.dirname(mocPath);
            
        // 
        // //!< 物理ファイル名を抜き出す
        // if (obj.physics == "")
        // {
        //     console.log("Error");
        // }
        // PhysicsFile = obj.physics
        // 
        // //!< テクスチャを抜き出す 1以上ない
        // if (obj.textures.length < 1) 
        // {
        //     console.log("Error tex");
        // }
        
        for (var i = 0; i < obj.textures.length; ++i)
        {
            var name = obj.textures[i]
            if (name == "")
            {
                continue;
            }
            this.TextureFiles.push(name)
        }
        console.log(this.TextureFiles);
        // //!< モーションファイルにモーション名があるものだけを入れる
        // MotionFiles = []
        // for (var key in obj.motions)
        // {
        //     if (key == "")
        //     {
        //         continue;
        //     }
        //     MotionFiles[key] = []
        //     for (var i = 0; i < obj.motions[key].length; ++i)
        //     {
        //         MotionFiles[key].push(obj.motions[key][i]["file"])
        //     }
        // }
        // 
        // console.log(ModelFile)
    };
    
    /*!
    * @breif モデルファイルのパスを取得（絶対パスに変換）
    * @return modelファイルパス
    */
    getModelFilePath()
    {
        return this.ResourcePath + "/" + this.ModelFile
    }
    
    /*!
    * @breif テクスチャのパスを取得（絶対パスに変換）
    * @param index - インデックス
    * @return textureファイルパス
    */
    getTextureFilePath(index)
    {
        return this.ResourcePath + '/' + this.TextureFiles[index]
    }
    
    /*!
    * @breif テクスチャのファイル数を取得
    * @return textureのサイズ
    */
    getTextureFileSize()
    {
        return this.TextureFiles.length
    }
}