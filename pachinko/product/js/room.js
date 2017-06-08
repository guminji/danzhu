/* 2. PAGE
 -----------------------------------------------------------------------------------------------
 ===============================================================================================*/
/*------ 2.3 ROOM ------*/
// 初始化物理引擎
let Engine = Matter.Engine;
let Render = Matter.Render;
let Runner = Matter.Runner;
let Body = Matter.Body;
let Events = Matter.Events;
let Composite = Matter.Composite;
let Composites = Matter.Composites;
let Common = Matter.Common;
let MouseConstraint = Matter.MouseConstraint;
let Mouse = Matter.Mouse;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Vector = Matter.Vector;
let Vertices = Matter.Vertices;

class Room extends Component {
  constructor() {
    super();

    this.init();
  }

  // 初始化
  init() {
    // 容器
    this.visible = true;
    this.alpha = 1;
    this.zOrder = 400;
    this.source = Laya.loader.getRes(IMG_PATH + 'skin_1/room/bg.jpg');
    this.width = this.stage.width;
    this.height = this.stage.height;
    this.centerX = 0;
    this.centerY = 0;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.width * this.source.height / this.source.width);
    Laya.stage.addChild(this);

    // 组件 - 头部
    let header = new RoomHeader();
    this.addChild(header);

    // 组件 - 弹珠机
    let pachinko = new RoomPachinko();
    pachinko.top = 253;
    pachinko.centerX = 0;
    this.addChild(pachinko);

    // 按钮 - 自动发射
    let btnAuto = new Images();
    btnAuto.isAuto = false;
    btnAuto.source = webgm.framesBtn.getTexture('btn_auto.png');
    btnAuto.width = btnAuto.source.width;
    btnAuto.height = btnAuto.source.height;
    btnAuto.left = 30;
    btnAuto.top = 1120;
    btnAuto.on(Event.CLICK, this, this.handlerAuto);
    this.addChild(btnAuto);

    // 组件 - 弹珠消耗
    let ballNums = new RoomBallNums();
    ballNums.left = 30;
    ballNums.top = 1220;
    this.addChild(ballNums);
  }

  // 事件 - 自动发射
  handlerAuto(evt) {
    let node = evt.target;

    node.isAuto = node.isAuto ? false : true;

    if (node.isAuto) {
      node.source = webgm.framesBtn.getTexture('btn_auto_checked.png');
    } else {
      node.source = webgm.framesBtn.getTexture('btn_auto.png');
    }

    console.log('按钮 - 自动发射', evt.target.isAuto);
  }
}

/* 组件 - 弹珠机 */
class RoomPachinko extends Component {
  constructor() {
    super();

    // matter世界
    this.world = null;
    // matter 引擎
    this.engine = null;

    // 雪碧图 - 洞
    this.framesBg = new SpriteFrames({
      jsonUrl: IMG_PATH + 'skin_1/room/bg.json',
      imageUrl: IMG_PATH + 'skin_1/room/bg.png'
    });

    // 初始化
    this.init();

    // 初始化物理引擎
    this.initPhysicsEngine();
  }

  // 初始化
  init() {
    // 容器
    this.source = Laya.loader.getRes(IMG_PATH + 'skin_1/room/bg_pachinko.png');
    this.width = this.source.width;
    this.height = this.source.height;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.height);

