# Sanus Web App
Contains:
* Druid
* Superset
* Web App

## Druid and Superset Documentation

### Druid Installation and Configuration

Clone from Apache

```
git clone https://github.com/apache/incubator-druid
```

#### Install Zookeeper, Tranquility Server, and add Sanus Config files

Go to the root druid directory and execute
```
curl https://archive.apache.org/dist/zookeeper/zookeeper-3.4.11/zookeeper-3.4.11.tar.gz -o zookeeper-3.4.11.tar.gz
tar -xzf zookeeper-3.4.11.tar.gz
mv zookeeper-3.4.11 zk
```
For Tranqulity:

```
curl http://static.druid.io/tranquility/releases/tranquility-distribution-0.8.3.tgz -o tranquility-distribution-0.8.3.tgz
tar -xzf tranquility-distribution-0.8.3.tgz
mv tranquility-distribution-0.8.3 tranquility
```

**Enable Tranquility Server**

In your conf/supervise/single-server/micro-quickstart.conf, (or other config files) uncomment the tranquility-server line.
Stop your bin/supervise command (CTRL-C) and then restart it by again running bin/supervise -c conf/supervise/single-serve
/micro-quickstart.conf.


**Add Sanus Config Files**

Go to the /superset-backup/ folder in the root of this repository and move the the sanus-index.json file to

```
/conf/tranquility/sanus-index.json
```
*IMPORTANT* You will have to go the micro-quickstart.conf file again to make sure tranquility has the path to the index file.

### Starting Druid Services

To start Druid firstly go to the root directory and execute 

```
./bin/start-micro-quickstart
```

or depending on the server configuration, look inside the /conf folder for other configs.

Once the cluster has started, you can navigate to http://localhost:8888. The Druid router process, which serves the Druid
console, resides at this address.

### Tranquility

Traquility server (HTTP Push) is automatically enabled in the configuration file. This is what we use to send data to druid instead of another service such as Kafka. If you need to change the ingestion spec it can be found in

```
/conf/tranquility/sanus-index.json
```

the ingestion spec is the file that determines how data should look like when inserted into Druid. The current spec contains these dimensions which are all strings:

```
"dimensionsSpec" : {
                  "dimensions" : [
                    "type",
                    "nodeID",
                    "staffID",
                    "staff_title",
                    "unit",
                    "room_number",
                    "response_type",
                    "response_message"
                  ]
                }
```

### Testing Data Ingestion

At this point Druid and Tranquility should be running so you can test an ingestion with


```
curl -XPOST -H'Content-Type: application/json' --data-binary @[data.json] http://localhost:8200/v1/post/[hospital]
```

You can change the variables in [ ] to your specific file and database name.



## Superset installation and initialization

Follow these few simple steps to install Superset:

```
# Install superset
pip install superset

# Create an admin user (you will be prompted to set a username, first and last name before setting a password)
fabmanager create-admin --app superset

# Initialize the database
superset db upgrade

# Load some data to play with
superset load_examples

# Create default roles and permissions
superset init

# To start a development web server on port 8088, use -p to bind to another port
superset runserver -d

```

Installation Issues: 

* Error with import maybe_box?

```
pip uninstall pandas
pip list | grep pandas
pip install pandas==0.23.4
```
