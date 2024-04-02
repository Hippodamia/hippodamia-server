# 分群设置

## 概念

### 分群配置文件`config\groups_settings.json`

文件结构为 {'群id' : GameSettings}
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

### 分群配置对象`GameSettings`
> 请注意!不要在json中出现注释文件。
```ts
export type GameSettings = Partial<{
    enable: boolean; // 表示bot在本群的开关
    admins: string[]; //表示此群bot管理员列表
    game: { // game下是对多个游戏模式的具体参数细节设置
        [key: string]: Partial<{ // 游戏模式为key，模式有pure,random,contract等，也可是管理自行创建的模式，用于在/创建赛马中呼出
            speed: number; // 速度
            min_player:number; // 最少加入成员
            max_player:number; // 最多加入玩家
            length: number; // 赛道长度
            luck: number; // 初始幸运
            effect_resistance: number; //效果抵抗
            exclude: string[]; // 内容排除，例如不想采用'114514.sleep'即可填入其中
            base_mode: string // 父模式，是官方的模式基础，如pure random等
        }>;
    };
}>;
```

## 全局分群设置(默认设置)

全局分群设置即配置文件中群id为`global`的配置，其相比于其他分群配置具有以下特点：
- 可以设置所有群共有的**Bot管理员**（不会被覆盖）
- 控制bot的全局开关
- 配置多个游戏模式的默认参数（会被覆盖）

### 最佳实践：设置赛马全局管理员
1. 修改json文件
```json
{
  "global": {
    "enable": true,
    "admins": [
      "1767407822",
      "2413502512"
    ]
  }
}
```
2. 重载分群配置

```
/hippodamia reload
```
