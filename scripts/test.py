# this script is needed because on github pages everything is on /digital-garden/...
# and to test we need to emulate this behaviour

import http.server
import socketserver

PORT = 8080

class RedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/digital-garden/'):
            new_path = self.path.replace('/digital-garden/', '/')
            self.send_response(301)
            self.send_header('Location', new_path)
            self.end_headers()
        else:
            super().do_GET()

Handler = RedirectHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