    // 轨道遮罩
    let pathWay = new Images();
    pathWay.source = Laya.loader.getRes(IMG_PATH + 'skin_1/room/bg_pachinko_pathway.png');
    pathWay.width = pathWay.source.width;
    pathWay.height = pathWay.source.height;
    pathWay.centerX = 0;
    pathWay.centerY = 0;
    pathWay.zOrder = 100;
    this.addChild(pathWay);
  }

  // 初始化物理引擎
  initPhysicsEngine() {
    // create engine
    this.engine = Engine.create({
      enableSleeping: true
    });

    this.world = this.engine.world;

    Engine.run(this.engine);

    let render = LayaRender.create({
      engine: this.engine,
      container: this,
      width: this.width,
      height: this.height,
      options: {
        background: IMG_PATH + 'skin_1/room/bg_pachinko.png',
        wireframes: false
      }
    });

    LayaRender.run(render);

    // 创建环形轨道
    this.createAnnularPathway();

    // 创建钢柱
    this.createPilingBar();

    //创建奖洞
    this.createHole();

    // 创建装饰品
    this.createDecoration();

    let counter = 0;
    let circle = [];

    /*setInterval(() => {
      counter++;

      const _forceX = Matter.Common.random(-14, -24);
      const _forceY = Matter.Common.random(0.01, 0.03);

      // 圆
      let _circle = Bodies.circle(405, 752, 8, {
        density: 0.785, // 密度
        restitution: 0.3, // 弹性
        isSleeping: true,
        render: {
          sprite: {
            texture: webgm.framesIcon.getTexture('icon_ball_red.png'),
            xOffset: 8,
            yOffset: 8,
          }
        },
        collisionFilter: {
          group: -1
        }
      });
      //施加压力
      Body.applyForce(_circle, _circle.position, {
        x: _forceX,
        y: _forceY
      });

      World.add(this.world, _circle);
      circle.push(_circle);

      //console.log(_forceX, _forceY);
    }, 600);*/

    Events.on(this.engine, 'collisionEnd', function(evt) {
      let _arr = [];
      // change object colours to show those ending a collision
      circle.map((obj, index) => {
        if (obj.angularSpeed === 0 && obj.speed === 0) {
          World.remove(this.world, obj);
          _arr.push(obj);
        }
      });
    });
  }

  // 创建环形轨道
  createAnnularPathway() {
    let _bodies = [];
    let _centerX = 405;
    let _centerY = 405;

    // 内环环形轨道
    let innerCircleCoordinates = this.getCircleCoordinates(328, 9);
    let exCircleCoordinates = this.getCircleCoordinates(340, 9);
    let concaveCoordinates = this.getConcaveSurfaceCoordinates(innerCircleCoordinates, exCircleCoordinates, [26, 34]);

    concaveCoordinates.map((item) => {
      let concave = Bodies.fromVertices(_centerX + item[0].x, _centerY + item[0].y, item, {
        isStatic: true,
        isSleeping: true,
        angle: -0.08,
        render: {
          visible: true
        }
      });

      _bodies.push(concave);
    });

    // 外环环形轨道
    let innerCircleCoordinates2 = this.getCircleCoordinates(370, 9);
    let exCircleCoordinates2 = this.getCircleCoordinates(385, 9);
    let concaveCoordinates2 = this.getConcaveSurfaceCoordinates(innerCircleCoordinates2, exCircleCoordinates2);

    concaveCoordinates2.map((item) => {
      let concave = Bodies.fromVertices(_centerX + item[0].x, _centerY + item[0].y, item, {
        isStatic: true,
        isSleeping: true, 
        angle: -0.08,
        render: {
          visible: false
        }
      });

      _bodies.push(concave);
    });

    // 部分轨道
    let pathwayPartCoordinates = [
      [{
        x: 216,
        y: 127
      }, {
        x: 224,
        y: 137
      }, {
        x: 196,
        y: 160
      }, {
        x: 187,
        y: 150
      }],
      [{
        x: 616,
        y: 109
      }, {
        x: 630,
        y: 120
      }, {
        x: 615,
        y: 164
      }, {
        x: 602,
        y: 154
      }]
    ];

    pathwayPartCoordinates.map((item) => {
      // 获取刚体中心坐标
      let _center = Vertices.centre(item);

      let part = Bodies.fromVertices(_center.x, _center.y, item, {
        isStatic: true,
        isSleeping: true,
        render: {
          visible: false
        }
      });

      _bodies.push(part);
    });

    World.add(this.world, _bodies);
  }

  // 创建钢柱
  createPilingBar() {
    const _arr = [{
      x: 333,
      y: 92
    }, {
      x: 366,
      y: 92
    }, {
      x: 398,
      y: 92
    }, {
      x: 430,
      y: 92
    }, {
      x: 463,
      y: 92
    }, {
      x: 398,
      y: 103
    }, {
      x: 285,
      y: 126
    }, {
      x: 274,
      y: 133
    }, {
      x: 264,
      y: 141
    }, {
      x: 256,
      y: 151
    }, {
      x: 247,
      y: 160
    }, {
      x: 241,
      y: 171
    }, {
      x: 337,
      y: 129
    }, {
      x: 325,
      y: 134
    }, {
      x: 314,
      y: 141
    }, {
      x: 305,
      y: 149
    }, {
      x: 295,
      y: 157
    }, {
      x: 287,
      y: 167
    }, {
      x: 281,
      y: 177
    }, {
      x: 366,
      y: 157
    }, {
      x: 356,
      y: 165
    }, {
      x: 346,
      y: 174
    }, {
      x: 338,
      y: 183
    }, {
      x: 384,
      y: 140
    }, {
      x: 381,
      y: 152
    }, {
      x: 380,
      y: 165
    }, {
      x: 413,
      y: 139
    }, {
      x: 416,
      y: 152
    }, {
      x: 416,
      y: 165
    }, {
      x: 430,
      y: 157
    }, {
      x: 440,
      y: 165
    }, {
      x: 450,
      y: 174
    }, {
      x: 459,
      y: 183
    }, {
      x: 459,
      y: 129
    }, {
      x: 471,
      y: 134
    }, {
      x: 482,
      y: 141
    }, {
      x: 491,
      y: 149
    }, {
      x: 501,
      y: 157
    }, {
      x: 509,
      y: 167
    }, {
      x: 516,
      y: 177
    }, {
      x: 511,
      y: 126
    }, {
      x: 522,
      y: 133
    }, {
      x: 532,
      y: 141
    }, {
      x: 540,
      y: 151
    }, {
      x: 549,
      y: 160
    }, {
      x: 555,
      y: 171
    }, {
      x: 205,
      y: 180
    }, {
      x: 178,
      y: 216
    }, {
      x: 206,
      y: 235
    }, {
      x: 225,
      y: 200
    }, {
      x: 234,
      y: 207
    }, {
      x: 242,
      y: 215
    }, {
      x: 267,
      y: 242
    }, {
      x: 289,
      y: 222
    }, {
      x: 315,
      y: 204
    }, {
      x: 324,
      y: 214
    }, {
      x: 473,
      y: 214
    }, {
      x: 482,
      y: 204
    }, {
      x: 506,
      y: 222
    }, {
      x: 528,
      y: 242
    }, {
      x: 554,
      y: 215
    }, {
      x: 562,
      y: 207
    }, {
      x: 571,
      y: 200
    }, {
      x: 590,
      y: 235
    }, {
      x: 618,
      y: 216
    }, {
      x: 590,
      y: 180
    }, {
      x: 94,
      y: 336
    }, {
      x: 104,
      y: 343
    }, {
      x: 134,
      y: 364
    }, {
      x: 134,
      y: 377
    }, {
      x: 141,
      y: 286
    }, {
      x: 150,
      y: 293
    }, {
      x: 158,
      y: 301
    }, {
      x: 152,
      y: 337
    }, {
      x: 167,
      y: 365
    }, {
      x: 167,
      y: 378
    }, {
      x: 181,
      y: 320
    }, {
      x: 201,
      y: 349
    }, {
      x: 208,
      y: 360
    }, {
      x: 215,
      y: 370
    }, {
      x: 189,
      y: 274
    }, {
      x: 212,
      y: 296
    }, {
      x: 245,
      y: 359
    }, {
      x: 239,
      y: 274
    }, {
      x: 556,
      y: 274
    }, {
      x: 551,
      y: 359
    }, {
      x: 584,
      y: 296
    }, {
      x: 606,
      y: 274
    }, {
      x: 581,
      y: 370
    }, {
      x: 588,
      y: 360
    }, {
      x: 596,
      y: 349
    }, {
      x: 615,
      y: 320
    }, {
      x: 639,
      y: 301
    }, {
      x: 647,
      y: 293
    }, {
      x: 655,
      y: 286
    }, {
      x: 629,
      y: 378
    }, {
      x: 629,
      y: 365
    }, {
      x: 644,
      y: 337
    }, {
      x: 662,
      y: 377
    }, {
      x: 662,
      y: 364
    }, {
      x: 692,
      y: 343
    }, {
      x: 702,
      y: 336
    }, {
      x: 90,
      y: 394
    }, {
      x: 101,
      y: 402
    }, {
      x: 112,
      y: 409
    }, {
      x: 94,
      y: 412
    }, {
      x: 138,
      y: 434
    }, {
      x: 175,
      y: 409
    }, {
      x: 184,
      y: 418
    }, {
      x: 193,
      y: 426
    }, {
      x: 231,
      y: 411
    }, {
      x: 240,
      y: 419
    }, {
      x: 556,
      y: 419
    }, {
      x: 565,
      y: 411
    }, {
      x: 603,
      y: 426
    }, {
      x: 612,
      y: 418
    }, {
      x: 621,
      y: 409
    }, {
      x: 685,
      y: 409
    }, {
      x: 696,
      y: 402
    }, {
      x: 706,
      y: 394
    }, {
      x: 703,
      y: 412
    }, {
      x: 113,
      y: 459
    }, {
      x: 141,
      y: 488
    }, {
      x: 143,
      y: 499
    }, {
      x: 162,
      y: 460
    }, {
      x: 183,
      y: 488
    }, {
      x: 180,
      y: 499
    }, {
      x: 223,
      y: 454
    }, {
      x: 234,
      y: 459
    }, {
      x: 243,
      y: 467
    }, {
      x: 251,
      y: 476
    }, {
      x: 257,
      y: 487
    }, {
      x: 277,
      y: 438
    }, {
      x: 288,
      y: 446
    }, {
      x: 297,
      y: 455
    }, {
      x: 304,
      y: 464
    }, {
      x: 310,
      y: 475
    }, {
      x: 342,
      y: 501
    }, {
      x: 351,
      y: 492
    }, {
      x: 364,
      y: 446
    }, {
      x: 373,
      y: 440
    }, {
      x: 388,
      y: 470
    }, {
      x: 399,
      y: 470
    }, {
      x: 399,
      y: 501
    }, {
      x: 410,
      y: 470
    }, {
      x: 423,
      y: 440
    }, {
      x: 433,
      y: 446
    }, {
      x: 445,
      y: 492
    }, {
      x: 454,
      y: 501
    }, {
      x: 486,
      y: 475
    }, {
      x: 492,
      y: 464
    }, {
      x: 499,
      y: 455
    }, {
      x: 508,
      y: 446
    }, {
      x: 519,
      y: 438
    }, {
      x: 539,
      y: 487
    }, {
      x: 545,
      y: 476
    }, {
      x: 553,
      y: 467
    }, {
      x: 562,
      y: 459
    }, {
      x: 573,
      y: 454
    }, {
      x: 616,
      y: 499
    }, {
      x: 613,
      y: 488
    }, {
      x: 634,
      y: 460
    }, {
      x: 653,
      y: 499
    }, {
      x: 655,
      y: 488
    }, {
      x: 683,
      y: 459
    }, {
      x: 205,
      y: 557
    }, {
      x: 207,
      y: 568
    }, {
      x: 226,
      y: 526
    }, {
      x: 247,
      y: 557
    }, {
      x: 244,
      y: 568
    }, {
      x: 273,
      y: 528
    }, {
      x: 278,
      y: 539
    }, {
      x: 280,
      y: 551
    }, {
      x: 281,
      y: 563
    }, {
      x: 279,
      y: 576
    }, {
      x: 294,
      y: 616
    }, {
      x: 296,
      y: 627
    }, {
      x: 315,
      y: 588
    }, {
      x: 322,
      y: 537
    }, {
      x: 327,
      y: 547
    }, {
      x: 332,
      y: 558
    }, {
      x: 336,
      y: 616
    }, {
      x: 333,
      y: 627
    }, {
      x: 372,
      y: 520
    }, {
      x: 399,
      y: 539
    }, {
      x: 425,
      y: 520
    }, {
      x: 463,
      y: 627
    }, {
      x: 460,
      y: 616
    }, {
      x: 464,
      y: 558
    }, {
      x: 469,
      y: 547
    }, {
      x: 474,
      y: 537
    }, {
      x: 481,
      y: 588
    }, {
      x: 500,
      y: 627
    }, {
      x: 502,
      y: 616
    }, {
      x: 518,
      y: 576
    }, {
      x: 516,
      y: 563
    }, {
      x: 516,
      y: 551
    }, {
      x: 519,
      y: 539
    }, {
      x: 524,
      y: 528
    }, {
      x: 552,
      y: 568
    }, {
      x: 549,
      y: 557
    }, {
      x: 570,
      y: 526
    }, {
      x: 589,
      y: 568
    }, {
      x: 591,
      y: 557
    }];

    let _bodies = [];

    _arr.map((obj) => {
      let _circle = Bodies.circle(obj.x + 6, obj.y + 6, 6, {
        isStatic: true,
        isSleeping: true,
        render: {
          sprite: {
            texture: webgm.framesIcon.getTexture('icon_pilingbar.png'),
            xOffset: 6,
            yOffset: 6,
          }
        }
      });

      _bodies.push(_circle);
    });

    World.add(this.world, _bodies);
  }

  // 创建奖洞
  createHole() {
    let _bodies = [];
    let _arr = [{
      label: 'hole',
      position: {
        x: 150,
        y: 511
      },
      width: 35,
      height: 7,
      times: 2,
      texture: ['bg_hole_2.png', 'bg_hole_2_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 214,
        y: 579
      },
      width: 35,
      height: 7,
      times: 4,
      texture: ['bg_hole_4.png', 'bg_hole_4_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 303,
        y: 638
      },
      width: 35,
      height: 7,
      times: 2,
      texture: ['bg_hole_6.png', 'bg_hole_6_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 624,
        y: 511
      },
      width: 35,
      height: 7,
      times: 8,
      texture: ['bg_hole_8.png', 'bg_hole_8_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 560,
        y: 579
      },
      width: 35,
      height: 7,
      times: 10,
      texture: ['bg_hole_10.png', 'bg_hole_10_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 471,
        y: 638
      },
      width: 35,
      height: 7,
      times: 12,
      texture: ['bg_hole_12.png', 'bg_hole_12_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 388,
        y: 612
      },
      width: 35,
      height: 7,
      times: 20,
      texture: ['bg_hole_20.png', 'bg_hole_20_highlight.png'],
      textureOffset: {
        x: 51,
        y: 15
      }
    }, {
      label: 'hole',
      position: {
        x: 375,
        y: 704
      },
      width: 60,
      height: 30,
      times: 0,
      texture: ['bg_hole.png'],
      textureOffset: {
        x: 69,
        y: 21
      }
    }];

    _arr.map((obj) => {
      let _texture = [];

      obj.texture.map((item) => {
        _texture.push(this.framesBg.getTexture(item));
      });

      let _hole = Bodies.rectangle(obj.position.x + obj.width / 2, obj.position.y + obj.height / 2, obj.width, obj.height, {
        isStatic: true,
        isSensor: true,
        isSleeping: true,
        label: obj.label,
        render: {
          sprite: {
            texture: _texture[0],
            xOffset: obj.textureOffset.x,
            yOffset: obj.textureOffset.y,
          }
        },
        texture: _texture,
        textureOffset: obj.textureOffset
      });

      _bodies.push(_hole);
    });

    World.add(this.world, _bodies);

    // 当钢珠碰到洞口时, 80ms后从引擎中移除钢珠 
    Events.on(this.engine, 'collisionStart', function(evt) {
      let _pairs = evt.pairs;

      _pairs.map((obj) => {
        let _hole = null;
        let _ball = null;

        // 判断是否小球和洞碰撞
        if (obj.bodyA.label === 'hole') {
          _hole = obj.bodyA;
          _ball = obj.bodyB;
        } else if (obj.bodyB.label === 'hole') {
          _hole = obj.bodyB;
          _ball = obj.bodyA;
        }

        if (_hole !== null && _ball !== null) {
          if (_hole.texture.length > 1) {
            let _sprite = _hole.layaSprite;

            _sprite.graphics.clear();
            _sprite.graphics.drawTexture(_hole.texture[1]);

            setTimeout(() => {
              _sprite.graphics.clear();
              _sprite.graphics.drawTexture(_hole.texture[0]);
            }, 200)
          }

          setTimeout(() => {
            World.remove(this.world, _ball);
          }, 60);
        }
      });
    });
  }

  // 创建装饰品
  createDecoration() {
    let _bodies = [];
    let _arr = [{
      label: 'arrow',
      position: {
        x: 373,
        y: 181
      },
      width: 64,
      height: 28,
      texture: ['bg_arrow_top.png', 'bg_arrow_top_highlight.png'],
      textureOffset: {
        x: 32,
        y: 14
      },
      timer: null
    }, {
      label: 'arrow',
      position: {
        x: 370,
        y: 208
      },
      width: 70,
      height: 25,
      texture: ['bg_arrow_bottom.png', 'bg_arrow_bottom_highlight.png'],
      textureOffset: {
        x: 35,
        y: 13
      },
      timer: null
    }];

    _arr.map((obj) => {
      let _texture = [];

      obj.texture.map((item) => {
        _texture.push(this.framesBg.getTexture(item));
      });

      let _decoration = Bodies.trapezoid(obj.position.x + obj.width / 2, obj.position.y + obj.height / 2, obj.width, obj.height, 0.2, {
        isStatic: true,
        isSensor: true,
        isSleeping: true,
        label: obj.label,
        render: {
          sprite: {
            texture: _texture[0],
            xOffset: obj.textureOffset.x,
            yOffset: obj.textureOffset.y,
          }
        },
        texture: _texture,
        textureOffset: obj.textureOffset
      });

      _bodies.push(_decoration);
    });

    World.add(this.world, _bodies);

    /*
     * 当钢珠碰经过箭头时, 箭头高亮, 200ms还原
     * 如果在200ms内再有钢珠经过, 则移除定时器, 重新定时
     */
    Events.on(this.engine, 'collisionStart', function(evt) {
      let _pairs = evt.pairs;

      _pairs.map((obj) => {
        let _decoration = null;
        let _ball = null;

        // 判断是否小球和箭头碰撞
        if (obj.bodyA.label === 'arrow') {
          _decoration = obj.bodyA;
          _ball = obj.bodyB;
        } else if (obj.bodyB.label === 'arrow') {
          _decoration = obj.bodyB;
          _ball = obj.bodyA;
        }

        if (_decoration !== null && _ball !== null) {
          if (_decoration.texture.length > 1) {
            clearTimeout(_decoration.timer);

            let _sprite = _decoration.layaSprite;

            _sprite.graphics.clear();
            _sprite.graphics.drawTexture(_decoration.texture[1]);

            _decoration.timer = setTimeout(() => {
              _sprite.graphics.clear();
              _sprite.graphics.drawTexture(_decoration.texture[0]);
            }, 200);
          }
        }
      });
    });
  }

  /**
   * 通过圆参数方程获取圆坐标
   * @param (number) radius 半径
   * @param (number) angle 角度
   **/
  getCircleCoordinates(radius, angle) {
    let _arr = [];
    // 弧度
    let _radian = 0;

    const _nums = 360 / angle;

    for (let i = 0; i < _nums; i++) {
      _radian = (2 * Math.PI / 360) * angle * i;

      _arr.push({
        x: Math.cos(_radian) * radius,
        y: Math.sin(_radian) * radius
      });
    }

    return _arr;
  }

  /**
   * 通过两个同心圆坐标获取凹面刚体顶点坐标
   * 两个同心圆构成圆环, 圆环分解成多个刚体
   * 一个刚体由4个顶点构成, 2个内圆相邻坐标, 2个外圆相邻坐标
   * @param (array) innerCircleCoordinates 内圆坐标数组
   * @param (array) exCircleCoordinates 外圆坐标数组
   * @param (array) emptyRegionn 空区域索引值
   **/
  getConcaveSurfaceCoordinates(innerCircleCoordinates, exCircleCoordinates, emptyRegionn) {
    let _arr = [];

    const ex_arr = exCircleCoordinates;
    const in_arr = innerCircleCoordinates;
    const _empty = Array.isArray(emptyRegionn) ? emptyRegionn : [-1, -1];

    in_arr.map((obj, index, arr) => {
      if (index < _empty[0] || index > _empty[1]) {
        if (index < arr.length - 1) {
          _arr.push([obj, ex_arr[index], ex_arr[index + 1], arr[index + 1]]);
        } else {
          _arr.push([obj, ex_arr[index], ex_arr[0], arr[0]]);
        }
      }
    });

    return _arr;
  }
}

