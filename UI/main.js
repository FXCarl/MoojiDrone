var Main = pc.createScript('main');


Main.attributes.add('minHeight', {
    type: 'number',
     default: 570
});
Main.attributes.add('minWidth', {
    type: 'number',
     default: 1070
});


// initialize code called once per entity
Main.prototype.initialize = function() {
    
     var css = function () { /*
                    body {
                    position:relative;
                  }
                  * {
                    cursor:default;
                    text-decoration:none;
                    outline:0;
                    padding:0;
                    margin:0;
                    -webkit-user-select: none;  
                    -moz-user-select: none;    
                    -ms-user-select: none; 
                    user-select: none;
                  }
                  a {
                    cursor: pointer;
                    color: #EA0;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
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
            */}.toString().trim();
            css = css.slice(css.indexOf('/*') + 2).slice(0, -3);
            $('<style/>').text(css).appendTo($('head'));
            
            this.overlay = $('<div/>').attr('id', 'state-change-overlay').addClass('overlay').appendTo($('body'));
            $('<div/>').addClass('loading').text('载入').appendTo(this.overlay);
            
            this.scenes = {
                "MAIN_MENU": this.app.root.findByName('MainMenu'),
                "GAME": this.app.root.findByName('Game')
            };
            this.level = 0;
            this.setState("MAIN_MENU");
            this.app.mouse.disableContextMenu();  
            
            $(window).resize(this.onResize.bind(this));
};

Main.prototype.onResize = function() {
            var height = $(window).height();
            var width = $(window).width();
            if (height < this.minHeight || width < this.minWidth) {
                $('.overlay').css({zoom: Math.min(Math.round(height / this.minHeight * 100), Math.round(width / this.minWidth * 100)) + '%'});
            } else {
                $('.overlay').css({zoom: 'auto'});
            }
};


Main.prototype.setState = function(name) {

            app.timeScale = 1;
            this.overlay.fadeIn(function () {
                for (var key in this.scenes) {
                    if (this.scenes.hasOwnProperty(key)) {
                        this.scenes[key].enabled = (key === name);
                        if (this.scenes[key].initialized) {
                            if (key === name) {
                                if (this.scenes[key].hasOwnProperty('onActivate')) {
                                    this.scenes[key].onActivate();
                                }
                            } else {
                                if (this.scenes[key].hasOwnProperty('onDeactivate')) {
                                    this.scenes[key].onDeactivate();
                                }
                            }
                        }
                    }
                }
                this.overlay.fadeOut(function () {   
                    this.onResize();
                }.bind(this));
            }.bind(this));
            this.state = name;
};



