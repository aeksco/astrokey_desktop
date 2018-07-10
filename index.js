'use strict';

const ioHook = require('iohook');
const robot = require('robotjs');
const _ = require('lodash');
const Promise = require('bluebird');
const myWorkflows = require('./workflows')
const triggers = require('./triggers')

let CURRENTLY_EXECUTING = false;
let IS_KEY_UP = true;

// start ioHook
ioHook.start();
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

// Setup keybindings
// TODO - break everything below out into a separate function
_.each(triggers, (trigger) => {

  // Registers shortcut
  ioHook.registerShortcut(trigger.shortcut, (keys) => {

    // Short-circuit execution if a workflow is currently in-progress
    // TODO - should this be tied to a specific workflow, or should it short-circuit all?
    if (CURRENTLY_EXECUTING) return
    CURRENTLY_EXECUTING = true
    IS_KEY_UP = false

    console.log('Shortcut pressed with keys:', keys);
    // console.log('EXECUTING WORKFLOW')

    // Handle KEYUP event
    // TODO - clean up this handler when the function is complete?
    ioHook.on('keyup', (msg) => {
      if (trigger.shortcut.includes(msg.keycode)) {
        if (IS_KEY_UP) return
        IS_KEY_UP = true
      }
    });

    // Finds the workflow associated with this trigger
    let workflow = _.find(myWorkflows, { _id: trigger.workflow_id })

    // TODO - better error handling here...
    if (!workflow) return

    // // // //
    // Execute workflow
    executeWorkflow({ workflow, trigger })
    .then(( ) => {
      console.log('\n\nDONE EXECUTING\n\n')
      CURRENTLY_EXECUTING = false
    })
    // // // //

  });

})
