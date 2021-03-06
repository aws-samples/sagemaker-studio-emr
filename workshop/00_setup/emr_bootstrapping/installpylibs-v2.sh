#!/bin/bash

# Remove outdated virtualenv 
sudo yum -y remove python-virtualenv

sudo /usr/bin/python3 -m pip install -U virtualenv
sudo /usr/bin/easy_install-3.7 --install-dir /usr/bin/ virtualenv

sudo yum install -y libtiff-devel libjpeg-devel libzip-devel freetype-devel lcms2-devel libwebp-devel tcl-devel tk-devel

sudo /usr/bin/python3 -m pip install -U cython==0.29.24
sudo /usr/bin/python3 -m pip install -U setuptools==58.1.0
sudo /usr/bin/python3 -m pip install -U numpy==1.21.2 
sudo /usr/bin/python3 -m pip install -U matplotlib==3.4.3
sudo /usr/bin/python3 -m pip install -U requests==2.26.0 
sudo /usr/bin/python3 -m pip install -U boto3==1.18.63 
sudo /usr/bin/python3 -m pip install -U pandas==1.2.5 
