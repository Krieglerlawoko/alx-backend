#!/usr/bin/env python3
"""
Task 2: Get locale from request
"""

from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """
    Configuration class for Flask application.
    """
    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """
    Retrieves the locale for a web page.

    Returns:
        str: Best match for supported languages.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index() -> str:
    """
    Default route for the homepage.

    Returns:
        str: Rendered HTML for the homepage.
    """
    return render_template("3-index.html")


# Uncomment the following line and comment the @babel.localeselector
# if you encounter the error:
# AttributeError: 'Babel' object has no attribute 'localeselector'
# babel.init_app(app, locale_selector=get_locale)


if __name__ == "__main__":
    app.run()
