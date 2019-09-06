# Sanus Web App
Contains:
* Druid
* Superset
* Web App

## Druid and Superset Documentation

### Druid Installation and Configuration

#### Using the setup.sh script
Go to the package root and go to the setup folder. Execute:
```
cd sanus-web-app/setup
./setup.sh
``` 
If everything unpacks okay skip to the ENABLE TRANQUILTY SECTION

#### Manual Method

Download from Apache

```
https://www-us.apache.org/dist/incubator/druid/0.15.1-incubating/apache-druid-0.15.1-incubating-bin.tar.gz
```

#### Install Zookeeper, Tranquility Server, and add Sanus Config files

After you downloaded Druid, execute the ``` setup.sh ``` script in the setup folder. This will automatically download
ZK and Tranquility and set up your folder structure.

If the script doesn't work then follow the steps below:

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

### Enable Tranquility Server

In your 
```druid/conf/supervise/single-server/micro-quickstart.conf```, uncomment the last line of code in the file.
From here. change ```/conf/tranquility/wikipedia-index.json``` to ```/conf/tranquility/sanus-index.json```


**Add Sanus Config Files**

Go to the /setup folder in the root of this repository and move the the sanus-index.json file to

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

# Schema Design

We send to Druid data in JSON format. Each segment of data that is sent is considered an Event.

This is the format of an Event (note: they are all strings):
```
        {
          "time",
          "type",
          "nodeID",
          "staffID",
          "staff_title",
          "unit",
          "room_number",
          "response_type",
          "response_message"
        }
```

An example POST payload is:
```
{
        "time": "2008-09-15T15:53:00",
        "type": "entry",
        "nodeID": "NSICU2500",
        "staffID": "6785246213",
        "staff_title": "Nurse",
        "unit": "ICU",
        "room_number": "2500",
        "response_type": "entry",
        "response_message": "clean"
}
```
Legend:

* time - ISO 8601 formated timestamp
* type - The type of event. This can be entry, alert, dispeser
* nodeID - The ID of the physical node placed in the hospital. This ID will have a specific coding to it so that you can find the Unit and Room Number from it.
* staffID - The ID associated with the specific staff member. This can be either a name or a specific number.
* unit - This is the unit name within the hospital which will be derived from the coding of the nodeID (ex. ICU)
* room_number - This is the room number where the node resides. This is also derived from the nodeID (ex. RM301)
* response_type - Type of response that is being given to user. This can be entry, alert, dispeser
* response_message:
        -entry can have either "clean" or "not clean"
        -alert can have either "alert given" or "no alert"
        -dispenser can have `"none"``



