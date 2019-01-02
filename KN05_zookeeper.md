## ZooKeeper Study Notes

### Concept
+ ZooKeeper is a distributed, open-source coordination service for distributed applications.
+ ZooKeeper data is kept in-memory, which means ZooKeeper can acheive high throughput and low latency numbers.
+ it performs best where reads are more common than writes, at ratios of around 10:1.
+ As long as a majority of the servers are available, the ZooKeeper service will be available.
+ Znodes maintain a stat structure that includes version numbers for data changes, ACL changes, and timestamps, to allow cache validations and coordinated updates.
+ Clients can set a watch on a znodes. A watch will be triggered and removed when the znode changes.

### Build/Setup
+ download linkage: [ZooKeeper](http://mirrors.shu.edu.cn/apache/zookeeper/)
+ ZK can use openjdk, there is no need for manual JDK installation. Just:

```shell
sudo apt-get install openjdk-8-jdk
```

+ ZK defaultly use con/zoo.cfg as the config file.

```shell
# A simple version of single server config
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
```

+ Some commands:

```shell
# Start Server
bin/zkServer.sh start

# Check running status
bin/zkServer.sh status

# Stop Server
bin/zkServer.sh stop

# Help
bin/zkServer.sh help
```

+ log check  
Copy slf4j-api-1.7.25.jar (in zookeeper/lib) and zookeeper-3.4.12.jar (in zookeeper) into a folder.  
In the folder, run:

```shell
java -classpath .:slf4j-api-1.7.25.jar:zookeeper-3.4.12.jar org.apache.zookeeper.server.LogFormatter /var/lib/zookeeper/version-2/log.4
```

### C programming

+ make

```shell
# in src/c
./config
make
make install
```

+ include & linkage

```shell
# the header file would be in /usr/local/include/zookeeper
# #include<zookeeper/zookeeper.h>
# static library would be in /usr/local/lib
# multithread link libzookeeper_mt.a; singlethread link libzookeeper_st.a
```

+ on Xcode?  
Copy the header files and static libraries into a new group.  
Remember add a new path in linker seek path to your libraries.  
Then you can develop your own ZooKeeper client API.

+ Create flag

```c++
ZOO_EPHEMERAL //ephemeral node
```

+ debug level

```c++
ZOO_LOG_LEVEL_ERROR
ZOO_LOG_LEVEL_WARN
```