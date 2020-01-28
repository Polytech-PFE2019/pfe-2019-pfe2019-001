import cv2
import sys
import time

camera = cv2.VideoCapture(sys.argv[1])
while True:
    flag, frame = camera.read()
    if flag:
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 20]
        image = cv2.imencode('.jpg', frame, encode_param)[1].tostring()
        print(image)
        sys.stdout.flush()
    time.sleep(1)
