// canvas的宽度
let WINDOW_WIDTH = 1024;
// canvas的高度
let WINDOW_HEIGHT = 500;
// 半径  距离方格边框 1像素 即 RADIUS + 1
let RADIUS = 5;
// 第一个数字距离画布上边的距离
let MARGIN_TOP = 60;
// 第一个数字距离画布左边的距离
let MARGIN_LEFT = 30;
// 倒计时截止时间  -- 设置为固定时间（此程序目前只支持99小时内、有需要时可扩充到 倒计时 年月日）
// const endTime = new Date(2022, 1, 1, 0, 0, 0)
// 倒计时截止时间  -- 设置为每次运行固定倒计时多少
let endTime = new Date();
endTime.setTime(endTime.getTime() + 10 * 3600 * 1000);
// 当前需要显示的秒数
let curShowTimeSeconds = 0;
// 小球 数组
let balls = [];
// 小球随机颜色
const COLORS = [
  "#33B5E5",
  "#0099CC",
  "#AA66CC",
  "#9933CC",
  "#99CC00",
  "#669900",
  "#FFBB33",
  "#FF8800",
  "#FF4444",
  "#CC0000",
];

window.onload = () => {
  WINDOW_WIDTH = document.body.clientWidth;
  WINDOW_HEIGHT = document.body.clientHeight;

  // 数字时间 占宽度 4/5
  // 左边的距离就是 1/10
  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
  // 距离上边 1/5 高度
  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);
  // 半径为 宽度的 4/5 除以108个方格 再减去 圆心距离方格的1个距离
  RADIUS = Math.round((WINDOW_WIDTH * 4) / 5 / 108) - 1;

  // 获取 canvas
  let canvas = document.getElementById("canvas");
  // 设置 canvas 宽度
  canvas.width = WINDOW_WIDTH;
  // 设置 canvas 高度
  canvas.height = WINDOW_HEIGHT;
  let context = canvas.getContext("2d");
  // 获取当前需要显示的秒数
  curShowTimeSeconds = getCurrentShowTimeSeconds();
  setInterval(() => {
    // 渲染
    render(context);
    // 更新显示
    update();
  }, 50);
};

// 获取当前需要显示的秒数
function getCurrentShowTimeSeconds() {
  // 当前时间
  let curTime = new Date();

  /**
   * 倒计时效果
   * 根据时间戳计算还剩多少秒
   */
  // let ret = endTime.getTime() - curTime.getTime()
  // ret = Math.round(ret / 1000)

  /**
   * 时钟效果
   */
  let ret =
    curTime.getHours() * 3600 +
    curTime.getMinutes() * 60 +
    curTime.getSeconds();

  return ret > 0 ? ret : 0;
}

/**
 * 时间的改变
 * 小球的生成
 * 小球的运动变化
 */
function update() {
  // 下一次要显示的时间(剩余秒数)
  let nextShowTimeSeconds = getCurrentShowTimeSeconds();

  let nextHours = parseInt(nextShowTimeSeconds / 3600);
  let nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
  let nextSeconds = nextShowTimeSeconds % 60;

  // 当前已经显示的时间
  let curHours = parseInt(curShowTimeSeconds / 3600);
  let curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
  let curSeconds = curShowTimeSeconds % 60;

  // 下一次要显示的时间和当前时间不同时
  if (nextSeconds != curSeconds) {
    // 当前显示的数字产生变化时 、 生成小球
    if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
      addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
    }
    if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
      addBalls(
        MARGIN_LEFT + 15 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curHours / 10)
      );
    }

    if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
      addBalls(
        MARGIN_LEFT + 39 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curMinutes / 10)
      );
    }
    if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
      addBalls(
        MARGIN_LEFT + 54 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curMinutes % 10)
      );
    }

    if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
      addBalls(
        MARGIN_LEFT + 78 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(curSeconds / 10)
      );
    }
    if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
      addBalls(
        MARGIN_LEFT + 93 * (RADIUS + 1),
        MARGIN_TOP,
        parseInt(nextSeconds % 10)
      );
    }

    //将下次要显示的时间、更新为现在显示的时间
    curShowTimeSeconds = nextShowTimeSeconds;
  }

  // 更新小球的运动
  updateBalls();
}

