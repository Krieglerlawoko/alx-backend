#!/usr/bin/env python3
"""
Infer appropriate time zone
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel, _
import pytz
from pytz import exceptions


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

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user():
    """
    Get user by ID
    """
    user_id = request.args.get('login_as')
    if user_id and int(user_id) in users:
        return users.get(int(user_id))
    return None


@app.before_request
def before_request():
    """
    Before request handler
    """
    g.user = get_user()


@babel.localeselector
def get_locale():
    """
    Get locale from request
    """
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    if g.user:
        user_locale = g.user.get('locale')
        if user_locale in app.config['LANGUAGES']:
            return user_locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone():
    """
    Get timezone from request
    """
    tz = request.args.get('timezone')
    if tz:
        try:
            return pytz.timezone(tz).zone
        except exceptions.UnknownTimeZoneError:
            pass
    if g.user:
        user_tz = g.user.get('timezone')
        if user_tz:
            try:
                return pytz.timezone(user_tz).zone
            except exceptions.UnknownTimeZoneError:
                pass
    return app.config['BABEL_DEFAULT_TIMEZONE']


@app.route('/')
def index():
    """
    Index route
    """
    return render_template('7-index.html')


if __name__ == "__main__":
    app.run()
