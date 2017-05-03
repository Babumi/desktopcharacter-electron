'use strict'
const electron = require('electron')

export default class ExtenstionEvent
{
  constructor()
  {
    let dragFlag = false;
    let prevX = 0, prevY = 0;
  }

  activate()
  {
    window.addEventListener("mousemove",
      function (e) {
        
        var mx = e.screenX;
        var my = e.screenY;
        if (this.dragFlag && this.prevX && this.prevY) {
          var dx = mx - this.prevX;
          var dy = my - this.prevY;
          var response = electron.ipcRenderer.sendSync('window_drag', { x: dx, y: dy });
          this.prevX = mx;
          this.prevY = my;
        }
      } , false);

    window.addEventListener("mousedown",
      function (e) {
        this.dragFlag = true;
        this.prevX = e.screenX;
        this.prevY = e.screenY;
      }, false);

    window.addEventListener("mouseup",
      function (e) {
        this.dragFlag = false;
      }, false);
  }
}