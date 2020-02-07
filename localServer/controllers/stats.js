const Stat = require('../models/stats')

exports.addStat = (req, res) => {
    let stat = new Stat()
    stat.type = req.body.type;
    stat.date = req.body.date;
    stat.state = req.body.state;
    stat.save((err, stat) => {
        if (err) res.send(err);
        res.send(stat);
    });
}

exports.getAverage = (req, res) => {
    Stat.find({ type: req.params.type }, function (err, stats) {
        let cpt = 0;
        stats = stats.sort(function (a, b) { return a.date - b.date });
        let temp1 = stats.filter((a) => {
            return a.state == false
        });

        let temp2 = stats.filter((a) => {
            return a.state == true
        });
        function myFunction(value, index, array) {
            console.log(value);

            return temp2[index].date - value.date;
        }
        results = temp1.map(myFunction);
        results.forEach((res) => {
            cpt = cpt + res

        });
        res.send({ avg: cpt / temp1.length })
    });
}


