import os
from setuptools import find_packages, setup

with open(os.path.join(os.path.dirname(__file__), 'README.rst')) as readme:
    README = readme.read()

os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

install_requires = [
    'Django>=1.11.20,<2.0.0', 'django-leaflet>=0.24.0',
    'djangorestframework>=3.9.1', 'geojson>=2.4.1', 'numpy>=1.16.1',
    'pandas>=0.24.1', 'psycopg2>=2.7.7', 'python-dateutil>=2.8.0',
    'pytz>=2018.9', 'six==1.12.0'
]

setup(
    name='explorer',
    version='0.1',
    packages=['explorer'],
    include_package_data=True,
    licence="MIT",
    description="Explorer is a simple Django app to view points on the map.",
    long_description=README,
    url="https://github.com/OpenUpSA/explorer",
    author="OpenUp",
    author_email="info@openup.org.za",
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: X.Y',  # replace "X.Y" as appropriate
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT Licence',  # example license
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        # Replace these appropriately if you are stuck on Python 2.
        'Programming Language :: Python :: 2.7',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ])
