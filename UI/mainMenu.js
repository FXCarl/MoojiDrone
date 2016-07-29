var MainMenu = pc.createScript('mainMenu');

// initialize code called once per entity
MainMenu.prototype.initialize = function() {
    
    var css = function () { /*
                 #main-menu {
                    position:fixed;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    display:block;
                  }
                  #main-menu h1 {
                    position: fixed;
                    font-family: "Lucida Grande", Arial, sans-serif;
                    text-shadow: 0px 0px 15px #AAC;
                    color: #EEF;
                    font-size:85px;
                    text-align:center;
                    width:100%;
                  }
                  #main-menu .btn-primary {
                    width: 250px;
                  }
                  #main-menu .btn-secondary {
                    width: 175px;
                  }
                  #main-menu .btn-play {
                    letter-spacing: 3px;
                  }
                  #main-menu .btn-play img {
                    position: fixed;
                    width: 48px;
                    top: 11px;
                  }
                  #main-menu .btn-play img.left {
                    left: 22px;
                  }
                  #main-menu .btn-play img.right {
                    right: 22px;
                  }
                  #main-menu .panel-wrapper {
                    padding: 105px 0 20px 0;
                  }
                  #main-menu .panel.main-menu, 
                  #main-menu .panel.settings,
                  #main-menu .panel.level-select {
                    height: 70px;
                    bottom: 0;
                  }
                  #main-menu .panel.level-select-details,
                  #main-menu .panel.more-stuff {
                    top: 50%;
                    margin-top: -170px;
                  }
                  #main-menu .panel.level-select-details .panel-body {
                    padding-bottom: 20px;
                  }
                  #main-menu .panel.level-select-details .description {
                    border: 1px solid #444;
                    border-radius: 10px;
                    clear: both;
                    top: 15px;
                    position: fixed;
                    width: 580px;
                    margin: 10px auto;
                    color: #DDD;
                    padding: 10px;
                    font-size: 0.8em;
                  }
                  #main-menu .btn-arrow {
                    width: 83px;
                  }
                  #main-menu .btn-arrow img {
                    width: 32px;
                    margin-top: 7px;
                  }
                  #main-menu .panel.more-stuff {
                      display: block;
                  }
                  #main-menu .panel.more-stuff h2 {
                      margin-bottom: 0;
                  }
                  #main-menu .panel.more-stuff .panel-body {
                    height: 275px;
                    margin: 0 20px 20px 20px;
                    overflow: scroll;
                  }
                  #main-menu .panel.more-stuff .panel-body ul {
                    list-style: none;
                  }
                  #main-menu .panel.more-stuff .panel-body li {
                    clear: both;
                    border-bottom: 2px dotted #AAA;
                    display: block;
                    margin: 10px 0;
                  }
                  #main-menu .panel.more-stuff .panel-body div.thumb {
                    float: left;
                  }
                  #main-menu .panel.more-stuff .panel-body img {
                    width: 100px;
                    -webkit-border-radius: 10px;
                    -moz-border-radius: 10px;
                    border-radius: 10px;
                  }
                  #main-menu .panel.more-stuff .panel-body div.thumb a.goto {
                    display: block;
                    text-align: center;
                    padding: 5px;
                  }
                  #main-menu .panel.more-stuff .panel-body div.body {
                    margin-left: 110px;
                    min-height: 130px;
                  }
                  #main-menu .panel.more-stuff .panel-body a.title {
                    font-size: 1.1em;
                  }
                  #main-menu .panel.more-stuff .panel-body p {
                    color: #EEE;
                    padding-top: 5px;
                  }
                  #main-menu .panel.more-stuff ul li:last-child {
                      border: none;
                  }
            */}.toString().trim();
    css = css.slice(css.indexOf('/*') + 2).slice(0, -3);
    $('<style/>').text(css).appendTo($('head'));

    this.main = this.app.root.findByName('UI').script.main;
    this.gameui=this.app.root.findByName('Game').script.gameUi;

    this.overlay = $('<div/>').attr('id', 'main-menu').addClass('overlay').appendTo($('body'));
    //this.overlay = this.app.graphicsDevice.canvas;
    var title = $('<h1/>').text('测试').appendTo(this.overlay);

    this.initMainMenuPanel();
    this.initSettingsPanel();
    this.initStartPanel();
    this.initPlaycanvasPanel();



    this.entity.onActivate = function () {
        this.reset();
    }.bind(this);
    this.entity.initialized = true;
    
};


MainMenu.prototype.reset = function() {
       
         this.mainMenuPanel.css({bottom: 20});
         this.settingsPanel.css({bottom: -100});
             this.startPanel.css({bottom: -100}); 
             this.playcanvasPanel.css({bottom: -100});
   
    
};

