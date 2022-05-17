#!/bin/bash
#Add a principal to the KDC for the master node, using the master node's returned host name
sudo kadmin.local -q "ktadd -k /etc/krb5.keytab host/`hostname -f`"
#Declare an associative array of user names and passwords to add

#Assign plain language variables for clarity
name=user1
password=pwd1

# Create principal for sshuser in the master node 
sudo kadmin.local -q "addprinc -pw $password $name"

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