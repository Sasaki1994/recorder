#!/bin/bash

FILENAME="4d-recorder_0.0.0_amd64.deb"
URL="https://github.com/Sasaki1994/recorder/releases/latest/download/$FILENAME"


sudo apt update -y

wget "$URL" -O "$FILENAME"

if [ $? -eq 0 ]; then
    echo "Download successful: $FILENAME"
else
    echo "Download failed" >&2
    exit 1
fi

sudo dpkg -i "$FILENAME"

sudo apt install -f -y

echo "Installation completed: $FILENAME"

rm "$FILENAME"
