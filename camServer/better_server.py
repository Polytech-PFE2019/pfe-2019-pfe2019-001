import eventlet
from eventlet import wsgi
import os
import socketio
import time, threading
import cv2
import base64
import subprocess

#Récupération du lien vers la picam
picam_proc = subprocess.Popen(["./picam.sh"], stdout=subprocess.PIPE)
picam = picam_proc.stdout.read().decode("utf-8").strip().split()
if len(picam) > 0:
    print("picam : " + " ".join(picam))

#Récupération des liens vers les caméras usb
usbcam_proc = subprocess.Popen(["./usbcam.sh"], stdout=subprocess.PIPE)
usbcam = usbcam_proc.stdout.read().decode("utf8").strip().split()
if len(usbcam) > 0:
    print("usbcams : " + " ".join(usbcam))

# Permet de patch les threads d'eventlet
eventlet.monkey_patch()

#Fusion des caméras en un tableau unique
all_cameras = picam + usbcam
camera_captures = []
for camera in all_cameras:
    # 1: Nom de la caméra
    # 2: VideoCapture de la caméra
    # 3: Liste des clients connectés au flux
    # 4: Référence vers le thread de streaming
    camera_captures.append((camera, None, [], None))

fps = 10
print('## LOG ## Live FPS: ' + str(fps))

def wsgi_handler(env, start_response):
    if env['PATH_INFO'] == "/":
        if os.path.exists("./index.html"):
            h = open("./index.html", 'rb')
            content = h.read()
            h.close()
            headers = [('content-type', 'text/html')]
            start_response('200 OK', headers)
            return [content]
    elif env['PATH_INFO'] == "/picture":
        cap = camera_captures[0][1]
        if cap != None:
            params = ["picture", cap, 2, 100]
            response = html_sendImage(params)
            headers = [('content-type', 'text/plain')]
            start_response('200 OK', headers)
            return [response]
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return ['Hello, World!\r\n']

sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio, wsgi_handler)

class setInterval :
    def __init__(self,interval,action, parameters=None, iter=0) :
        self.interval=interval
        self.action=action
        self.stopEvent=threading.Event()
        self.parameters=parameters
        self.iter=iter
        self.currIter=iter
        thread=threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self) :
        nextTime=time.time()+self.interval
        if self.iter > 0:
            while not self.stopEvent.wait(nextTime-time.time()):
                nextTime+=self.interval
                self.action(self.parameters)
                self.currIter = self.currIter - 1
                if self.currIter == 0:
                    self.stopEvent.set()
        else:
            while not self.stopEvent.wait(nextTime-time.time()) :
                nextTime+=self.interval
                self.action(self.parameters)

    def cancel(self) :
        print('## LOG ## Streaming thread stopped')
        self.stopEvent.set()

# 0 : channel
# 1 : camera source
# 2 : room
# 3 : Encoding quality
def sendImage(params):
    flag, frame = params[1].read()
    if flag:
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 20]
        if not isinstance(params[3], bool) and isinstance(params[3], int) and params[3] >= 0 and params[3] <= 100:
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), params[3]]
        image = cv2.imencode('.jpg', frame, encode_param)[1].tostring();
        image = base64.b64encode(image)
        image = image.decode('utf-8')
        sio.emit(params[0], image, params[2]);
        return image
    return False

def html_sendImage(params):
    flag, frame = params[1].read()
    if flag:
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 20]
        if not isinstance(params[3], bool) and isinstance(params[3], int) and params[3] >= 0 and params[3] <= 100:
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), params[3]]
        image = cv2.imencode('.jpg', frame, encode_param)[1].tostring();
        image = base64.b64encode(image)
        image = image.decode('utf-8')
        return image
    return False

def bind_client(sid, camera_id):
    global camera_captures
    temp = camera_captures[camera_id]
    camera_captures[camera_id] = (temp[0], temp[1], temp[2] + [sid], temp[3])
    sio.enter_room(sid, "camera_" + str(camera_id))
    print("## LOG ## Client binded to room camera_" + str(camera_id))
    start()

def remove_client(sid):
    global camera_captures
    for i in range(0, len(camera_captures)):
        if sid in camera_captures[i][2]:
            temp = camera_captures[i]
            temp[2].remove(sid)
            camera_captures[i] = (temp[0], temp[1], temp[2], temp[3])
            sio.leave_room(sid, "camera_" + str(i))
            print("## LOG ## Client removed from room camera_" + str(i))
            break
    stop()

def start():
    for i in range(0, len(camera_captures)):
        if len(camera_captures[i][2]) > 0 and camera_captures[i][1] == None:
            start_camera(i)

def start_camera(id):
    global camera_captures
    temp = camera_captures[id]
    temp2 = cv2.VideoCapture(temp[0])
    params = ["image", temp2, "camera_" + str(id), False]
    camera_captures[id] = (temp[0], temp2, temp[2], setInterval(1/float(fps), sendImage, params))
    print('## LOG ## Live started for camera ' + str(id))

def stop():
    for i in range(0, len(camera_captures)):
        if len(camera_captures[i][2]) == 0 and camera_captures[i][1] != None:
            stop_camera(i)

def stop_camera(id):
    global camera_captures
    camera_captures[id][3].cancel()
    camera_captures[id][1].release()
    temp = camera_captures[id]
    camera_captures[id] = (temp[0], None, temp[2], None)
    print('## LOG ## Live stopped for camera ' + str(id))

@sio.event
def connect(sid, environ):
    print('## LOG ## Client connected, sid: ' + str(sid))
    bind_client(sid, 0)

@sio.event
def disconnect(sid):
    print('## LOG ## Client disconnected, sid: ', str(sid))
    remove_client(sid)

@sio.event
def camera_count(sid, data):
    print("## LOG ## Camera count request")
    return len(camera_captures)

@sio.event
def switch(sid, camera_id):
    if camera_id < len(camera_captures):
        print("## LOG ## Switching camera")
        remove_client(sid)
        bind_client(sid, camera_id)
    else:
        print("## LOG ## Error while switching camera: wrong index")

@sio.event
def picture(sid, data):
    print('## LOG ## Client requested a picture')
    cap = None
    id = 0
    for i in range(0, len(camera_captures)):
        if sid in camera_captures[i][2]:
            cap = camera_captures[i][1]
            id = i
            break
    if cap != None:
        params = ["picture", cap, sid, data]
        return sendImage(params)
    return False

if len(camera_captures) > 1:
    bind_client(666, 1)
else:
    bind_client(666, 0)
    
if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 3000)), app)
