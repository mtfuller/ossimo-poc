from __future__ import print_function

import random
import logging

import grpc

from ossimo import multipliermodule_pb2, multipliermodule_pb2_grpc

class MultiplierModule:
    def __init__(self, port):
        self.server_address = 'localhost:{}'.format(port)
    
    # def add(self, a, b):
    #     request = samplemodule_pb2.AddRequest(a=a, b=b)

    #     with grpc.insecure_channel(self.server_address) as channel:
    #         stub = samplemodule_pb2_grpc.SampleModuleStub(channel)
    #         myResult = stub.Add(request)

    #     return myResult
    def quadruple(self, a):
        request = multipliermodule_pb2.QuadrupleRequest(a=a)
        with grpc.insecure_channel(self.server_address) as channel:
            stub = multipliermodule_pb2_grpc.MultiplierModuleStub(channel)
            myResult = stub.Quadruple(request)
        return myResult.result

    def timesSix(self, a):
        request = multipliermodule_pb2.TimesSixRequest(a=a)
        with grpc.insecure_channel(self.server_address) as channel:
            stub = multipliermodule_pb2_grpc.MultiplierModuleStub(channel)
            myResult = stub.TimesSix(request)
        return myResult.result

