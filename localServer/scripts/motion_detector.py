# USAGE
# python motion_detector.py
# python motion_detector.py --video videos/example_01.mp4

# import the necessary packages
from imutils.video import VideoStream
import argparse
import datetime
import imutils
import time
import cv2
import requests
import base64
from PIL import Image
import io
import numpy as np
from imageio import imread
import os
import time

ap = argparse.ArgumentParser()
ap.add_argument("-v", "--video", help="path to the video file")
ap.add_argument("-a", "--min-area", type=int,
                default=500, help="minimum area size")
args = vars(ap.parse_args())


def stringToImage(base64_string):
    img = imread(io.BytesIO(base64.b64decode(base64_string)))
    cv2_img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    return cv2_img


# initialize the first frame in the video stream
firstFrame = None
text = "Unoccupied"

# loop over the frames of the video
i = 0
while True:
    i += 1
    # grab the current frame and initialize the occupied/unoccupied
    # text
    time.sleep(1)
    r = requests.get("http://"+os.environ.get('CAMSERVER') +
                     ":"+os.environ.get('CAMPORT')+"/picture")
    # print(r.text)
    frame = stringToImage(r.text)
    # if the frame could not be grabbed, then we have reached the end
    # of the video
    # print(frame)

    if frame is None:
        break

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
        # text = "Occupied"

    if cnts:
        if text == "Unoccupied":
            r = requests.post("http://"+os.environ.get('SERVER') +
                              ":"+os.environ.get('PORT')+'/bird', json={"presence": True})
            # print("LIVE")
            text = "Occupied"
    else:
        if text == "Occupied":
            r = requests.post(
                "http://"+os.environ.get('SERVER') +
                ":"+os.environ.get('PORT')+'/bird', json={"presence": False})
            #print("COUPER LIVE")
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
        break

# cleanup the camera and close any open windows
cv2.destroyAllWindows()
