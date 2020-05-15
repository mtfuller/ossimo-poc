from concurrent import futures
import time
import math
import logging
import configparser

import grpc
from interface import triplermodule_pb2, triplermodule_pb2_grpc
from implementation import TriplerModule


class TriplerModuleServicer(triplermodule_pb2_grpc.TriplerModuleServicer):
    def __init__(self):
        pass

    # def Add(self, request, context):
    #     a = request.a
    #     b = request.b
    #     try:
    #         result = TriplerModule.add(a, b)
    #     except:
    #         logging.error("AHHH!!! ADD!!")

    #     return triplermodule_pb2.AddReply(result=result)

    def Triple(self, request, context):
        a = request.a
        try:
            result = TriplerModule.triple(a)
        except Exception as e:
            logging.error(e)
        return triplermodule_pb2.TripleResponse(result=result)




def serve(port):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    triplermodule_pb2_grpc.add_TriplerModuleServicer_to_server(
        TriplerModuleServicer(), server)
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
