var tessel = require('tessel');

var climateLib = require('climate-si7020');

var climate = climateLib.use(tessel.port['B']);

climate.on('ready', function() {
    console.log('Connected to si7020');

    setImmediate(function loop() {
        climate.readTemperature('f', function(err, temp) {
            climate.readHumidity(function(err, humid) {
                console.log('Degrees: ', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
                setTimeout(loop, 300);
            });

        });
    });

});

climate.on('error', function(err) {
    console.log('error connection module', err);
});
