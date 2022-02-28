import sqlite3
from flask import g

DaDATABASE='database.db'

def connect_db():
    return sqlite3.connect(DaDATABASE)

def get_db():
    db=getattr(g, 'db', None)
    if db is None:
        db = g.db=connect_db()
    return db

def disconnect_db():
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()
        g.db = None

def create_profile(email, password, firstname, familyname, gender, city, country):
    try:
        get_db().execute("insert into profile values(?, ?, ?, ?, ?, ?, ?, ?)", [email, password, firstname, familyname, gender, city, country, 'NULL'])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False

def find_user(email):
    cursor = get_db().execute("select * from profile where email like ?", [email])
    rows = cursor.fetchall()
    cursor.close()
    return rows

def give_token(email, token):
    try:
        get_db().execute("update profile set token = ? where email like ?",[token, email])
        get_db().commit()
        print("true")
        return True
    except Exception as e:
        print(e)
        return False

def find_user_bytoken(token):
    cursor = get_db().execute("select * from profile where token like ?", [token])
    rows = cursor.fetchall()
    cursor.close()
    return rows

def changepswrd(email, newPassword):
    try:
        get_db().execute("update profile set password = ? where email like ?",[newPassword, email])
        get_db().commit()
        print("true")
        return True
    except Exception as e:
        print(e)
        return False

def find_data_bytoken(token):
    cursor = get_db().execute("select email,firstname,familyname, gender, city, country from profile where token like ?", [token])
    rows = cursor.fetchall()
    cursor.close()
    return rows

def find_data_byemail(email):
    cursor = get_db().execute("select email,firstname,familyname, gender, city, country from profile where email like ?", [email])
    rows = cursor.fetchall()
    cursor.close()
    return rows

def find_msgs_byemail(email):
    cursor = get_db().execute("select user_email,posted_message from messages2 where posted_email like ?", [email])
    rows = cursor.fetchall()
    cursor.close()
    return rows

def post_it(user_email, posted_email, message):
    try:
        get_db().execute("insert into messages2 (user_email,posted_email,posted_message) values(?, ?, ?)", [user_email, posted_email, message])
        get_db().commit()
        return True
    except Exception as e:
        print(e)
        return False

# def no_email(email):
#     try:
#         get_db().execute("select email from profile where email like (?)", [email])
#         get_db().commit()
        
#         return True
#     except Exception as e:
#         print(e)
#         return False
