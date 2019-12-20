var firebase = require("firebase");
const { spawn } = require('child_process');
const path = require('path');

function count() {
    var file = require('./ressources/ressources.json');
    function runScript() {
        const imagePath = path.join(__dirname, 'ressources/out00000.jpg');
        return spawn(`cd darknet && ./darknet detect cfg/yolov3.cfg yolov3.weights ${imagePath}`,
            { shell: true }
        );
    }
    if (file.presence == true) {
        var imageProcess = spawn(`cd scripts && python3 video_receiver.py ../ressources out 1`,
            { shell: true }
        );
        imageProcess.stderr.on('close', () => {
            const subprocess = runScript();
            subprocess.stderr.on('data', (data) => {
                console.log("" + data)
            })

            subprocess.stdout.on('data', (data) => {
                const text = "" + data;
                var count = (text.match(new RegExp("bird", "g")) || []).length
                console.log(text);
                console.log(count);
                try {
                    var ref = firebase.database().ref();
                    var birdsCountRef = ref.child('stats/birds_count');
                    var birdsCountObj = {
                        time: Date.now(),
                        value: count
                    };
                    birdsCountRef.push(birdsCountObj);

                    console.log("Bird count value added to database.")
                } catch (e) {
                    console.log("Couldn't add bird count value to database.");
                }
            });
        });
    }
}

module.exports.count = count;


function motionDetection() {
    spawn(`cd scripts && python3 motion_detector.py`,
        { shell: true }
    );
} module.exports.motionDetection = motionDetection;
