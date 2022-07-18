#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import read_gps as gps
import gyro
import websocket
import time
import threading
import accelerometer as acc
from datetime import datetime
import queue
import obdutil
import bluetooth2 as bluetoothutil
import subprocess
import os
import urllib.request
import json

#DEFINE CONSTANTS
default = connection_number = "9C:5C:F9:AF:EF:BC"
ACC_SLEEP = 0.5
OBD_SLEEP = 0.5
ANDROID_SLEEP = 0.5
GPS_SLEEP = 0.5

connection_number = bluetoothutil.start_server()[0]

if (connection_number == "e"):
    print("Error Connecting")
    settings_file = open("settings.txt", "r")
    settings = settings_file.readlines()
    connection_number = str(settings[0])[:-1]
    ACC_SLEEP = float(settings[1])
    ANDROID_SLEEP = float(settings[2])
    OBD_SLEEP = float(settings[3])
    GPS_SLEEP = float(settings[4])
    print(connection_number)

else:
    print(connection_number)
    print("Android Connection Established!")

driver_number = '"' + str(connection_number) + '"'

print("shutting down wifi")
cmd = 'sudo ifconfig wlan0 down'
os.system(cmd)
print("shut down wifi")

time.sleep(10)
os.system("/home/pi/Desktop/3grun.sh")
print("connected 3G modem")

print(connection_number)
print(driver_number)
pi_no = '"A1:B2:C3"'
file_stop = threading.Event()


class WebSocketClient(threading.Thread):
    def __init__(self, url):
        self.url = url
        threading.Thread.__init__(self)

    def run(self):

        # Running the run_forever() in a seperate thread.
        #websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(
            self.url,
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
            on_open=self.on_open)
        # self.ws.on_open = self.on_open
        self.ws.run_forever()

    def send(self, data):

        # Wait till websocket is connected.
        # while not self.ws.sock.connected:
        #     time.sleep(0.25)
        self.ws.send(data)

    def stop(self):
        print('Stopping the websocket...')
        self.ws.close()

    def on_message(self, ws, message):
        print('Received data...', message)

    def on_error(self, ws, error):
        print('Received error...')

    def on_close(self, ws):
        print('Closed the connection...')
        file_stop.clear()
        save_to_file()
        main()

    def on_open(self, ws):
        return self.ws.sock.connected


