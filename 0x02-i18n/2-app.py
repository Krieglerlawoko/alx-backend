#!/usr/bin/env python3
"""
Get locale from request
"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """
    Config class for Flask app
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """
    Get locale from request
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """
    Index route
    """
    return render_template('2-index.html')


if __name__ == "__main__":
    app.run()