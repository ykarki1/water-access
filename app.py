#!/usr/bin/env python
# coding: utf-8
#
#* Created in June of 2019 by Joe, Kayti, Spaar, Yogi at UCBX for a Data Analytics Bootcamp Project.
#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#!--888**888**888**888--888--\   -----------------------------------   /--888--888**888**888**888--!#
#?-*-*-*-*-*-*-*-*-*-*-*-*-       Water Access Project: Dependencies       -*-*-*-*-*-*-*-*-*-*-*-*-#
#!--888**888**888**888--888--/   -----------------------------------   \--888--888**888**888**888--!#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |               Local: Munging               | * * * * * * * * * * * * *@
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
import pandas as pd
from splinter import Browser
import time, os, zipfile, time
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |               Remote: Serving               | * * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from flask import Flask, redirect, url_for, render_template, g, request, jsonify
#
#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#!--888**888**888**888--888--\  -------------------------------------  /--888--888**888**888**888--!#
#?-*-*-*-*-*-*-*-*-*-*-*-*-     Local: Scrape, Clean, Database (ETL)       -*-*-*-*-*-*-*-*-*-*-*-*-#
#!--888**888**888**888--888--/  -------------------------------------  \--888--888**888**888**888--!#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |               Local: Scraping               | * * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
def init_splinter():
    '''
        init_splinter() inits and returns an automated Chrome web browser for us to use for scraping.
    '''
    print('\n---------- Initizalizing Splinter Browser...\n')
    time.sleep(2)
    if (os.name == "posix"):
        executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    elif (os.name == "nt"):
        executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)
    return browser
#
def scrape_worldbank():
    '''
        World Bank's data export is downloaded to the users [hopefully] ~/Downloads folder
    '''
    browser = init_splinter()
    browser.driver.minimize_window()
    url = "http://api.worldbank.org/v2/en/indicator/SH.H2O.SMDW.ZS?downloadformat=csv"
    browser.visit(url)
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * |              Local: Cleaning Setup               | * * * * * * * * * * *@
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
def init_global_flask():
    '''
        init_global_flask() initializes Flask to be used globally as a const among other programs,
    it returns its app var out to main for use.
    '''
    app = Flask(__name__)
    return app
#
def get_slash():
    '''
        Returns the correct slash for the os type (either forward or backwards).
    '''
    if (os.name == "posix"):
        slash = "/"
    elif (os.name == "nt"):
        slash = "\\"
    return slash
#
def declare_locs(slash):
    '''
        The user's downloads dir, filename of dl'd .zip, and full path are declared and returned.
    '''
    data_dir = str(os.environ['HOME'] + slash + "Downloads" + slash)
    print('\n---------- Using Downloads Dir of: ' + data_dir + '\n')
    data_file = "API_SH.H2O.SMDW.ZS_DS2_en_csv_v2_10581721.zip"
    data_loc = (data_dir + data_file)
    print('\n---------- Using File: ' + data_loc + '\n')
    return data_loc, data_dir
#
def extract(data_loc, data_dir):
    '''
        Extracts the .csvs from the .zip archive that was scraped from World Bank.
    '''
    zf = zipfile.ZipFile(data_loc, 'r')
    zf.extractall(data_dir)
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |               Local: Cleaning               | * * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
#
def declare_csvs(data_dir):
    '''
        The extracted .csvs' locations are declared as variables to use with Pandas.
    '''
    csv1_name = "API_SH.H2O.SMDW.ZS_DS2_en_csv_v2_10581721.csv"
    csv1 = (data_dir + csv1_name)
    print('\n---------- Percentage with Access to Clean Water CSV is Using: ' + csv1 + '\n')
    csv2_name = "Metadata_Country_API_SH.H2O.SMDW.ZS_DS2_en_csv_v2_10581721.csv"
    csv2 = (data_dir + csv2_name)
    print('\n---------- Income Level by GDP Tier is Using: ' + csv2 + '\n')
    return csv1, csv2
