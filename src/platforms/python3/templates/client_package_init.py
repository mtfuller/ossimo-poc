from .client import __{{MODULE_NAME}}

import configparser

__config = configparser.ConfigParser()
__config.read('.env')

{{MODULE_NAME}} = __{{MODULE_NAME}}(int(__config['{{MODULE_NAME}}']['port']))