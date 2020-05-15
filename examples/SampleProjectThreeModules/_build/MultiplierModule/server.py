from concurrent import futures
import time
import math
import logging
import configparser

import grpc
from interface import multipliermodule_pb2, multipliermodule_pb2_grpc
from implementation import MultiplierModule


class MultiplierModuleServicer(multipliermodule_pb2_grpc.MultiplierModuleServicer):
    def __init__(self):
        pass

    # def Add(self, request, context):
    #     a = request.a
    #     b = request.b
    #     try:
    #         result = MultiplierModule.add(a, b)
    #     except:
    #         logging.error("AHHH!!! ADD!!")

    #     return multipliermodule_pb2.AddReply(result=result)

    def Quadruple(self, request, context):
        a = request.a
        try:
            result = MultiplierModule.quadruple(a)
        except Exception as e:
            logging.error(e)
        return multipliermodule_pb2.QuadrupleResponse(result=result)

    def TimesSix(self, request, context):
        a = request.a
        try:
            result = MultiplierModule.timesSix(a)
        except Exception as e:
            logging.error(e)
        return multipliermodule_pb2.TimesSixResponse(result=result)




def serve(port):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    multipliermodule_pb2_grpc.add_MultiplierModuleServicer_to_server(
        MultiplierModuleServicer(), server)
    logging.info("Serving on port {}...".format(port))
    server.add_insecure_port('[::]:{}'.format(port))
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('.env')
    port = int(config['config']['port'])
    logging.basicConfig()
    serve(port)
