# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: multipliermodule.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='multipliermodule.proto',
  package='multipliermodule',
  syntax='proto3',
  serialized_options=None,
  serialized_pb=b'\n\x16multipliermodule.proto\x12\x10multipliermodule\"\x1d\n\x10QuadrupleRequest\x12\t\n\x01\x61\x18\x01 \x01(\x05\"#\n\x11QuadrupleResponse\x12\x0e\n\x06result\x18\x01 \x01(\x05\"\x1c\n\x0fTimesSixRequest\x12\t\n\x01\x61\x18\x01 \x01(\x05\"\"\n\x10TimesSixResponse\x12\x0e\n\x06result\x18\x01 \x01(\x05\x32\xbf\x01\n\x10MultiplierModule\x12V\n\tQuadruple\x12\".multipliermodule.QuadrupleRequest\x1a#.multipliermodule.QuadrupleResponse\"\x00\x12S\n\x08TimesSix\x12!.multipliermodule.TimesSixRequest\x1a\".multipliermodule.TimesSixResponse\"\x00\x62\x06proto3'
)




_QUADRUPLEREQUEST = _descriptor.Descriptor(
  name='QuadrupleRequest',
  full_name='multipliermodule.QuadrupleRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='a', full_name='multipliermodule.QuadrupleRequest.a', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=44,
  serialized_end=73,
)


_QUADRUPLERESPONSE = _descriptor.Descriptor(
  name='QuadrupleResponse',
  full_name='multipliermodule.QuadrupleResponse',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='result', full_name='multipliermodule.QuadrupleResponse.result', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=75,
  serialized_end=110,
)


_TIMESSIXREQUEST = _descriptor.Descriptor(
  name='TimesSixRequest',
  full_name='multipliermodule.TimesSixRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='a', full_name='multipliermodule.TimesSixRequest.a', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=112,
  serialized_end=140,
)


_TIMESSIXRESPONSE = _descriptor.Descriptor(
  name='TimesSixResponse',
  full_name='multipliermodule.TimesSixResponse',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='result', full_name='multipliermodule.TimesSixResponse.result', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=142,
  serialized_end=176,
)

DESCRIPTOR.message_types_by_name['QuadrupleRequest'] = _QUADRUPLEREQUEST
DESCRIPTOR.message_types_by_name['QuadrupleResponse'] = _QUADRUPLERESPONSE
DESCRIPTOR.message_types_by_name['TimesSixRequest'] = _TIMESSIXREQUEST
DESCRIPTOR.message_types_by_name['TimesSixResponse'] = _TIMESSIXRESPONSE
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

QuadrupleRequest = _reflection.GeneratedProtocolMessageType('QuadrupleRequest', (_message.Message,), {
  'DESCRIPTOR' : _QUADRUPLEREQUEST,
  '__module__' : 'multipliermodule_pb2'
  # @@protoc_insertion_point(class_scope:multipliermodule.QuadrupleRequest)
  })
_sym_db.RegisterMessage(QuadrupleRequest)

QuadrupleResponse = _reflection.GeneratedProtocolMessageType('QuadrupleResponse', (_message.Message,), {
  'DESCRIPTOR' : _QUADRUPLERESPONSE,
  '__module__' : 'multipliermodule_pb2'
  # @@protoc_insertion_point(class_scope:multipliermodule.QuadrupleResponse)
  })
_sym_db.RegisterMessage(QuadrupleResponse)

TimesSixRequest = _reflection.GeneratedProtocolMessageType('TimesSixRequest', (_message.Message,), {
  'DESCRIPTOR' : _TIMESSIXREQUEST,
  '__module__' : 'multipliermodule_pb2'
  # @@protoc_insertion_point(class_scope:multipliermodule.TimesSixRequest)
  })
_sym_db.RegisterMessage(TimesSixRequest)

TimesSixResponse = _reflection.GeneratedProtocolMessageType('TimesSixResponse', (_message.Message,), {
  'DESCRIPTOR' : _TIMESSIXRESPONSE,
  '__module__' : 'multipliermodule_pb2'
  # @@protoc_insertion_point(class_scope:multipliermodule.TimesSixResponse)
  })
_sym_db.RegisterMessage(TimesSixResponse)



_MULTIPLIERMODULE = _descriptor.ServiceDescriptor(
  name='MultiplierModule',
  full_name='multipliermodule.MultiplierModule',
  file=DESCRIPTOR,
  index=0,
  serialized_options=None,
  serialized_start=179,
  serialized_end=370,
  methods=[
  _descriptor.MethodDescriptor(
    name='Quadruple',
    full_name='multipliermodule.MultiplierModule.Quadruple',
    index=0,
    containing_service=None,
    input_type=_QUADRUPLEREQUEST,
    output_type=_QUADRUPLERESPONSE,
    serialized_options=None,
  ),
  _descriptor.MethodDescriptor(
    name='TimesSix',
    full_name='multipliermodule.MultiplierModule.TimesSix',
    index=1,
    containing_service=None,
    input_type=_TIMESSIXREQUEST,
    output_type=_TIMESSIXRESPONSE,
    serialized_options=None,
  ),
])
_sym_db.RegisterServiceDescriptor(_MULTIPLIERMODULE)

DESCRIPTOR.services_by_name['MultiplierModule'] = _MULTIPLIERMODULE

# @@protoc_insertion_point(module_scope)
