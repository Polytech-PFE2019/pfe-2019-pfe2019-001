
const path = require('path');
const { spawn } = require('child_process');

function runScript() {
    return spawn('python', [
        "-u",
        path.join(__dirname, 'food_detector.py'),
        "--foo", "some value for foo",
    ]);
}

module.exports = (req, res) => {
    const subprocess = runScript();
    subprocess.stdout.on('data', (data) => {
        console.log(`data:${data}`);
    });
    subprocess.stderr.on('data', (data) => {
        console.log(`error:${data}`);
    });
    subprocess.on('close', () => {
        console.log("Closed");
    });
};