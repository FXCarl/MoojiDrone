var DroneView = Backbone.View.extend({
    el: '#wrapper',
    initialize: function(){
        console.log('init DroneView');
    },
    events:{
        'click #Display_Loading':'DisplayLoading',
        'click #Display_Login':'DisplayLogin',
        'click #Display_Menu':'DisplayMenu',
        'click #Display_InGame':'DisplayInGame',
        'click #Display_Result':'DisplayResult',
        'click #Drop_Loading':'DropLoading',
        'click #Drop_Login':'DropLogin',
        'click #Drop_Menu':'DropMenu',
        'click #Drop_InGame':'DropInGame',
        'click #Drop_Result':'DropResult',
    },
    DisplayLoading:function(event){
        html_loading=$.ajax({url:"resources/01_loading.html"}).done(function(){
            $("#ui_root").append(html_loading.responseText)
        });
    },
    DisplayLogin:function(event){
        html_loading=$.ajax({url:"resources/02_login.html"}).done(function(){
            $("#ui_root").append(html_loading.responseText)
        });
    },
    DisplayMenu:function(event){
        html_loading=$.ajax({url:"resources/03_menu.html"}).done(function(){
			$("#ui_root").append(html_loading.responseText)
        });
    },
    DisplayInGame:function(event){
        html_loading=$.ajax({url:"resources/04_ingame.html"}).done(function(){
			$("#ui_root").append(html_loading.responseText)
        });
    },
    DisplayResult:function(event){
        html_loading=$.ajax({url:"resources/05_result.html"}).done(function(){
			$("#ui_root").append(html_loading.responseText)
        });
    },
    DropLoading:function(event){
        $("#page_loading").remove();
    },
    DropLogin:function(event){
        $("#page_login").remove();
    },
    DropMenu:function(event){
        $("#page_menu").remove();
    },
    DropInGame:function(event){
        $("#page_ingame").remove();
    },
    DropResult:function(event){
        $("#page_result").remove();
    }
});

var cont = 0;
var DroneView = new DroneView();
function step(timestamp) {
    window.requestAnimationFrame(step);
    if(cont > 10){
        $('#testinput').val(chance.string());
        cont = 0;
    }
    cont ++;
}
window.requestAnimationFrame(step);