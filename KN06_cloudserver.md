## Linux (云)服务器相关
+ 如何在原本非root用户的云服务器里开通root登录？

```shell
#首先用非root账号登录
sudo passwd root #设置root的密码
sudo vim /etc/ssh/sshd_config
#修改文件中的PermitRootLogin为yes
sudo service ssh restart #重启ssh服务
```

+ scp命令

```shell
#从本地复制到server
scp local_file remote_username@remote_ip:remote_folder

#从server复制到本地
scp remote_username@remote_ip:remote_folder local_file
```

+ tar命令

```shell
:<<!
-c: 建立压缩档案
-x：解压
-t：查看内容
-r：向压缩归档文件末尾追加文件
-u：更新原压缩包中的文件
-z：有gzip属性的
-j：有bz2属性的
-Z：有compress属性的
-v：显示所有过程
-O：将文件解开到标准输出
!
tar -xzvf file.tar.gz #解压tar.gz包
```