// 添加小球
function addBalls(x, y, num) {
  for (let i = 0; i < digit[num].length; i++)
    for (let j = 0; j < digit[num][i].length; j++)
      if (digit[num][i][j] == 1) {
        let aBall = {
          x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          // 加速度
          g: 1.5 + Math.random(),
          //  X方向的速度 (正1 或 负1)*4
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
          // Y方向的速度
          vy: -5,
          // 随机色
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
        // 将1个小球添加到小球数组
        balls.push(aBall);
      }
}

// 更新小球状态
function updateBalls() {
  for (let i = 0; i < balls.length; i++) {
    // 小球x方向的位置
    balls[i].x += balls[i].vx;
    // 小球y方向的位置
    balls[i].y += balls[i].vy;
    // Y方向的速度 重力加速度
    balls[i].vy += balls[i].g;

    // 碰撞检测
    if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
      // 到达地板（小球球心Y方向坐标、为边框高度减去半径的位置）
      balls[i].y = WINDOW_HEIGHT - RADIUS;
      // Y方向设置为相反的速度 向上弹起
      // 摩擦系数  弹起速度要小于下落速度
      balls[i].vy = -balls[i].vy * 0.75;
    }
  }

  // 当前屏幕中小球的数量
  let cnt = 0;
  for (let i = 0; i < balls.length; i++) {
    // 在屏幕中、小球x方向位置未超过canvas边框
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
      // 将当前还在屏幕中的小球 在数组中往前开始放
      balls[cnt++] = balls[i];
    }
  }

  // 当数组长度大于 当前屏幕中小球的数量时 开始删除不在屏幕中的小球
  // 当屏幕中小球数量大于500个时，最多只保留500个小球
  while (balls.length > Math.min(500, cnt)) {
    // 从数组最后面开始删除
    balls.pop();
  }
}

// 渲染
function render(cxt) {
  // 清除区域内的内容
  cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);

  // 倒计时剩余的 时分秒
  let hours = parseInt(curShowTimeSeconds / 3600);
  let minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
  let seconds = curShowTimeSeconds % 60;

  // 时 第一个数
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
  /**
   * 半径为 RADIUS + 1 、直径为 2 * (RADIUS + 1)
   * digit.js中、一个数字为横向7个格子 即一个数字 占 14 * (RADIUS + 1) 宽
   * 每个数字之间间隔 1个 (RADIUS + 1) 即 15 * (RADIUS + 1)
   */
  // 时 第二个数
  renderDigit(
    MARGIN_LEFT + 15 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(hours % 10),
    cxt
  );
  // 冒号
  renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
  //  digit.js中、一个冒号为横向4个格子，即 4*2+1 =9
  // 分 第一个数
  renderDigit(
    MARGIN_LEFT + 39 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(minutes / 10),
    cxt
  );
  // 分 第二个数
  renderDigit(
    MARGIN_LEFT + 54 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(minutes % 10),
    cxt
  );
  // 冒号
  renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
  // 秒 第一个数
  renderDigit(
    MARGIN_LEFT + 78 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(seconds / 10),
    cxt
  );
  // 秒 第二个数
  renderDigit(
    MARGIN_LEFT + 93 * (RADIUS + 1),
    MARGIN_TOP,
    parseInt(seconds % 10),
    cxt
  );

  // 渲染所有小球
  for (let i = 0; i < balls.length; i++) {
    cxt.fillStyle = balls[i].color;

    cxt.beginPath();
    cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
    cxt.closePath();

    cxt.fill();
  }
}

// 渲染单个数字
function renderDigit(x, y, num, cxt) {
  // 填充的颜色
  cxt.fillStyle = "rgb(0,102,153)";

  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] == 1) {
        //开始
        cxt.beginPath();
        // 划弧
        // arc(圆心x坐标，圆心y坐标，半径，起点，终点(0、0.5、1、1.5、2)π)
        cxt.arc(
          x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          RADIUS,
          0,
          2 * Math.PI
        );
        // 结束
        cxt.closePath();
        // 填充
        cxt.fill();
      }
    }
  }
}
