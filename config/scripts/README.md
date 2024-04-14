## 文件结构

scripts下文件会被app直接调用，允许向app注册各类数据

### items/
存放用于注册道具/物品脚本的数据结构
### random_events/
存放用于注册随机事件的脚本数据
- 使用
### shared_buffs
存放可共享的基础BUFF脚本
- 如果需要开放共用，则请使用Buffs.register(buff)注册一个全局buff