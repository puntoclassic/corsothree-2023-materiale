const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
    console.log(path.join(
        __dirname,
        'dist/livecode_16/index.html'));
    win = new BrowserWindow({ width: 900, height: 670 })
    win.loadURL(url.format({
        pathname: path.join(
            __dirname,
            'dist/livecode_16/index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', onReady);
