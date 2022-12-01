const { ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('Electro', {
    run: async (name,arg) => {
        const result = await ipcRenderer.invoke('CALL_EXPOSED_MAIN_FN', {name, arg});
        return result;
    }
})