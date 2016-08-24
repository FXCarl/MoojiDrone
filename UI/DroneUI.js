var css = function () { /*
                  #state-change-overlay {
                    position:fixed;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    background-color: #000;
                    z-index: 1000;
                  }
                  #state-change-overlay div {
                    position: fixed;
                    width: 100%;
                    top: 50%;
                    margin-top: -10px;
                    text-align: center;
                    color: #FFF;
                    font-size: 40px;
                    text-shadow: 0px 0px 3px #FFF;
                  }
                  .btn {
                    position: absolute;
                    display:block;
                    font-size:20px;
                    width:200px;
                    height:46px;
                    line-height:50px;
                    text-align:center;
                    color:#FFF;
                    border:2px solid #AAA;
                    -webkit-border-radius: 10px;
                    -moz-border-radius: 10px;
                    border-radius: 10px;
                  }
                  .btn:hover {
                    background-color: rgba(56, 125, 240, 0.75);
                    text-shadow: 0px 0px 4px #FFF;
                    text-decoration: none;
                  }
                  .btn-primary {
                    background-color: rgba(56, 125, 240, 0.5);
                    font-weight: bold;
                    border-color:#FFF;
                    width: 250px;
                  }
                  .btn-primary * {
                    -webkit-animation-name: blinker;
                    -webkit-animation-duration: 1s;
                    -webkit-animation-timing-function: linear;
                    -webkit-animation-iteration-count: infinite;
                
                    -moz-animation-name: blinker;
                    -moz-animation-duration: 1s;
                    -moz-animation-timing-function: linear;
                    -moz-animation-iteration-count: infinite;
                
                    animation-name: blinker;
                    animation-duration: 1s;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                  }
                
                  @-moz-keyframes blinker {  
                    0% { opacity: 1.0; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1.0; }
                  }
                
                  @-webkit-keyframes blinker {  
                    0% { opacity: 1.0; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1.0; }
                  }
                
                  @keyframes blinker {  
                    0% { opacity: 1.0; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1.0; }
                  }
                  .panel-wrapper {
                    position: absolute;
                    height: 100%;
                    width: 652px;
                    bottom: 0;
                    left: 50%;
                    padding: 20px 0;
                    margin-left: -322px;
                  }
                  .panel {
                    width:644px;   
                    position: absolute;
                    left:50%;
                    margin-left:-322px;
                    background-color: rgba(16, 16, 48, 0.75);
                    border:2px solid #DDD;
                    -webkit-border-radius: 20px;
                    -moz-border-radius: 20px;
                    border-radius: 20px;
                  }
                  .panel h2 {
                    color: #FFF;
                    margin: 20px 20px 20px 20px;
                    text-align: right;
                    width: 94%;
                    border-bottom: 2px solid #EEE;
                  }
                  .panel-wrapper .panel {
                    height: 100%;
                    position: relative;
                    left: auto;
                    width: 644px;
                    vertical-align: top;
                  }
                  .panel-body.valign-middle {
                    position: absolute;
                    top: 50%;
                    margin-top: -100px;
                    left: 50%;
                    margin-left: -327px;
                    width: 655px;
                  }
                  #level-chart,
                  .leaderboard {
                    width: 285px;
                    height: 170px;
                    border-radius: 10px;
                    border: 1px solid #444;
                  }
                  #level-chart {
                    float: left;
                    margin-left: 22px;
                    background: url(https://playcanvas.com/api/files/assets/1584526/1/level_chart_bg.png) repeat center;
                  }
                  .leaderboard {
                    position: relative;
                    float: right;
                    margin-right: 22px;
                    height: 170px;                    
                    color: #DDD;
                    padding: 10px;
                    height: 150px;
                    font-size: 11px;
                  }
                  .leaderboard table td.index {
                    padding-right: 5px;
                  }
                  .leaderboard table td.name {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                    padding-right: 5px;
                    text-transform: capitalize;
                  }
                  .leaderboard table td.score {
                    text-align: right;
                  }
                  .leaderboard .btn.btn-sign-in {
                    width: 280px;
                    font-size: 18px;
                    margin-top: 45px;
                  }
                  .leaderboard .loading {
                    text-align: center;
                    margin-top: 65px;
                  }
                  .leaderboard .sign-out {
                    position: absolute;
                    bottom: 0;
                    right: 10px;
                    font-size: 10px;
                  }
                  #main-menu {
                    position:fixed;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    display:block;
                    pointer-events : none;
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
                    pointer-events : auto;
                  }
                  #main-menu .btn-secondary {
                    width: 175px;
                    pointer-events : auto;
                  }
                  #main-menu .btn-play {
                    letter-spacing: 3px;
                    pointer-events : auto;
                  }
                  #main-menu .btn-play img {
                    position: fixed;
                    width: 48px;
                    top: 11px;
                    pointer-events : auto;
                  }
                  #main-menu .btn-play img.left {
                    left: 22px;
                    pointer-events : auto;
                  }
                  #main-menu .btn-play img.right {
                    right: 22px;
                    pointer-events : auto;
                  }
                  #main-menu .panel-wrapper {
                    padding: 105px 0 20px 0;
                    pointer-events : auto;
                  }
                  #main-menu .panel.main-menu,
                  #main-menu .panel.settings,
                  #main-menu .panel.level-select {
                    height: 70px;
                    bottom: 0;
                    pointer-events : auto;
                  }
                  #main-menu .panel.level-select-details,
                  #main-menu .panel.more-stuff {
                    top: 50%;
                    margin-top: -170px;
                    pointer-events : auto;
                  }
                  #main-menu .panel.level-select-details .panel-body {
                    padding-bottom: 20px;
                    pointer-events : auto;
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
                    pointer-events : auto;
                  }
                  #main-menu .btn-arrow {
                    width: 83px;
                    pointer-events : auto;
                  }
                  #main-menu .btn-arrow img {
                    width: 32px;
                    margin-top: 7px;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff {
                      display: block;
                      pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff h2 {
                      margin-bottom: 0;
                      pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body {
                    height: 275px;
                    margin: 0 20px 20px 20px;
                    overflow: scroll;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body ul {
                    list-style: none;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body li {
                    clear: both;
                    border-bottom: 2px dotted #AAA;
                    display: block;
                    margin: 10px 0;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body div.thumb {
                    float: left;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body img {
                    width: 100px;
                    -webkit-border-radius: 10px;
                    -moz-border-radius: 10px;
                    border-radius: 10px;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body div.thumb a.goto {
                    display: block;
                    text-align: center;
                    padding: 5px;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body div.body {
                    margin-left: 110px;
                    min-height: 130px;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body a.title {
                    font-size: 1.1em;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff .panel-body p {
                    color: #EEE;
                    padding-top: 5px;
                    pointer-events : auto;
                  }
                  #main-menu .panel.more-stuff ul li:last-child {
                      border: none;
                      pointer-events : auto;
                  }
            */}.toString().trim();
            css = css.slice(css.indexOf('/*') + 2).slice(0, -3);
            $('<style/>').text(css).appendTo($('head'));

