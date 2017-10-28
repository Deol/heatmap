var HeatMap = (function () {
  // default config
  var defaultConfig = {
      blur: 0.75,
      radius: 40,
      gradient: {0.25: 'rgb(0,0,0)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)'}
    },
    palette = null,
    shadowCanvas = document.createElement('canvas'),
    shadowCanvasMap = {}
  
  // util
  function extend (obj, templateObj) {
    var item = ''
    for (item in templateObj) {
      obj[item] = typeof obj[item] === 'undefined' ? templateObj[item] : obj[item]
    }
    return obj
  }
  
  function handleConfig (userConfig) {
    return extend(userConfig || {}, defaultConfig)
  }
  
  /**
   * @param {Object} ctx
   * @param {Object} data 
   * [{
        x: 30, y: 100, value: 1
      },{     
        x: 102, y: 329, value: 21
      }, ..., {
        x: 452, y: 673, value: 35
   *  }]
   */
  function render (ctx, data, cfg) {
    var canvas = ctx.canvas,
      w = canvas.width,
      h = canvas.height
    
    shadowCanvas.width = w
    shadowCanvas.height = h
    
    if (!ctx) {console.log('No canvas will be draw.'); return}
    
    if (!data) {console.log('There is data needed to fill heat map.'); return}
    
    ctx.clearRect(0, 0, w, h)
    
    setPalette(cfg.gradient)
    
    drawShadowCanvas(ctx, data, cfg, w, h)
  }
  
  function drawShadowCanvas (ctx, arr, cfg, width, height) {
    var max = 0, min = 0, temp = [], sctx = shadowCanvas.getContext('2d'),
      xRange = [], yRange = [], len = arr.length
    
    arr.map(function (item) {
      temp.push(item.value || 1)
    })
    
    temp.sort((a, b) => (a - b))
    
    max = temp[len - 1]
    min = temp[0]
        
    arr.map(function (item) {
      var v = item.value || 1,
        r = item.radius || getRadius(v, min, max),
        b = item.blur || cfg.blur,
        x = item.x - r,
        y = item.y - r

      sctx.drawImage(drawPoint(r, b), x, y)
      
      xRange.push(x, x + 2 * r)
      yRange.push(y, y + 2 * r)
    })
    
    xRange.sort((a, b) => (a - b))
    yRange.sort((a, b) => (a - b))
    
    len = xRange.length
    
    // document.body.appendChild(shadowCanvas)
    // shadowCanvas.style.position = 'absolute'
    // shadowCanvas.style.zIndex = 1000
    // shadowCanvas.style.top = '121px'
    // shadowCanvas.style.left = '21px'
    // shadowCanvas.style.opacity = 0.5
    // shadowCanvas.style.background = '#fff'
    // console.log(xRange, yRange, Math.max(0, xRange[0]), Math.max(0, yRange[0]), Math.min(width, xRange[len - 1]), Math.min(height, yRange[len - 1]))
    
    let img = sctx.getImageData(Math.max(0, xRange[0]), Math.max(0, yRange[0]), Math.min(width, xRange[len - 1]), Math.min(height, yRange[len - 1])),
      data = img.data,
      l = data.length, alpha = 0, offset = 0

    for (let i = 0; i < l; i += 4) {
      alpha = data[i + 3] + 1
      offset = alpha * 4
      
      data[i] = palette[offset]
      data[i + 1] = palette[offset + 1]
      data[i + 2] = palette[offset + 2]
      data[i + 3] = palette[offset + 3]
    }
    
    img.data.set(data)
    ctx.putImageData(img, Math.max(0, xRange[0]), Math.max(0, yRange[0]))
  }
  
  function drawPoint (radius, blur) {
    if (shadowCanvasMap[radius + '-' + blur]) {
      return shadowCanvasMap[radius + '-' + blur]
    }
    
    let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      l = radius * 2
    
    canvas.width = l
    canvas.height = l
    
    let gradient = ctx.createRadialGradient(radius, radius, 1 - blur, radius, radius, radius)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.globalAlpha = 0.5
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, l, l)
    
    shadowCanvasMap[radius + '-' + blur] = canvas
    
    return canvas
  }
  
  // 半径范围在 10 - 20 之间
  function getRadius (v, min, max) {
    var range = max === min ? (v) : (max - min),
      val = v - min,
      pxRange = 20 - 10,
      result = 0
    
    result = Math.ceil(10 + pxRange * (val / range))
 
    return result
  }
  
  function setPalette (gradientConfig) {
    if (palette) {
      return
    }
    
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    canvas.width = 256
    canvas.height = 1

    let gradient = ctx.createLinearGradient(0, 0, 256, 1);
    for (let key in gradientConfig) {
      gradient.addColorStop(key, gradientConfig[key])
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 1)
    
    palette = ctx.getImageData(0, 0, 256, 1).data
  }
  
  return function createHeatMapByClickData (ctx, data, config) {
    if (!ctx) {
      return console.log('no canvas context be used.')
    }
  
    config = handleConfig(config)
    
    render(ctx, data, config)
  }
})();

export default HeatMap
