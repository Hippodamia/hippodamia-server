# 分群设置

## 概念

分群设置将不同的模式及不同的群组的配置分隔开来储，以便于管理。

其中，全局设置是默认的设置，如果群组未设置单独的配置以及单独的配置中不包含的属性都会采用全局设置的配置内容。

游戏模式也可以在群组设置的`game`属性下进行分开设置，以便于管理。

同时也可以创建不属于默认的游戏名(例如创建 dev 模式)的模式，但这个模式需要依赖于一个存在的基础模式，例如纯净模式或者随机事件模式

不同的模式可以为其设置不同的基础数值以及消息发送间隔。

### 分群配置文件`config\groups_settings.json`

> settings.json 文件中，群 id 为 key，对应的值为 `GameSetting` 对象。

下述 json 文件中

- 增加了 114514 群号的配置内容，其中本群的 hippodamia 服务是关闭的.
- 为随机事件模式, 也就是 `random` 模式配置了其群专属参数, 速度改为了 `8`，赛道长度改为了 `20`, 幸运基础数值为 `1`(默认也为 `1`,可以不改变), 抵抗为 `0`(默认为 `0`)，以及并不排除任何的内容

```json
{
  "114514": {
    "enable": false,
    "admins": [],
    "game": {
      "random": {
        "speed": 8,
        "length": 20,
        "luck": 1,
        "effect_resistance": 0,
        "exclude": []
      }
    }
  },
  "global": {
    "enable": true,
    "admins": []
  }
}
```

### 分群配置对象`GameSetting`

> 请注意!不要在 json 中出现注释文件。

## 全局分群设置(默认设置)

全局分群设置即配置文件中群 id 为`global`的配置，其相比于其他分群配置具有以下特点：

- 可以设置所有群共有的**Bot 管理员**（不会被覆盖）
- 控制 bot 的全局开关
- 配置多个游戏模式的默认参数（会被分群设置覆盖）

### 默认模式配置

```js
//纯净模式的默认设置
const pure: GameModeSetting = {
  speed: 5,
  length: 12,
  min_player: 2,
  max_player: 6,
  interval: 6,
};

//随机事件的默认设置
const random: GameModeSetting = {
  speed: 5,
  length: 14,
  min_player: 2,
  max_player: 8,
  interval: 7,
  luck: 1,
  effect_resistance: 1,
};
```

### 最佳实践：设置赛马全局管理员

```json
{
  "global": {
    "enable": true,
    "admins": ["1767407822", "2413502512"]
  }
}
```

### 最佳实践:为群增`716626916`加`super-long`模式

```json

```
