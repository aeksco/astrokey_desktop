console.log('RENDERING?')

$("#exit-button").click( function() {
  console.log('CLOSE')
  win.close();
});

$("#minimize-button").click( function() {
  console.log('MINIMIZE')
  win.minimize();
});