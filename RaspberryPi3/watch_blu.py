import bluetooth
import uuid

def main():
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

    client_sock1, client_info1 = server_sock.accept()
    print("Accepted connection from ", client_info1)
    # client_sock2, client_info2 = server_sock.accept()
    # print("Accepted connection from ", client_info2)

    #this part will try to get something form the client
    # you are missing this part - please see it's an endlees loop!!
    try:
        while True:
            data = client_sock1.recv(1024)
            if len(data) == 0: break
            print("received [%s]" % data)

    # raise an exception if there was any error
    except IOError:
        pass


    print("disconnected")

    client_sock1.close()
    # client_sock2.close()
    server_sock.close()

main()