#
def clean_data(csv1, csv2):
    '''
        The .csvs are cleaned into DataFrames, then merged into one all-encompassing container - All years..
    '''
    csv1_DF = pd.read_csv(csv1, header=2)
    csv1_DF_clean = csv1_DF[["Country Name", "Country Code", "2000", "2001", "2002", "2003", "2004",
                             "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]].copy()
    csv1_DF_clean = csv1_DF_clean.drop(
        [62, 63, 229, 215, 151, 71, 132, 93, 103, 257], axis=0)
    csv1_DF_clean.head()
    ''''''
    csv2_DF = pd.read_csv(csv2)
    csv2_DF_clean = csv2_DF.drop(["Unnamed: 5"], axis=1).dropna(axis=0)
    csv2_DF_clean.head()
    ''''''
    DF = pd.merge(csv1_DF_clean, csv2_DF_clean, on="Country Code", how="left")
    DF = DF.drop(["Region", "SpecialNotes", "TableName"], axis=1).copy()
    DF.to_csv("water_data.csv")
    DF.head()
    ''''''
    return DF
#
def clean_data_2012(csv1, csv2):
    '''
        The .csvs are cleaned into Dataframes, merged into one all-encompassing container - year 2012 only.
    '''
    csv1_DF = pd.read_csv(csv1, header=2)
    csv1_DF_clean = csv1_DF[["Country Name", "Country Code", "2012"]].copy()
    # csv1_DF_clean = csv1_DF_clean.dropna(axis=0)
    csv1_DF_clean = csv1_DF_clean.drop(
        [62, 63, 229, 215, 151, 71, 132, 93, 103, 257], axis=0)
    csv1_DF_clean.head()
    ''''''
    csv2_DF = pd.read_csv(csv2)
    csv2_DF_clean = csv2_DF.drop(["Unnamed: 5"], axis=1).dropna(axis=0)
    csv2_DF_clean.head()
    ''''''
    DF = pd.merge(csv1_DF_clean, csv2_DF_clean, on="Country Code", how="left")
    DF = DF.drop(["Region", "SpecialNotes", "TableName"], axis=1).copy()
    DF.to_csv("water_data_2012.csv")
    DF.head()
    ''''''
    return DF
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |               Local: Database               | * * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
def create_db(DF):
    '''
        A SQLite db is created from the cleaned and combined all-encompassing DataFrame - All years.
    '''
    engine = create_engine('sqlite:///water_data.sqlite', echo=True)
    DF.to_sql("water_data", con=engine, if_exists="replace")
    session = Session(engine)
    sqldata = session.execute("SELECT * FROM water_data")
    return sqldata
#
def create_db_2012(DF):
    '''
        A SQLite db is created from the cleaned and combined all-encompassing DataFrame - year 2012 only.
    '''
    engine = create_engine('sqlite:///water_data_2012.sqlite', echo=True)
    DF.to_sql("water_data_2012", con=engine, if_exists="replace")
    session = Session(engine)
    sqldata = session.execute("SELECT * FROM water_data_2012")
    return sqldata
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |               Local: Execution               | * * * * * * * * * * * *@
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
#
app = init_global_flask()
#
def do_all_the_things():
    '''
        Executes above local ETL functions - All years.
    '''
    scrape_worldbank()
    slash = get_slash()
    data_loc, data_dir = declare_locs(slash)
    extract(data_loc, data_dir)
    csv1, csv2 = declare_csvs(data_dir)
    DF = clean_data(csv1, csv2)
    sqldata = create_db(DF)
    return sqldata
#
def do_all_the_things_2012():
    '''
        Executes above local ETL functions - year 2012 only.
    '''
    scrape_worldbank()
    slash = get_slash()
    data_loc, data_dir = declare_locs(slash)
    extract(data_loc, data_dir)
    csv1, csv2 = declare_csvs(data_dir)
    DF = clean_data_2012(csv1, csv2)
    sqldata = create_db_2012(DF)
    return sqldata
#
#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#!--888**888**888**888--888--\            -----------------            /--888--888**888**888**888--!#
#?-*-*-*-*-*-*-*-*-*-*-*-*-                Remote: Serving                 -*-*-*-*-*-*-*-*-*-*-*-*-#
#!--888**888**888**888--888--/            -----------------            \--888--888**888**888**888--!#
#!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8!8
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * |               Remote: API Returns               | * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
#
def Return_All_Years():
    engine = create_engine('sqlite:///water_data.sqlite', echo=True)
    session = Session(engine)
    sqldata = session.execute("SELECT * FROM water_data")
    return sqldata
#
def Return_2012_Only():
    engine = create_engine('sqlite:///water_data_2012.sqlite', echo=True)
    session = Session(engine)
    sqldata = session.execute("SELECT * FROM water_data_2012")
    return sqldata
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |       Remote: Flask's Page Route Hooks      | * * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
#
@app.route('/')
def index():
    '''
        Homepage's Index is rendered.
    '''
    return render_template("index.html")
#
@app.route('/claims')
def claims():
    '''
        Claims page is rendered.
    '''
    return render_template("claims.html")
#
@app.route('/findings')
def findings():
    '''
        Findings page is rendered.
    '''
    return render_template("findings.html")
#
@app.route('/social')
def social():
    '''
        Social feed page is rendered.
    '''
    return render_template("social.html")
#
@app.route('/process')
def process():
    '''
        Process page is rendered.
    '''
    return render_template("process.html")
#
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * |       Remote: Flask's API Route Hooks       | * * * * * * * * * * * * @
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
#
#
@app.route('/data_all')
def data_all():
    '''
        All data from the SQLite database is returned as a JSON - All years.
    '''
    #? If locally deployed:
    #! all_data = do_all_the_things()
    #? If remotely deployed:
    all_data = Return_All_Years()
    '''
        Below is used regardless of which you've enabled above^
    '''
    list_of_dicts = []
    for data in all_data:
        singledict = {}
        singledict[data["Country Name"]] = data[2:]
        list_of_dicts.append(singledict)
    return jsonify(list_of_dicts)
#
@app.route('/data_2012')
def data_2012():
    '''
        All data from the SQLite database is returned as a JSON - year 2012 only.
    '''
    #? If locally deployed:
    #! all_data = do_all_the_things_2012()
    #? If remotely deployed:
    all_data = Return_2012_Only()
    '''
        Below is used regardless of which you've enabled above^
    '''
    list_of_dicts = []
    for data in all_data:
        singledict = {}
        singledict[data["Country Name"]] = data[2:]
        list_of_dicts.append(singledict)
    return jsonify(list_of_dicts)
#
##
####
######
########
###############
########
######
####
##
#
# ?- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -@
# * * * * * * * * * * * * * * |                Debugging               | * * * * * * * * * * * * * *@
# ? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - @
'''
from rfc3339 import rfc3339
import colors,datetime
#
#
@app.before_request
#
def start_timer():
    g.start = time.time()
#
#
@app.after_request
#
def log_request(response):
    if request.path == '/favicon.ico':
        return response
    elif request.path.startswith('/static'):
        return response
    #
    now = time.time()
    duration = round(now - g.start, 2)
    dt = datetime.datetime.fromtimestamp(now)
    timestamp = rfc3339(dt, utc=True)
    #
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    host = request.host.split(':', 1)[0]
    args = dict(request.args)
    #
    log_params = [('method', request.method, 'blue'),
                  ('path', request.path, 'blue'),
                  ('status', response.status_code, 'yellow'),
                  ('duration', duration, 'green'),
                  ('time', timestamp, 'magenta'), ('ip', ip, 'red'),
                  ('host', host, 'red'), ('params', args, 'blue')]
    #
    request_id = request.headers.get('X-Request-ID')
    if request_id:
        log_params.append(('request_id', request_id, 'yellow'))
    #
    parts = []
    for name, value, color in log_params:
        part = colors.color("{}={}".format(name, value), fg=color)
        parts.append(part)
    line = " ".join(parts)
    #
    app.logger.info(line)
    #
    return response
'''
#
if __name__ == "__main__":
    app.run(debug=True)