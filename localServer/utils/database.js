const mongoose = require('mongoose'),
    host = "localhost",
    database = "bird"
connectionString = 'mongodb://' + host + '/' + database;

let connection = null;

class Database {

    open(callback) {
        var options = {
            promiseLibrary: global.Promise,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        mongoose.connect(connectionString, options, (err) => {
            if (err) {
                console.log('mongoose.connect() failed: ' + err);
            }
        });
        connection = mongoose.connection;

        mongoose.connection.on('error', (err) => {
            console.log('Error connecting to MongoDB: ' + err);
            callback(err, false);
        });

        mongoose.connection.once('open', () => {
            console.log('*** Connected to mongodb');
            callback(null, true);
        });
    }

    close() {
        connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    }
}

module.exports = new Database();