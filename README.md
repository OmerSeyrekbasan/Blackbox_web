# Blackbox For Cars

In this project I designed a blackbox system for cars similar to the ones used in Aircrafts. All Raspberry Pi 3 code was written by me in Pyhton 3 and 
web server code written by me in Node.js Express framework and mongoose for MongoDB interface.

I connected GPS, Accelerometer, Gyroscope sensors to a Raspberry Pi 3. Also an Android phone and Android Smart Watch can be connected 
to this system via Bluetooth.

This device collects information and sends it to a web server in realtime
if a connection can be made. If no connection can be made, it saves the data on its SDCard. Web server can be used to track and analyze driver
behaviors and patterns.

Raspberry Pi 3 and connected sensors:

![WhatsApp Image 2019-02-06 at 11 07 41 PM](https://user-images.githubusercontent.com/35407744/179505810-ebbe20ff-79cc-4d20-a1bb-a3c039248990.jpeg)

![WhatsApp Image 2019-02-06 at 11 07 44 PM](https://user-images.githubusercontent.com/35407744/179505838-bd2afadd-1ef9-4390-948d-74332ff1ee33.jpeg)

In addition to sensors in the photos Raspberry Pi 3 can also connect to an Android Phone. This system needs an App on phone in order to 
read sensors and share them over Bluetooth. 
App: https://github.com/OmerSeyrekbasan/Android-Publish-Sensors-Via-Bluetooth

This Raspberry Pi 3 system collects data from the sensors and sends the data to a server in realtime. A user can inspect 
device information in realtime or later thanks to the database implementation. 

GPS data can be tracked using Google Maps.

![gps](https://user-images.githubusercontent.com/35407744/179505112-2b8d328b-44bc-442c-b35e-40f794093b1b.png)

Screenshots from a real drive:

Accelerometer:
![calisan_ivmeolcer](https://user-images.githubusercontent.com/35407744/179505298-6242e041-7cc4-4796-8871-35a3d6e1229a.png)

Gyroscope X, Y, Z:
![jiroskop_calisma](https://user-images.githubusercontent.com/35407744/179505604-e5824b32-34f3-4a87-a788-cf44a701870a.png)

Phone data, Magnetometer X, Y, Z:
![calisan_telefon](https://user-images.githubusercontent.com/35407744/179505650-8e5ddec3-65e0-49b7-b805-246393119d06.png)

OBD Sensor connected to car via serial. Connected to the system via bluetooth:
Vehicle Speed and RPM:
![calisan_obd](https://user-images.githubusercontent.com/35407744/179505671-6ed7b651-b162-49b8-8f40-8136678bcf12.png)

![umltasarim](https://user-images.githubusercontent.com/35407744/179505371-eef05763-7524-47ad-af6f-f1f03a75a122.jpg)
![umlsinif](https://user-images.githubusercontent.com/35407744/179505460-fa577348-bab3-4ccb-9e78-7c88cd74ba02.png)
![tarihi_sec](https://user-images.githubusercontent.com/35407744/179505477-a3868ae1-ea5f-451c-937c-92cf359be381.png)
