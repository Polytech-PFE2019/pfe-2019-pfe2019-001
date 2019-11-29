#!/bin/bash

LINKS="$(ls /dev | grep video)"
RES=""
for LINK in $LINKS
do
	INFOS="$(sudo udevadm info --query=all --name=/dev/$LINK | grep ID_V4L_PRODUCT=mmal)"
	if [ INFOS != "" ]
	then
		RES=$LINK
		break
	fi
done 

echo "/dev/$RES"
