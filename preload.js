const { contextBridge } = require('electron')


exec('$myshell = New-Object -com "Wscript.Shell', {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
    
    console.log(error,stdout,stderr);
})
press = () => exec('$myshell.SendKeys([char]179)', {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
    console.log(error,stdout,stderr);
})
//TODO: fix pause and play to be media specific
contextBridge.exposeInMainWorld('mediaUtil', {
  play : () => press(),
  pause : () => press()
})