// 初始化存储 SDK
AV.init({
  appId: 'BFDAr3xLGtvjhtVvy3RWO5NM-gzGzoHsz',// 应用 ID，用来识别应用
  appKey: '8WqN5AUVCm8Bx6NjNdr4rA5z'// 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
});

var Realtime = AV.Realtime;
var TextMessage = AV.TextMessage;
var realtime = new Realtime({
  appId: 'BFDAr3xLGtvjhtVvy3RWO5NM-gzGzoHsz',
  region: 'cn', // 美国节点为 "us"
});
var currentUser;

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
                            UI.loginpanel.show();
                        });
                    }
                    UI.mainmenu.hide();
                    
                    //loging menu
                    if(!UI.loginpanel){
                        UI.loginpanel = $('#loginpanel');
                        $('#login').on('click',function(){
                            $("#application-canvas").trigger('userlog');
                        });
                        //turn regist
                        $('#newuser').on('click', function () {
                            UI.registpanel.show();
                            UI.loginpanel.hide();
                        });
                        $('#abandonlogin').on('click', function () {
                            UI.loginpanel.hide();
                        });
                    }
                    UI.loginpanel.hide();

                    //regist
                    if(!UI.registpanel){
                        UI.registpanel = $('#registpanel');
                        //turn login
                        $('#abandonregist').on('click',function(){
                            UI.registpanel.hide();
                            UI.loginpanel.show();
                        });
                    }
                    UI.registpanel.hide();

                        //pre menu
                    if(!UI.jumpmenu){
                      UI.jumpmenu = $('#jumpinpanel');
                        var btnjumpin = $('#jumpinbtn');
                        btnjumpin.on('click', function () {
                            //can't input
                            $("#application-canvas").trigger('jumpin');
                        });
                    }
                    UI.jumpmenu.hide();

                    //chat
                    
                    if(!UI.chatpanel){
                        UI.chatpanel =  $('#chatpanel');
                        $('#inputblock').hide();
                        $('#chatinput').on('click',function(){
                            var message = {
                                name:'',//your nick name、id
                                word:''
                            };
                            message.word = $('#words').val();
                            message.name = currentUser.id;
                            //send message
                            $('#words').val('');
                            ChatingRoom.send(
                                new AV.TextMessage(message.name + ' : ' + message.word)
                            ).then(function(message) {
                                $('#messages').append($('<li>').text(message.text));
                            }).catch(console.error);
                        });

                        //in the speak team
                        $('#enterchating').on('click',function(){
                            $('#inputblock').show();
                            $('#enterchating').hide();
                        });
                    }UI.chatpanel.hide();

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
                    UI.chatpanel.fadeIn();
                    UI.jumpmenu.fadeIn();
                },
                onexitjumpmenu:function(){
                    UI.chatpanel.fadeOut();
                    UI.jumpmenu.fadeOut();
                },
                onentergamemenu:function(){
                    UI.chatpanel.fadeIn();
                    UI.gamemenu.fadeIn();
                },
                onexitgamemenu:function(){
                    UI.gamemenu.fadeOut();
                    UI.chatpanel.fadeOut();
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
    /*socket.on('connected',function(cil){//recieve connect
        isonline = true;
        mycilent.id = cil.id;
    });
    socket.on('disconnect',function(){//lost connect
        isonline = false;
        Game._2singlegame();
    });*/


    /*
    socket.on('logsuccess',function(){
        console.log(mycilent.id + " logsuccess!");
    });*/

    $("#application-canvas").on('customlog',function(){
        AV.User.logIn('User1', '123').then(
            function (loginedUser) {
                realtime.createIMClient(loginedUser.attributes.username).then(function(user) {
                    currentUser = user;
                    user.on('message', function(message, conversation) {
                        $('#messages').append($('<li>').text(message.text));
                    });
                    return user.getConversation('57d1248f0e3dd90069bec762');//DroneWaitRoom.id
                }).then(function(conversation) {
                    ChatingRoom = conversation;
                    return conversation.join();
                }).then(function(conversation) {
                    $("#application-canvas").trigger('login');
                    console.log('登陆成功！');
                }).catch(console.error.bind(console));
            },
            function (error) {
                alert(error);
            }
        );
        //Game.userlog();
    });

    $('#application-canvas').on('userlog',function(){
        var username = $('#loginusername').val();
        if(!username){
            console.log('Please Enter username!');
            return;
        }
        var password = $('#loginpassword').val();
        if(!password){
            console.log('Please Enter password!');
            return;
        }
        AV.User.logIn(username, password).then(
            function (loginedUser) {
                realtime.createIMClient(loginedUser.attributes.username).then(function(user) {
                    currentUser = user;
                    user.on('message', function(message, conversation) {
                        $('#messages').append($('<li>').text(message.text));
                    });
                    return user.getConversation('57d1248f0e3dd90069bec762');//DroneWaitRoom.id
                }).then(function(conversation) {
                    ChatingRoom = conversation;
                    return conversation.join();
                }).then(function(conversation) {
                    $("#application-canvas").trigger('login');
                    console.log('登陆成功！');
                }).catch(console.error.bind(console));
            },
            function (error) {
                alert(error);
            }
        );
        Game.userlog();
    });
    
    
    $("#application-canvas").on('login',function(){
        console.log('login');
        Game.logged();
    });

    $("#application-canvas").on('jumpin',function(){
        Game.jumpin();//jumpin game
       // socket.emit("agentjumpin",new AgentMessage(player));
    });

    $("#application-canvas").on('aboard',function(){
        if(player){
            //socket.emit('AgentDead',new AgentMessage(player));
            player.stateMachine.aboard();// aboard game
        }
    });

    $("#application-canvas").on('timeover',function(){
        if(player){
            //socket.emit('AgentDead',new AgentMessage(player));
            player.stateMachine.timeover();//timeover
        }
    });

    $("#application-canvas").on('return',function(){
        Game.return();//to jump in menu
       // socket.emit('return');
    });

    $("#application-canvas").on('back2single',function(){
        Game._2singlegame();//to jump in menu
    });

    /*socket.on('syncAgentList',function(newlist){
        if(localgame.current !== "localgaming")
            SyncAgentList(newlist);
    });
    socket.on('agentMove',function(data){
        if(data.id >= 0 && (data.id !== mycilent.id)){
            pc.app.fire('AgentMove' + data.id,data);
        }
    });

    socket.on('Addbullet',function(data){
        AddBullet(data);
    });*/
});