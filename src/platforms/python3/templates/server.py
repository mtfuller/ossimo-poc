from concurrent import futures
import time
import math
import logging
import configparser

import grpc
from grpc_reflection.v1alpha import reflection
from interface import {{MODULE_PACKAGE_NAME}}_pb2, {{MODULE_PACKAGE_NAME}}_pb2_grpc
from implementation import {{MODULE_NAME}}


class {{MODULE_NAME}}Servicer({{MODULE_PACKAGE_NAME}}_pb2_grpc.{{MODULE_NAME}}Servicer):
    def __init__(self):
        pass

    # def Add(self, request, context):
    #     a = request.a
    #     b = request.b
    #     try:
    #         result = {{MODULE_NAME}}.add(a, b)
    #     except:
    #         logging.error("AHHH!!! ADD!!")

    #     return {{MODULE_PACKAGE_NAME}}_pb2.AddReply(result=result)

{{MODULE_SERVER_METHODS}}


def serve(port):
    try:
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        {{MODULE_PACKAGE_NAME}}_pb2_grpc.add_{{MODULE_NAME}}Servicer_to_server(
            {{MODULE_NAME}}Servicer(), server)
        logging.info("Serving on port {}...".format(port))
        SERVICE_NAMES = (
            {{MODULE_PACKAGE_NAME}}_pb2.DESCRIPTOR.services_by_name['{{MODULE_NAME}}'].full_name,
            reflection.SERVICE_NAME,
        )
        reflection.enable_server_reflection(SERVICE_NAMES, server)
        server.add_insecure_port('[::]:{}'.format(port))
        server.start()
        server.wait_for_termination()
    except Exception as e:
        print(e)


if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('.env')
    port = int(config['config']['port'])
    logging.basicConfig()
    serve(port)
