"""Dev server for The Sommelier's Codex.

Same as `python -m http.server` but sends Cache-Control: no-cache so the
browser always revalidates — edited files show up on plain reload instead
of hiding behind the heuristic HTTP cache. (In production the service
worker owns caching; this server is for development only.)

Usage: py serve.py [port]
"""
import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    # SimpleHTTPRequestHandler answers HTTP/1.0 by default, closing the
    # connection after every response. Chrome refuses to register a service
    # worker over that, with only "an unknown error occurred when fetching
    # the script" to say so, and the offline shell therefore cannot be tested
    # locally at all. HTTP/1.1 needs accurate Content-Length, which this
    # handler already sends for every file it serves.
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8632
    root = Path(__file__).parent
    os.chdir(root)
    print(f"Serving {root} at http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
