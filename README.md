## 开始使用

### windows系统
1. 下载编译exe版本
2. 放置在任何文件夹内
3. 创建config文件夹
4. 创建config/settings.json文件
5. 内容参考后续配置文件,这里给一个基础版本
```
{
    "mode":"onebot",
    "onebot": {
        "mode": "http",
        "port": 11455,
        "api": "http://127.0.0.1:3000/"
    },
    "api":{
        "port": 12778
    },
    "logging":{
        "level": "debug"
    }
}
```

## 更新部署版本

相比较于旧的版本，你大致需要将做一下的事情

- 更新 packages.json
- 更新整个 src 目录

## 配置文件
hippodammia-server 使用各种配置文件来运行

> - 多个配置文件可以使用settings.xxx.json来区分
> - 在启动时，可以通过命令尾部附带 xxx 参数来指定配置文件
> - 例如：`bun run start ws`

### `mode` 服务模式

模式决定了 hippodamia-server 的对接模式，目前仅支持一下两种

- `onebot`
- `test`

#### `onebot` 模式

使用 onebot 模式可以对接任何提供 onebot 服务的协议端
例如:

- napcat
- llonebot
- go-cqhttp

同时你需要提供以下参数

`mode` 为 `http`,`ws`,`ws-reverse`

- `http` 模式

  - `port` 端口号,这是用于开启 HTTP POST 的监听服务,在 onebot 上报初需要填写`http://127.0.0.1:端口号/onebot`
  - `api` 这是 onebot 协议端的 API 地址,用于发送 api 请求
    当使用
  - `secret` 密钥

  ```json
    "onebot": {
        "mode": "http",
        "port": 11451,
        "api": "http://127.0.0.1:3000/"
    }
  ```

- `ws` 模式

  - `url` 连接正向 ws 的地址
  - `secret` 密钥

  ```json
    "onebot": {
        "bot": "1919810",
        "mode": "ws",
        "url": "ws://127.0.0.1:3389",
    }
  ```

- `ws-reverse` 模式

### `logging` 日志

#### `level` 日志级别

- `debug` 调试模式
- `info` 信息模式
- `warn` 警告模式
- `error` 错误模式
- `fatal` 严重错误模式

### `api`

api配置项决定了hippodamia-server启动的API接口
> 也就是后期用于后台操作赛马API的接口

#### `port` 端口号

### 例子:使用onebot的ws模式连接