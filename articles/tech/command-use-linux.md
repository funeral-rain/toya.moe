# Linux 系统基本功能使用笔记集

## 在命令行下用 gdisk 修改和扩容硬盘分区

### 一点吐槽

之所以会接触到这个知识。。。起因是使用了 `hyper-v` 创建的 `ubuntu` 虚拟机，然后创建时预分配的硬盘分区容量不够了需要扩容。。。不得不说 `hyper-v` 虽然确实是 `windows` 下一个比 `vmware` 还舒服流畅的选择，但是一旦涉及到 `windows` 的虚拟磁盘操作的时候真的很坑

::: details 一点前置知识

首先，`windows` 的虚拟磁盘文件 `.vhdx` 有三种模式，固定大小，动态大小，和差分模式。其中，只要虚拟机因运行或者手动创建了检查点，那么磁盘文件无论本来是在何种模式，此时一定会是差分模式。差分模式下除了 `.vhdx` 格式的父硬盘，还会有数个 `.avhdx` 的子硬盘，作为父硬盘的延伸，这些文件之间共同构成了一条差分硬盘链，或者叫差异链

创建了检查点的情况下，`.vhdx` 格式的，差异链上最大的父硬盘保存的是创建第一个检查点时虚拟机的磁盘状态；顺着差异链，这个最大的父硬盘的第一个 `.avhdx` 子硬盘保存的是从创建第一个检查点到创建第二个检查点的状态，第二个 `.avhdx` 子硬盘（同时也是父硬盘的第一个 `.avhdx` 子硬盘的第一个子硬盘，对于这个硬盘来说父硬盘的第一个 `.avhdx` 子硬盘也是它的父硬盘）保存的是从创建第二个检查点到创建第三个检查点的状态。。。以此类推；而差异链上最小的 `.avhdx` 子硬盘则保存了从最后一个检查点到关机 / 保存（类似于 `vmware` 的挂起）时，虚拟机的状态

如果对这些差分磁盘文件单独做了修改，甚至只是挪动了位置，那么差异链就会被破坏，需要用 `hyper-v` 对最小的子硬盘进行编辑以重新连接差异链；而文件没有变动的话，差分硬盘一样能在重新连接后恢复运作。但是如果是因文件修改导致的差异链断裂。。那么即使忽略修改后硬盘 `id` 不同强行重建差异链，结果也只会导致文件系统损坏，然后虚拟机就打不开了

然而，从上述的差异硬盘的解析可以看出，就算差异硬盘的其他子硬盘都缺失了，最大的 `.vhdx` 父硬盘也是能单独打开的，但是会丢失所有第一个检查点以后的数据。。。

:::

使用过程中，由于提示磁盘容量不足，我在保存了两个检查点（误触的，检查点的按钮和启用增强会话的按钮太近了）的情况下，修改了最大的 `.vhdx` 父硬盘的最大容量大小，于是差异链就断裂了，差分硬盘损坏，重新连接后文件系统损坏

没错，文件修改，甚至不涉及内部数据改动，只是调整硬盘最大容量都算是修改。。。所幸最大的父硬盘 `.vhdx` 能单独打开作为虚拟机磁盘使用，但这样一来，我就成功的丢失了前六个小时中所有对虚拟机的操作。。。

言归正传。。像上述这样调整完磁盘大小以后，硬盘分区和 `/root` 的大小都没有变化，而由于神秘原因，将虚拟磁盘挂载到主机上的话修改分区会提示文件系统错误。。只得用 `gdisk` 修改分区表以扩容硬盘分区了

### 用 fdisk 获取硬盘名和分区

输入

```bash
sudo fdisk -l
```

然后找到需要调整分区的硬盘和分区说明，形如

```
Disk /dev/sda: 50 GiB, 53687091200 bytes, 104857600 sectors
Disk model: Virtual Disk    
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 00000000-0000-0000-0000-000000000000

Device      Start       End   Sectors  Size Type
/dev/sda1    2048     10239      8192    4M BIOS boot
/dev/sda2   10240    227327    217088  106M EFI System
/dev/sda3  227328  25165823  24938495 11.9G Linux filesystem
```

可以看到明明有 50g 的磁盘却只使用了 12g 。。此时需要扩容磁盘分区利用剩余空间才行

### 使用 gdisk 查看磁盘分区表

