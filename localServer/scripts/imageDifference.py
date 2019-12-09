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
import io
import base64 
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity
import socketio

# Take in base64 string and return PIL image
def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))

# convert PIL Image to an GRAY image( technically a numpy array ) that's compatible with opencv
def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)


# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-a", "--min-area", type=int,
                default=500, help="minimum area size")
ap.add_argument("-e", "--etalon", 
                default=None, help="The frame which contains max food")
ap.add_argument("-i", "--image", 
                default=None, help="the image to compare")

args = vars(ap.parse_args())

#Nombre de frames sur lequelles calculer le score
iterations = 50


# we read from the webcam
if args.get("etalon", None) is None:
    etalon_path = "./../ressources/etalon.jpg"
else :
    etalon_path = args.get("etalon")

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, etalon_path)



# initialize the first frame in the video stream
# Load an color image in grayscale
firstFrame = cv2.imread(filename)
#firstFrame = cv2.cvtColor(firstFrame, cv2.COLOR_BGR2GRAY)
resizedFirstFrame = imutils.resize(firstFrame, width=500)
firstFrame = cv2.GaussianBlur(resizedFirstFrame, (21, 21), 0)

if args.get("image", None) is None:
    print("error, no input image for food detection")
    #set a default image for testing
    file=open("../ressources/testimg.txt", "r")
    image = file.read()
else :
    image = args.get("image")
#conversion de l'image en tableau
image = stringToImage(image)
image = toRGB(image)




def getDifferenceWithEtalon(image2):
    #frame = cv2.imread(image2,0)
    frame = imutils.resize(image2, width=500)
    #gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(frame, (21, 21), 0)

    (score, diff) = structural_similarity(gray, firstFrame, full=True,  multichannel=True)
    diff = (diff * 255).astype("uint8")

    print(score)


score = getDifferenceWithEtalon(image)
