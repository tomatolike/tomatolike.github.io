## Linux (云)服务器相关
+ 如何在原本非root用户的云服务器里开通root登录？

```shell
#首先用非root账号登录
sudo passwd root #设置root的密码
sudo vim /etc/ssh/sshd_config
#修改文件中的PermitRootLogin为yes
sudo service ssh restart #重启ssh服务
```