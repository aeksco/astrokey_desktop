module.exports = [
  {
    _id: 'abc123',
    label: 'My First Workflow',
    author: 'aeksco',
    steps: [
      // { id: 2, order: 2, icon: 'fa-play-circle-o', type: 'MACRO', label: 'Run Macro', value: [] },
      // { id: 3, order: 3, type: 'KEY_UP', label: 'Release Key' },
      { id: 5, order: 5, icon: 'fa-paragraph', type: 'TEXT', label: 'Type', value: 'Hello, Astrokey' },
      { id: 6, order: 6, icon: 'fa-cube', type: 'KEY', value: 'enter' },
      // { id: 6, order: 6, icon: 'fa-cube', type: 'KEY', value: 'enter' },
      // { id: 4, order: 4, icon: 'fa-clock-o', type: 'DELAY', label: 'Delay', value: 2000 },
      { id: 7, order: 7, icon: 'fa-code', type: 'KEY_UP', label: 'Keyup' },
      { id: 6, order: 6, icon: 'fa-cube', type: 'KEY', value: 'enter' },
      { id: 5, order: 5, icon: 'fa-paragraph', type: 'TEXT', label: 'Type', value: 'Woooo' }
    ]
  },
  {
    _id: 'xyz123',
    label: 'My Second Workflow',
    author: 'aeksco',
    steps: [
      { id: 1, order: 1, type: 'TEXT', value: 'Hello, Astrokey' },
      { id: 2, order: 2, type: 'KEY', value: 'enter' }
    ]
  },
]