从 `fdisk` 指令中了解了硬盘是 `/dev/sda` ，且确认硬盘 `Disklabel type` 为 `gpt` 之后，就可以用 `gdisk` 对这个硬盘进行操作了，使用

```bash
sudo gdisk -l /dev/sda
```

确认硬盘分区，输出应该是形如

```
GPT fdisk (gdisk) version 1.0.8

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.
Disk /dev/sda: 104857600 sectors, 50.0 GiB
Model: Virtual Disk    
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 00000000-0000-0000-0000-000000000000
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 25165823
Partitions will be aligned on 2048-sector boundaries
Total free space is 79691777 sectors (38.0 GiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048           10239   4.0 MiB     EF02  
   2           10240          227327   106.0 MiB   EF00  
   3          227328        25165823   11.9 GiB    8300  Linux filesystem 
```

确定以上信息之后，就可以扩容分区了，因为是要扩充 `linux` 系统的 `/` ，因此需要编辑的磁盘分区就是 3 号类型为 `Linux filesystem` 的分区

### 使用 gdisk 编辑磁盘分区表

指定硬盘，进入 `gdisk` 命令行

```bash
sudo gdisk /dev/sda
```

可以见到形如

```
GPT fdisk (gdisk) version 1.0.8

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.
```

的命令行模式

在对分区进行容量修改前，需要先删除旧分区

以上面的硬盘为例，在 `gdisk` 命令行下输入 d ，然后指定分区号删除分区，形如

```
Command (? for help): d
Partition number (1-3): 3
```

然后就是创建一个，起始扇区号与原扇区一致，终止扇区号自定义，文件系统类型也与原扇区一致的新硬盘分区

为此，需要在 `gdisk` 命令行下输入 n 创建新扇区，然后逐一指定各项设置，形如

```
Command (? for help): n
Partition number (1-128, default 3): 3
First sector (34-104857566, default = 227328) or {+-}size{KMGTP}: 227328
Last sector (227328-104857566, default = 104857566) or {+-}size{KMGTP}: 
Current type is 8300 (Linux filesystem)
Hex code or GUID (L to show codes, Enter = 8300):
Changed type of partition to 'Linux filesystem'
```

其中，第三行和第五行指定分区结尾扇区和文件系统 `Hex code` 的部分，因为需要直接扩容到磁盘末端，且无需改变原有文件系统类型，此处直接键入回车使用默认值

最后，键入 w 将更改写入分区表

```
Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING PARTITIONS!!

Do you want to proceed? (Y/N): Y
OK; writing new GUID partition table (GPT) to /dev/sda.
Warning: The kernel is still using the old partition table.
The new table will be used at the next reboot or after you
run partprobe(8) or kpartx(8)
The operation has completed successfully.
```

之后，重启系统，使用新的分区表即可

重启系统后，可以再检查一次硬盘分区，查看更改是否成功（以下使用 `fdisk`）

```
Disk /dev/sda: 50 GiB, 53687091200 bytes, 104857600 sectors
Disk model: Virtual Disk    
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 00000000-0000-0000-0000-000000000000

Device      Start       End   Sectors  Size Type
/dev/sda1    2048     10239      8192    4M BIOS boot
/dev/sda2   10240    227327    217088  106M EFI System
/dev/sda3  227328 104857566 104630239 49.9G Linux filesystem
```

### 扩展分区上的文件系统

其实，修改硬盘容量以后，会发现无论是图形化界面中 `dolphin` 之类的文件管理器还是使用 `df` 命令查看，总可用空间和剩余空间大小都没有变化。这是因为 `Linux` 的文件系统大小需要另外调整才能使分区中的空间变为系统可用空间

扩容了分区空间后，只需要让文件系统大小变为分区大小即可。如果文件系统类型为 `ext4`，则使用 

```bash
sudo resize2fs /dev/sda3
```

重新调整文件系统大小为分区大小，~~其他类型的我没用过自行搜索吧~~

之后就可以使用 

```bash
df -h 
```

查看更改是否生效了，形如

```
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           292M  1.3M  291M   1% /run
/dev/sda3        49G   13G   37G  25% /
tmpfs           1.5G     0  1.5G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
efivarfs        128M  9.8K  128M   1% /sys/firmware/efi/efivars
/dev/sda1       105M  6.1M   99M   6% /boot/efi
tmpfs           292M   84K  292M   1% /run/user/130
tmpfs           292M   96K  292M   1% /run/user/1000
```

