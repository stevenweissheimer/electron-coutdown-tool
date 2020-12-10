// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

require('electron-reload')(__dirname);

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 400,
      height: 670,
      resizable: false,
      titleBarStyle: 'hidden',
      frame: true,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    })

  // and load the index.html of the app.
  mainWindow.loadFile('build/index.html')

  // hide top menu
  mainWindow.setMenuBarVisibility(false),

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.