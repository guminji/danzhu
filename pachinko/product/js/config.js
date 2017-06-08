/* CONFIG */
/* -------------------------------------------------------------- 
-----------------------------------------------------------------
  DEFINITIONS: Pachinko
  VERSION:     2017-05-22
  CONTENTS:
  0. CONFIG
    0.1 ACCOUNT
    0.2 PAYMENT
    0.3 SPRITES
    0.4 CONFIG
    0.5 ASSET
    0.6 SCENE
    0.7 POPUP
    0.8 SOCKET
    0.9 CMD
    0.10 DATA
    0.11 UTILS
    0.12 AUDIO
  1. BASE
    1.1 CUSTOM COMPONETNS
      1.1.1 SPRITE FRAMES
  2. PAGE
    2.1 LOADING
    2.2 HALL
    2.3 CURTAIN
    2.4 ROOM
    2.5 POPUP
    2.6 ALERT

-----------------------------------------------------------------
-------------------------------------------------------------- */

/* 0. CONFIG
-----------------------------------------------------------------------------------------------
===============================================================================================*/
var Sprite = laya.display.Sprite; // 基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。
var Text = laya.display.Text; // 用于创建显示对象以显示文本的类。
var Animation = laya.display.Animation; // 位图动画,用于创建位图动画的类，可以加载并显示一组位图图片，并组成动画进行播放。
var AutoBitmap = laya.ui.AutoBitmap; // 类是用于表示位图图像或绘制图形的显示对象。封装了位置，宽高及九宫格的处理，供UI组件使用。
var Component = laya.ui.Component; // 是ui控件类的基类。
var Box = laya.ui.Box; // 类是一个控件容器类。
var Images = laya.ui.Image; // 类是用于表示位图图像或绘制图形的显示对象。
var Dialog = laya.ui.Dialog; // 类是一个弹出对话框。
var Label = laya.ui.Label; // 类用于创建显示对象以显示文本。
var List = laya.ui.List; // 类用来显示项目列表。
var TextInput = laya.ui.TextInput; // 类用于创建显示对象以显示和输入文本。
var Clip = laya.ui.Clip; // 类是位图切片动画。
var Panel = laya.ui.Panel; // 是一个面板容器类
var Handler = laya.utils.Handler; // 事件处理器类。 推荐使用 Handler.create() 方法从对象池创建，减少对象创建消耗。 注意：由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。
var Pool = laya.utils.Pool; // 是对象池类，用于对象的存贮、重复使用。
var Browser = laya.utils.Browser; // 是浏览器代理类。封装浏览器及原生 js 提供的一些功能。
var Stat = laya.utils.Stat; // 用于显示帧率统计信息。
var Tween = laya.utils.Tween; // 是一个缓动类。使用实现目标对象属性的渐变。
var Ease = laya.utils.Ease; // 类定义了缓动函数，以便实现 Tween 动画的缓动效果。
var Timer = laya.utils.Timer; // 是时钟管理类。它是一个单例，可以通过 Laya.timer 访问。
var BlurFilter = laya.filters.BlurFilter; // 滤镜 - 模糊
var Rectangle = laya.maths.Rectangle; // 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
var Point = laya.maths.Point; // 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
var LocalStorage = laya.net.LocalStorage; // 用于没有时间限制的数据存储的类。
var Loader = laya.net.Loader; // 用来加载文本、JSON、XML、二进制、图像等资源的类。
var LocalStorage = laya.net.LocalStorage; // 类用于没有时间限制的数据存储。
var Texture = laya.resource.Texture; // 纹理处理类。
var Event = laya.events.Event; // 事件类型的集合。
var SoundChannel = laya.media.SoundChannel; // 用来控制程序中的声音
var SoundManager = laya.media.SoundManager; // 声音管理类。
var HTMLDivElement = Laya.HTMLDivElement; // 使用HTML字符串创建文本，或者使用外部的html文件中的文字。HTML使用CSS样式。
var HttpRequest = Laya.HttpRequest; // 通过HTTP协议传送或接收XML及其他数据
var Matrix = laya.maths.Matrix; // 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
var Matter = window.Matter; // 物理引擎
var LayaRender = window.LayaRender;