/* 组件 - 头部 */
class RoomHeader extends Component {
  constructor() {
    super();

    // 初始化
    this.init();
  }

  // 初始化
  init() {
    this.source = webgm.framesBg.getTexture('bg_header.png');
    this.width = this.stage.width - 9 * 2;
    this.height = 86;
    this.top = 9;
    this.centerX = 0;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.height);

    let bg = new Images();
    bg.source = webgm.framesBg.getTexture('bg_header.png');
    bg.sizeGrid = '10, 10, 10, 10, 1';
    bg.width = this.width;
    bg.height = this.height;
    this.addChild(bg);

    // 按钮 - 返回
    let btnBack = new Images();
    btnBack.source = webgm.framesBtn.getTexture('btn_header_back.png');
    btnBack.width = btnBack.source.width;
    btnBack.height = btnBack.source.height;
    btnBack.left = 13;
    btnBack.centerY = 0;
    btnBack.on(Event.CLICK, this, this.handlerBack);
    this.addChild(btnBack);

    // 按钮 - 排行榜
    let btnRank = new Images();
    btnRank.source = webgm.framesBtn.getTexture('btn_header_rank.png');
    btnRank.width = btnRank.source.width;
    btnRank.height = btnRank.source.height;
    btnRank.left = 156;
    btnRank.centerY = 0;
    btnRank.on(Event.CLICK, this, this.handlerRank);
    this.addChild(btnRank);

