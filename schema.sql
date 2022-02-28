--CREATE TABLE profile(email varchar(100), password varchar(100), firstname varchar(100), familyname varchar(100), gender varchar(10), city varchar(100), country varchar(100), primary key(email));

--INSERT INTO profile (email, password, firstname, familyname, gender, city, country)
--VALUES ('a@gmail.com', 'aaaaaaaaa', 'A', 'B','Male', 'C', 'D');  

--ALTER TABLE profile
--ADD token varchar(100);

--CREATE TABLE messages(user_email varchar(100), posted_email varchar(100), posted_message varchar(250), primary key(user_email,posted_message))
--INSERT INTO messages(user_email,posted_email,posted_message)
--VALUES('a@gmail.com','a@gmail.com', 'Tjena kexet står du här o smular ;)')

--INSERT INTO messages(user_email,posted_email,posted_message)
--VALUES('b@gmail.com','a@gmail.com', 'Kexbrist :(')

--CREATE TABLE messages2(post_id INTEGER PRIMARY KEY AUTOINCREMENT, user_email varchar(100), posted_email varchar(100), posted_message varchar(250));
--INSERT INTO messages2 (user_email,posted_email,posted_message) SELECT user_email,posted_email,posted_message FROM messages;
--DROP TABLE messages2;

--CREATE TABLE messages3(post_id INTEGER PRIMARY KEY AUTOINCREMENT, user_email varchar(100), posted_email varchar(100), posted_message varchar(250));
--INSERT INTO messages3(user_email,posted_email,posted_message) SELECT user_email,posted_email,posted_message FROM messages2;
--DELETE FROM messages3 WHERE posted_message = "lol"