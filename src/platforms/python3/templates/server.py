from concurrent import futures
import time
import math
import logging
import sys

import grpc
from ossimo import {{MODULE_PACKAGE_NAME}}_pb2, {{MODULE_PACKAGE_NAME}}_pb2_grpc
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
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    {{MODULE_PACKAGE_NAME}}_pb2_grpc.add_{{MODULE_NAME}}Servicer_to_server(
        {{MODULE_NAME}}Servicer(), server)
    logging.info("Serving on port {}...".format(port))
    server.add_insecure_port('[::]:{}'.format(port))
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    port = sys.argv[1]
    logging.basicConfig()
    serve(port)
