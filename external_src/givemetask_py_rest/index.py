#!/usr/bin/python
from apps.app import create_app
from flask import abort

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)