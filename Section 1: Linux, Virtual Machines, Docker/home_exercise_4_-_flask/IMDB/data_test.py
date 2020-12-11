from contextlib import closing
import sqlite3

def query(db_name, sql):
  with closing(sqlite3.connect(db_name)) as con, con,  \
      closing(con.cursor()) as cur:
    cur.execute(sql)
    print(cur.fetchall())    

if __name__ == '__main__':
  query("IMDB.db","""SELECT * FROM title_basics LIMIT 200""")
 
