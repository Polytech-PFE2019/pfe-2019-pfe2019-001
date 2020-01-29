# USAGE
# python motion_detector.py
# python motion_detector.py --video videos/example_01.mp4

# import the necessary packages
from imutils.video import VideoStream
import argparse
import datetime
import imutils
import cv2
import requests
import base64
from PIL import Image
import io
import numpy as np
from imageio import imread
import os
import sys
from socketIO_client import SocketIO
import time

ap = argparse.ArgumentParser()
ap.add_argument("-v", "--video", help="path to the video file")
ap.add_argument("-a", "--min-area", type=int,
                default=500, help="minimum area size")
args = vars(ap.parse_args())

i = 0
# initialize the first frame in the video stream
firstFrame = None
text = "Unoccupied"
oldFrame = None
cap = cv2.VideoCapture('http://'+os.environ.get('CAMSERVER')+ ':'+ os.environ.get('CAMPORT') +'/')

while True:
    #print("img")
    i = i+1
    #print('message received with ', data)
    ret, frame = cap.read()

    if frame is None:
        print('Impossible to get image')
        time.sleep(5)
        cap = cv2.VideoCapture('http://'+os.environ.get('CAMSERVER')+ ':'+ os.environ.get('CAMPORT') +'/')
        continue
        #sys.exit()
    # resize the frame, convert it to grayscale, and blur it
    frame = imutils.resize(frame, width=500)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (21, 21), 0)

    # if the first frame is None, initialize it
    if firstFrame is None:
        firstFrame = gray
        oldFrame = gray
        continue
    if i == 10:
        firstFrame = oldFrame
        oldFrame = gray
        i = 0
        continue

    # compute the absolute difference between the current frame and
    # first frame
    frameDelta = cv2.absdiff(firstFrame, gray)
    thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]

    # dilate the thresholded image to fill in holes, then find contours
    # on thresholded image
    thresh = cv2.dilate(thresh, None, iterations=2)
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    # loop over the contours
    for c in cnts:
        # if the contour is too small, ignore it
        if cv2.contourArea(c) < args["min_area"]:
            continue

        # compute the bounding box for the contour, draw it on the frame,
        # and update the text
        (x, y, w, h) = cv2.boundingRect(c)
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    if cnts:
        if text == "Unoccupied":
            try:
                requests.post("http://"+os.environ.get('SERVER') +
                              ":"+os.environ.get('PORT')+'/bird', json={"presence": True})
            except Exception:
                pass
            print("LIVE")
            text = "Occupied"
    else:
        if text == "Occupied":
            try:
                requests.post(
                    "http://"+os.environ.get('SERVER') +
                    ":"+os.environ.get('PORT')+'/bird', json={"presence": False})
            except Exception:
                pass
            print("COUPER LIVE")
            text = "Unoccupied"

    # draw the text and timestamp on the frame
    cv2.putText(frame, "Room Status: {}".format(text), (10, 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    cv2.putText(frame, datetime.datetime.now().strftime("%A %d %B %Y %I:%M:%S%p"),
                (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

    # show the frame and record if the user presses a key
    # cv2.imshow("Security Feed", frame)
    # cv2.imshow("Thresh", thresh)
    # cv2.imshow("Frame Delta", frameDelta)
    key = cv2.waitKey(1) & 0xFF

    # if the `q` key is pressed, break from the lop
    if key == ord("q"):
        # cleanup the camera and close any open windows
        cv2.destroyAllWindows()
        sys.exit()
