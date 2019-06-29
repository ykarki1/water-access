#!/usr/bin/env python
# coding: utf-8

#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
# * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * #
# *                                                                                               * #
# ? * * * * * * * * * * * * * * * * * / Water Access Project: Setup / * * * * * * * * * * * * * * * *@
# *                                                                                               * #
# * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * #
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8

# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# ? * * * * * * * * * * * * * * * / Dependencies + Decleration Methods / * * * * * * * * * * * * * * *@
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @

import pandas as pd
from splinter import Browser
import time
import os
import subprocess
# ansi colors package
# import colors
import time
import datetime
# used with debugging
# from rfc3339 import rfc3339
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect
import zipfile
from flask import Flask, redirect, url_for, render_template, g, request, jsonify

#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
# * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * #
# *                                                                                               * #
# ? * * * * * * * * * * * * * * * * * / Auxillary Method Library / * * * * * * * * * * * * * * * * * @
# *                                                                                               * #
# * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * #
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8


def init_splinter():
    '''
        init_splinter() initializes and returns an automated Chrome web browser for us to use for
    scraping.
    '''
    print('Initizalizing Splinter Browser...\n')
    time.sleep(2)
    if (os.name == "posix"):
        executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    elif (os.name == "nt"):
        executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)
    return browser


def init_global_flask():
    '''
        init_global_flask() initializes Flask to be used globally as a const among other programs,
    it returns its app var out to main for use.
    '''
    app = Flask(__name__)
    ############################################
    return app


def scrape_worldbank():
    '''
        world bank's data export is downloaded to the users [hopefully] ~/Downloads folder
    '''
    browser = init_splinter()
    browser.driver.minimize_window()
    url = "http://api.worldbank.org/v2/en/indicator/SH.H2O.SMDW.ZS?downloadformat=csv"
    browser.visit(url)

# ????
# def scrape_deaths():
#    browser = init_splinter()
#    #browser.driver.minimize_window()
#    browser.visit("https://ourworldindata.org/grapher/death-rate-unsafe-water-source?country=CAF")
#    browser.find_by_xpath("/html/body/main/figure/div/div[4]/div/a")
# ????

# todo make this os.filepath.join instead


def get_slash():
    '''
        Returns the correct slash for the os type (either forward or backwards).
    '''
    if (os.name == "posix"):
        slash = "/"
    elif (os.name == "nt"):
        slash = "\\"
    return slash


def declare_locs(slash):
    '''
        the downloads dir, filename, and full path are declared and returned.
    '''
    data_dir = str(os.environ['HOME'] + slash + "Downloads" + slash)
    print(data_dir)
    data_file = "API_SH.H2O.SMDW.ZS_DS2_en_csv_v2_10581721.zip"
    data_loc = (data_dir + data_file)
    print(data_loc)
    return data_loc, data_dir


def extract(data_loc, data_dir):
    '''
        extracts the .csvs from the .zip archive that was scraped from worldbank
    '''
    zf = zipfile.ZipFile(data_loc, 'r')
    zf.extractall(data_dir)


def declare_csvs(data_dir):
    '''
        csvs' locs are declared as vars
    '''
    csv1_name = "API_SH.H2O.SMDW.ZS_DS2_en_csv_v2_10581721.csv"
    csv1 = (data_dir + csv1_name)
    print(csv1)
    csv2_name = "Metadata_Country_API_SH.H2O.SMDW.ZS_DS2_en_csv_v2_10581721.csv"
    csv2 = (data_dir + csv2_name)
    print(csv2)
    return csv1, csv2


