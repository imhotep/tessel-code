process.on('message', function(msg) {
  console.log('reply');
  process.send(msg);
});
 
process.ref();
