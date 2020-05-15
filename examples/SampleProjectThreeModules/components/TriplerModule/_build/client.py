from __future__ import print_function

import random
import logging

import grpc

from ossimo import triplermodule_pb2, triplermodule_pb2_grpc

class TriplerModule:
    def __init__(self, port):
        self.server_address = 'localhost:{}'.format(port)
    
    # def add(self, a, b):
    #     request = samplemodule_pb2.AddRequest(a=a, b=b)

    #     with grpc.insecure_channel(self.server_address) as channel:
    #         stub = samplemodule_pb2_grpc.SampleModuleStub(channel)
    #         myResult = stub.Add(request)

    #     return myResult
    def triple(self, a):
        request = triplermodule_pb2.TripleRequest(a=a)
        with grpc.insecure_channel(self.server_address) as channel:
            stub = triplermodule_pb2_grpc.TriplerModuleStub(channel)
            myResult = stub.Triple(request)
        return myResult

