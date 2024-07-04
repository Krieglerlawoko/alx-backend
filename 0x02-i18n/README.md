alx 0x02-i18n project readme file

# Flask Hello World Application with Internationalization

This is a simple Flask application that renders a 'Hello world' message with internationalization support using Flask-Babel.

## Getting Started

### Prerequisites

- Python 3.6 or higher
- Flask
- Flask-Babel

### Installation

1. Clone the repository:
    bash
    git clone <repository-url>
    
2. Navigate to the project directory:
    bash
    cd <project-directory>
    
3. Install the required packages:
    bash
    pip install flask flask-babel
    

### Usage

1. Extract messages and initialize translations:
    bash
    pybabel extract -F babel.cfg -o messages.pot .
    pybabel init -i messages.pot -d translations -l en
    pybabel init -i messages.pot -d translations -l fr
    
2. Edit the translation files (`translations/en/LC_MESSAGES/messages.po` and `translations/fr/LC_MESSAGES/messages.po`) to provide the translations.

3. Compile the translations:
    bash
    pybabel compile -d translations
    

4. Run the Flask application:
    bash
    ./3-app.py
    

5. Open your browser and go to `http://127.0.0.1:5000/` to see the 'Hello world' message in the default language (English). To view the message in French, set the default locale to 'fr' in `3-app.py`.

## Code Style

This project adheres to the pycodestyle (version 2.5) style guide.

## Documentation

All modules, classes, and functions in this project are documented with descriptions of their purposes and functionalities.

