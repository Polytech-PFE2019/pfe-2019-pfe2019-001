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
from socketIO_client import SocketIO
import requests
import json


# Take in base64 string and return PIL image
def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))

# convert PIL Image to an GRAY image( technically a numpy array ) that's compatible with opencv


def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

# compute the score of the differences between the image from the rasp and the etalon


def getDifferenceWithEtalon(image2):
    #frame = cv2.imread(image2,0)
    frame = imutils.resize(image2, width=500)
    #gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(frame, (21, 21), 0)

    (score, diff) = structural_similarity(
        gray, firstFrame, full=True,  multichannel=True)
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

# Nombre de frames sur lequelles calculer le score
iterations = 50
i = 0

score = 0

#creation de la socket

# we read from the webcam
if args.get("etalon", None) is None:
    etalon_path = "./../ressources/etalon.jpg"
else:
    etalon_path = args.get("etalon")

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, etalon_path)



# initialize the first frame in the video stream
# Load an color image
firstFrame = cv2.imread(filename)
#firstFrame = cv2.cvtColor(firstFrame, cv2.COLOR_BGR2GRAY)
resizedFirstFrame = imutils.resize(firstFrame, width=500)
firstFrame = cv2.GaussianBlur(resizedFirstFrame, (21, 21), 0)


    
# for i in range(iterations):
#     # test de récupération de la requète sur la rasp
#     image = requests.get("http://"+os.environ.get('CAMSERVER') +
#                          ":"+os.environ.get('CAMPORT')+"/picture").text

#     # conversion de l'image en tableau
#     image = stringToImage(image)
#     image = toRGB(image)
#     score += getDifferenceWithEtalon(image)

score = score/iterations
print(score)

def on_img_response(image):
    global i
    global score

    if (i < iterations):
        #calcul du score
        image = stringToImage(image)
        image = toRGB(image)
        score += getDifferenceWithEtalon(image)





socketIO = SocketIO('192.168.43.175', 3000)
socketIO.on('connect', print("connection"))
socketIO.on('disconnect', print("disconnect"))

socketIO.on('image', on_img_response)


#open and write in the JSON file
fileRessources = open("../ressources/ressources.json", "r")

ressources = json.load(fileRessources)

if(score > 0.40):
    ressources['food'] = 'true'
else:
    ressources['food'] = 'false'

json.dump(ressources, fileRessources)