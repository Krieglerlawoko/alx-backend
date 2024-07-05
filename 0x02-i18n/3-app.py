#!/usr/bin/env python3
"""
A Basic Flask application.
"""
from flask import Flask, request, render_template
from flask_babel import Babel


class Config:
    """
    Configuration class for the Flask application.
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# Instantiate the application object
app = Flask(__name__)
app.config.from_object(Config)

# Wrap the application with Babel
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """
    Gets locale from request object.

    Returns:
        str: Best match for supported languages.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def index() -> str:
    """
    Renders a basic HTML template.

    Returns:
        str: Rendered HTML for the homepage.
    """
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run()
