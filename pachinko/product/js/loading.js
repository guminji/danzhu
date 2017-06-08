/* 2. PAGE
 -----------------------------------------------------------------------------------------------
 ===============================================================================================*/
/*------ 2.1 LOADING ------*/
class Loading extends Component {
  constructor(onLoadedEnd) {
    super();

    this.bar = null;

    // 加载完成后运行的方法
    this.onLoadedEnd = onLoadedEnd;

    this.init();
  }

  // 初始化
  init() {
    // 容器
    this.zOrder = 300;
    this.width = this.stage.width;
    this.height = this.stage.height;
    this.loadImage(IMG_PATH + 'loading/bg_loading.jpg');
    this.pos(this.width / 2, this.height / 2);
    this.pivot(this.width / 2, this.height / 2);
    Laya.stage.addChild(this);

    // logo
    let logo = new Images(IMG_PATH + 'loading/icon_logo.png');
    logo.y = 172;
    logo.centerX = 0;
    this.addChild(logo);

    // 筹码
    let chips = new Images(IMG_PATH + 'loading/icon_chips.png');
    chips.x = 598;
    chips.y = 377;
    this.addChild(chips);

    // 健康公告
    let health = new Images(IMG_PATH + 'loading/word_health_info.png');
    health.y = 622;
    health.centerX = 0;
    this.addChild(health);

    // 进度条
    let progress = new Box();
    progress.loadImage(IMG_PATH + 'loading/bg_progressbar.png');
    progress.width = 534;
    progress.height = 40;
    progress.centerX = 0;
    progress.top = 518;
    this.addChild(progress);

    // 进度条
    this.bar = new Images(IMG_PATH + 'loading/pic_progressbar.png');
    this.bar.sizeGrid = '0, 15, 0, 15, 0';
    this.bar.width = 0;
    this.bar.height = 29;
    this.bar.left = 6;
    this.bar.centerY = 0;
    progress.addChild(this.bar);

    // 执行加载
    this.onLoad();
  }

  onLoad() {
    // 无加载失败重试
    Laya.loader.retryNum = 0;
    Laya.loader.load(webgm.asset, Handler.create(this, this.onLoaded), Handler.create(this, this.onLoading, null, false));

    // 侦听加载失败
    Laya.loader.on(Event.ERROR, this, this.onLoadError);
  }

  // 加载完成
  onLoaded() {
    Tween.to(this, {
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
    }, 600, null, Handler.create(this, () => {
      Laya.stage.removeChild(this);
      this.destroy();
    }));

    if (typeof this.onLoadedEnd === 'function') {
      this.onLoadedEnd();
    }
  }

  // 加载进度侦听器
  onLoading(progress) {
    console.log("加载进度: ", progress);

    this.bar.width = 383 * progress;
  }

  // 侦听加载失败
  onLoadError(err) {
    console.log("加载失败: ", err);
  }
}