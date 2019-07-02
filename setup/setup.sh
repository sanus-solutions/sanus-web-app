#!/bin/bash
echo "unpacking Druid folder..."
tar -xzf apache-druid-0.15.0-incubating-bin.tar.gz
mv apache-druid-0.15.0-incubating druid
cd druid

## Download Zookeeper to package root
curl https://archive.apache.org/dist/zookeeper/zookeeper-3.4.11/zookeeper-3.4.11.tar.gz -o zookeeper-3.4.11.tar.gz
tar -xzf zookeeper-3.4.11.tar.gz
mv zookeeper-3.4.11 zk

## Download Tranquility Server
curl http://static.druid.io/tranquility/releases/tranquility-distribution-0.8.3.tgz -o tranquility-distribution-0.8.3.tgz
tar -xzf tranquility-distribution-0.8.3.tgz
mv tranquility-distribution-0.8.3 tranquility