var ee = new EventEmitter(); // 发布 & 订阅

//const IMG_PATH = '../res/images/';
const IMG_PATH = 'images/res/';
const AUDIO_PATH = 'audio/';

var webgm = {};

/*------ 0.1 ACCOUNT ------*/

/*------ 0.2 PAYMENT ------*/


/*------ 0.3 SPRITES ------*/
// 背景
webgm.framesBg = null;

// 按钮
webgm.framesBtn = null;

// 图标
webgm.framesIcon = null;

// 文字 
webgm.framesWord = null;

//弹层
webgm.framesPop = null;



/*------ 0.4 CONFIG ------*/
webgm.config = {
  // socket.io地址
  socketIoUrl: null,
  // 用户登录地址
  userLoginUrl: null,
  //游戏宽 高
  width: 750,
  height: 1334,
};

/*------ 0.5 ASSET ------*/
webgm.asset = [{
  url: [
    'bg.png',
    'btn.png',
    'icon.png',
    'word.png',
    'popModules.png',
    'skin_1/room/bg.jpg',
    'skin_1/room/bg_pachinko.png',
    'skin_1/room/bg_pachinko_pathway.png',
    'skin_1/room/bg.png',
  ],
  type: Loader.IMAGE
}, {
  url: 'bg.json',
  type: Loader.ATLAS
}, {
  url: 'btn.json',
  type: Loader.ATLAS
}, {
  url: 'icon.json',
  type: Loader.ATLAS
}, {
  url: 'word.json',
  type: Loader.ATLAS
}, {
  url: 'skin_1/room/bg.json',
  type: Loader.ATLAS
}, {
  url: 'popModules.json',
  type: Loader.ATLAS
}];

// 静态资源添加对应路径
webgm.asset.map((obj) => {
  switch (obj.type) {
    case Loader.IMAGE:
      obj.url.map((item, index, arr) => {
        arr[index] = IMG_PATH + item;
      });

      break;
    case Loader.ATLAS:
      obj.url = IMG_PATH + obj.url;

      break;
    case Loader.JSON:
      obj.url = AUDIO_PATH + obj.url;

      break;
    case Loader.SOUND:
      obj.url = AUDIO_PATH + obj.url;

      break;
  }
});

/*------ 0.6 SCENE ------*/
webgm.scene = {
  loading: null,
  hall: null,
  room: null
};

/*------ 0.7 POPUP ------*/
webgm.popup = {
  recharge: null, // 充值
  gain: null, // 收获
  result: null, // 牌局结果
  rank: null, // 排行榜
  prompt: null, // 提示
  prop: null, // 道具
  help: null // 帮助
};

/*------ 0.8 SOCKET ------*/
webgm.socket = null;

webgm.socketEmit = function(res) { // 推送消息
  if (typeof LocalStorage.getItem('debug') !== 'undefined' && LocalStorage.getItem('debug') === 'true') {
    console.log('推送:' + JSON.stringify(res));
  }

  webgm.socket.emit('router', webgm.utils.utf8ToBase64(JSON.stringify(res)));

  // 发布 - socket 绑定事件
  if (typeof res.callback === 'function' && ee.getListeners(res.cmd).length === 0) {
    ee.on(res.cmd, (data) => {
      res.callback(data);
    });
  }
};

webgm.socketOn = function() { // 接收消息
  webgm.socket.on('router', function(res) {
    if (typeof LocalStorage.getItem('debug') !== 'undefined' && LocalStorage.getItem('debug') === 'true') {
      console.log('接受:' + webgm.utils.base64ToUtf8(res));
    }

    var data = JSON.parse(webgm.utils.base64ToUtf8(res));

    // 订阅 - socket 绑定事件
    if (typeof data.cmd !== 'undefined') {
      ee.trigger(data.cmd, [data]);
    } else {
      ee.trigger(webgm.cmd.ERROR, [data]);
    }
  });
};