---

## 使用 nmcli 连接 wifi

### 前言（？

* 怎样都好的吐槽：如果直接搜索 `linux` 命令行 连接 `wifi` ，其结果基本都在使用老旧的 `iwconfig` 工具进行连接。。。问题在于 `iwconfig` 无法连接 `WPA` `WPA2` 加密的 `wifi`，现在加了密码的 `wifi` 几乎没有非这两种加密协议的了。。。被这个坑了几十分钟，才看到有人说了这个事情，改用 `nmcli` 就一次成功了  

* 目前大部分 `linux` 系统都会使用 `NetworkManager` 管理网络，因此内置了 `nmcli` 这个命令，如果在命令行下连接 `wifi` ，这个无疑才是最佳选择

### 扫描并展示周围 wifi 列表

```bash
nmcli dev wifi list
```

可以见到形如

```bash
IN-USE  BSSID              SSID            MODE   CHAN  RATE        SIGNAL  BARS  SECURITY  
        00:00:00:00:00:00  example_1       Infra  12    270 Mbit/s  99      ▂▄▆█  --        
*       11:11:11:11:11:11  example_2       Infra  11    130 Mbit/s  97      ▂▄▆█  WPA2     
```

的命令行界面

* 注：如果已连接到某一 `wifi` 网络，那么 `IN-USE` 那栏就会有个 * 号，按以下步骤连接到 `wifi` 后也能用这个指令检查 `wifi` 是否连接

### 连接到 wifi 网络

记住并填入上条命令显示的 `wifi` 的 `SSID`，并填入 `wifi` 密码

```bash
nmcli dev wifi connect <SSID> <password>
```

也可以使用 `--ask` 参数，交互式输入密码：

```bash
nmcli dev wifi connect <SSID> --ask
```

输入后会出现形如

```
Password: 
```

的提示输入密码，输入密码后确认即可连接

---

## 修改 dns（仅 debian/ubuntu）

### 所有 linux 系统适用：（临时）修改 dns 服务器

使用任何文本编辑器如 `nano` 和 `vi` 打开并修改 `/etc/resolv.conf` （以 `nano` 为例）

```bash
sudo nano /etc/resolv.conf
```

将文件中 （以 `ubuntu` 的 `/etc/resolv.conf` 文件为例，总之是没有 # 开头的那些行）

```
nameserver 127.0.0.53
options edns0 trust-ad
search mshome.net
```

修改为任意 `dns` 服务器地址（以未被墙的 `cloudflare dns 1.0.0.1` 为例）

```
nameserver 1.0.0.1
```

保存修改后，即刻生效

### debian/ubuntu 的注意事项

因为 `ubuntu` 是默认全局链接到本地 `dns` 服务器（`127.0.0.53`），然后再由本地转发到远程 `dns` 服务器进行请求。。

直接修改 `/etc/resolv.conf` 虽然可以马上生效 `dns`的改动，但那样的话，首先是所有连接都会直接使用远程的 `dns` 服务器，本地无法缓存 `dns` 也无法进行分流等等，而且重启或者只是做了任何 `restart` 了 `systemd-resolved.service` 的操作，`/etc/resolv.conf` 这个文件就会被再次修改回本地 `dns` ，

此前的改动也就失效了

为了永久使用某个 `dns` 服务器进行解析，我们必须修改 `/etc/systemd/resolved.conf` 这个全局配置文件 （以 `nano` 为例）

```bash
sudo nano /etc/systemd/resolved.conf
```

找到其中形如

```
[Resolve]
...
...
#DNS=
```

的部分，将 `#DNS=` 这一行去掉 # ，在 = 后添加远程 `dns` 服务器地址，也就是类似这样 （同样以未被墙的 `cloudflare dns 1.0.0.1` 为例）

```
DNS=1.0.0.1
```

保存修改后，输入

```bash
sudo systemctl restart systemd-resolved
```

重启本地 `dns` 解析服务

重启后可以输入

```bash
resolvectl status
```

查看当前使用的远程 `dns` 服务器地址，确认设定成功后，输入

```bash
resolvectl flush-caches
```

刷新 `dns` 解析缓存即可

`ubuntu` 的 `dns` 分流设置等高级操作，以及原理详解还可以看看这篇文章 https://www.keepnight.com/archives/1772/ 

---