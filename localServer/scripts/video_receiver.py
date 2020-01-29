import sys
import os
import cv2

if len(sys.argv) < 3:
    print("Usage: python3 <path> <filename> <images_count>")
    sys.exit()

path = sys.argv[1]
file_name = sys.argv[2]
images_count = int(sys.argv[3])
image_cpt = 0

try:
    # Create target Directory
    os.mkdir(path)
    print("Directory Created ")
except FileExistsError:
    print("Directory already exists")

cap = cv2.VideoCapture('http://'+os.environ.get('CAMSERVER')+ ':'+ os.environ.get('CAMPORT') +'/')
while image_cpt < images_count:
    ret, frame = cap.read()

    if frame is None:
        print('Impossible to get image')
        sys.exit()

    filename = path + '/' + file_name + str(image_cpt).zfill(5) + '.jpg'
    cv2.imwrite(filename, frame)
    image_cpt = image_cpt + 1