def calc_date():
    return (datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"))


"""
type0 = gps
type1 = gyro
type2 = acc
type3 = obd
type4 = android phone
type5 = android watch
"""


def add_info(data, type):
    data = data[:-1]
    data += ',' + '"tS":' + '"'
    data += str(calc_date())
    data += '"' + ','
    data += '"user":' + str(driver_number) + ","
    data += '"pi_no":' + str(pi_no) + ","
    data += '"type":' + str(type)
    data += "}"
    # print (data)
    return data


# Thread for fetching and sending gps data
#dont forget to edit
def gps_network_thread(ws):
    try:
        while True:
            send = True
            try:
                data = gps.gps()
                print(data)
                if (data == "ERROR!"):
                    print("Error Happened!")
                    send = False
            except Exception:
                print("Exception Occured!")
                send = False
            if (send == True):
                edited_data = add_info(data, 0)
                print("gps inside network")
                ws.send(edited_data)
            time.sleep(1)
    except KeyboardInterrupt:
        print("err")


# Thread for fetching and sending gyro data
def gyro_network_thread(ws):
    try:
        while True:
            data = gyro.gyro_to_json()
            edited_data = add_info(data, 1)
            # print("gyro inside network")
            ws.send(edited_data)
            time.sleep(ACC_SLEEP)
    except KeyboardInterrupt:
        print("err")


# Thread for fetching and sending  acc data
def acc_network_thread(ws):
    try:
        while True:
            data = acc.acc_to_json()
            edited_data = add_info(data, 2)
            # print("acc inside network")
            ws.send(edited_data)
            time.sleep(ACC_SLEEP)
    except KeyboardInterrupt:
        print("err")


# Thread for fetching and sending  obd data
def obd_network_thread(ws):
    try:
        while True:
            data = obdutil.obd_to_json()
            edited_data = add_info(data, 3)
            # print("obd inside network")
            ws.send(edited_data)
            time.sleep(OBD_SLEEP)
    except KeyboardInterrupt:
        print("err")


def phone_network_thread(ws):
    try:
        while True:
            data = bluetoothutil.phone_recv()
            edited_data = add_info(data, 4)
            # print("bluetooth inside network")
            ws.send(edited_data)
            time.sleep(ANDROID_SLEEP)
    except KeyboardInterrupt:
        print("err")


def watch_network_thread(ws):
    try:
        while True:
            data = bluetoothutil.watch_recv()
            edited_data = add_info(data, 5)
            # print("bluetooth inside network")
            ws.send(edited_data)
            time.sleep(ANDROID_SLEEP)
    except KeyboardInterrupt:
        print("err")


#Gps thread to save file
def gps_file_thread(my_file):
    try:
        while (not file_stop.is_set()):
            data = gps.gps()
            edited_data = add_info(data, 1)
            # print("gps inside file")
            my_file.write(edited_data + "\r\n")
            time.sleep(GPS_SLEEP)
    except KeyboardInterrupt:
        print("err")


#Gyro thread to save file
def gyro_file_thread(my_file):
    try:
        while (not file_stop.is_set()):
            data = gyro.gyro_to_json()
            edited_data = add_info(data, 1)
            # print("gyro inside file")
            my_file.write(edited_data + "\r\n")
            time.sleep(ACC_SLEEP)
    except KeyboardInterrupt:
        print("err")


#Acc thread to save file
def acc_file_thread(my_file):
    try:
        while (not file_stop.is_set()):
            data = acc.acc_to_json()
            edited_data = add_info(data, 2)
            # print("acc inside file")
            my_file.write(edited_data + "\r\n")
            time.sleep(ACC_SLEEP)
    except KeyboardInterrupt:
        print("err")


#Obd thread to save file
def obd_file_thread(my_file):
    try:
        while (not file_stop.is_set()):
            data = obdutil.obd_to_json()
            edited_data = add_info(data, 3)
            # print("obd inside file")
            my_file.write(edited_data + "\r\n")
            time.sleep(OBD_SLEEP)
    except KeyboardInterrupt:
        print("err")


#Bluetooth thread to save file
def phone_file_thread(my_file):
    try:
        while (not file_stop.is_set()):
            # print("hello from bluetooth thread")
            data = bluetoothutil.phone_recv()
            edited_data = add_info(data, 4)
            # print("bluetooth inside file")
            my_file.write(edited_data + "\r\n")
            time.sleep(ANDROID_SLEEP)
    except KeyboardInterrupt:
        print("err")


def watch_file_thread(my_file):
    try:
        while (not file_stop.is_set()):
            # print("hello from bluetooth thread")
            data = bluetoothutil.watch_recv()
            edited_data = add_info(data, 5)
            # print("bluetooth inside file")
            my_file.write(edited_data + "\r\n")
            time.sleep(ANDROID_SLEEP)
    except KeyboardInterrupt:
        print("err")


def retry_connection():
    while True:
        ws = WebSocketClient(
            "ws://ec2-35-156-178-24.eu-central-1.compute.amazonaws.com/ws/" +
            str(connection_number))
        ws.start()
        i = 6
        while (i > 0):
            time.sleep(0.5)
            print("....Connecting....")
            i -= 0.5
        connection = ws.on_open(ws)
        print(file_stop.is_set())
        if (connection):
            file_stop.set()
            threading.Thread(target=gps_network_thread, args=(ws, )).start()
            threading.Thread(target=gyro_network_thread, args=(ws, )).start()
            threading.Thread(target=acc_network_thread, args=(ws, )).start()
            threading.Thread(target=obd_network_thread, args=(ws, )).start()
            threading.Thread(target=phone_network_thread, args=(ws, )).start()
            threading.Thread(target=watch_network_thread, args=(ws,)).start()
            return
        print("---Connection Failed---")
        i = 6
        while (i > 0):
            time.sleep(0.5)
            print("....Waiting To Retry Connection....")
            i -= 0.5
    # def start_transfer(ws):
    #     threading.Thread(target=gyro_thread, args=(ws,)).start()
    #     threading.Thread(target=acc_thread, args=(ws,)).start()


def save_to_file():
    my_file = open("sensors.txt", mode="w")
    print("Starting file save threads!")
    threading.Thread(target=gps_file_thread, args=(my_file, )).start()
    threading.Thread(target=gyro_file_thread, args=(my_file, )).start()
    threading.Thread(target=acc_file_thread, args=(my_file, )).start()
    threading.Thread(target=obd_file_thread, args=(my_file, )).start()
    threading.Thread(target=phone_file_thread, args=(my_file, )).start()
    threading.Thread(target=watch_file_thread,args=(my_file,)).start()


def main():
    print("PROGRAM HAS STARTED!")
    save_to_file()
    retry_connection()
    print("Connection Resumed!")

    # i = 6
    # while (i>0):
    #     time.sleep(0.5)
    #     # print ("....Waiting To Retry Connection....")
    #     i -= 0.5


obdutil.start_bluetooth()
time.sleep(10)

print("main program starting")
gps.init_gps()
main()