    // 按钮 - 排行榜
    let btnHome = new Images();
    btnHome.source = webgm.framesBtn.getTexture('btn_header_home.png');
    btnHome.width = btnHome.source.width;
    btnHome.height = btnHome.source.height;
    btnHome.right = 156;
    btnHome.centerY = 0;
    btnHome.on(Event.CLICK, this, this.handlerHome);
    this.addChild(btnHome);

    // 按钮 - 设置
    let btnConfig = new Images();
    btnConfig.source = webgm.framesBtn.getTexture('btn_header_config.png');
    btnConfig.width = btnConfig.source.width;
    btnConfig.height = btnConfig.source.height;
    btnConfig.right = 13;
    btnConfig.centerY = 0;
    btnConfig.on(Event.CLICK, this, this.handlerConfig);
    this.addChild(btnConfig);

    // 显示 - 筹码
    let amountBox = new Images();
    amountBox.source = webgm.framesBg.getTexture('bg_header_amount.png');
    amountBox.sizeGrid = '14, 14, 14, 14, 1';
    amountBox.width = 210;
    amountBox.height = this.source.height;
    amountBox.centerX = 0;
    amountBox.centerY = 0;
    this.addChild(amountBox);

    let amountIcon = new Images();
    amountIcon.source = webgm.framesIcon.getTexture('icon_coin.png');
    amountIcon.left = 0;
    amountIcon.centerY = 0;
    amountBox.addChild(amountIcon);

