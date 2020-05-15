from __future__ import print_function

import random
import logging

import grpc

from .ossimo import doublermodule_pb2, doublermodule_pb2_grpc

class __DoublerModule:
    def __init__(self, port):
        self.server_address = 'localhost:{}'.format(port)
    
    # def add(self, a, b):
    #     request = samplemodule_pb2.AddRequest(a=a, b=b)

    #     with grpc.insecure_channel(self.server_address) as channel:
    #         stub = samplemodule_pb2_grpc.SampleModuleStub(channel)
    #         myResult = stub.Add(request)

    #     return myResult
    def double(self, a):
        request = doublermodule_pb2.DoubleRequest(a=a)
        with grpc.insecure_channel(self.server_address) as channel:
            stub = doublermodule_pb2_grpc.DoublerModuleStub(channel)
            myResult = stub.Double(request)
        return myResult.result