def clean_data(csv1, csv2):
    '''
        csvs are cleaned into dataframes, merged into one encompassing
    '''
    csv1_DF = pd.read_csv(csv1, header=2)
    csv1_DF_clean = csv1_DF[["Country Name", "Country Code", "2000", "2001", "2002", "2003", "2004",
                             "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]].copy()
    # csv1_DF_clean = csv1_DF_clean.dropna(axis=0)
    csv1_DF_clean = csv1_DF_clean.drop(
        [62, 63, 229, 215, 151, 71, 132, 93, 103, 257], axis=0)
    csv1_DF_clean.head()
    #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*##*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
    csv2_DF = pd.read_csv(csv2)
    csv2_DF_clean = csv2_DF.drop(["Unnamed: 5"], axis=1).dropna(axis=0)
    csv2_DF_clean.head()
    #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*##*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
    DF = pd.merge(csv1_DF_clean, csv2_DF_clean, on="Country Code", how="left")
    DF = DF.drop(["Region", "SpecialNotes", "TableName"], axis=1).copy()
    DF.to_csv("water_data.csv")
    DF.head()
    #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*##*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
    return DF


def create_db(DF):
    '''
        sqlite db is created from the cleaned and combined DataFrame
    '''
    engine = create_engine('sqlite:///water_data.sqlite', echo=True)
    DF.to_sql("water_data", con=engine, if_exists="replace")
    session = Session(engine)
    sqldata = session.execute("select * from water_data")
    # for item in test:
    #    print(item)
    #    print("\n")
    return sqldata

# ????


def clean_data_2012(csv1, csv2):
    '''
        csvs are cleaned into dataframes, merged into one encompassing
    '''
    csv1_DF = pd.read_csv(csv1, header=2)
    csv1_DF_clean = csv1_DF[["Country Name", "Country Code", "2012"]].copy()
    # csv1_DF_clean = csv1_DF_clean.dropna(axis=0)
    csv1_DF_clean = csv1_DF_clean.drop(
        [62, 63, 229, 215, 151, 71, 132, 93, 103, 257], axis=0)
    csv1_DF_clean.head()
    #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*##*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
    csv2_DF = pd.read_csv(csv2)
    csv2_DF_clean = csv2_DF.drop(["Unnamed: 5"], axis=1).dropna(axis=0)
    csv2_DF_clean.head()
    #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*##*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
    DF = pd.merge(csv1_DF_clean, csv2_DF_clean, on="Country Code", how="left")
    DF = DF.drop(["Region", "SpecialNotes", "TableName"], axis=1).copy()
    DF.to_csv("water_data_2012.csv")
    DF.head()
    #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*##*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
    return DF


def create_db_2012(DF):
    '''
        sqlite db is created from the cleaned and combined DataFrame
    '''
    engine = create_engine('sqlite:///water_data_2012.sqlite', echo=True)
    DF.to_sql("water_data_2012", con=engine, if_exists="replace")
    session = Session(engine)
    sqldata = session.execute("select * from water_data_2012")
    return sqldata
# ????


#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
# * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * #
# *                                                                                               * #
# ? * * * * * * * * * * * * * * * * * / Primary Method Library / * * * * * * * * * * * * * * * * * @
# *                                                                                               * #
# * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * #
#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
app = init_global_flask()


def do_all_the_things_2012():
    # scrape_worldbank()
    slash = get_slash()
    data_loc, data_dir = declare_locs(slash)
    extract(data_loc, data_dir)
    csv1, csv2 = declare_csvs(data_dir)
    DF = clean_data_2012(csv1, csv2)
    sqldata = create_db_2012(DF)
    return sqldata


def do_all_the_things():
    # scrape_worldbank()
    slash = get_slash()
    data_loc, data_dir = declare_locs(slash)
    extract(data_loc, data_dir)
    csv1, csv2 = declare_csvs(data_dir)
    DF = clean_data(csv1, csv2)
    sqldata = create_db(DF)
    return sqldata


def testhook():
    engine = create_engine('sqlite:///water_data_2012.sqlite', echo=True)
    session = Session(engine)
    sqldata = session.execute("select * from water_data_2012")
    return sqldata

def testhook2():
    engine = create_engine('sqlite:///water_data.sqlite', echo=True)
    session = Session(engine)
    sqldata = session.execute("select * from water_data")
    return sqldata


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/data_all')
def return_data_all():
    #all_data = do_all_the_things()
    all_data = testhook2()
    list_of_dicts = []
    for data in all_data:
        singledict = {}
        singledict[data["Country Name"]] = data[2:]
        list_of_dicts.append(singledict)
    return jsonify(list_of_dicts)


@app.route('/data_2012')
def return_data_2012():
    # all_data = do_all_the_things_2012()
    all_data = testhook()
    list_of_dicts = []
    for data in all_data:
        singledict = {}
        singledict[data["Country Name"]] = data[2:]
        list_of_dicts.append(singledict)
    return jsonify(list_of_dicts)

# @app.route('/testing')
# def tester():
# scrape_deaths()
# return str("done")


# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# ? * * * * * * * * * * * * * * * * * * * / Debugging Stuffs / * * * * * * * * * * * * * * * * * * * *@
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
'''
@app.before_request
def start_timer():
    g.start = time.time()

@app.after_request
def log_request(response):
    if request.path == '/favicon.ico':
        return response
    elif request.path.startswith('/static'):
        return response
    ############################################
    now = time.time()
    duration = round(now - g.start, 2)
    dt = datetime.datetime.fromtimestamp(now)
    timestamp = rfc3339(dt, utc=True)
    ############################################
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    host = request.host.split(':', 1)[0]
    args = dict(request.args)
    ############################################
    log_params = [('method', request.method, 'blue'),
                  ('path', request.path, 'blue'),
                  ('status', response.status_code, 'yellow'),
                  ('duration', duration, 'green'),
                  ('time', timestamp, 'magenta'), ('ip', ip, 'red'),
                  ('host', host, 'red'), ('params', args, 'blue')]
    ############################################
    request_id = request.headers.get('X-Request-ID')
    if request_id:
        log_params.append(('request_id', request_id, 'yellow'))
    ############################################
    parts = []
    for name, value, color in log_params:
        part = colors.color("{}={}".format(name, value), fg=color)
        parts.append(part)
    line = " ".join(parts)
    ############################################
    app.logger.info(line)
    ############################################
    return response
    '''

if __name__ == "__main__":
    app.run(debug=True)
