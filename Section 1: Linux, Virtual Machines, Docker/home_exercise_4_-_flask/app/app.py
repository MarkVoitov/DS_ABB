#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request, abort
from contextlib import closing
import sqlite3
import random
import json

app = Flask(__name__)
db_path = "/app/IMDB.db"

@app.route('/', methods=['GET'])
def hello_world():
  
  return 'It`s Flash Python API (using IMDB)'

# по id = tt0000001: /movie_id/tt0000007   http://localhost:5000/movie_id/tt0000007
@app.route('/movie_id/<parameter>', methods=['GET'])
def get_tconsts(parameter):
  
  result = []
  try:
    result = query_get_with_parameter("tconst", parameter)
    if len(result) == 0:
      return jsonify({}), 404
  except:
    return jsonify({}), 404
  
  return jsonify({'movies': result})

# по названию title = Carmencita http://localhost:5000/movie/Autour%20d'une%20cabine
@app.route('/movie/<parameter>', methods=['GET'])
def get_primaryTitles(parameter):
  
  result = []
  try:
    result = query_get_with_parameter('primaryTitle', parameter)
    if len(result) == 0:
      return jsonify({}), 404
  except:
    return jsonify({}), 404
  
  return jsonify({'movies': result})
  
# по году выхода год=1894 http://localhost:5000/year/1895
@app.route('/year/<parameter>', methods=['GET'])
def get_startYears(parameter):
  
  result = []
  try:
    result = query_get_with_parameter('startYear', parameter)
    if len(result) == 0:
      return jsonify({}), 404
  except:
    return jsonify({}), 404
  
  return jsonify({'movies': result})

# Common with GET
def query_get_with_parameter(field_name, par):
  
  with closing(sqlite3.connect(db_path)) as con, con,  \
      closing(con.cursor()) as cur:
    cur.execute('SELECT tconst FROM title_basics WHERE ' + field_name + '=?', (par,))
    result = []
    for value in cur.fetchall():
      result.append(value[0])
    return result

@app.route('/suggest/<int:parameter>', methods=['POST'])
def post_suggest(parameter):
  
  result = []
  try:
    excluded_items = []
  
    if(request.data):
      excluded_items = []
      request_json = request.get_json()
      for t in request_json['ratings']:
        excluded_items.append(t)
  
    with closing(sqlite3.connect(db_path)) as con, con,  \
        closing(con.cursor()) as cur:

      if len(excluded_items) == 0:
        sql_query = "SELECT tconst FROM title_basics ORDER BY RANDOM() LIMIT ?"
      else:
        sql_query = "SELECT tconst FROM title_basics WHERE " + \
          " and ".join(("tconst != '" + str(n) + "'" for n in excluded_items)) + \
          " ORDER BY RANDOM() LIMIT ?"
      
      cur.execute(sql_query, (parameter,))
      result = []
      for value in cur.fetchall():
        result.append(value[0])
      if len(result) == 0:
        return jsonify({}), 404
      result = jsonify({'ratings': {x:round(random.random(),1) for x in result}})
  except:
    return jsonify({}), 404
  
  return result
  
if __name__ == '__main__':
  app.run(debug=True,host='0.0.0.0')
  