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
        //server only tell cilent [isonline]

    socket.on('connected',function(cil){//recieve connect
        isonline = true;
        mycilent.id = cil.id;
    });
    socket.on('disconnect',function(){//lost connect
        isonline = false;
    });

    $("#application-canvas").on('login',function(){
        Game.userlog();
        socket.emit('userlog',new AgentMessage(player));//[mycilent] -> username + password
    });
    $("#application-canvas").on('customlog',function(){
        Game.userlog();
        Game.logged();
    });
    socket.on('loginfailed',function(){
        Game.logfailed();
    });
    socket.on('logsuccess',function(){
        //username:passworld correct
        Game.logged();
    });

    $("#application-canvas").on('jumpin',function(){
        Game.jumpin();//jumpin game
        socket.emit("agentjumpin",new AgentMessage(player));
    });

    $("#application-canvas").on('aboard',function(){
        //UI.stateMachine._2jump();
        socket.emit('aboard',new AgentMessage(player));
        player.stateMachine.aboard();// aboard game
    });
    socket.on('aboarded',function(){
        //copy agent data
        console.log(player.id + ' aboarded!');
    });

    $("#application-canvas").on('timeover',function(){
        //UI.stateMachine.gameover();
        if(player){
            player.stateMachine.timeover();//timeover
            socket.emit('aboard',new AgentMessage(player));
        }
    });

    $("#application-canvas").on('return',function(){
        //UI.stateMachine._2jump();
        Game.return();//to jump in menu
        socket.emit('return',new AgentMessage(player));
    });
    $("#application-canvas").on('back2single',function(){
        //UI.stateMachine._2jump();
        Game._2singlegame();//to jump in menu
    });

    socket.on('syncAgentList',function(newlist){
        //username:passworld correct
        if(newlist)
            SyncAgentList(newlist);
    });
    socket.on('agentMove',function(agent,x,y){
        //username:passworld correct
        console.log('player : ' + player.id + '----Move' + agent.id);
        if(!player || player.id !== agent.id)
            pc.app.fire('Move' + agent.id,x,y);
    });
});