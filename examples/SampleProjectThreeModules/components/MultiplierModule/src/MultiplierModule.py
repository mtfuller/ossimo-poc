from ossimo.components import DoublerModule, TriplerModule

def quadruple(a):
    val = DoublerModule.double(a)
    val = DoublerModule.double(val)
    return val

def timesSix(a):
    val = DoublerModule.double(a)
    val = TriplerModule.triple(val)
    return val