/*------ 0.9 CMD ------*/
webgm.cmd = {
  // SOCKET CMD
  GET_USER_INFO: 'game::getUserInfo', // 获取用户信息
  IN_ROOM: 'game::inRoom', // 进入房间
  QUIT_ROOM: 'game::quit', // 退出房间
  CHECK_IN_TABLE: 'game::checkInTable', // 检测是否在桌上
  ROOM_LIST: 'game::roomList', // 房间列表 
  CHANGE_TABLE: 'game::switchTable', // 换桌
  SHOW_TAKE_OUT: 'game::showTakeOut', // 显示收获
  TAKE_OUT: 'game::takeOut', // 收获
  ERROR: 'game::error', // 统一错误返
  CHECK_USER_INFO: 'game::checkUserInfo', // 带入游戏币成功
  SET_TUO_GUAN: 'game::setTuoGuan', // 托管
  INIT_ROOM: 'game::initRoom', // 初始化房间
  QUIT_GAME: 'game::lizhuo', // 玩家离座
  WHO_IN_TABLE: 'game::whoInTable', // 玩家入座
  NO_READY_TIME: 'game::noReadyTime', // 准备倒计时
  READY: 'game::ready', // 点击准备
  CANCEL_READY: 'game::cancelReady', // 取消准备
  THINK: 'game::thinkTime', // 思考
  START: 'game::start', // 牌局开始
  DEAL: 'game::deal', // 发牌
  TURN: 'game::dealInfo', // 轮到谁说话
  PLAY: 'game::outOfCard', // 出牌
  PASS: 'game::pass', // 过牌
  END: 'game::end', // 牌局结束
  RESULT: 'game::settle', // 结算
  ERROR: 'game::error', // 错误
  GET_CHAT_FACE: 'game::getChatFaceData', // 获取聊天表情
  SEND_CHAT_FACE: 'game::sendChatFace', // 发送聊天表情
  GET_PROP: 'game::getAllItemData', // 获取道具
  SEND_PROP: 'game::payAndUseItem', // 发送道具
  BROADCAST_PUSH: 'notice::main', // 推送消息
  CHECK_NET_STATUS: 'game::heartBeat', // 弱网监测
  GET_RANK_MILLIONAIRE: 'game::rankingList', // 弹层 - 获取富豪榜
  GET_RANK_MINE: 'game::Rank_my', // 弹层 - 获取我的战绩
  GET_RANK_WINRATE: 'game::winning', // 弹层 - 获取胜率排名
  ACTIVITY: 'api::activity', // 弹层 - 人人游戏不中险   
  CAUTION: 'cmd::caution', // 弹层 - 输分禁用
  LOSE_POINT_INFO: 'game::losePointInfo', // 弹层 - 输分提醒
  USE_REMIND: 'game::wlt_error', // 弹层 - 万里通, 健康金提醒
  // EventEmitter CMD
  COUNTDOWN_START: 'ee:countdownStart', // 倒计时 - 开始
  COUNTDOWN_END: 'ee:countdownEnd' // 倒计时 - 结束
};

/*------ 0.10 DATA ------*/
webgm.data = {
  currency: [ // 积分类别
    {
      accountType: 1,
      accountName: '欢乐值',
      amountAvailable: 0,
      amountLocked: 0
    }, {
      accountType: 2,
      accountName: '万里通',
      amountAvailable: 0,
      amountLocked: 0
    }, {
      accountType: 3,
      accountName: '欢乐豆',
      amountAvailable: 0,
      amountLocked: 0
    }, {
      accountType: 4,
      accountName: '彩金',
      amountAvailable: 0,
      amountLocked: 0
    }, {
      accountType: 5,
      accountName: '钻石',
      amountAvailable: 0,
      amountLocked: 0
    }, {
      accountType: 9,
      accountName: '彩分',
      amountAvailable: 0,
      amountLocked: 0
    }, {
      accountType: 10,
      accountName: '健康金余额',
      amountAvailable: '0 平安好医生',
      amountLocked: 0
    }
  ]
};

