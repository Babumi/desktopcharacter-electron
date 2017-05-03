<template>
    <body>
        <div id="app" @click.shift="openMenu">
            <canvas id="glcanvas" width = "512px" height="512px"></canvas>
            <ModalMenu></ModalMenu>
            <button @click="WindowCreate()">Button</button>             
        </div>
    </body>
</template>

<script>

import Vue from 'vue'
import ModalMenu from './components/ModalMenu'
import { mapActions, mapGetters } from 'vuex'
import * as FileIO from './extension/utility/FileIO'
import ActionPacket from './extension/live2dframework/ActionCommand.js'
import ModelFormat from './extension/live2dframework/ModelFormat.js'
import Model from './extension/live2dframework/Model.js'
import Canvas from './extension/live2dframework/Canvas.js'

const electron = require('electron')
const app = electron.remote.app
const contents = electron.remote.getCurrentWebContents()

var PacketManager = window.ActionPacketManager

export default {
    name: 'app',
    components: {
        ModalMenu
    },
    computed: {
        ...mapGetters([
            'AssetPath'
        ]),
        getAssetPath() {
            return this.AssetPath;
        }
    },
    mounted () {
        console.log(this.$store._actions)
        console.log(this.$store._mutations)
        this.initialize();
    },
    methods: {
        ...mapActions([
            'NextSequence',
            'AddMenu',
            'WindowCreate'
        ]),
        openMenu: function(e) {
            this.NextSequence({ from: 'Main', to: 'Menu' })
        },
        initialize: function() {
            //!< メニューの作成
            var menuData = 
            [
                {
                    label: "設定",
                    callback: function(data){
                        data.openMenu();
                    }.bind(this, this),
                },
                {
                    label: "終了",
                    callback: function(data){
                        data.quit();
                    }.bind(this, app),
                },
                {
                    label: "DevTools",
                    callback: function(data){
                        data.openDevTools();
                    }.bind(this, contents),             
                },
                {
                    label: "Reload",
                    callback: function(data){
                        data.reload()
                    }.bind(this, contents),
                }
            ];
            for(var item in menuData) {
                this.AddMenu( menuData[item] )
            }
            
            FileIO.fetchFileList(this.getAssetPath + '/**/*.model.json',
            function(err, matches) 
            {
                if(!err)
                {
                    console.log(matches.join());
                    var model = new Model();
                    model.create(new ModelFormat(matches.join()));
                    var packet = new ActionPacket();
                    packet.setModel(model);
                    PacketManager.pushPacket(packet)
                    return;
                }
            });
            var canvas = new Canvas();
        },
    }
};



</script>
