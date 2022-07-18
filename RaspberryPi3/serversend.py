# -*- coding: utf-8 -*-
"""
Created on Sat Feb 24 19:11:26 2018

@author: omcdn
"""
import requests as req
import json

data = {"accelometer": {
        "xaxis":10,
        "yaxis":123,
        "zasdi":9.7}
}
#
#body = json.dumps(data)
#print (body)
#
url = "https://exercise-omerseyrekbasan.c9users.io/ws/2312123"

#r = req.post(url, data ="asdasd" )
#
#print (r.request.body)
#print (r.status_code)
headers = {'content-type': 'application/json'}
#payload = {'some': 'data'}

r = req.post(url, data=json.dumps(data) , headers = headers)
print(r.request.body)