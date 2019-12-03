FILE=darknet/yolov3.weights
if [ -f "$FILE" ]; then
    echo "$FILE exist"
else 
    cd darknet
    wget https://pjreddie.com/media/files/yolov3.weights
    cd ..
fi
node server.js