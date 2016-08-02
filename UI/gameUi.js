var GameUi = pc.createScript('gameUi');

// initialize code called once per entity
GameUi.prototype.initialize = function() {
          var css = function () { /*
                  #game {
                    position:fixed;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    display: block;
                    pointer-events : none;
                  }
                  #game .score-hud {
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    font-size: 55px;
                    color: #EA0;
                    text-shadow: 0px 0px 3px #EA0;
                  }
                  #game .stunt-log {
                    position: fixed;
                    top: 65px;
                    left: 10px;
                    font-size: 15px;
                    color: #EA0;
                    list-style: none;
                    padding: 0;
                    opacity: 0.5;
                    text-shadow: 0px 0px 3px #EA0;
                  }
                  #game .btn-pause {
                    width: 50px;
                    pointer-events : auto;
                  }
                  #game .btn-pause img {
                    width: 32px;
                    margin-top: 7px;
                    pointer-events : auto;
                  }
                  #game .panel.pause,
                  #game .panel.tutorial {
                    top: 50%;
                    margin-top: -195px;
                    pointer-events : auto;
                  }
                  #game .panel .panel-body {
                      padding: 70px 0 90px 0;
                      min-height: 115px;
                      pointer-events : auto;
                  }
                  #game .panel.level-complete .panel-body {
                      padding: 0 0 140px 0;
                      min-height: 115px;
                      pointer-events : auto;
                  }
                  #game .panel.pause .panel-body .btn,
                  #game .panel.level-complete .panel-body .btn {
                    position: static;
                    margin: 0 auto;
                    margin-bottom: 0;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete {
                    top: 50%;
                    margin-top: -150px;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete .panel-body .score-label,
                  #game .panel.level-complete .panel-body .score-value {
                    position: static;
                    font-size: 40px;
                    color: #EA0;
                    text-shadow: 0px 0px 3px #EA0;
                    text-align: center;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete .panel-body .score-label {
                    font-size: 30px;
                    padding-bottom: 5px;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete .panel-body .message {
                    clear: both;
                    color: #FFF;
                    text-align: center;
                    padding: 20px 30px 10px 30px;
                    display: none;
                    line-height: 1.2em;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete .panel-body .message a {
                      color: #EA0;
                      text-decoration: underline;
                      cursor: pointer;
                      pointer-events : auto;
                  }
                  #game .panel.level-complete .result,
                  #game .panel.level-complete .leaderboard {
                    width: 285px;
                    border-radius: 10px;
                    border: 1px solid #444;
                    background: rgba(0,0,0,0.2);
                    pointer-events : auto;
                  }
                  #game .panel.level-complete .result {
                    float: left;
                    margin-left: 22px;
                    height: 115px;
                    padding-top: 55px;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete.final {
                      margin-top: -185px;
                      pointer-events : auto;
                  }
                  #game .panel.level-complete.final .panel-body {
                      padding-bottom: 60px;
                      pointer-events : auto;
                  }
                  #game .panel.level-complete.final .panel-body .message {
                    display: block;
                    pointer-events : auto;
                  }
                  #game .panel.level-complete.final .next-level {
                    display: none;
                    pointer-events : auto;
                  }
                  #game .btn-secondary {
                    width: 175px;
                    pointer-events : auto;
                  }
                  #game .panel.tutorial {
                      display: none;
                      pointer-events : auto;
                  }
                  #game .panel.tutorial .panel-body {
                    text-align: center;
                    padding: 20px 0 90px 0;
                    pointer-events : auto;
                  }
                  #game .panel.tutorial .panel-body .message {
                    color: #FFF;
                    padding: 10px;
                    line-height: 22px;
                    pointer-events : auto;
                  }
                  #game .fuel-container {
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    width: 300px;
                    height: 46px;
                    margin-left: -150px;
                    opacity: 0.75;
                    pointer-events : auto;
                  }
                  #game .fuel-container .bar {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 0px;
                    height: 46px;
                    background-color: rgb(0,192,0);
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    pointer-events : auto;
                  }
                  #game .fuel-container .label {
                    position: absolute;
                    left: 0;
                    padding-top: 3px;
                    width: 300px;
                    height: 43px;
                    line-height: 46px;
                    font-size: 30px;
                    text-align: center;
                    text-shadow: 0 0 2px #FFFFFF;
                    color: rgba(255, 255, 255, 0.5);
                    background: url(https://playcanvas.com/api/files/assets/1596583/1/fuel_bg.png) repeat-x center;
                    opacity: 0.75;
                    border: 2px solid #AAA;
                    -webkit-border-radius: 10px;
                    -moz-border-radius: 10px;
                    border-radius: 10px;
                  }
                  #game .splash {
                    position:absolute;
                    top:50%;
                    left:0;
                    font-family: "Lucida Grande", Arial, sans-serif;
                    text-shadow: 0px 0px 15px #AAC;
                    color: #EEF;
                    font-size:60px;
                    text-align:center;
                    margin-top:-20px;
                    width:100%;
                    display:none;
                    opacity:0.5;
                    letter-spacing: 5px;
                  }
                  #game .control-panel {
                    position: absolute;
                    width: 40%;
                    height: 80%;
                    bottom: 5%;
                    pointer-events : auto;
                  }
                  #game .control-panel.left {
                      left: 0;
                      pointer-events : auto;
                  }
                  #game .control-panel.right {
                      right: 0;
                      pointer-events : auto;
                  }
            */}.toString().trim();
    css = css.slice(css.indexOf('/*') + 2).slice(0, -3);
    $('<style/>').text(css).appendTo($('head'));
    
    this.game = this.entity.script.game;
    this.main = this.app.root.findByName('UI').script.main;

    //this.overlay = document.getElementById("touchPanel");
    this.overlay = $('<div/>').attr('id', 'game').addClass('overlay').appendTo($('body'));
   //var touchPanel = $('<div>/').attr('id','touchPanel').attr('style','position:fixed;z-index:0;top:0;left:0;width:100%; height:100%;display:block;').appendTo(this.overlay);

    this.btnPause = $('<a/>').addClass('btn btn-pause').css({top: 10, right: 10}).appendTo(this.overlay);
    $('<img/>').attr('src', 'https://playcanvas.com/api/files/assets/1584528/1/pause.png').appendTo(this.btnPause);
    this.btnPause.on('click', function () {
        this.game.pause(true);
    }.bind(this));
    this.btnPause.display = function (show) {
        if (show) {
            this.btnPause.stop().fadeIn();
        } else {
            this.btnPause.stop().fadeOut();
        }
    }.bind(this);
    
    this.btnEnd = $('<a/>').addClass('btn btn-pause').css({top: 10, left: 10}).appendTo(this.overlay);
    $('<img/>').attr('src', 'https://playcanvas.com/api/files/assets/1584528/1/stop.png').appendTo(this.btnEnd);
    this.btnEnd.on('click', function () {
        this.game.end();
    }.bind(this));
    this.btnEnd.display = function (show) {
        if (show) {
            this.btnEnd.stop().fadeIn();
        } else {
            this.btnEnd.stop().fadeOut();
        }
    }.bind(this);
    
    
    this.pausePanel = $('<div/>').addClass('panel pause').appendTo(this.overlay);
    $('<h2/>').text('暂停').appendTo(this.pausePanel);
    var pauseBody = $('<div/>').addClass('panel-body').appendTo(this.pausePanel);
    this.pauseResume = $('<a/>').addClass('btn').css({bottom: 10, left: 10}).text('继续').appendTo(pauseBody);
    this.pauseResume.on('click', function () {
        this.game.pause(false);
    }.bind(this));
    this.pauseRestart = $('<a/>').addClass('btn').css({bottom: 10, left: 10}).text('重新开始').appendTo(pauseBody);
    this.pauseRestart.on('click', function () {
        this.game.reset();
    }.bind(this));
    this.pauseMainMenu = $('<a/>').addClass('btn').css({bottom: 10, left: 10}).text('主菜单').appendTo(pauseBody);
    this.pauseMainMenu.on('click', function () {
        this.game.reset();
        document.getElementById('game').style.display='none';
        document.getElementById('main-menu').style.display='block';
        this.game.switchState("MAIN_MENU");
    }.bind(this));
    this.pausePanel.display = function (show) {
        if (show) {
            this.pausePanel.stop().fadeIn();
        } else {
            this.pausePanel.stop().fadeOut();
        }
    }.bind(this);
    this.pausePanel.display(false);  
    
    this.endPanel = $('<div/>').addClass('panel pause').appendTo(this.overlay);
    $('<h2/>').text('游戏结束').appendTo(this.endPanel);
    var endBody = $('<div/>').addClass('panel-body').appendTo(this.endPanel);
    this.endRestart = $('<a/>').addClass('btn').css({bottom: 10, left: 20}).text('游戏结束').appendTo(endBody);
    this.endRestart.on('click', function () {
        this.game.reset();
        document.getElementById('game').style.display='none';
        document.getElementById('main-menu').style.display='block';
        this.game.switchState("MAIN_MENU");
    }.bind(this));
    this.endPanel.display = function (show) {
        if (show) {
            this.endPanel.stop().fadeIn();
        } else {
            this.endPanel.stop().fadeOut();
        }
    }.bind(this);
    this.endPanel.display(false); 
    this.app.on('GameReset',this.reset,this);
};




GameUi.prototype.reset = function() { 
    this.btnEnd.display(true);  
    this.btnPause.display(true);        
    this.pausePanel.display(false);  
    this.endPanel.display(false);  
    document.getElementById('game').style.display='block';
};


