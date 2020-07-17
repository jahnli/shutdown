const child_process = require('child_process');
const {ipcMain,BrowserWindow,app} = require('electron');
const win  = BrowserWindow.getFocusedWindow();
ipcMain.on('start',(event,action,time)=>{
  child_process.exec(`shutdown -${action} -t ${time}`,(err,stdout, stderr)=>{})
})

ipcMain.on('cancel',(event,action,time)=>{
  child_process.exec('shutdown -a',(err,stdout, stderr)=>{})
})

ipcMain.on('handle', (event, arg) => {
  child_process.exec('shutdown -a',(err,stdout, stderr)=>{})
  if(arg == 'quit'){
    win.destroy();
    app.quit();
  }
})
