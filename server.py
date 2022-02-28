from cgitb import handler
import json
import random
from unittest import result
# from collections.abc import Mapping
from geventwebsocket.handler import WebSocketHandler
from geventwebsocket import WebSocketError
from flask import Flask, jsonify, request
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
import database_helper

app = Flask(__name__)
app.debug = True
@app.route("/", methods = ["GET"])
def root():
    return app.send_static_file("client.html")

loggedinsocket=dict()

@app.route("/sign_in", methods=['PUT']) 
def sign_in():
    json = request.get_json()
    if("email" in json and "password" in json):
        user=database_helper.find_user(json['email'])
        if(user and (json['password'] == (user[0])[1])):
            letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
            token=''.join((random.choice(letters))for x in range(36))
            result=database_helper.give_token((user[0])[0], token)
            if json['email'] in loggedinsocket:
                try:
                    ws = loggedinsocket[json['email']]
                    ws.send(json.dumps({'success': False, 'message': 'You have been logged out'}))
                except WebSocketError as e:
                    del loggedinsocket[json['email']]

            return jsonify(token), 200
        else:
            return "{}", 500
    else:
        return "{}",400 

@app.route("/sign_up", methods = ['PUT'])
def sign_up():
    json = request.get_json()
    isuser=database_helper.find_data_byemail(json['email'])

    if(not isuser and "email" in json and "password" in json and "firstname" in json and "familyname" in json and "gender" in json and "city" in json and "country" in json):
        if(len(json['password'])>=8):
            result=database_helper.create_profile(json['email'],json['password'],json['firstname'],json['familyname'],json['gender'],json['city'],json['country'])
            if(result==True):
                return "{}", 201
            else:
                return "{}", 500
        else:
            return "{}", 400
    else:
        return "{}",400

@app.route("/sign_out", methods=['GET'])
def sign_out():
    json = request.headers['Authorization']
    if(json):
        user=database_helper.find_user_bytoken(json)
        if(user):
            result=database_helper.give_token((user[0])[0], 'NULL')
            return "{}", 200
        else:
            return "{}", 500
    else:
        return "{}",400

@app.route("/Change_password", methods=['PUT'])
def Change_password():
    json = request.get_json()
    tok = request.headers['Authorization']

    if(tok and "oldPassword" in json and "newPassword" in json):
        user=database_helper.find_user_bytoken(tok)
        if((user[0])[1]==json['oldPassword'] and len(json['newPassword'])>=8):
            result=database_helper.changepswrd((user[0])[0], json['newPassword'])
            return "{}", 200
        else:
            return "{}", 500
    else:
        return "{}", 400


@app.route("/get_user_data_by_token", methods=['GET'])
def get_user_data_by_token():
    json = request.get_json()
    tok = request.headers['Authorization']

    if(tok):
        user=database_helper.find_data_bytoken(tok)
        if(user):
            return jsonify(user[0]), 200
        else:
            return "{}", 500
    else:
        return "{}", 400

@app.route("/get_user_data_by_email/<email>", methods=['GET'])
def get_user_data_by_email(email): 
    # try:
    #     json = request.get_json()
    # except Exception as e:
    #     print(e) 
    tok = request.headers['Authorization']
    if(tok and email): 
        hastoken=database_helper.find_data_bytoken(tok)
        user=database_helper.find_data_byemail(email)
        if(user and hastoken):#kolla om token är giltig
            result=[]
            result.append({"email":(user[0])[0],"firstname":(user[0])[1],"familyname":(user[0])[2],"gender":(user[0])[3],"city":(user[0])[4],"country":(user[0])[5]})#fortsätta så här 
            #print("res",result)
            return jsonify(result), 200
        else:
            return "{}", 500
    else:
        return "{}", 400

 
@app.route("/Get_user_messages_by_token", methods=['GET'])
def Get_user_messages_by_token():
    tok = request.headers['Authorization']

    if(tok):
        user=database_helper.find_user_bytoken(tok)
        if(user):
            msgs=database_helper.find_msgs_byemail((user[0])[0])
            return jsonify(msgs), 200
        else:
            return "{}", 500
    else:
        return "{}", 400

@app.route("/get_user_messages_by_email/<email>",methods=['GET'])
def get_user_messages_by_email(email):
    tok = request.headers['Authorization']

    if(tok and email):
        user=database_helper.find_data_byemail(email)
        hastoken=database_helper.find_data_bytoken(tok)

        if(user and hastoken): #här med!
            msgs=database_helper.find_msgs_byemail((user[0])[0])
            print(msgs)
            #result=[]
            #result.append({"email":(user[0])[0],"firstname":(user[0])[1],"familyname":(user[0])[2],"gender":(user[0])[3],"city":(user[0])[4],"country":(user[0])[5]})#fortsätta så här 
            #print("res",result)
            return jsonify(msgs), 200
        else:
            return "{}", 500
    else:
        return "{}", 400

@app.route("/post_message",methods=['PUT'])
def post_message():
    json = request.get_json()
    #print(json)
    tok = request.headers['Authorization']
    #print(tok)
    if(tok and "message" in json and "email" in json):
        user=database_helper.find_user_bytoken(tok)
        isuser=database_helper.find_data_byemail(json['email'])
        #print(user)
        #print(isuser)
        if(user and isuser): 
            msgs=database_helper.post_it((user[0])[0],json['email'] ,json['message'])
            return "{}", 201
        else: 
            return "{}", 500
    else:
        return "{}", 400

app.route('/api')
def api():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        try:
            rec=ws.recieve()
            data=json.loads(rec)
        except WebSocketError as e:
            print(e)
        try:
            loggedinsocket[data['email']]=ws
            while True:
                rec = ws.recieve()
                if rec is None:
                    del loggedinsocket[data['email']]
                    ws.close()
                #ws.send(message)   
                    return ""
        except WebSocketError as e:
            del loggedinsocket[data['email']]
            print(e)

    return ""

if __name__=="__main__":
    #app.run()
    http_server = WSGIServer(('127.0.0.1', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()