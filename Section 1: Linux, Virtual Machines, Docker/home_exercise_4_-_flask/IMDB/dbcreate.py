from contextlib import closing
import sqlite3

def query(db_name, sql):
  with closing(sqlite3.connect(db_name)) as con, con,  \
      closing(con.cursor()) as cur:
    cur.execute(sql)

if __name__ == '__main__':
  query("IMDB.db","""CREATE TABLE title_basics
    (
     tconst text
    ,titleType text
    ,primaryTitle text
    ,originalTitle text
    ,isAdult text
    ,startYear integer
    ,endYear integer
    ,runtimeMinutes integer
    ,genres text)
    """)
