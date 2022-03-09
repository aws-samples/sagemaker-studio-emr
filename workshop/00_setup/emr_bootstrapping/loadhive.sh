#!/bin/bash

#Assign plain language variables for clarity
name=user1
password=pwd1

#Add user hdfs directory
hdfs dfs -mkdir /user/$name

#Change owner of user's hdfs directory to user
hdfs dfs -chown $name:$name /user/$name

curl -sSL https://aws-ml-blog.s3.amazonaws.com/artifacts/sma-milestone1/movie_reviews.csv | hdfs dfs -put - movie_reviews.csv
hive  <<-EOF1
    DROP TABLE IF EXISTS movie_reviews;
    CREATE EXTERNAL TABLE IF NOT EXISTS movie_reviews ( review string, sentiment string)
        ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde';
    LOAD DATA INPATH 'movie_reviews.csv' OVERWRITE INTO TABLE movie_reviews;
EOF1