/*------ 0.11 UTILS ------*/
webgm.utils = {
  utf8ToBase64: (str) => { // utf8转base64, 通过对字符串编码解码解决原生Base64中文乱码问题
    return window.btoa(unescape(encodeURIComponent(str)));
  },
  base64ToUtf8: (str) => { // base64转utf8, 通过对字符串编码解码解决原生Base64中文乱码问题
    return decodeURIComponent(escape(window.atob(str)));
  },
  checkLoginStatus: () => { // 检查用户登录状态
    if (typeof webgm.account.token !== 'undefined' && webgm.account.token !== '') {
      return true;
    } else {
      location.href = webgm.config.userLoginUrl;
      return false;
    }
  },
  thousandsSeparators: (number, position) => { // 数字千位显示格式化, 避免传入的数字 .99999999向上舍入, 参数最好是字符串
    var num = typeof number !== 'string' ? '' + number : number;
    var pos = position || 0;
    var isPlus = ''; // 是否是正数

    if (num.indexOf('-') > -1) {
      isPlus = '-';
      num = num.substring(1);
    }

    num = ('' + num).split('.');

    var integer = num[0].split('');
    var decimal = num[1];

    if (pos > 0) {
      if (typeof decimal !== 'undefined') {
        decimal = '.' + decimal.substring(0, pos);
      } else {
        decimal = '.';

        for (var i = 0; i < pos; i++) {
          decimal += '0';
        }
      }
    } else {
      decimal = '';
    }

    var len = integer.length;
    var count = Math.floor(len / 3);

    if (len % 3 === 0) {
      count -= 1;
    }

    for (var j = 0; j < count; j++) {
      integer.splice(-3 * (j + 1) - j, 0, ' ');
    }

    var str = integer.toString();
    str = str.replace(/,/g, "");
    str = str.replace(/\s+/g, ",");
    str += decimal;

    return isPlus + str;
  },
  formatNum: (num, maxChars) => { // 格式化数字
    let str = '' + num;

    if (str.length > maxChars) {
      str = str.substring(0, maxChars - 1) + '...';
    }

    return str;
  },
  getRandom: (n, m) => Math.round(Math.random() * (m - n) + n),
  ajax: (params) => { // ajax请求
    let httpRequest = new HttpRequest();
    let url = params.url;
    let data = params.data || null;
    let type = params.type || 'get';
    let dataType = params.dataType || 'json';

    if (data !== null) {
      let str = '';
      let keys = Object.keys(data);

      keys.map((elem, index, arr) => {
        str += elem + '=' + data[elem];

        if (index !== arr.length - 1) {
          str += '&';
        }
      });

      data = str;
    }

    if (typeof params.success === 'function') {
      httpRequest.once(Event.COMPLETE, params.caller, () => {
        params.success(httpRequest.data);
      });
    }

    if (typeof params.error === 'function') {
      httpRequest.once(Event.ERROR, params.caller, () => {
        params.error(httpRequest.data);
      });
    }

    if (typeof params.progress === 'function') {
      httpRequest.once(Event.PROGRESS, params.caller, () => {
        params.success(httpRequest.data);
      });
    }

    httpRequest.send(url, data, type, dataType);
  },
  updateUrl: (url, key) => { // 刷新添加版本号, 防止在微信中页面不刷新
    let _key = (key || 'v') + '='; // 默认是"v"
    let reg = new RegExp(_key + '\\d+'); // 正则：v=1472286066028
    let timestamp = Browser.now();

    if (url.indexOf('&NaN') > -1) {
      url = url.replace('&NaN', '');
    }

    if (url.indexOf(_key) > -1) { //有时间戳，直接更新
      return url.replace(reg, key + timestamp);
    } else { //没有时间戳，加上时间戳
      if (url.indexOf('\?') > -1) {
        let urlArr = url.split('\?');

        if (urlArr[1]) {
          return urlArr[0] + '?' + urlArr[1] + '&' + _key + timestamp;
        } else {
          return urlArr[0] + '?' + _key + timestamp;
        }
      } else {
        if (url.indexOf('\#') > -1) {
          return url.split('#')[0] + '#' + location.hash + _key + timestamp;
        } else {
          return url + '#' + _key + timestamp;
        }
      }
    }
  },
  soundSwitches: (isInit) => { // 声音开关
    if (isInit === true) {
      if (LocalStorage.getItem('switches') === null) {
        LocalStorage.setItem('switches', 'true');
      }

      SoundManager.muted = LocalStorage.getItem('switches') === 'true' ? false : true;
    } else {
      if (SoundManager.muted) {
        SoundManager.muted = false;
        LocalStorage.setItem('switches', 'true')
      } else {
        SoundManager.muted = true;
        LocalStorage.setItem('switches', 'false');
      }
    }

    if (webgm.data.soundBtnList.length > 0) {
      if (!SoundManager.muted) {
        let audio_src = webgm.scene.hall.visible ? 'hall.mp3' : 'room.mp3';

        webgm.data.soundBtnList.map((obj) => {
          obj.play();
        });

        SoundManager.playMusic(AUDIO_PATH + audio_src, 0);
      } else {
        webgm.data.soundBtnList.map((obj) => {
          obj.stop();
          obj.index = obj.total - 1;
        });
      }
    }
  },
  playSound: (name) => { // 播放音效
    let json = Laya.loader.getRes(AUDIO_PATH + 'audio.json');
    let audio = {};

    audio.soundName = name;
    audio.soundChannel = SoundManager.playSound(AUDIO_PATH + 'audio.mp3', 1, null, null, json.sprite[name][0] / 1000);
    audio.removeSound = (sound) => {
      if (typeof sound.soundChannel !== 'undefined' && sound.soundChannel !== null) {
        let _index = null;

        sound.soundChannel.stop();

        webgm.audio.map((obj, index) => {
          if (obj === sound) {
            obj = null;
            _index = index;
          }
        });

        webgm.audio.splice(_index, 1);
      }
    };

    webgm.audio.push(audio);

    Laya.timer.once(json.sprite[name][1], this, audio.removeSound, [audio]);
  },
  stopSound: (name) => { // 停止音效
    let _index = [];

    webgm.audio.map((obj, index) => {
      if (typeof obj.soundChannel !== 'undefined' && obj.soundChannel !== null) {
        if (obj.soundName === name) {
          obj.soundChannel.stop();
          obj = null;
          _index.push(index);
        }
      }
    });

    if (_index.length > 0) {
      _index.map((elem) => {
        webgm.audio.splice(elem, 1);
      });
    }
  }
};

