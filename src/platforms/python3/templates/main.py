from ossimo.Transport import Transport
from ossimo.Controller import ControllerMethodBuilder, Controller
from ossimo.Datatypes import int32
from implementation.SampleModule import {{METHOD_LIST}}
import sys

def main(port):
    controller = Controller()

    # add Method
    #mulMethodBuilder = ControllerMethodBuilder('add')
    #mulMethodBuilder.addParameter('a', Int)
    #mulMethodBuilder.addParameter('b', Int)
    #mulMethodBuilder.setReturnType(Int)
    #mulMethodBuilder.setCallableFunction(add)
    #addMethod = mulMethodBuilder.build()
    #controller.registerMethod(addMethod)
 
{{INSERT}}

    transport = Transport(controller, port)
    try:
        transport.start()
    except KeyboardInterrupt:
        transport.stop()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise Exception("Missing arguments")

    port = int(sys.argv[1])

    main(port)