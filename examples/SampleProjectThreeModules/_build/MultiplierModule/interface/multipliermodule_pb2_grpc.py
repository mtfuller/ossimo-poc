# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

from . import multipliermodule_pb2 as multipliermodule__pb2


class MultiplierModuleStub(object):
    """Missing associated documentation comment in .proto file"""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Quadruple = channel.unary_unary(
                '/multipliermodule.MultiplierModule/Quadruple',
                request_serializer=multipliermodule__pb2.QuadrupleRequest.SerializeToString,
                response_deserializer=multipliermodule__pb2.QuadrupleResponse.FromString,
                )
        self.TimesSix = channel.unary_unary(
                '/multipliermodule.MultiplierModule/TimesSix',
                request_serializer=multipliermodule__pb2.TimesSixRequest.SerializeToString,
                response_deserializer=multipliermodule__pb2.TimesSixResponse.FromString,
                )


class MultiplierModuleServicer(object):
    """Missing associated documentation comment in .proto file"""

    def Quadruple(self, request, context):
        """Missing associated documentation comment in .proto file"""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def TimesSix(self, request, context):
        """Missing associated documentation comment in .proto file"""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_MultiplierModuleServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Quadruple': grpc.unary_unary_rpc_method_handler(
                    servicer.Quadruple,
                    request_deserializer=multipliermodule__pb2.QuadrupleRequest.FromString,
                    response_serializer=multipliermodule__pb2.QuadrupleResponse.SerializeToString,
            ),
            'TimesSix': grpc.unary_unary_rpc_method_handler(
                    servicer.TimesSix,
                    request_deserializer=multipliermodule__pb2.TimesSixRequest.FromString,
                    response_serializer=multipliermodule__pb2.TimesSixResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'multipliermodule.MultiplierModule', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class MultiplierModule(object):
    """Missing associated documentation comment in .proto file"""

    @staticmethod
    def Quadruple(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/multipliermodule.MultiplierModule/Quadruple',
            multipliermodule__pb2.QuadrupleRequest.SerializeToString,
            multipliermodule__pb2.QuadrupleResponse.FromString,
            options, channel_credentials,
            call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def TimesSix(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/multipliermodule.MultiplierModule/TimesSix',
            multipliermodule__pb2.TimesSixRequest.SerializeToString,
            multipliermodule__pb2.TimesSixResponse.FromString,
            options, channel_credentials,
            call_credentials, compression, wait_for_ready, timeout, metadata)
