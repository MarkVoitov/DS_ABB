from contextlib import closing
import sqlite3
import csv

def insert_query(db_name, data_array):
  with closing(sqlite3.connect(db_name)) as con, con,  \
      closing(con.cursor()) as cur:
    cur.executemany("INSERT INTO title_basics VALUES (?,?,?,?,?,?,?,?,?)", data_array)
    con.commit()    

def from_file_to_db(file_name, db_name):
  films_list = []
  with open(file_name, newline = '') as films_file:
    reader = csv.reader(films_file, delimiter='\t')
    i = 0
    first_pass = 0
    for film in reader:
      if first_pass == 0:
        first_pass = 1
        continue
      films_list.append(film)
      i += 1
      if i > 100000 :
        i = 0
        insert_query(db_name, films_list)
        films_list = []
	
	# LIMIT 100000 LINES
        break

if __name__ == '__main__':
  from_file_to_db('data.tsv',"IMDB.db")