var DroneUI = (function(){
    var uigroup = function(){
        var UI = this;
        //UIstateMachine
        UI.stateMachine = new stateMachine('DroneUI',{
            initial:null,
            events:[
                {name:'born',from:null,to:'loading'},
                {name:'startconnect',from:null,to:'connecting'},
                {name:'connected',from:'connecting',to:'mainmenu'},
                {name:'startlog',from:'mainmenu',to:'loging'},
                {name:'_2jump',from:null,to:'jumpmenu'},
                {name:'jumpin',from:'jumpmenu',to:'gamemenu'},
                {name:'gameover',from:'gamemenu',to:'endmenu'}
            ],
            callbacks:{
                onbeforeborn:function(){
                    //loading UI Resources

                    //generate UI items
                        //loading scene
                    if(!UI.loadingoverlay){
                        UI.loadingoverlay = $('<div/>').attr('id', 'state-change-overlay').addClass('overlay').appendTo($('body'));
                        UI.loadingScene = $('<div/>').addClass('loading').text('Loading-LOGO').appendTo(UI.loadingoverlay);
                    }UI.loadingoverlay.hide();
                        //connecting scene
                    if(!UI.connectingoverlay){
                        UI.connectingoverlay = $('<div/>').attr('id', 'state-change-overlay').addClass('overlay').appendTo($('body'));
                        UI.connectingScene = $('<div/>').addClass('loading').text('Connecting...').appendTo(UI.connectingoverlay);
                    }UI.connectingoverlay.hide();
                        //Login In scene
                    if(!UI.mainmenu){
                        UI.mainmenu = $('<div/>').attr('id', 'main-menu').addClass('overlay').appendTo($('body'));
                        var mainMenuPanel = $('<div />').addClass('panel main-menu').appendTo(UI.mainmenu);
                        var btnLogin = $('<a/>').addClass('btn btn-primary btn-play').css({top: 10, left: 195}).html('<span>Log In</span>').appendTo(mainMenuPanel);
                        btnLogin.on('click', function () {
                            //UI.stateMachine.startlog();
                            Game.userlog();//login game
                        }.bind(UI));
                    }
                    UI.mainmenu.hide();
                    if(!UI.jumpmenu){
                      UI.jumpmenu = $('<div/>').attr('id', 'main-menu').addClass('overlay').appendTo($('body'));
                        var jumpPanel = $('<div />').addClass('panel main-menu').appendTo(UI.jumpmenu);
                        var btnjumpin = $('<a/>').addClass('btn btn-primary btn-play').css({top: 10, left: 70}).html('<span>Jump In</span>').appendTo(jumpPanel);
                        btnjumpin.on('click', function () {
                            //UI.stateMachine.jumpin();
                            Game.jumpin();//jumpin game
                        }.bind(UI));
                        var btnLost = $('<a/>').addClass('btn').css({top: 10, left: 400}).text('Lost Connect').appendTo(jumpPanel);
                        btnLost.on('click', function () {
                            Game.connectserver();
                        }.bind(UI));
                    }
                    UI.jumpmenu.hide();
                    if(!UI.gamemenu){
                      UI.gamemenu = $('<div/>').attr('id', 'main-menu').addClass('overlay').appendTo($('body'));
                        var gamePanel = $('<div />').addClass('panel main-menu').appendTo(UI.gamemenu);
                        var btntimeover = $('<a/>').addClass('btn').css({top: 10, left: 10}).text('timeover').appendTo(gamePanel);
                        btntimeover.on('click', function () {
                            //UI.stateMachine.gameover();
                            if(player)
                              player.stateMachine.timeover();//timeover
                        }.bind(UI));
                        var btnaboard = $('<a/>').addClass('btn').css({top: 10, left: 430}).text('Aboard').appendTo(gamePanel);
                        btnaboard.on('click', function () {
                            //UI.stateMachine._2jump();
                            if(player)
                              player.stateMachine.aboard();// aboard game
                        }.bind(UI));
                        var btnLost = $('<a/>').addClass('btn').css({top: 10, left: 220}).text('Lost Connect').appendTo(gamePanel);
                        btnLost.on('click', function () {
                            Game.connectserver();
                        }.bind(UI));
                    }
                    UI.gamemenu.hide();
                    if(!UI.endmenu){
                      UI.endmenu = $('<div/>').attr('id', 'main-menu').addClass('overlay').appendTo($('body'));
                        var endPanel = $('<div />').addClass('panel main-menu').appendTo(UI.endmenu);
                        var btnjumpin = $('<a/>').addClass('btn btn-primary btn-play').css({top: 10, left: 100}).html('<span>Return</span>').appendTo(endPanel);
                        btnjumpin.on('click', function () {
                            //UI.stateMachine._2jump();
                            Game.return();//to jump in menu
                        }.bind(UI));
                        var btnLost = $('<a/>').addClass('btn').css({top: 10, left: 400}).text('Lost Connect').appendTo(endPanel);
                        btnLost.on('click', function () {
                            Game.connectserver();
                        }.bind(UI));
                    }
                    UI.endmenu.hide();
                },
                onenterloading:function(){
                    UI.loadingoverlay.fadeIn();
                },
                onexitloading:function(){
                    UI.loadingoverlay.fadeOut();
                },
                onenterconnecting:function(){
                    UI.connectingoverlay.fadeIn();
                },
                onexitconnecting:function(){
                    UI.connectingoverlay.fadeOut();
                },
                onentermainmenu:function(){
                    UI.mainmenu.fadeIn();
                },
                onexitmainmenu:function(){
                    UI.mainmenu.fadeOut();
                },
                onenterjumpmenu:function(){
                    UI.jumpmenu.fadeIn();
                },
                onexitjumpmenu:function(){
                    UI.jumpmenu.fadeOut();
                },
                onentergamemenu:function(){
                    UI.gamemenu.fadeIn();
                },
                onexitgamemenu:function(){
                    UI.gamemenu.fadeOut();
                },
                onenterendmenu:function(){
                    UI.endmenu.fadeIn();
                },
                onexitendmenu:function(){
                    UI.endmenu.fadeOut();
                },
            }
        });
    };
    return function(){return new uigroup();};
})();