export default class ActionPacket
{
       
    Model = null;

    constructor() 
    {

    }

    begin()
    {
        //!< 描画準備が整っているか確認
        if(!this.Model.isCompleted())
        {
            //!< もしかしてまだ作成されてない？
            this.Model.create();
            return;
        }
        //!< 描画セットアップ
        this.Model.drawSetup();
    }

    finish()
    {

    }

    drawModel()
    {
        
        //!< モデルを取り出す
        var model = this.Model.getModel();

        //!< 個別のパラメーターを更新
        var t = UtSystem.getUserTimeMSec() * 0.001 * 2 * Math.PI; //1秒ごとに2π(1周期)増える
        var cycle = 3.0; //パラメータが一周する時間(秒)
        // PARAM_ANGLE_Xのパラメータが[cycle]秒ごとに-30から30まで変化する
        model.setParamFloat("PARAM_ANGLE_X", 30 * Math.sin(t/cycle));
        model.setParamFloat("PARAM_EYE_R_OPEN", 1 * Math.sin(t/cycle));
        model.setParamFloat("PARAM_EYE_L_OPEN", 1 * Math.sin(t/cycle));


        //!< アニメーションを更新

        //!< パラメーターの反映
        model.update();
        
        //!< 描画をする
        model.draw();
    }

    /**
     * @breif モデルをセットする 
     * @param Live2Dのモデル
     */
    setModel(model)
    {
        this.Model = model;
    }

    /**
     * @brief マウスに目線追尾させるかどうか
     * @param 有効化
     * @param マウス座標
     * @note 目線追尾は自前で計算しモデルにセットします
     */
    setEyeTrackingToMouse(isEnable, mousePosition)
    {

    }

    setAnimation(isForce, animation)
    {

    }

    setGLDevice(glDevice)
    {
        if(this.isModel())
        {
            this.Model.setOpenGLDevice(glDevice);
        }
    }

    isModel()
    {
        if(this.Model == null){
            return false;
        }
        return true;
    }
};


(function () {
    
    function ActionPacketManager() {}
    
    //!< パケットリスト
    ActionPacketManager.PacketList = [];
    ActionPacketManager.OpenGLDevice = null;

    /**
     * @brief アクションパケットを追加する
     * @param packet - アクションパケット
     */
    ActionPacketManager.pushPacket = function( packet ) 
    {
        if( packet instanceof ActionPacket && packet.isModel())
        {
            packet.setGLDevice(ActionPacketManager.OpenGLDevice);
            ActionPacketManager.PacketList.push(packet)
        }
    }

    /**
     * @breif アクションパケットを取得
     * @param PacketList - パケットリスト
     */
    ActionPacketManager.getPacket = function(index)
    {
        return ActionPacketManager.PacketList[0];
    }

    /**
     * @breif アクションパケットを全削除
     */
    ActionPacketManager.clearPacketList = function()
    {
        ActionPacketManager.PacketList = [];
    }

    ActionPacketManager.size = function()
    {
        return ActionPacketManager.PacketList.length;
    }

    ActionPacketManager.setGLDevice = function(glDevice)
    {
        ActionPacketManager.OpenGLDevice = glDevice;
    }

    window.ActionPacketManager = ActionPacketManager;
})();