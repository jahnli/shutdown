const {app,Menu, BrowserWindow ,Tray }  = require('electron')
const path = require('path');
let tray;
app.whenReady().then(() => {
  const win  = BrowserWindow.getFocusedWindow();
  tray = new Tray(path.join(__static,'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开主界面', click:show},
    { label: '退出程序',  click: () => {
        win.show();
        win.webContents.send('chackStatus')
      }},
  ])

  tray.setToolTip('远程关机')
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    win.show()
  })
  function show() {
    win.show()
  }
})

