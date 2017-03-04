'use strict'

var dragFlag = false;
var prevX, prevY;

var ipc = require('electron').ipcRenderer

window.addEventListener("mousemove",
  function (e) {
    var mx = e.screenX;
    var my = e.screenY;
    if (dragFlag && prevX && prevY) {
      var dx = mx - prevX;
      var dy = my - prevY;

      var response = ipc.sendSync('window_drag', { x: dx, y: dy });
      prevX = mx;
      prevY = my;
    }
  }
  , false);

window.addEventListener("mousedown",
  function (e) {
    dragFlag = true;
    prevX = e.screenX;
    prevY = e.screenY;
  }
  , false);

window.addEventListener("mouseup",

  function (e) {
    dragFlag = false;
  }
  , false);