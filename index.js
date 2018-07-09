'use strict';

const ioHook = require('iohook');
const robot = require('robotjs');
const _ = require('lodash');
const Promise = require('bluebird');

// start ioHook
ioHook.start();
// ioHook.setDebug(true); // Uncomment this line for see all debug information from iohook

// Key constants
const DESKTOP_SHORTCUT = 'DESKTOP_SHORTCUT'
const EXECUTION_TIMEOUT = 500
const CTRL = 29;
const ALT = 56;
const TAB = 15;
const F7 = 65;

// Astrokey Workflow
const myWorkflows = [{
  _id: 'abcdefabcdef123123',
  label: 'My New Workflow',
  author: 'aeksco',
  created_by: 'created_by_user_id',
  public: true, // PUBLICLY VISIBLE BOOLEAN
  version_major: 0, // WORKFLOW VERSION
  version_minor: 1, // WORKFLOW VERSION MINOR
  compatible_with: [], // DEVICE_TYPE_VERSIONS (?)
  steps: [
    // { id: 2, order: 2, icon: 'fa-play-circle-o', type: 'MACRO', label: 'Run Macro', value: [] },
    // { id: 3, order: 3, type: 'KEY_UP', label: 'Release Key' },
    { id: 5, order: 5, icon: 'fa-paragraph', type: 'TEXT', label: 'Type', value: 'I love Alaina' },
    { id: 6, order: 6, icon: 'fa-cube', type: 'KEY', value: 'enter' },
    // { id: 4, order: 4, icon: 'fa-clock-o', type: 'DELAY', label: 'Delay', value: 2000 },
    // { id: 6, order: 6, icon: 'fa-cube', type: 'KEY', value: 'enter' },
    // { id: 6, order: 6, icon: 'fa-cube', type: 'KEY', value: 'enter' },
    { id: 7, order: 7, icon: 'fa-code', type: 'KEY_UP', label: 'Keyup' },
    { id: 5, order: 5, icon: 'fa-paragraph', type: 'TEXT', label: 'Type', value: 'SO MUCHHHHH' }
  ],
  triggers: [{
    type: DESKTOP_SHORTCUT,
    // shortcut: [CTRL, F7]
    shortcut: [F7]
  }]
}]

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
  console.log('KEY UP KEY UP')
  return new Promise((resolve, reject) => {
    // console.log('finish keytap.')
    ioHook.registerShortcut(shortcut, (keys) => {
      console.log('Shortcut KEY UP WOW pressed with keys:', keys);
      // return resolve()
      // console.log('EXECUTING WORKFLOW')
    });
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

// Setup keybindings
_.each(myWorkflows, (workflow) => {
  _.each(workflow.triggers, (trigger) => {
    if (trigger.type === DESKTOP_SHORTCUT) {

      // Registers shortcut
      ioHook.registerShortcut(trigger.shortcut, (keys) => {
        console.log('Shortcut pressed with keys:', keys);
        // console.log('EXECUTING WORKFLOW')


        // Execute workflow
        setTimeout(() => {

          // NOTE - each step is asynchonous - this should be considered for things like delays
          Promise.each(workflow.steps, (step) => {
            if (step.type === 'TEXT') {
              return typeString(step.value)
            } else if (step.type === 'DELAY') {
              return delay(step.value)
            } else if (step.type === 'KEY') {
              return keyTap(step.value)
            } else if (step.type === 'KEY_UP') {
              return keyUp(trigger.shortcut)
            }
          }).then(() => {
            // console.log('WORKFLOW COMPLETE')
          })
        }, EXECUTION_TIMEOUT)

      });

    }
  })
})


// let shId = ioHook.registerShortcut([ALT, F7], (keys) => {
// console.log('This shortcut will be called once. Keys:', keys);
//   ioHook.unregisterShortcut(shId);
// })

// console.log('Hook started. Try type something or move mouse');