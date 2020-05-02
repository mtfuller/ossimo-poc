class ControllerMethod:
    def __init__(self, name, paramList, returnType, callableFunction):
        self.name = name
        self.paramList = paramList
        self.returnType = returnType
        self.callableFunction = callableFunction

class ControllerMethodBuilder(ControllerMethod):
    def __init__(self, name):
        self.name = name
        self.paramList = []
        self.returnType = None
        self.callableFunction = None
    
    def addParameter(self, name, datatype):
        param = {
            "name": name,
            "datatype": datatype
        }
        self.paramList.append(param)
    
    def setReturnType(self, returnType):
        self.returnType = returnType

    def setCallableFunction(self, callableFunction):
        self.callableFunction = callableFunction

    def build(self):
        return ControllerMethod(
            self.name,
            self.paramList,
            self.returnType,
            self.callableFunction
        )

class Controller:
    def __init__(self):
        self.methods = {}

    def registerMethod(self, controllerMethod):
        if controllerMethod.name in self.methods:
            raise Exception("The method '{}' was already registered.".format(controllerMethod.name))
        self.methods[controllerMethod.name] = controllerMethod

    def invoke(self, name, argDict):
        if name not in self.methods:
            raise Exception("The name {} is not a method".format(name))
        method = self.methods[name]

        if len(argDict) != len(method.paramList):
            raise Exception("The number of params is not correct for {}".format(name))

        finalArgs = []
        for expectedParam in method.paramList:
            if expectedParam["name"] not in argDict:
                raise Exception("{} not in {}".format(expectedParam["name"], argDict))

            argumentValue = argDict[expectedParam["name"]]
            try:
                parsedValue = expectedParam["datatype"](argumentValue)
                finalArgs.append(parsedValue)
            except:
                raise Exception("The param {} with value {} is not of type {}".format(expectedParam["name"], argumentValue, ExpectedType))

        try:
            returnValue = method.callableFunction(*finalArgs)
        except:
            raise Exception("The function {} failed with exception".format(method.name))

        try:
            finalReturnValue = method.returnType(returnValue)
        except:
            raise Exception("The return value {} is not expected".format(returnValue))

        return finalReturnValue
        