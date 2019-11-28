import eventlet
import socketio
import time, threading
import cv2
import base64

clients = []
recording = False
capture = cv2.VideoCapture('/dev/video0')

sio = socketio.Server()
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
        print('called')
        self.stopEvent.set()

# start action every 0.6s
#inter=setInterval(0.6,action)
#print('just after setInterval -> time : {:.1f}s'.format(time.time()-StartTime))

# will stop interval in 5s
#t=threading.Timer(5,inter.cancel)
#t.start()

def temp():
    print('mock')
    flag, frame = capture.read()
    if flag:
        image = cv2.imencode('.jpg', frame)[1].tostring();
        image = base64.b64encode(image)
        sio.emit('image', image);

def sendImage():
    flag, frame = capture.read()
    if flag:
        image = cv2.imencode('.jpg', frame)[1].tostring();
        image = base64.b64encode(image)
        #print('image: ' + image)
        sio.emit('image', image);
        print('sending image')

def printClients():
    for client in clients:
        print('client: ' + client)

def start():
    global recording
    print('start recording')
    if not recording:
        recording = setInterval(0.1, sendImage)

def stop():
    global recording
    print('stop recording')
    if recording != False:
        recording.cancel()

@sio.event
def connect(sid, environ):
    print('connect ', sid)

    clients.append(sid)
    printClients()
    start()

@sio.event
def live(sid, data):
    print('message ', data)
    if data:
        start()
    else:
        stop()

@sio.event
def disconnect(sid):
    print('disconnect ', sid)
    clients.remove(sid)
    if len(clients) == 0:
        stop()
        print('Live stopped')

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 3000)), app)
