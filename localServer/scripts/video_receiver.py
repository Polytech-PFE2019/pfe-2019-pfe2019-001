from socketIO_client import SocketIO
import base64
import sys
import os

image_cpt = 0

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_img_response(data):
    global image_cpt
    print('img')
    imgdata = base64.b64decode(data)
    filename = '../ressources/video/image' + str(image_cpt).zfill(5) + '.jpg'
    with open(filename, 'wb') as f:
        f.write(imgdata)
    image_cpt = image_cpt + 1
    if image_cpt >= 6000:
        sys.exit()

try:
    # Create target Directory
    os.mkdir('../ressources/video')
    print("Directory Created ")
except FileExistsError:
    print("Directory already exists")

socketIO = SocketIO('192.168.43.175', 3001)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)

# Listen
socketIO.on('image', on_img_response)

socketIO.wait()
