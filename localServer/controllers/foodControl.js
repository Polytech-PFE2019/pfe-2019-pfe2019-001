
exports.setValue = (req, res) => {
    console.log(req.body.key)
    var foodsRef = ref.child('waters');
    // Create a new ref and log it’s push key
    var waterRef = watersRef.push();
    console.log('water key', waterRef.key);
    // Create a new ref and save data to it in one step
    var waterRef = usersRef.push({
        name: 'water',
        empty: true
    });
    res.status(200).json({
        message: "Message received",
    });
}