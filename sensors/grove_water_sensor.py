#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# The MIT License (MIT)
#
# Grove Base Hat for the Raspberry Pi, used to connect grove sensors.
# Copyright (C) 2018  Seeed Technology Co.,Ltd.
'''
This is the code for
    - `Grove - Water Sensor <https://www.seeedstudio.com/Grove-Water-Sensor-p-748.html>`_

Examples:

    .. code-block:: python

        import time
        from grove.grove_water_sensor import GroveWaterSensor

        # connect to alalog pin 2(slot A2)
        PIN = 2

        sensor = GroveWaterSensor(PIN)

        print('Detecting ...')
        while True:
        value = sensor.value
            if sensor.value > 800:
                print("{}, Detected Water.".format(value))
            else:
                print("{}, Dry.".format(value))

            time.sleep(.1)
'''
import time
import sys
import math
from grove.adc import ADC
import requests


__all__ = ["GroveWaterSensor"]


class GroveWaterSensor:
    '''
    Grove Water Sensor class

    Args:
        pin(int): number of analog pin/channel the sensor connected.
    '''

    def __init__(self, channel):
        self.channel = channel
        self.adc = ADC()

    @property
    def value(self):
        '''
        Get the water strength value

        Returns:
            (int): ratio, 0(0.0%) - 1000(100.0%)
        '''
        return self.adc.read(self.channel)


Grove = GroveWaterSensor


def main():
    from grove.helper import SlotHelper
    sh = SlotHelper(SlotHelper.ADC)
    pin = sh.argv2pin()

    sensor = GroveWaterSensor(pin)

    wet = True

    print('Detecting ...')
    empty = 0
    water = 0
    while True:
        value = sensor.value
        if sensor.value > 800:
            if wet == True:
                empty += 1
                if empty == 50:
                    print("{}, Dry.".format(value))
                    try:
                        requests.post('http://localhost:1337/water',
                                      json={"Water": False})
                    except Exception:
                        pass
                    wet = False
                    empty = 0
                    water = 0

        else:
            if wet == False:
                water += 1
                if water == 50:
                    print("{}, Detected Water.".format(value))
                    try:
                        requests.post('http://localhost:1337/water',
                                      json={"Water": True})
                    except Exception:
                        pass
                    wet = True
                    water = 0
                    empty = 0
        time.sleep(.1)


if __name__ == '__main__':
    main()
