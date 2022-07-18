import gyro
from websocket import create_connection
import time 
from datetime import datetime

driver_number = '"DEV_#1"'
pi_no = '"DEV_PI_#1"'

"""current route is to /ws---Change if needeed"""
ws = create_connection("ws://exercise-omerseyrekbasan.c9users.io/ws")
print("connected")

def calc_date():
    return (datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"))

def add_info(data):
    data = data[:-1]
    data += ',' + '"timeSent":' + '"'
    data +=str(calc_date())
    data += '"' + ','
    data += '"user":' + driver_number + ","
    data += '"pi_no":' + str(pi_no)
    data += "}"
    print (data)
    return data


print ("Connection Established!")
while True:
    data = gyro.gyro_to_json()
    edit_data = add_info(data)
    ws.send(edit_data)
    time.sleep(10)
ws.close()




