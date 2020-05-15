from .client import __DoublerModule

import configparser

__config = configparser.ConfigParser()
__config.read('.env')

DoublerModule = __DoublerModule(int(__config['DoublerModule']['port']))