var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var climateLib = require('climate-si7020');

var ambient = ambientlib.use(tessel.port['A']);
var climate = climateLib.use(tessel.port['B']);
var temperature, humidity;

ambient.on('ready', function() {
    climate.on('ready', function() {
        ambient.setSoundTrigger(0.1);

        ambient.on('sound-trigger', function(data) {

            console.log("You asked for weather ?", data);

            climate.readTemperature('f', function(err, temp) {
                temperature = temp;
                climate.readHumidity(function(err, humid) {
                    humidity = humid;
                    console.log('Degrees: ', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
                    process.send(JSON.stringify({temp: temperature, humid: humidity}));
                    setTimeout(loop, 300);
                });
            });

            ambient.clearSoundTrigger();

            setTimeout(function() {
                ambient.setSoundTrigger(0.1);
            }, 1500);

        });
    });

    climate.on('error', function(err) {
        console.log('error connection module', err);
    });
});

