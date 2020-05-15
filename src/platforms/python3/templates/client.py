from __future__ import print_function

import random
import logging

import grpc

from .interface import {{MODULE_PACKAGE_NAME}}_pb2, {{MODULE_PACKAGE_NAME}}_pb2_grpc

class __{{MODULE_NAME}}:
    def __init__(self, port):
        self.server_address = 'localhost:{}'.format(port)
    
    # def add(self, a, b):
    #     request = samplemodule_pb2.AddRequest(a=a, b=b)

    #     with grpc.insecure_channel(self.server_address) as channel:
    #         stub = samplemodule_pb2_grpc.SampleModuleStub(channel)
    #         myResult = stub.Add(request)

    #     return myResult
{{MODULE_CLIENT_METHODS}}