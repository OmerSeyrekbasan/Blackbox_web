import bluetooth
import obd
import subprocess
import time
import sys
from os import system


speed = obd.commands.SPEED
rpm = obd.commands.RPM





def start_bluetooth():
    print("starting connection")
    bd_addr = "00:1D:A5:68:98:8A"
    subprocess.Popen(
        ["sudo", "rfcomm", "connect", "1", bd_addr], stderr=subprocess.STDOUT)
    time.sleep(5)
    start_obd()



def start_obd():
    print("initializing obd connection!")
    ports = obd.scan_serial()
    print(ports)
    global connection
    connection = obd.OBD("/dev/rfcomm1")
    print("obd connection initialized!")


def run():
    obd_values = {}
    val = connection.query(speed)
    if (val.is_null()):
        obd_values['speed'] = 0
    else:
        obd_values['speed'] = val.value.magnitude
    val = connection.query(rpm)
    if (val.is_null()):
        obd_values['rpm'] = 0
    else :
        obd_values['rpm'] = val.value.magnitude

    return obd_values

# def obd_to_json():
#     responses = run()
#     json = '{ "obd": {"speed":'
#     json += str(responses['speed'])+ ', "rpm" :'
#     json += str(responses['rpm']) + ' } }'
#     return json


def obd_to_json():
    responses = run()
    json = '{ "speed":'
    json += str(responses['speed']) + ', "rpm" :'
    json += str(responses['rpm']) + '}'
    return json
