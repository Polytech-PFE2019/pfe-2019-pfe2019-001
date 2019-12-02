import eventlet
import socketio
import time, threading
import cv2
import base64
import subprocess

picam_proc = subprocess.Popen(["./picam.sh"], stdout=subprocess.PIPE)
picam = picam_proc.stdout.read().decode("utf-8").strip()
if picam == "":
    picam = None
else:
    print("picam : " + picam)

usbcam_proc = subprocess.Popen(["./usbcam.sh"], stdout=subprocess.PIPE)
usbcam = usbcam_proc.stdout.read().decode("utf8").strip().split()
if len(usbcam) > 0:
    print("usbcams : " + " ".join(usbcam))

encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 20]
# Permet de patch les threads d'eventlet
eventlet.monkey_patch()
clients = []
recording = False
fps = 10
print('## LOG ## Live FPS: ' + str(fps))

id = 0
streamingCamera = ""
if picam != None:
    streamingCamera = picam
else:
    streamingCamera = usbcam[id]
capture = None
#capture = cv2.VideoCapture(usbcam[0])
#capture.set(3, 640)
#capture.set(4, 480)


sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

class setInterval :
    def __init__(self,interval,action, iter=0) :
        self.interval=interval
        self.action=action
        self.stopEvent=threading.Event()
        self.iter=iter
        self.currIter=iter
        thread=threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self) :
        nextTime=time.time()+self.interval
        if self.iter > 0:
            while not self.stopEvent.wait(nextTime-time.time()):
                nextTime+=self.interval
                self.action()
                self.currIter = self.currIter - 1
                if self.currIter == 0:
                    self.stopEvent.set()
        else:
            while not self.stopEvent.wait(nextTime-time.time()) :
                nextTime+=self.interval
                self.action()

    def cancel(self) :
        print('## LOG ## Streaming thread stopped')
        self.stopEvent.set()

# start action every 0.6s
#inter=setInterval(0.6,action)
#print('just after setInterval -> time : {:.1f}s'.format(time.time()-StartTime))

# will stop interval in 5s
#t=threading.Timer(5,inter.cancel)
#t.start()

def rescale_frame(frame, percent=75):
	width = int(frame.shape[1] * percent/100)
	height = int(frame.shape[0] * percent / 100)
	dim = (width, height)
	return cv2.resize(frame, dim, interpolation=cv2.INTER_AREA)

def sendImage():
    flag, frame = capture.read()
    if flag:
        image = cv2.imencode('.jpg', frame, encode_param)[1].tostring();
        image = base64.b64encode(image)
        #print('image: ' + str(image))
        sio.emit('image', image.decode('utf-8'));
        #print('sending image')

def printClients():
    for client in clients:
        print('client: ' + client)

#def test():
#    print("test")

def start():
    global recording
    global capture
    if not recording:
        capture = cv2.VideoCapture(streamingCamera)
        print('## LOG ## Live started')
        recording = setInterval(1/float(fps), sendImage)
        #oui = setInterval(1/float(fps), test, 5)

def stop():
    global recording
    global capture
    if recording != False:
        print('## LOG ## Live stopped')
        recording.cancel()
        del recording
        capture.release()
        recording = False

def switchCamera():
    global streamingCamera
    global id
    stop()
    if picam != None:
        id = (id + 1) % (len(usbcam) + 1)
        if id == 0:
            streamingCamera = picam
        else:
            streamingCamera = usbcam[id - 1]
    else:
        id = (id + 1) % len(usbcam)
        streamingCamera = usbcam[id]
    start()

@sio.event
def connect(sid, environ):
    print('## LOG ## Client connected, sid: ' + str(sid))
    clients.append(sid)
    printClients()
    start()

@sio.event
def live(sid, data):
    print('## LOG ## Live event, value: ' + str(data))
    if data:
        start()
    else:
        stop()

@sio.event
def switch(sid, data):
    print('## LOG ## Switch event, value: ' + str(data))
    if picam != None:
        if (len(usbcam) + 1) > 1:
            switchCamera()
    elif len(usbcam) > 1:
        switchCamera()

@sio.event
def disconnect(sid):
    print('## LOG ## Client disconnected, sid: ', str(sid))
    clients.remove(sid)
    if len(clients) == 0:
        print("## LOG ## No more clients, stopping live")
        stop()

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 3000)), app)
