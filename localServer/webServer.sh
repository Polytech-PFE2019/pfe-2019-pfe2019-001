DIR=dist/
if [ -d "$DIR" ]; then
    echo "$DIR exist"
else 
    cd ../webApp
    if [ -d "$DIR" ]; then
        echo "$DIR exist"
        mv dist ../localServer/dist
    else
        ng build --aot 
        mv dist ../localServer/dist
    fi
    cd ../localServer
fi
node webServer.js