MainMenu.prototype.initMainMenuPanel = function() {
    
    this.mainMenuPanel = $('<div />').addClass('panel main-menu').appendTo(this.overlay);

    this.btnSettings = $('<a/>').addClass('btn btn-secondary').css({top: 10, left: 10}).text('设置').appendTo(this.mainMenuPanel);
    this.btnSettings.on('click', function () {
//                 this.sound.script.sound.btnClick();
    this.mainMenuPanel.display(false);
    this.settingsPanel.display(true);
    }.bind(this));


    this.btnPlay = $('<a/>').addClass('btn btn-primary btn-play').css({top: 10, left: 195}).html('<span>开始</span>').appendTo(this.mainMenuPanel);
    this.btnPlay.on('click', function () {
       // this.sound.script.sound.btnClick();
        this.mainMenuPanel.display(false);

        this.startPanel.display(true);
    }.bind(this));

    this.butPlaycanvas = $('<a/>').addClass('btn btn-secondary').css({top: 10, left: 455}).text('PlayCanvas').appendTo(this.mainMenuPanel);
    this.butPlaycanvas.on('click', function () {
         //  this.sound.script.sound.btnClick();
           this.mainMenuPanel.display(false);
           this.playcanvasPanel.display(true);

    }.bind(this));


    this.mainMenuPanel.display = function (show) {
        if (show) {
            this.mainMenuPanel.stop().animate({bottom: 20});
        } else {
            this.mainMenuPanel.stop().animate({bottom: -100});
        }
    }.bind(this);
    
    
};

//设置按钮
MainMenu.prototype.initSettingsPanel = function() {
    
    this.settingsPanel = $('<div />').addClass('panel settings').css({bottom: -100}).appendTo(this.overlay);
    this.btnSettingsBack = $('<a/>').addClass('btn').css({top: 10, left: 10}).text('返回').appendTo(this.settingsPanel);
    this.btnSettingsBack.on('click', function () {
     //   this.sound.script.sound.btnClick();
        this.settingsPanel.display(false);
        this.mainMenuPanel.display(true);
    }.bind(this));

    this.btnSettingsSound = $('<a/>').addClass('btn').css({top: 10, left: 220}).text('声音').appendTo(this.settingsPanel);
    this.btnSettingsSound.on('click', function () {
//                 this.sound.enabled = !this.sound.enabled;
//                 if (this.sound.enabled) {
//                     this.btnSettingsSound.text('声音: ON');
//                 } else {
//                     this.btnSettingsSound.text('声音: OFF');
//                 }
//                 this.sound.script.sound.btnClick();
    }.bind(this));
    this.btnSettingsMusic = $('<a/>').addClass('btn').css({top: 10, left: 430}).text('音乐').appendTo(this.settingsPanel);
    this.btnSettingsMusic.on('click', function () {
//                 this.music.enabled = !this.music.enabled;
//                 if (this.music.enabled) {
//                     this.btnSettingsMusic.text('音乐: ON');
//                 } else {
//                     this.btnSettingsMusic.text('音乐: OFF');
//                 }
//                 this.sound.script.sound.btnClick();
    }.bind(this));

    this.settingsPanel.display = function (show) {
        if (show) {
            this.settingsPanel.stop().animate({bottom: 20});
        } else {
            this.settingsPanel.stop().animate({bottom: -100});
        }
    }.bind(this);
    
}


MainMenu.prototype.initStartPanel = function() {
    this.startPanel = $('<div />').addClass('panel level-select').css({bottom: -100}).appendTo(this.overlay);
    this.btnLevelSelectBack = $('<a/>').addClass('btn btn-secondary').css({bottom: 10, left: 10}).text('返回').appendTo(this.startPanel);
    this.btnLevelSelectBack.on('click', function () {
      //  this.sound.script.sound.btnClick();
        this.startPanel.display(false);
        this.mainMenuPanel.display(true);
    }.bind(this));

    this.btnLevelSelectPlay = $('<a/>').addClass('btn btn-primary btn-play').css({bottom: 10, left: 375}).html('<span>进入</span>').appendTo(this.startPanel);
    this.btnLevelSelectPlay.on('click', function () {
      //  this.sound.script.sound.btnClick();

        document.getElementById('main-menu').style.display='none';

        this.startPanel.display(false);
        this.startGame();
    }.bind(this));


   this.startPanel.display = function (show) {
        if (show) {
            this.startPanel.stop().animate({bottom: 20});
        } else {
            this.startPanel.stop().animate({bottom: -100});
        }
    }.bind(this);
    
}


MainMenu.prototype.initPlaycanvasPanel = function() {
    
   this.playcanvasPanel = $('<div />').addClass('panel settings').css({bottom: -100}).appendTo(this.overlay);

    this.butPlaycanvas = $('<a/>').addClass('btn').css({top: 10, left: 50}).text('返回').appendTo(this.playcanvasPanel);
    this.butPlaycanvas.on('click', function () {
      //  this.sound.script.sound.btnClick();
        this.playcanvasPanel.display(false);
        this.mainMenuPanel.display(true);
    }.bind(this));

    this.btnLoginPlayCanvas = $('<a/>').addClass('btn').css({top: 10, left: 360}).text('进入').appendTo(this.playcanvasPanel);
    this.btnLoginPlayCanvas.on('click', function () {
      //  this.sound.script.sound.btnClick();
       // window.open('http://www.playcanvas.com');
    }.bind(this));


    this.playcanvasPanel.display = function (show) {
        if (show) {
            this.playcanvasPanel.stop().animate({bottom: 20});
        } else {
            this.playcanvasPanel.stop().animate({bottom: -100});
        }
    }.bind(this);
    
}



MainMenu.prototype.startGame = function() {
     setTimeout(function () { 
                this.main.setState("GAME");
            }.bind(this), 100);
};


