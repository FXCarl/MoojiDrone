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
                              $("#application-canvas").trigger('customlog');
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
                    }
                    UI.gamemenu.hide();

                        //end menu
                    if(!UI.endmenu){
                      UI.endmenu = $('#endpanel');
                        var returnBtn = $('#returnbtn');
                        returnBtn.on('click', function () {
                              $("#application-canvas").trigger('return');
                        });
                        var backBtn = $('#backsinglebtn');
                        backBtn.on('click', function () {
                              $("#application-canvas").trigger('back2single');
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


var AgentMessage = function(agent){
    if(!agent)
        return;
    this.id = agent.id;
    this.leftTime = agent.leftTime;
};
$(document).ready(function(){
    socket.on('connected',function(cil){//recieve connect
        isonline = true;
        mycilent.id = cil.id;
    });
    socket.on('disconnect',function(){//lost connect
        isonline = false;
        Game._2singlegame();
    });

    $("#application-canvas").on('login',function(){
        Game.userlog();
        socket.emit('userlog');
    });
    socket.on('logsuccess',function(){
        console.log(mycilent.id + " logsuccess!");
    });
    $("#application-canvas").on('customlog',function(){
        Game.userlog();
        Game.logged();
    });
    socket.on('loginfailed',function(){
        Game.logfailed();
    });

    $("#application-canvas").on('jumpin',function(){
        Game.jumpin();//jumpin game
        socket.emit("agentjumpin",new AgentMessage(player));
    });

    $("#application-canvas").on('aboard',function(){
        if(player){
            socket.emit('AgentDead',new AgentMessage(player));
            player.stateMachine.aboard();// aboard game
        }
    });

    $("#application-canvas").on('timeover',function(){
        if(player){
            socket.emit('AgentDead',new AgentMessage(player));
            player.stateMachine.timeover();//timeover
        }
    });

    $("#application-canvas").on('return',function(){
        Game.return();//to jump in menu
        socket.emit('return');
    });

    $("#application-canvas").on('back2single',function(){
        Game._2singlegame();//to jump in menu
    });

    socket.on('syncAgentList',function(newlist){
        if(localgame.current !== "localgaming")
            SyncAgentList(newlist);
    });
    socket.on('agentMove',function(data){
        if(data.id >= 0 && (data.id !== mycilent.id)){
            pc.app.fire('Move' + data.id,data.x,data.y);
        }
    });
});