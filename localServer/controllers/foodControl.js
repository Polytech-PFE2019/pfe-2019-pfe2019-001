var firebase = require("firebase");

const { spawn } = require('child_process');

// La requéte contient le channel image de la socket
async function setValue() {
    //ip de la rasp : 192.168.43.175

    var subprocess = spawn(`cd scripts && python3 imageDifference.py`,
        { shell: true }
    );
    console.log("script for food detection launched");
    subprocess.stdout.on('data', (data) => {
        score = parseFloat(data);
        console.log("food score computation finished");
    });
    subprocess.stderr.on('data', (data) => {
        console.log("error :" + data);
    });
}; module.exports.setValue = setValue;

async function setEtalon(req, res) {
    console.log("update etalon begin");
    var subprocess = spawn(`cd scripts && python3 video_receiver.py ../ressources etalon 1`,
        { shell: true }
    );
    subprocess.stderr.on('close', () => {
        console.log('Etalon updated');
        res.status(200).json({
            message: "Message received",
        });
    });
}; module.exports.setEtalon = setEtalon;


async function dataBaseUpdate(req, res) {
    try {
        var ref = firebase.database().ref();
        var foodRef = ref.child('stats/food');
        foodRef.limitToLast(1).once('child_added', function (snap) {
            if (req.body.food != snap.child("/value").val()) {
                var ref = firebase.database().ref();
                var foodRef = ref.child('stats/food');
                var foodObj = {
                    time: Date.now(),
                    value: req.body.food
                };
                foodRef.push(foodObj);
                console.log("Water value added to database.")
            } else {
            }
        });
    } catch (e) {
        console.log("Couldn't add food value to database.");
    }
}; module.exports.dataBaseUpdate = dataBaseUpdate;
