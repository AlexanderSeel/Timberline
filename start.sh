#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Open http://localhost:8797 in your browser"
python3 -m http.server 8797
