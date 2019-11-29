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
import os
from skimage.metrics import structural_similarity


# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-a", "--min-area", type=int,
                default=500, help="minimum area size")
ap.add_argument("-e", "--etalon-frame", 
                default=None, help="The frame which contains max food")
args = vars(ap.parse_args())

# we read from the webcam
if args.get("etalon-frame", None) is None:
    etalon_path = "tests/etalon.jpg"
else :
    etalon_path = args.get("etalon-frame")

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, etalon_path)

vs = VideoStream(src=1).start()
time.sleep(2.0)

# initialize the first frame in the video stream
# Load an color image in grayscale
firstFrame = cv2.imread(filename)
firstFrame = cv2.cvtColor(firstFrame, cv2.COLOR_BGR2GRAY)
resizedFirstFrame = imutils.resize(firstFrame, width=500)
firstFrame = cv2.GaussianBlur(resizedFirstFrame, (21, 21), 0)


finalScore = 0


# loop over the frames of the video
numberOfFrames = 500
i = 0
while i < numberOfFrames:
    i += 1
    if (i % 2 == 0):
        # grab the current frame and initialize the occupied/unoccupied
        # text
        frame = vs.read()
        frame = frame if args.get("video", None) is None else frame[1]

        # if the frame could not be grabbed, then we have reached the end
        # of the video
        if frame is None:
            break

        # resize the frame, convert it to grayscale, and blur it
        frame = imutils.resize(frame, width=500)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        # compute the Structural Similarity Index (SSIM) between the two
        # images, ensuring that the difference image is returned
        (score, diff) = structural_similarity(gray, firstFrame, full=True)
        diff = (diff * 255).astype("uint8")
        #print("SSIM: {}".format(score))
        finalScore += score
finalScore = finalScore/numberOfFrames/2

# cleanup the camera and close any open windows
vs.stop() if args.get("video", None) is None else vs.release()
cv2.destroyAllWindows()

print(finalScore)