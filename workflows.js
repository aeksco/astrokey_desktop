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
  {
    _id: 'xyzabc',
    label: 'My Third Workflow',
    author: 'aeksco',
    steps: [
      {
        id: 0,
        order: 0,
        type: 'DELAY',
        value: 1000
      },
      {
        id: 1,
        order: 1,
        type: 'MACRO',
        value: [
          { order: 1, key: 'control', position: 'KEY_DOWN' },
          { order: 2, key: 'space', position: 'KEY_PRESS' },
          { order: 3, key: 'control', position: 'KEY_UP' }
        ]
      },
      {
        id: 2,
        order: 2,
        type: 'DELAY',
        value: 1000
      },
      {
        id: 3,
        order: 3,
        type: 'TEXT',
        value: 'CHROME'
      },
      {
        id: 4,
        order: 4,
        type: 'DELAY',
        value: 500
      },
      {
        id: 5,
        order: 5,
        type: 'KEY',
        value: 'enter'
      }
    ]
  },
]
