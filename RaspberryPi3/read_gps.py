# -*- coding: utf-8 -*-
"""
Created on Wed Jan 31 13:46:00 2018

@author: Ömer Seyrekbasan
"""

import serial, time
import serial.tools.list_ports
def init_gps():
    list = serial.tools.list_ports.comports()
    connected = []
    for element in list:
        connected.append(element.device)
    print("Connected COM ports: " + str(connected))
    global ser
    ser = serial.Serial(connected[3], 9600)


def gps():
    while True:
        serial_line = ser.readline()
        str1 = serial_line.decode()
        # print(str1)
        if "GPGLL" in str1:
            try:
                json = GPGLL(str1)
            except Exception:
                json = "ERROR!"
            # print (json)
            return json
        else:
            if "GPRMC" in str1:
                try:
                    json = GPRMC(str1)
                # print(json)
                except Exception:
                    json = "ERROR!"
                return json
            else:
                if "GPGGA" in str1:
                    try:
                        json = GPGGA(str1)
                    # print(json)
                    except Exception:
                        json = "ERROR!"
                    return json

def GPGGA(gps_input):
    i = 18
    latitude = ""
    while (i<29):
        latitude += gps_input[i]
        i = i+1


    dd = ''
    mm = ''
    latitude_1 = latitude.split(',', 1)[0]
    dd = latitude_1[0] + latitude_1[1]
    mm = latitude_1[2] + latitude_1[3] + latitude_1[4] + latitude_1[5] + latitude_1[6] + latitude_1[7] + latitude_1[8]
    mm = float(mm)
    mm = mm/60
    dd = float(dd)
    lat = dd + mm
    latitude_2 = latitude.split(',',1)[1]

    if (latitude_2 == "W"):
        lat = -lat


    i = 30
    longitude = ""
    while (i<42):
        longitude += gps_input[i]
        i = i+1

    dd = ''
    mm = ''

    longitude_1 = longitude.split(',', 1)[0]
    dd = longitude_1[0] + longitude_1[1] + longitude_1[2]
    mm = longitude_1[3] + longitude_1[4] + longitude_1[5] + longitude_1[6] + longitude_1[7] + longitude_1[8] + longitude_1[9]
    longitude_1 = float(longitude_1)
    mm = float(mm)
    mm = mm / 60
    dd = float(dd)
    lon = dd + mm
    longitude_2 = longitude.split(',', 1)[1]
    # print(longitude_1)
    # print(longitude_2)

    if (longitude_2 == 'S'):
        lon = -lon
    # print(longitude_1)
    # print(longitude_2)

    # print ("UTC TIME RIGHT NOW =" + hour+":"+mins+"."+sec)
    # print ("Latitude =" + latitude)
    # print ("Longtitude =" + longtitude)
    """
    {
        "gyro": {
            "xAxis": someValue,
            "yAxis": someValue,
            "zAxis": someValue
        },
        "accelerometer": {
            "xAxis": someValue,
            "yAxis": someValue,
            "zAxis": someValue
        }

    }"""

    json = '{ "lat":'
    json += str(lat)
    json += ',"lon":' + str(lon)
    json += '}'
    return json


def GPRMC(gps_input):

    i = 20
    latitude = ""
    while (i<31):
        latitude += gps_input[i]
        i = i+1


    dd = ''
    mm = ''
    latitude_1 = latitude.split(',', 1)[0]
    dd = latitude_1[0] + latitude_1[1]
    mm = latitude_1[2] + latitude_1[3] + latitude_1[4] + latitude_1[5] + latitude_1[6] + latitude_1[7] + latitude_1[8]
    mm = float(mm)
    mm = mm/60
    dd = float(dd)
    lat = dd + mm
    latitude_2 = latitude.split(',',1)[1]

    if (latitude_2 == "W"):
        lat = -lat
    # print(latitude_1)
    # print(latitude_2)

    i = 32
    longitude = ""
    while (i<44):
        longitude += gps_input[i]
        i = i+1

    dd = ''
    mm = ''

    longitude_1 = longitude.split(',', 1)[0]
    dd = longitude_1[0] + longitude_1[1] + longitude_1[2]
    mm = longitude_1[3] + longitude_1[4] + longitude_1[5] +longitude_1[6] + longitude_1[7] + longitude_1[8] + longitude_1[9]
    longitude_1 = float(longitude_1)
    # print("DD= " + dd)
    mm = float(mm)
    # print("MM=", mm)
    mm = mm / 60
    dd = float(dd)
    lon = dd + mm
    longitude_2 = longitude.split(',', 1)[1]
    # print(longitude_1)
    # print(longitude_2)

    if (longitude_2 == 'S'):
        lon = -lon

    json = '{ "lat":'
    json += str(lat)
    json += ',"lon":' + str(lon)
    json += '}'
    return json


    # print ("UTC TIME RIGHT NOW =" + hour+":"+mins+"."+sec)
    # print ("Latitude =" + latitude)
    # print ("Longtitude =" + longtitude)

def GPGLL(gps_input):

    i = 7
    latitude = ""
    while (i<18):
        latitude += gps_input[i]
        i = i+1
    i = 19

    dd = ''
    mm = ''
    latitude_1 = latitude.split(',', 1)[0]
    dd = latitude_1[0] + latitude_1[1]
    mm = latitude_1[2] + latitude_1[3] + latitude_1[4] + latitude_1[5] + latitude_1[6] + latitude_1[7] + latitude_1[8]
    mm = float(mm)
    mm = mm/60
    dd = float(dd)
    lat = dd + mm
    latitude_2 = latitude.split(',',1)[1]

    if (latitude_2 == "W"):
        lat = -lat
    # print(latitude_1)
    # print(latitude_2)


    longitude = ""
    while (i<31):
        longitude += gps_input[i]
        i = i+1

    dd = ''
    mm = ''

    longitude_1 = longitude.split(',', 1)[0]
    dd = longitude_1[0] + longitude_1[1] + longitude_1[2]
    # print("DD= " + dd)
    mm = longitude_1[3] + longitude_1[4] + longitude_1[5] + longitude_1[6] + longitude_1[7] + longitude_1[8] + longitude_1[9]
    longitude_1 = float(longitude_1)
    # print("MM=", mm)
    mm = float(mm)
    mm = mm / 60
    dd = float(dd)
    lon = dd + mm
    longitude_2 = longitude.split(',', 1)[1]
    # print(longitude_1)
    # print(longitude_2)

    if (longitude_2 == 'S'):
        lon = -lon
    # print(longitude_1)
    # print(longitude_2)
    # json = '{ "gps": { "latitude":'
    # json += '"' + latitude+'"'+ ',"longitude":'
    # json += '"' + longtitude+'"'+ ',"time":'
    # json += '"' +str(hour)+ ":" + str(mins) + ":" + str(sec) +'"'
    # json += '}' + '}'





    json = '{ "lat":'
    json += str(lat)
    json += ',"lon":' + str(lon)
    json += '}'
    return json



# init_gps()
# gps()
# print ("UTC TIME RIGHT NOW =" + hour+":"+mins+"."+sec)
# print ("Latitude =" + latitude)
# print ("Longtitude =" + longtitude)
