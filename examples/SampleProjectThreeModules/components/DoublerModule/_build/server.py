from concurrent import futures
import time
import math
import logging
import configparser

import grpc
from ossimo import doublermodule_pb2, doublermodule_pb2_grpc
from implementation import DoublerModule


class DoublerModuleServicer(doublermodule_pb2_grpc.DoublerModuleServicer):
    def __init__(self):
        pass

    # def Add(self, request, context):
    #     a = request.a
    #     b = request.b
    #     try:
    #         result = DoublerModule.add(a, b)
    #     except:
    #         logging.error("AHHH!!! ADD!!")

    #     return doublermodule_pb2.AddReply(result=result)

    def Double(self, request, context):
        print("DOUBLE!!!")
        a = request.a
        try:
            print(a)
            result = DoublerModule.double(a)
            print(result)
        except:
            logging.error("AHHH!!! ERROR!!")
        return doublermodule_pb2.DoubleResponse(result=result)




def serve(port):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    doublermodule_pb2_grpc.add_DoublerModuleServicer_to_server(
        DoublerModuleServicer(), server)
    logging.info("Serving on port {}...".format(port))
    server.add_insecure_port('[::]:{}'.format(port))
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('.env')
    port = int(config['config']['port'])
    print("Listening on {}...".format(port))
    logging.basicConfig()
    serve(port)
