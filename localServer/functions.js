function count() {
    const { spawn } = require('child_process');
    const path = require('path');
    var socket = require('socket.io-client')('http://raspberrypi.local:3000')
    socket.emit("switch", 1)
    socket.emit("picture", 0)
    socket.on('picture', function (data) {
        require("fs").writeFile("out.png", data, 'base64', function (err) {
            function runScript() {
                const imagePath = path.join(__dirname, '/out.png');
                return spawn(`cd darknet && ./darknet detect cfg/yolov3.cfg yolov3.weights ${imagePath}`,
                    { shell: true }
                );
            }
            const subprocess = runScript();
            subprocess.stdout.on('data', (data) => {
                const text = "" + data;
                console.log(text);
                console.log((text.match(new RegExp("bird", "g")) || []).length);
            });
            subprocess.stderr.on('close', () => {
                `serv`
                console.log("Closed");
            });
        });
    })
} module.exports.count = count;