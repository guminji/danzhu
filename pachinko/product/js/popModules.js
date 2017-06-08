/**
 * Created by guminji on 2017/6/7.
 */
//弹层的背后半透明背景以及一些公共的弹层方法
class popBG extends laya.ui.Component{
    constructor(){
        super();
        this.popBG = new laya.display.Sprite();
        this.setSprite(this.popBG,{
            height:this.stage.height,
            width:this.stage.width,
            alpha:0.6
        })
        this.popBG.graphics.drawRect(0,0,this.popBG.width,this.popBG.height,'black');
        this.addChild(this.popBG);
        this.popBG.on('click',this,function(){
            this.close();
        })
    }
    close(){
        this.visible = false;
    }
    show(){
        this.visible = true;
    }
    setSprite(target,options){
        for(var key in options){
            target[key] = options[key];
        }
    }
}
//公共弹出框基类
class commonPOP extends popBG{
    constructor(){
        super();
        var BG = this.BG = new laya.ui.Image();
        this.zOrder = 99999;
        this.setSprite(BG,{
            source:webgm.framesPop.getTexture('commonbird.png'),
            height:webgm.framesPop.getTexture('commonbird.png').height,
            width:webgm.framesPop.getTexture('commonbird.png').width,
            centerX:0,
            top:140
        })
        this.addChild(BG);
        var closeBtn  =this.common_closeBtn  = new laya.ui.Image();
        this.setSprite(closeBtn,{
            source:webgm.framesPop.getTexture('common_closebtn.png'),
            height:webgm.framesPop.getTexture('common_closebtn.png').height,
            width:webgm.framesPop.getTexture('common_closebtn.png').width,
            top:-40,
            right:-10
        })
        BG.addChild(closeBtn);
        closeBtn.on('click',this,function(){
            this.close();
        })
    }
}
//余额充值弹层
class toChargePOP extends popBG{
    constructor(){
        super();
        this.BG = null;
        this.closeBtn = null;
        this.zOrder = 999999;
        this.init();
        this.bindEvent();
    }
    init(){
        var self =this;
        //充值弹框背景
        var popBG;
        popBG = this.BG = new laya.ui.Image();
        this.setSprite(popBG,{
            source:webgm.framesPop.getTexture('tochargeBg.png'),
            width : webgm.framesPop.getTexture('tochargeBg.png').width,
            height : webgm.framesPop.getTexture('tochargeBg.png').height,
            top :164
        })
        this.addChild(popBG);

        //取消按钮
        var closeBtn;
        closeBtn = this.closeBtn = new laya.ui.Button();
        this.setSprite(closeBtn,{
            height:78,
            width:78,
            top:14,
            right:4
        })
        popBG.addChild(closeBtn);
        //确定按钮
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            height:97,
            width:217,
            bottom:20,
            left:267
        })
        popBG.addChild(sureBtn);
        //选择金额充值容器
        var choseMoney = this.choseMoney = new laya.ui.Tab();
        this.setSprite(choseMoney,{
            centerX:0,
            top:175,
            heigth:222,
            width:707,
            space:7
        })
        choseMoney.initItems();
        for(var i = 0;i<4;i++){
            let moneyType = self["moneyType"+i] = new laya.ui.Button();
            //moneyType.height = 247;
            //moneyType.width = 167;
            moneyType.stateNum =2;
            moneyType.left = 167*i+7*(i+1);
            moneyType.skin = 'popModules/moneyType.png';
            //initItems()
            self.choseMoney.addItem(moneyType);
        }
        popBG.addChild(choseMoney);
        choseMoney.selectedIndex = -1;

        //输入框
        var moneyBlank = this.moneyBlank = new laya.ui.Image();
        this.setSprite(moneyBlank,{
            source:webgm.framesPop.getTexture('chargeBlank.png'),
            width:webgm.framesPop.getTexture('chargeBlank.png').width,
            height:webgm.framesPop.getTexture('chargeBlank.png').height,
            centerX:0,
            top:422
        })
        var inputLabel = this.inputLabel = new laya.ui.Label();
        this.setSprite(inputLabel,{
            height:moneyBlank.height,
            width:moneyBlank.width-20,
            centerX :0,
            valign :'middle',
            text :"请输入大于零的整数",
            color :'#735a62',
            fontSize:24
        })
        moneyBlank.addChild(inputLabel);
        popBG.addChild(moneyBlank);
    }
    bindEvent(){
        var self = this;
        this.closeBtn.on('click',this,function(){
            this.close();
        })
        this.sureBtn.on('click',this,function(){
            this.close();
        })
        this.choseMoney.selectHandler = new Laya.Handler(self,function(index){
            var moneychoose = [10,50,100,500];
            this.inputLabel.text = moneychoose[index];
        })
    }
}
class settingsPOP extends popBG{
    constructor(){
        super();
        //this.BG =null;
        this.zOrder = 999999;
        this.init();
        this.bindEvent();
    }
    init(){
        //设置弹窗背景
        var BG;
        BG = this.BG = new laya.ui.Image();
        this.setSprite(BG,{
            source : webgm.framesPop.getTexture('settingsBg.png'),
            width :webgm.framesPop.getTexture('settingsBg.png').width,
            height : webgm.framesPop.getTexture('settingsBg.png').height,
            top : 110 ,
            right : 2
        })
        this.addChild(BG);
        //声音关闭icon
        var soundIcon = this.soundIcon = new laya.ui.Image();
        this.setSprite(soundIcon,{
            source : webgm.framesPop.getTexture('closeSound.png'),
            width :webgm.framesPop.getTexture('closeSound.png').width,
            height : webgm.framesPop.getTexture('closeSound.png').height,
            top : 30 ,
            centerX:0,
            visible:false
        })
        if(localStorage.getItem('localVoiceStatus') == 'false'){
            soundIcon.visible = true;
        }
        BG.addChild(soundIcon);
        //设置声音按钮
        var soundBtn =this.soundBtn= new laya.ui.Button;
        this.setSprite(soundBtn,{
            height:63,
            width:74,
            top:30,
            centerX:0,
        })
        BG.addChild(soundBtn);
        //换肤按钮
        var skinBtn =this.skinBtn= new laya.ui.Button;
        this.setSprite(skinBtn,{
            height:70,
            width:90,
            top:275,
            centerX:0,
        })
        BG.addChild(skinBtn);
    }
    bindEvent() {
        this.soundBtn.on('click',this,function(){
            var storage = window.localStorage;
            if(storage.getItem('localVoiceStatus') == 'false'){
                storage.setItem('localVoiceStatus','true');
                this.soundIcon.visible = false;
                Laya.SoundManager.soundMuted =true;
            }
            else{
                storage.setItem('localVoiceStatus','false');
                this.soundIcon.visible = true;
                Laya.SoundManager.soundMuted =false;
            }
        })
        this.skinBtn.on('click',this,function(){
            this.visible = false;
            var a = new skinPOP();
            Laya.stage.addChild(a);
        })
    }
}
//皮肤切换弹层
class skinPOP extends popBG{
    constructor(){
        super();
        this.zOrder = 999999;
        this.init();
        this.bindEvent();
    }
    init(){
        var self = this;
        //换肤背景
        var BG = this.BG = new laya.ui.Image();
        this.setSprite(BG,{
            source:webgm.framesPop.getTexture('changeSkinBg.png'),
            width:webgm.framesPop.getTexture('changeSkinBg.png').width,
            height:webgm.framesPop.getTexture('changeSkinBg.png').height,
        })
        this.addChild(BG);
        //关闭按钮
        var closeBtn = this.closeBtn = new laya.ui.Button();
        this.setSprite(closeBtn,{
            height:78,
            width:78,
            top:30,
            right:5
        })
        BG.addChild(closeBtn);
        //确定按钮
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            height:80,
            width:217,
            bottom:17,
            centerX:0
        })
        BG.addChild(sureBtn);
        //选择皮肤容器
        var choseSkin = this.choseSkin = new laya.ui.Tab();
        this.setSprite(choseSkin,{
            centerX:0,
            top:130,
            heigth:410,
            width:680,
            space:17
        })
        choseSkin.initItems();
        for(var i = 0;i<4;i++){
            let skinType = self["moneyType"+i] = new laya.ui.Button();
            //moneyType.height = 247;
            //moneyType.width = 167;
            skinType.stateNum =2;
            skinType.left = 232*i;
            skinType.skin = 'popModules/skin1.png';
            //initItems()
            self.choseSkin.addItem(skinType);
        }
        BG.addChild(choseSkin);
        choseSkin.selectedIndex = -1;
    }
    bindEvent(){
        var self = this;
        this.closeBtn.on('click',this,function(){
            this.close();
        })
        this.sureBtn.on('click',this,function(){
            this.close();
        })
        this.choseSkin.selectHandler = new Laya.Handler(self,function(index){
            var skinchoose = ['type1','type2','type3'];
            console.log(skinchoose[index]);
        })
    }
}
//提示信息弹层
class commonMessage extends commonPOP{
    constructor(){
        super();
        this.init()
    }
    init(){
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            skin:'popModules/common_closebtn.png',
            centerX:0,
            bottom:20,
            stateNum:1
        })
        this.BG.addChild(sureBtn);
        console.log(2);
    }
}


