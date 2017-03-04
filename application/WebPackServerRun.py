import os

path = os.path.dirname(os.path.abspath(__file__))

exe = "node "
filePath = path + "\\node_modules\\webpack-dev-server\\bin\\webpack-dev-server.js "
args = "--inline --hot --colors --port 9080 --content-base app/dist"

os.system(exe + filePath + args)


