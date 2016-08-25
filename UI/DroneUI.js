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
                    //Get UI items
                        //loading scene
                    if(!UI.loadingoverlay){
                        UI.loadingoverlay = $('#loadingpanel');
                    }UI.loadingoverlay.hide();

                        //connecting scene
                    if(!UI.connectingoverlay){
                        UI.connectingoverlay = $('#connectingpanel');
                    }UI.connectingoverlay.hide();

                        //mainmenu
                    if(!UI.mainmenu){
                        UI.mainmenu = $('#mainmenupanel');
                        var btnLogin = $('#loginbtn');
                        btnLogin.on('click', function () {
                              $("#application-canvas").trigger('login');
                        });
                    }
                    UI.mainmenu.hide();

                        //loging menu

                        //pre menu
                    if(!UI.jumpmenu){
                      UI.jumpmenu = $('#jumpinpanel');
                        var btnjumpin = $('#jumpinbtn');
                        btnjumpin.on('click', function () {
                              $("#application-canvas").trigger('jumpin');
                        });
                        var btnLost = $('#jumplostbtn');
                        btnLost.on('click', function () {
                              $("#application-canvas").trigger('lost');
                        });
                    }
                    UI.jumpmenu.hide();

                        //game menu
                    if(!UI.gamemenu){
                      UI.gamemenu = $('#gamingpanel');
                        var btntimeover = $('#timeoverbtn');
                        btntimeover.on('click', function () {
                              $("#application-canvas").trigger('timeover');
                        });
                        var btnaboard = $('#aboardbtn');
                        btnaboard.on('click', function () {
                              $("#application-canvas").trigger('aboard');
                        });
                        var btnLost = $('#gaminglostbtn');
                        btnLost.on('click', function () {
                              $("#application-canvas").trigger('lost');
                        });
                    }
                    UI.gamemenu.hide();

                        //end menu
                    if(!UI.endmenu){
                      UI.endmenu = $('#endpanel');
                        var returnBtn = $('#returnbtn');
                        returnBtn.on('click', function () {
                              $("#application-canvas").trigger('return');
                        });
                        var btnLost = $('#endlostbtn');
                        btnLost.on('click', function () {
                              $("#application-canvas").trigger('lost');
                        });
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
                onenterloging:function(){
                    //show loading UI
                },
                onexitloging:function(){
                    //show loading UI
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

$(document).ready(function(){
    $("#application-canvas").on('login',function(){
        Game.userlog();//login game
    });
    $("#application-canvas").on('jumpin',function(){
        //UI.stateMachine.jumpin();
        Game.jumpin();//jumpin game
    });
    $("#application-canvas").on('aboard',function(){
      //UI.stateMachine._2jump();
      if(player)
        player.stateMachine.aboard();// aboard game
    });
    $("#application-canvas").on('timeover',function(){
      //UI.stateMachine.gameover();
      if(player)
        player.stateMachine.timeover();//timeover
    });
    $("#application-canvas").on('return',function(){
      //UI.stateMachine._2jump();
      Game.return();//to jump in menu
    });
    $("#application-canvas").on('lost',function(){
      Game.connectserver();
    });
});