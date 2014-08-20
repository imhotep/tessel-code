var tessel = require('tessel');
var exec = require('child_process').exec; 
var util = require('util');

var script = require.resolve('./device/weathervoice.js');

var opts = {
    stop: true,
    serial: process.env.TESSEL_SERIAL
};

var args = [];

tessel.findTessel(opts, function(err, client) {
    if(err) throw err;
    client.run(script, args, {}, function() {
        client.stdout.resume();
        client.stdout.pipe(process.stdout);
        client.stderr.resume();
        client.stderr.pipe(process.stderr);

        client.on('message', function(m) {
            var d = JSON.parse(m);
            console.log('Got something!', d);
            console.log(d.temp, d.humid);
            exec('say ' + util.format("The temperature is %s degrees. Humidity is %s bars", Math.round(d.temp), Math.round(d.humid)));
        });

        process.on('SIGINT', function() {
            setTimeout(function() {
                logs.info('Script aborted');
                process.exit(131);
            }, 200);
            client.stop();
        });

        client.once('script-stop', function(code) {
            client.close(function() {
                process.exit(code);
            });
        });
    });
});
