from socketIO_client import SocketIO
import base64
import sys
import os

if len(sys.argv) < 3:
    print("Usage: python3 <path> <filename> <images_count>")
    sys.exit()

path = sys.argv[1]
file_name = sys.argv[2]
images_count = int(sys.argv[3])
image_cpt = 0

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_img_response(data):
    global image_cpt
    print('img')
    imgdata = base64.b64decode(data)
    filename = path + '/' + file_name + str(image_cpt).zfill(5) + '.jpg'
    with open(filename, 'wb') as f:
        f.write(imgdata)
    image_cpt = image_cpt + 1
    if image_cpt >= images_count:
        sys.exit()

try:
    # Create target Directory
    os.mkdir(path)
    print("Directory Created ")
except FileExistsError:
    print("Directory already exists")

socketIO = SocketIO('192.168.43.175', 3001)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)

# Listen
socketIO.on('image', on_img_response)

socketIO.wait()
