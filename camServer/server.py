import eventlet
import socketio
import time, threading
import cv2
import base64
import subprocess

picam_proc = subprocess.Popen(["./picam.sh"], stdout=subprocess.PIPE)
picam = picam_proc.stdout.read().decode("utf-8").rstrip()
print("picam : " + picam)
camera_ids = ["/dev/v4l/by-id/usb-Generic_USB2.0_PC_CAMERA-video-index0"]

# Permet de patch les threads d'eventlet
eventlet.monkey_patch()
clients = []
recording = False
fps = 10
print('## LOG ## Live FPS: ' + str(fps))
capture = cv2.VideoCapture(picam)
capture.set(3, 640)
capture.set(4, 480)


sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

class setInterval :
    def __init__(self,interval,action) :
        self.interval=interval
        self.action=action
        self.stopEvent=threading.Event()
        thread=threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self) :
        nextTime=time.time()+self.interval
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
        image = cv2.imencode('.jpg', rescale_frame(frame))[1].tostring();
        image = base64.b64encode(image)
        #print('image: ' + str(image))
        sio.emit('image', image.decode('utf-8'));
        #print('sending image')

def printClients():
    for client in clients:
        print('client: ' + client)

def start():
    global recording
    if not recording:
        print('## LOG ## Live started')
        recording = setInterval(1/float(fps), sendImage)

def stop():
    global recording
    if recording != False:
        print('## LOG ## Live stopped')
        recording.cancel()
        del recording
        recording = False

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
def disconnect(sid):
    print('## LOG ## Client disconnected, sid: ', str(sid))
    clients.remove(sid)
    if len(clients) == 0:
        print("## LOG ## No more clients, stopping live")
        stop()

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 3000)), app)
