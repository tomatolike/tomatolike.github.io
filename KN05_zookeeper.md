## ZooKeeper 学习笔记

### Concept
+ ZooKeeper is a distributed, open-source coordination service for distributed applications.
+ ZooKeeper data is kept in-memory, which means ZooKeeper can acheive high throughput and low latency numbers.
+ it performs best where reads are more common than writes, at ratios of around 10:1.
+ As long as a majority of the servers are available, the ZooKeeper service will be available.
+ Znodes maintain a stat structure that includes version numbers for data changes, ACL changes, and timestamps, to allow cache validations and coordinated updates.
+ Clients can set a watch on a znodes. A watch will be triggered and removed when the znode changes.

### Build/Setup
+ download linkage: [ZooKeeper](http://mirrors.shu.edu.cn/apache/zookeeper/)
+ 