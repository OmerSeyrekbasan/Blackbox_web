import sys
import bluetooth
import uuid

client1 = ""
client2 = ""



def start_server():

    server_sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    server_sock.bind(("", bluetooth.PORT_ANY))
    server_sock.listen(1)

    port = server_sock.getsockname()[1]

    uuid = "1e0ca4ea-299d-4335-93eb-27fcfe7fa848"
    print(uuid)
    bluetooth.advertise_service(
        server_sock,
        "SampleServer",
        service_id=uuid,
        service_classes=[uuid, bluetooth.SERIAL_PORT_CLASS],
        profiles=[bluetooth.SERIAL_PORT_PROFILE])
    print(uuid)
    print("Waiting for connection on RFCOMM channel %d" % port)
    server_sock.settimeout(4)
    try:
        client_sock1, client_info1 = server_sock.accept()
        print("Accepted connection from ", client_info1)
        # client_sock2, client_info2 = server_sock.accept()
        # print("Accepted connection from ", client_info2)
        print(client_sock1)
        global client1
        global client2
        client1 = client_sock1
        # client2 = client_sock2
        return client_info1

    except bluetooth.BluetoothError:
        return_val = "e"
        return return_val





def phone_recv():
    global client1
    data = client1.recv(1024)
    msg = data.decode('utf-8')
    print(msg)
    return msg

# def watch_recv():
#     global client2
#     data = client2.recv(1024)
#     msg = data.decode('utf-8')
#     return msg


# def android_recv():
#     print("Sending Recv!")
#     data = sock.recv(1024)
#     msg = data.decode('utf-8')
#     return msg


# sock.close()
