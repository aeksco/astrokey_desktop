const CTRL = 29;
const ALT = 56;
const TAB = 15;
const F7 = 65;

// Exports array of triggers that associate a particular workflow with a keyboard shortcut
module.exports = [
  {
    // shortcut: [CTRL, F7]
    // workflow_id: 'abc123'
    shortcut: [F7],
    workflow_id: 'xyzabc',
    global_hotkey: 'Ctrl+Shift+A',
    accelerator: 'CommandOrControl+Shift+A'
  },
  {
    // shortcut: [CTRL, F7]
    shortcut: [ALT],
    workflow_id: 'xyz123',
    global_hotkey: 'ctrl+tab',
    accelerator: 'CommandOrControl+Tab'
  },
]