const { app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')
let winMain, winPop;
const createWindow = () => {
    if (winMain?.isVisible()) winMain.show()
    else {
        winMain = new BrowserWindow({
            width: 1000,
            height: 600,
            icon: 'favicon.ico',
            autoHideMenuBar: true,
            tranparent: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
        winMain.loadFile('public/index.html')
        winMain.on('closed', function () {

            winMain = null
            winPop=null;
          })
    }
}


const createPopup = () => {
    if (winPop?.isVisible()) winPop.show()
    else {
        winPop = new BrowserWindow({
            width: 280,
            height: 260,
            icon: 'favicon.ico',
            autoHideMenuBar: true,
            tranparent: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
        winPop.loadFile('public/popup.html')
        winPop.on('close', () => {
            winPop = null;
          });
        
            // set to null
          winPop.on('closed', () => {
            winPop = null;
          });
    }
}

app.whenReady().then(() => {
    createWindow()
    tray = new Tray('favicon.ico')
      
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
])


  


const {GlobalSystemMediaTransportControlsSessionManager} = require('@nodert-win10-21h1/windows.media.control');

const util = require('util');

const reload = util.promisify(GlobalSystemMediaTransportControlsSessionManager.requestAsync)

let sessions = [];

async function reloadSessions() {
    const _sessions = await reload()
    const current_sessions = _sessions.getSessions();
    sessions = [];
    for (let i = 0; i < current_sessions.length; i++) {
        sessions[i] = current_sessions[i];
    }
    return sessions.map(x => x.sourceAppUserModelId);
}

mainFns = {
    reloadSessions: reloadSessions,
    play: (id) => {
        if (id<0 || id >= sessions.length) {
            return false
        }
        sessions[id].tryPlayAsync(() => { })
    },
    pause: (id) => {
        if (id<0 || id >= sessions.length) {
            return false
        }
        sessions[id].tryPauseAsync(() => { })
    },
    _normalId: -1,
    _breakId: -2,
    playNormal: async () => await mainFns.play(mainFns._normalId),
    pauseNormal: async () => await mainFns.pause(mainFns._normalId),
    playBreak: async () => await mainFns.play(mainFns._breakId),
    pauseBreak: async () => await mainFns.pause(mainFns._breakId),
    setNormal: (i) => {mainFns._normalId = i},
    setBreak: (i) => {mainFns._breakId = i},
    getNormal: () => {return mainFns._normalId},
    getBreak: () => {return mainFns._breakId},
    openUI: createWindow,
    openPopup: createPopup
}

//electron workarounds for 'security', adapted from web source
ipcMain.handle('CALL_EXPOSED_MAIN_FN', async (_, data) => {
    const result = await mainFns[data.name](data.arg)
    return result
  }
  )