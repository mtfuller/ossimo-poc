from .client import __TriplerModule

import configparser

__config = configparser.ConfigParser()
__config.read('.env')

TriplerModule = __TriplerModule(int(__config['TriplerModule']['port']))