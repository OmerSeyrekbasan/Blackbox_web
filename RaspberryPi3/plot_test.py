# -*- coding: utf-8 -*-
"""
Created on Mon Mar  5 20:20:18 2018

@author: omcdn
"""
import numpy as np
import matplotlib.pyplot as plt
xaxis, x, y, z = [1,2,3], [4,5,6], [2,5,7], [7,5,3]
plt.plot(xaxis, np.rad2deg(x), color = "blue", label = "xaxis")
plt.plot(xaxis, np.rad2deg(y), color = "red", label = "yaxis")
plt.plot(xaxis, np.rad2deg(z), color = "black", label = "zaxis")
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.show()