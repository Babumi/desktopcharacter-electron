var glob = require('glob');

export function loadFile(path) 
{
    var fs = require('fs');
    var buf = fs.readFileSync(path);
    var arrayBuf = (function ( buffer )
    {
        var ab = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(ab);
        for(var i = 0; i < buffer.length; ++i){
            view[i] = buffer[i];
        }
        return ab;
    })( buf );
    return arrayBuf;
}

export function fetchFileList(pattern, cb) 
{
    glob(pattern, function (err, matches) {
        if(err) {
            cb(err, null);
            return;
        }
        cb(null, matches);
    });
}

