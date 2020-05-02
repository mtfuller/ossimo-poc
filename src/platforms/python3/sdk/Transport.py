from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json

class Transport:
    controllerInstance = None

    class TransportHandler(BaseHTTPRequestHandler):
        def _set_response(self):
            self.send_response(200)
            self.send_header('Content-type', 'text/json')
            self.end_headers()

        def _send_error(self):
            self.send_response(422)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            self.wfile.write("ERROR".encode('utf-8'))

        def _send_return(self, value):
            self.send_response(200)
            self.send_header('Content-type', 'text/json')
            self.end_headers()
            res_data = {
                "result": value
            }
            self.wfile.write(str(json.dumps(res_data)).encode('utf-8'))

        def do_POST(self):
            content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
            post_data = self.rfile.read(content_length)
            try:
                req_data = json.loads(post_data.decode('utf-8'))
            except:
                self._send_error()
                return

            methodName = str(self.path[1:])
            args = req_data
            print("Invoking {}({})...".format(methodName, args))
            val = Transport.controllerInstance.invoke(methodName, args)
            print(" = {}".format(val))

            self._send_return(val)

    def __init__(self, controller, port):
        self.controller = controller
        if Transport.controllerInstance == None:
            Transport.controllerInstance = self.controller
        self.port = port
        self.server = HTTPServer(('', self.port), Transport.TransportHandler)

    def start(self):
        print("Starting...")
        self.server.serve_forever()

    def stop(self):
        print("Stopping...")
        self.server.server_close()
    