    this.amountLabel = new Label();
    this.amountLabel.text = '0';
    this.amountLabel.overflow = 'hidden';
    this.amountLabel.width = 144;
    this.amountLabel.height = amountBox.height;
    this.amountLabel.left = 58;
    this.amountLabel.top = 0;
    this.amountLabel.color = '#ffc28b';
    this.amountLabel.fontSize = 24;
    this.amountLabel.align = 'right';
    this.amountLabel.valign = 'middle';
    amountBox.addChild(this.amountLabel);
  }

  // 事件 - 返回
  handlerBack() {
    console.log('按钮 - 返回');
  }

  // 事件 - 排行榜
  handlerRank() {
    var a = new commonMessage();
    Laya.stage.addChild(a);
    console.log('按钮 - 排行榜');
    
  }

  // 事件 - 首页
  handlerHome() {
    var a = new toChargePOP();
    console.log(a.mouseThrough);
    Laya.stage.addChild(a);
    console.log('按钮 - 首页');
  }

  // 事件 - 设置
  handlerConfig() {
    var a = new settingsPOP();
    console.log(a.mouseThrough);
    Laya.stage.addChild(a);
    console.log('按钮 - 设置');
  }

  /**
   * 更新筹码数量
   * @param (number) amount 筹码数量
   **/
  updateAmount(amount) {
    this.amountLabel = '' + amount;
  }
}

/* 组件 - 弹珠消耗 */
class RoomBallNums extends Component {
  constructor() {
    super();

    // 初始化
    this.init();
  }

  // 初始化
  init() {
    // 显示 - 弹珠消耗
    this.source = webgm.framesBg.getTexture('bg_ball_nums.png');
    this.width = this.source.width;
    this.height = this.source.height;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.height);

    this.numsLabel = new Label();
    this.numsLabel.text = '0';
    this.numsLabel.overflow = 'hidden';
    this.numsLabel.width = 68;
    this.numsLabel.height = 36;
    this.numsLabel.right = 16;
    this.numsLabel.top = 12;
    this.numsLabel.color = '#fffc00';
    this.numsLabel.fontSize = 30;
    this.numsLabel.align = 'right';
    this.numsLabel.valign = 'middle';
    this.addChild(this.numsLabel);
  }

  /**
   * 更新弹珠数量
   * @param (number) num 弹珠码数量
   **/
  updateNums(num) {
    this.numsLabel = '' + num;
  }
}