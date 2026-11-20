import http.server
import os

PORT = 8081
DOCS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DOCS_DIR, **kwargs)

with http.server.HTTPServer(('', PORT), Handler) as httpd:
    print(f'Serving docs at http://localhost:{PORT}')
    httpd.serve_forever()
