// Modules to control application life and create native browser window
const {app, Menu, Tray, BrowserWindow, globalShortcut} = require('electron')
const _ = require('lodash');
const robot = require('robotjs');
const Promise = require('bluebird');
// const ioHook = require('iohook');

// Imports astrokey constants
const myWorkflows = require('../workflows');
const triggers = require('../triggers');

// // // //

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Only allow one open window at a time
  if (mainWindow) {
    mainWindow.focus()
    return
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  })

  // and load the index.html of the app.
  mainWindow.loadFile('client/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// // // //

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// // // //

let CURRENTLY_EXECUTING = false;
let IS_KEY_UP = true;

// start ioHook
// ioHook.start();
// ioHook.setDebug(true); // Uncomment this line for see all debug information from iohook

// Key constants
const EXECUTION_TIMEOUT = 500
// const CTRL = 29;
// const ALT = 56;
// const TAB = 15;
// const F7 = 65;

function typeString (string) {
  // console.log('Start typestring...')
  return new Promise((resolve, reject) => {
    // console.log('finish typestring.')
    robot.typeString(string)
    return resolve()
  })
}

function keyTap (key) {
  // console.log('Start keytap...')
  return new Promise((resolve, reject) => {
    // console.log('finish keytap.')
    robot.keyTap(key)
    return resolve()
  })
}

function keyUp (shortcut) {
  return new Promise((resolve, reject) => {
    // console.log('finish keytap.')
    // ioHook.registerShortcut(shortcut, (keys) => {
    //   console.log('Shortcut KEY UP WOW pressed with keys:', keys);
    //   // return resolve()
    //   // console.log('EXECUTING WORKFLOW')
    // });
    let interval;
    interval = setInterval(() => {
      // console.log('CHECKING INTERVAL')
      if (IS_KEY_UP) {
        clearInterval(interval)
        return resolve()
      }
    }, 250)
  })
  // Registers shortcut
}

function delay (timeout) {
  // console.log('Start delay...')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // console.log('Delay finished.')
      return resolve()
    }, timeout)
  })
}

function runMacro (macro) {
  // console.log('Start delay...')
  return new Promise((resolve, reject) => {
    _.each(macro, (step) => {
      console.log(step)
      if (step.position === 'KEY_DOWN') {
        robot.keyToggle(step.key, 'down')
      } else if (step.position === 'KEY_UP') {
        robot.keyToggle(step.key, 'up')
      } else {
        robot.keyTap(step.key)
      }
    })
    return resolve()
    // setTimeout(() => {
    //   // console.log('Delay finished.')
    // }, timeout)
  })
}

// // // //

function executeWorkflow ({ workflow, trigger }) {
  // NOTE - each step is asynchonous - this should be considered for things like delays
  return Promise.each(workflow.steps, (step) => {
    if (step.type === 'TEXT') {
      return typeString(step.value)
    } else if (step.type === 'DELAY') {
      return delay(step.value)
    } else if (step.type === 'KEY') {
      return keyTap(step.value)
    } else if (step.type === 'KEY_UP') {
      return keyUp(trigger.shortcut)
    } else if (step.type === 'MACRO') {
      return runMacro(step.value)
    }
  })
}

// // // //

app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister('CommandOrControl+X')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

// app.on('ready', () => {})
// console.log('ON READY')
// Register a 'CommandOrControl+X' shortcut listener.
// const ret = globalShortcut.register('CommandOrControl+X', () => {
//   console.log('CommandOrControl+X is pressed')
// })

// if (!ret) {
//   console.log('registration failed')
// }

// Check whether a shortcut is registered.

// // // //

// Setup keybindings
// TODO - break everything below out into a separate function
function initTriggers () {
  console.log('INIT TRIGGERS')
  _.each(triggers, (trigger) => {

    console.log('Each trigger..')
    // Create a shortcut with |option|.
    // let shortcut = new gui.Shortcut({ key: trigger.global_hotkey });

    // Register global desktop shortcut, which can work without focus.
    // gui.App.registerGlobalHotKey(shortcut);

    const shortcut = globalShortcut.register(trigger.accelerator, () => {

      if (CURRENTLY_EXECUTING) {
        IS_KEY_UP = false
        return
      }

      // Sets current execution
      CURRENTLY_EXECUTING = true
      IS_KEY_UP = true

      console.log('GlobalShortcut pressed')
      console.log(globalShortcut.isRegistered('CommandOrControl+X'))
      console.log("Global desktop keyboard shortcut: " + this.key + " active.");
      // Finds the workflow associated with this trigger
      let workflow = _.find(myWorkflows, { _id: trigger.workflow_id })
      // TODO - better error handling here...
      if (!workflow) return

      executeWorkflow({ workflow, trigger })
      .then(( ) => {
        console.log('\n\nDONE EXECUTING\n\n')
        CURRENTLY_EXECUTING = false
        IS_KEY_UP = true
      })

    });

    if (!shortcut) {
      console.log('registration failed')
    } else {
      console.log('registration success')
    }

  })
}

// // // //

// Application tray
// https://github.com/electron/electron/blob/master/docs/api/tray.md
let tray = null
app.on('ready', () => {
  tray = new Tray('./astrokey_white.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ])
  tray.setToolTip('AstroKey Desktop')
  tray.setContextMenu(contextMenu)
  // tray.on('click', function() { window.open('https://astrokey.github.io/#/workflows/abcdefabcdef123123/edit', '_blank'); });
  tray.on('click', createWindow);
  initTriggers()
})
