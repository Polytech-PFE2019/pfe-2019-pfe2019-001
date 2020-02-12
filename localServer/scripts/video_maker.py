import numpy as np
import cv2
import sys
import time
import os

cap = cv2.VideoCapture('http://'+os.environ.get('CAMSERVER')+ ':'+ os.environ.get('CAMPORT') +'/')
cap.set(3,640)
cap.set(4,480)
path = sys.argv[1]
capture_duration = int(sys.argv[2])

frames = []
start_time = time.time()
while( int(time.time() - start_time) < capture_duration ):
    ret, frame = cap.read()
    if ret==True:
        frames.append(frame)
    else:
        break

fps = len(frames) / capture_duration
timestamp = str(int(round(time.time() * 1000)))
fullpath = path + '/' + timestamp + '.mp4'
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(fullpath, fourcc, fps, (640,480))
for frame in frames:
    out.write(frame)

print(timestamp)
cap.release()
out.release()
cv2.destroyAllWindows()
