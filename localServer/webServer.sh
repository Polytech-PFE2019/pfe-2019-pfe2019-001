DIR=dist/
if [ -d "$DIR" ]; then
    echo "$DIR exist"
else 
    cd ../webApp
    if [ -d "$DIR" ]; then
        echo "$DIR exist"
        mv dist ../SERVER/dist
    else
        ng build --aot 
        mv dist ../SERVER/dist
    fi
    cd ../SERVER
fi
node webServer.js