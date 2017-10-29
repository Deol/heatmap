# heatmap
热力图渲染插件

本款插件可以用于渲染热力图，效果：

![热力图效果](https://user-images.githubusercontent.com/2509085/32117445-f5d964a6-bb80-11e7-9d32-d055850096c3.jpg)

## 安装

```html
<script src="./heatmap.js"></script>
```

or 

```javascript
import './heatmap'
```

## 用法

```javascript
new HeatMap(ctx, data); // 使用默认配置

new HeatMap(ctx, data, config); // 使用自定义配置
```

参数 | 类型 | 描述
---- | ---- | ----
ctx | Object| 画布 context2d 对象
data | Array | 数据数组
config | Object | 可选配置

#### data 的数据结构

```javascript
[
  {
    x: 100, // 横轴X坐标
    y: 200, // 纵轴y坐标
    value: 20, // 值
    radius: 5 // 可选，自定义半径
    blur: 0.5 // 可选，自定义透明区域范围
  }, {
  ...
  }
  ...
]
```

#### 配置

配置项 | 类型 | 默认值 | 描述
---- | ---- | ---- | ----
blur | Number | 0.75 | 数据对应的圆的透明区域范围
radius | Number | 40 | 圆半径
gradient | Object | - | 调色盘颜色

gradient 默认值如下：

```javascript
gradient: {0.25: 'rgb(0,0,0)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)'}
```

## 热力图生成原理

本插件使用的原理与 [pa7/heatmap.js](https://github.com/pa7/heatmap.js) 项目基本相同，欲了解详细可查看我写的一篇文章：

[传送门](https://github.com/ajccom/blog/issues/2)

## Thanks



