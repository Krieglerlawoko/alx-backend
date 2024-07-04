#!/usr/bin/env python3
"""
Flask application to render a simple 'Hello world' page with internationalization.
"""

from flask import Flask, render_template
from flask_babel import Babel, gettext as _
from typing import Any

app = Flask(__name__)
app.config['BABEL_DEFAULT_LOCALE'] = 'en'
babel = Babel(app)

@app.route('/')
def index() -> Any:
    """
    Render the index page with translations.

    Returns:
        The rendered template for the index page.
    """
    return render_template('3-index.html')

if __name__ == '__main__':
    app.run(debug=True)
