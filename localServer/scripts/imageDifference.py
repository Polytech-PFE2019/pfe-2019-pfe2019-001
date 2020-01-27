# import the necessary packages
from imutils.video import VideoStream
import argparse
import imutils
import cv2
import os
import io
import base64
import numpy as np
from PIL import Image
from socketIO_client import SocketIO
import json
import sys
import requests

from skimage import data, img_as_float
from skimage.metrics import structural_similarity

# Take in base64 string and return PIL image
def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))

# convert PIL Image to an GRAY image( technically a numpy array ) that's compatible with opencv
def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

# compute the score of the differences between the image from the rasp and the etalon
def getDifferenceWithEtalon(image2):
    global firstFrame
    frame = imutils.resize(image2, width=500)
    frame = cv2.GaussianBlur(frame, (21, 21), 0)

    (score, diff) = structural_similarity(
        frame, firstFrame, full=True,  multichannel=True)
    diff = (diff * 255).astype("uint8")
    return(score)


# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-a", "--min-area", type=int,
                default=500, help="minimum area size")
ap.add_argument("-e", "--etalon",
                default=None, help="The frame which contains max food")
ap.add_argument("-i", "--image",
                default=None, help="the image to compare")

args = vars(ap.parse_args())

# Number of frames used to compute the score
iterations = 50
i = 0
score = 0

cap = cv2.VideoCapture('http://192.168.20.100:8081/')
# load the etalon frame
etalon_path = "./../ressources/etalon00000.jpg"
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, etalon_path)
firstFrame = cv2.imread(filename)
resizedFirstFrame = imutils.resize(firstFrame, width=500)
firstFrame = cv2.GaussianBlur(resizedFirstFrame, (21, 21), 0)

#take a frame and add the score of the comparison with the etalon to the global score.
#if it's the last frame to compare, then write the result of the food presence in the database
while True:
    if (i < iterations):
        #sum for the score computation
        ret, image = cap.read()
        image = toRGB(image)
        score += getDifferenceWithEtalon(image)
        i += 1
    else :
        print(str(score/iterations))
        food = True
        if(score > 0.40):
           food = True
        else:
           food = False
        #x = requests.post("http://localhost:1337/food/dataBaseUpdate", json={"Food": True})
        sys.exit()