/*------ 0.12 AUDIO ------*/
webgm.audio = [];

/*------ 1.1 CUSTOM COMPONETNS ------*/
/* 1.1.1 SPRITE FRAMES */
class SpriteFrames {
  constructor(params) {
    this.frames = Laya.loader.getRes(params.jsonUrl);
    this.texture = Laya.loader.getRes(params.imageUrl);
  }

  // 生成小图纹理
  sprite(node, framesName) {
    let frames = this.frames.frames;
    let width = frames[framesName].frame.w;
    let height = frames[framesName].frame.h;
    let left = frames[framesName].frame.x;
    let top = frames[framesName].frame.y;

    node.size(width, height);
    node.graphics.drawTexture(Texture.createFromTexture(this.texture, left, top, width, height), 0, 0, width, height);
  }

  // 获取小图纹理
  getTexture(framesName) {
    let frames = this.frames.frames;
    let width = frames[framesName].frame.w;
    let height = frames[framesName].frame.h;
    let left = frames[framesName].frame.x;
    let top = frames[framesName].frame.y;

    return Texture.createFromTexture(this.texture, left, top, width, height);
  }

  // 获取位图图像或绘制图形的显示对象
  getAutoBitmap(framesName, sizeGrid) {
    let frames = this.frames.frames;
    let width = frames[framesName].frame.w;
    let height = frames[framesName].frame.h;
    let left = frames[framesName].frame.x;
    let top = frames[framesName].frame.y;

    let autoBitmap = new AutoBitmap();

    autoBitmap.sizeGrid = sizeGrid || null;
    autoBitmap.source = Texture.createFromTexture(this.texture, left, top, width, height);

    return autoBitmap;
  }
}