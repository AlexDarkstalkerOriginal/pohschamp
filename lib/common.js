var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n22U7uBhXJDVWVM9b4kxQYh2YbZLqeZNMHa";

// онлоад
  window.onload = function(){         
    if(typeof(webExtensionWallet) === "undefined"){     
          $(".noExtension").show();   
          $(".content").hide();
      }else{          
      }
  };  
// онлоад

var hash_value = '';

var vm = new Vue({
  el: '.app',
  data: {      
    market: false,
    lab: true,    
    battleground: false,
    rank: false,
    lab_monsters: true,
    lab_gift: false,
    congrat: false, 
    versus: false,
    lab_nav: true,
    monster_page: false,
    no_monsters: false,      
    monsters: [],
    monsters_battle: [],
    my_monsters: [],
    monsters_gift: [],  
    monsters_market: [],  
    monster_page_arr: [],
    monsters_ranked: [],
    monsters_fight: [],    
    id_pack: [],
    id_monster: 0,
    id_defender: 0,
    id_attacker: 0,
    id_for_history: 0,
    fight_id: 0,
    history_arr_frontned: [],
  },
   methods: {
    monsterPage: function(id) {
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.monster_page = true;
      vm.versus = false;
      vm.congrat = false;

      vm.id_for_history = id;
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMonsterInfo';
      var id_this = id;
      var args = [];
      args.push(id_this);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonsterPage              
      });        
      var callFunction2 = 'getMonsterHistory';                  
      nebPay.simulateCall(to, value, callFunction2, callArgs, { 
        listener: cbMonsterHistory 
      });        
    },
    sell: function (id) {
      $('.sell_fake').trigger('click');
      vm.id_monster = id;
    },
    unsell: function (id) {      
      vm.id_monster = id;
      var to = dappAddress;
      var value = 0;
      var callFunction = 'offMarket';    
      var id_this = vm.id_monster;
      var args = [];
      args.push(id_this);    
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionSell              
      });        
    }, 
    buy: function (id, prize) {
      vm.id_monster = id;
      var to = dappAddress;
      var prize_this = prize;
      var value = prize_this;
      var callFunction = 'buyMonster';    
      var id_this = vm.id_monster;
      var args = [];
      args.push(id_this);          
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionBuy              
      });        
    },
    attack_monster: function (id) {
      $('.attack_fake').trigger('click');          
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyCaps';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonsters,        
      });
      vm.id_defender = id;        
    },
    attack_init: function(id) {
      var to = dappAddress;
      var value = 0;
      var callFunction = 'fight';
      var attacker = id;
      vm.id_attacker = id;
      var defender = vm.id_defender;
      var args = [];
      args.push(attacker);
      args.push(defender);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonstersFight
      }); 
    }
  }
})  

// монстер маркет
    Vue.component('monster-market', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale', 'owner', 'price'],           
    template: `<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\
                <span class="prize">{{price}}</span>\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\
                <span class="owner">owner <span class="value">{{owner}}</span></span>\                
                <button class="buy" v-on:click="vm.buy(id, price)">Buy</button>\
              </div>`,
    })
// монстер маркет

// страница боя
  Vue.component('monster-fight', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'owner', 'win', 'boolen'],
    template: '<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="owner">owner <span class="value">{{owner}}</span></span>\
                <span class="weight">{{weight}} lvl</span>\
                <button v-bind:class="{ winner: boolen }" class="result loose">+{{win}}<span class="kg">+ 1 kg</span></button>\
              </div>  ',
  })
// страница боя

// мои монстры лаб  
  Vue.component('my-monster-lab', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale'],           
    template: `<div class="monster">\                
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\                  
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\                                
                <a v-if="sale"><button  v-on:click="vm.unsell(id) class="unsell">Cancel sell</button></a> <a v-else v-on:click="vm.sell(id)"><button class="sell" href="#sell">Sell</button></a> \
              </div>`,              
  })
// мои монстры лаб

// страница монстра гет
  Vue.component('my-monster-page', {
      props: ['speed','name', 'flex', 'power', 'weight', 'src', 'owner'],           
      template: '<div class="monster">\
                  <h3>{{name}}</h3>\
                  <img v-bind:src="src" alt="">\
                  <div class="stats">\
                    <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                    <span class="agility">def: <span class="value">{{flex}}</span></span>\
                    <span class="power">attack: <span class="value">{{power}}</span></span>\
                  </div>\
                  <span class="owner">owner <span class="value">{{owner}}</span></span>\
                  <span class="weight">{{weight}} lvl</span>\
                </div>',              
    })    

  function cbMonsterPage(resp) {
     var page_monster = JSON.parse(resp.result);    
      vm.monster_page_arr = [];
      page_monster.flex = Math.round(page_monster.flex);
      page_monster.power = Math.round(page_monster.power);
      page_monster.weight = page_monster.weight.toFixed(1);
      var new_name = fix_name(page_monster.name);
      page_monster.name = new_name;      
      vm.monster_page_arr.push(page_monster);      
  }
// страница монстра гет

// монстр из коробки
  // <img v-bind:src="src" alt="">\
  var gift_monster_component = Vue.component('monster-gift', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale'],           
    template: `<div class="monster">\                
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\                                    
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\
                </div>\                                
                <button v-if="sale" class="unsell"><a v-on:click="vm.unsell(id)">Cancel sell</a></button><button v-else class="sell"><a v-on:click="vm.sell(id)" href="#sell" class="popup">Sell</a></button> \
              </div>`,              
  })
// монстр из коробки

// монстр батлграунд
  Vue.component('monster-bg', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'owner'],           
    template: `<div class="monster">\
                <h3>{{name}}</h3>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                   <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\
                </div>\
                <span class="owner">owner <span class="value">{{owner}}</span></span>\                
                <a href="#my_monsters_popup"  v-on:click="vm.attack_monster(id)" class="popup"><button class="attack">Attack</button></a>\
              </div>`,              
  })
// монстр батлграунд

// монстр ранкед
 Vue.component('monster-ranked', {
    props: ['speed','name', 'flex', 'power', 'weight', 'src', 'id', 'owner'],           
    template: `<div class="monster">\
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\                
                <div class="stats">\
                  <span class="speed">renewal: <span class="value">{{speed}}</span></span>\
                  <span class="agility">def: <span class="value">{{flex}}</span></span>\
                  <span class="power">attack: <span class="value">{{power}}</span></span>\
                </div>\
                <span class="owner">owner <span class="value">{{owner}}</span></span>\
                <span class="weight">{{weight}} lvl</span>\                
              </div>`,              
  })
// монстр ранкед

// мои монстры лаб попап
  Vue.component('my-monster-lab-popup', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale'],           
    template: `<div class="monster">\                
                <div class="name"><h3>{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\                  
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\            
                <button v-on:click="vm.attack_init(id)" class="pick">Pick</button>\
              </div>`,
  })
// мои монстры лаб попап

// переключение табов
  $('.nav button').click(function(){

    if ($(this).hasClass('market')) {
        vm.market = true;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
    } else if ($(this).hasClass('lab')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = true;
        vm.lab_monsters = true;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
    } else if ($(this).hasClass('battleground')) {
        vm.market = false;      
        vm.lab = false;
        vm.battleground = true;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
    } else if ($(this).hasClass('rank')) {
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = true;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.no_monsters = false;
        vm.congrat = false;
    }

    $('.lab_nav').hide();
    
    if ($(this).hasClass('lab')) {
      $('.lab_nav').show();
    };

    if ($(this).hasClass('active')) {
      return false;
    };    

    $('.nav button').removeClass('active');
    $(this).addClass('active');
  })


  $('.lab_nav button').click(function(){

    if ($(this).hasClass('lab_monsters')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = true;
        vm.lab_monsters = true;
        vm.lab_gift = false;
        vm.no_monsters = false;
        vm.congrat = false;
    } else if ($(this).hasClass('lab_gift')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = true;
        vm.lab_monsters = false;
        vm.lab_gift = true;
        vm.no_monsters = false;
        vm.congrat = false;
      };
    if ($(this).hasClass('active')) {
      return false;
    }
    $('.lab_nav button').removeClass('active');
    $(this).addClass('active');
  })
// переключение табов

// попапы
  $('.popup').magnificPopup({
    type:'inline',
    fixedContentPos: true, 
    mainClass: 'mfp-fade',      
    showCloseBtn: true,
    closeOnBgClick: false
  });   

  $('.transaction').magnificPopup({
    type:'inline',
    fixedContentPos: true, 
    mainClass: 'mfp-fade',      
    showCloseBtn: true,
    closeOnBgClick: false
  });   
// попапы

// нет монстра 
  $('.fake_gift').click(function(){
    $('.lab_gift').trigger('click');    
  })

  $('.fake_market').click(function(){
    $('.nav .market').trigger('click');    
  })
// нет монстра

// гет гифт монстра
  $('.get_free_monster').click(function(){
    $('.gift_box .error h1').html('');
    var to = dappAddress;
    var value = 0;
    var callFunction = 'getCaps';
    var id_pack_this = $(this).attr('data-id-pack');
    vm.id_pack = id_pack_this;
    var args = [];
    args.push(id_pack_this);
    var callArgs = JSON.stringify(args);
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbBuyFreeСheck            
    });
  })

  function cbBuyFreeСheck(resp) {        
    if (resp.result == 'true') {      
        $('.gift_box .error h1').html('');
        var to = dappAddress;
        var value = 0;
        var callFunction = 'getCaps';
        var id_pack_this = vm.id_pack;        
        var args = [];
        args.push(id_pack_this);
        var callArgs = JSON.stringify(args);
        nebPay.call(to, value, callFunction, callArgs, { 
          listener: cbTransactionGetBox           
        });
    } else {
      $('.gift_box .error h1').html(resp.result);
    }
  }

  function cbCongrat(resp) {
    var gift_monster = JSON.parse(resp.result);            
    vm.monsters_gift = [];
    var length = gift_monster.length;
    vm.monsters_gift.push(gift_monster[gift_monster.length - 1]);
    vm.monsters_gift.push(gift_monster[gift_monster.length - 2]);        
    vm.monsters_gift.push(gift_monster[gift_monster.length - 3]);        
    vm.monsters_gift.push(gift_monster[gift_monster.length - 4]);        
    vm.monsters_gift.push(gift_monster[gift_monster.length - 5]);        
    for (var i = 0; i < 5; i++) {      
      vm.monsters_gift[i].win =  vm.monsters_gift[i].chanceToWin;
      vm.monsters_gift[i].drop =  vm.monsters_gift[i].chanceDrop;
      vm.monsters_gift[i].name = fix_name(vm.monsters_gift[i].name);
      vm.monsters_gift[i].sale = fix_sale(vm.monsters_gift[i].sale);              
    }            
   } 
// гет гифт монстра

// гет платного монстра
  $('.pay_monster_get').click(function(){
    var to = dappAddress;
    var value = 0.01;
    var callFunction = 'getCaps';
    var id_pack = $('.pay_monster_get').attr('data-id-pack');
    var args = [];
    args.push(id_pack);
    var callArgs = JSON.stringify(args);
    nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTransactionGetBox            
    });
  })
// гет платного монстра

// гет магазин
  $('.market').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getAllCapsOnMarket';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMarketMonsters              
      });    
  })

  function cbMarketMonsters(resp) {
      var market_monsters = JSON.parse(resp.result);        
      vm.monsters_market = [];
      $.each(market_monsters,function(index,value){            
        // var new_sale = fix_sale(market_monsters[index].sale);
        // market_monsters[index].sale = new_sale;
        market_monsters[index].win = market_monsters[index].chanceToWin;
        market_monsters[index].drop = market_monsters[index].chanceDrop;
        var new_name = fix_name(market_monsters[index].name);
        var new_prize = market_monsters[index].price/1000000000000000000;
        market_monsters[index].price = new_prize;
        market_monsters[index].name = new_name;        
        vm.monsters_market.push(market_monsters[index]);
      });
  }
// гет магазин

// гет мои монстров + монстров под бой
  $(document).ready(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyCaps';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonsters              
      });    
      
      user_info();
  })

  $('.lab_monsters').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getMyCaps';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMyMonsters              
      });    
  })

  function cbMyMonsters(resp) {            
    if (resp.result == 'null') {      
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = true;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.no_monsters = true;
    } else {      
      var mymonsters_arr = JSON.parse(resp.result);      
      vm.my_monsters = [];   
      $.each(mymonsters_arr,function(index,value){   
        mymonsters_arr[index].win = mymonsters_arr[index].chanceToWin;
        mymonsters_arr[index].drop = mymonsters_arr[index].chanceDrop;
        mymonsters_arr[index].name = fix_name(mymonsters_arr[index].name);
        mymonsters_arr[index].sale = fix_sale(mymonsters_arr[index].sale);        
        vm.my_monsters.push(mymonsters_arr[index]);
      });
    }
  }

  function cbMyMonstersFight(resp) {  
     if (resp.execute_err == '') {
      var to = dappAddress;
      var value = 0;
      var callFunction = 'fight';
      var attacker = vm.id_attacker;
      var defender = vm.id_defender;
      var args = [];
      args.push(attacker);
      args.push(defender);
      var callArgs = JSON.stringify(args);    
      nebPay.call(to, value, callFunction, callArgs, { 
        listener: cbTransactionFight
      }); 
    } else {
      $('#error_info .error').html(resp.result);
      console.log('error ' + JSON.stringify(resp));
      $('.error_info_fake').trigger('click');
    }
  }
// гет мои монстров + монстров под бой

// обработчик транзакции гет бокс
  function cbTransactionGetBox(resp) {    
    hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = false;
        vm.congrat = true;
        var to = dappAddress;
        var value = 0;
        var callFunction = 'getMyCaps';
        var callArgs = "[]";        
        nebPay.simulateCall(to, value, callFunction, callArgs, { 
          listener: cbCongrat            
        });

        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  } 
// обработчик транзакции гет бокс

// нормальное имя
  function fix_name(name) {   
    var x = name;        
    switch(x) {
      case '1.1':
        x = 'Snake';
        return x;
        break;

      case '1.2': 
        x = 'Montgomery';
        return x;
        break;

      case '1.3':        
        x = 'Fallout Boy';
        return x;
        break;

      case '1.4': 
        x = 'Scratchy';        
        return x;
        break;

      case '1.5':       
        x = 'Grampa';
        return x; 
        break;

      case '2.1': 
        x = 'Cyndaquil';
        return x;
        break;

      case '2.2': 
        x = 'Hoppip';
        return x;
        break;

      case '2.3': 
        x = 'Squirtle';
        return x;
        break;

      case '2.4': 
        x = 'Bulbasaur';
        return x;
        break;

      case '2.5': 
        x = 'Ash&Pikachu';
        return x;
        break;

      case '3.1': 
        x = 'Buterin';
        return x;
        break;

      case '3.2': 
        x = 'Aero';
        return x;
        break;

      case '3.3': 
        x = 'DimOk';
        return x;
        break;

      case '3.4': 
        x = 'Hitters';
        return x;
        break;

      case '3.5': 
        x = 'Satoshi Nakamoto';
        return x;
        break;

      default:
        break;
    }
  }
// нормальное имя

// сейл, ансейл фикс
   function fix_sale(sale) {   
    var x = sale;    
    switch(x) {
      case 1:
        x = true;
        return x;
        break;
      case 0:
        x = false;
        return x;
        break;
      default:
        break; 
      }
    }
// сейл, ансейл фикс

// продажа монстра
  $('#sell .sell').click(function(){
    var to = dappAddress;
    var value = 0;
    var callFunction = 'goMarket';
    var prize = $('#sell input').val();
    var id_this = vm.id_monster;
    var args = [];
    args.push(id_this);
    args.push(prize);    
    var callArgs = JSON.stringify(args);    
    nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTransactionSell              
    });        
  })

  function cbTransactionSell(resp) {   
   hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        $('.lab_monsters').trigger('click');
        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  }    
// продажа монстра

// обработчик транзакции на покупку
  function cbTransactionBuy(resp) {   
   hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        $('.market').trigger('click');
        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);  
  }    
// обработчик транзакции на покупку

// гет поле боя
    $('.battleground').click(function(){
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getAllCaps';          
      var min = 0;
      var max = 9999999;
      var args = [];
      args.push(min);    
      args.push(max);    
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbBattleList              
      });   
    })

    function cbBattleList(resp) {      
      var battleList = JSON.parse(resp.result);            
      vm.monsters_battle = [];            
      $.each(battleList,function(index,value){
        battleList[index].win = battleList[index].chanceToWin;
        battleList[index].drop = battleList[index].chanceDrop;
        battleList[index].name = fix_name(battleList[index].name);
        battleList[index].sale = fix_sale(battleList[index].sale);        
        vm.monsters_battle.push(battleList[index]);
      })    
    }
// гет поле боя

// обработчик транзакции на атаку
  function cbTransactionFight(resp) {
    hash_value = resp.txhash;    
    if (resp.txhash == undefined) {
     } else {
      $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');           
    } 

    var reload_trans = setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {        
        result_trans = receipt.status;        
      if (result_trans == 1) {
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = true;
        vm.congrat = false;
        // var to = dappAddress;
        // var value = 0;
        // var callFunction = 'getMyMonsters';
        // var callArgs = "[]";        
        // nebPay.simulateCall(to, value, callFunction, callArgs, { 
        //   listener: cbCongrat            
        // });
        clearInterval(reload_trans);                          
      } else if (result_trans == 2) {
        $('#transaction .status_trans').html('<p style="color: orange"> pending </p>');
      } else {
        $('#transaction .status_trans').html('<p style="color: red"> fail </p>');                        
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);          
        clearInterval(reload_trans);          
      }
    })}, 1000);   
  }
// обработчик транзакции на атаку

// кнопка окей, сори
  $('.ok_err').click(function(){
    $('#error_info .mfp-close').trigger('click');
  })
// кнопка окей, сори

// история и страница боев обработик 
  function cbMonsterHistory(resp) {    
    var history_arr = JSON.parse(resp.result);
    var our_monster;
    var opponent;    
    vm.history_arr_frontned = [];    
    $.each(history_arr,function(index,value){
      if (history_arr[index].attacker.id == vm.id_for_history) {
        our_monster = 'a'; 
        opponent = history_arr[index].defender;
      } else {
        our_monster = 'd'; 
        opponent = history_arr[index].attacker;
      };
      var el_for_push = {};      
      if (history_arr[index].win == our_monster) {
        el_for_push.result = 'Win';
      } else {
        el_for_push.result = 'Loose';
      };
      el_for_push.name = opponent.name;
      el_for_push.name = fix_name(el_for_push.name);
      el_for_push.id_fight = index;
      vm.history_arr_frontned.push(el_for_push);
    })    
    $('.history ul').html('<li><span class="opponent">Oppenent</span><span class="result">Result</span></li>');

    $.each(vm.history_arr_frontned,function(index,value){
      if (vm.history_arr_frontned[index].result == 'Win') {
        $('.history ul').append('<li fight-id=' + vm.history_arr_frontned[index].id_fight + '><img class="opp" src="img/'+ vm.history_arr_frontned[index].name + '.png">\
                              <span class="res winner">' + vm.history_arr_frontned[index].result + '</span>\
                              <a href="#" class="info"><img src="img/info.png"></a>\
                              </li>');
      } else {
        $('.history ul').append('<li fight-id=' + vm.history_arr_frontned[index].id_fight + '><img class="opp" src="img/'+ vm.history_arr_frontned[index].name + '.png">\
                              <span class="res loose">' + vm.history_arr_frontned[index].result + '</span>\
                              <a href="#" class="info"><img src="img/info.png"></a>\
                              </li>')
      }
    });
    if (vm.history_arr_frontned.length == 0) {
      $('.history ul').append('<h2>You never fought. Go to battleground</h2>');
    };
    $('.history .info').click(function(){
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.monster_page = false;
      vm.versus = true;
      vm.congrat = false;
    });

    $('.history li .info').click(function(){
      var to = dappAddress;
      var value = 0;            
      var args = [];
      vm.fight_id = $(this).parent().attr('fight-id');      
      args.push(vm.id_for_history);              
      var callArgs = JSON.stringify(args);
      var callFunction = 'getMonsterHistory';                  
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonsterFight 
      });    
    });
  }

  function cbMonsterFight(resp) {    
    var history_arr = JSON.parse(resp.result);    
    vm.monsters_fight = [];
    // $.each(history_arr,function(index,value){
      history_arr[vm.fight_id].attacker.flex = Math.round(history_arr[vm.fight_id].attacker.flex);
      history_arr[vm.fight_id].attacker.power = Math.round(history_arr[vm.fight_id].attacker.power);
      history_arr[vm.fight_id].attacker.weight = history_arr[vm.fight_id].attacker.weight.toFixed(1);
      history_arr[vm.fight_id].defender.flex = Math.round(history_arr[vm.fight_id].defender.flex);
      history_arr[vm.fight_id].defender.power = Math.round(history_arr[vm.fight_id].defender.power);
      history_arr[vm.fight_id].defender.weight = history_arr[vm.fight_id].defender.weight.toFixed(1);

      var new_name = fix_name(history_arr[vm.fight_id].attacker.name);            
      history_arr[vm.fight_id].attacker.name = new_name;        
      var new_name = fix_name(history_arr[vm.fight_id].defender.name);                  
      history_arr[vm.fight_id].defender.name = new_name;        
      // vm.history_arr_frontned[vm.fight_id].result - результат для vm.id_for_history      
      if (history_arr[vm.fight_id].attacker.id == vm.id_for_history) {
        if (vm.history_arr_frontned[vm.fight_id].result == 'Loose') {
          history_arr[vm.fight_id].attacker.win = vm.history_arr_frontned[vm.fight_id].result;  
          history_arr[vm.fight_id].attacker.boolen = false;       
          history_arr[vm.fight_id].defender.win = 'Win'; 
          history_arr[vm.fight_id].defender.boolen = true;
        } else {
          history_arr[vm.fight_id].attacker.win = vm.history_arr_frontned[vm.fight_id].result;     
          history_arr[vm.fight_id].attacker.boolen = true;    
          history_arr[vm.fight_id].defender.win = 'Loose'; 
          history_arr[vm.fight_id].defender.boolen = false;
        }   
      } else {
        if (vm.history_arr_frontned[vm.fight_id].result == 'Loose') {
          history_arr[vm.fight_id].defender.win = vm.history_arr_frontned[vm.fight_id].result;
          history_arr[vm.fight_id].defender.boolen = false;
          history_arr[vm.fight_id].attacker.win = 'Win'; 
          history_arr[vm.fight_id].attacker.boolen = true; 
        } else {
          history_arr[vm.fight_id].defender.win = vm.history_arr_frontned[vm.fight_id].result;
          history_arr[vm.fight_id].defender.boolen = true;
          history_arr[vm.fight_id].attacker.win = 'Loose'; 
          history_arr[vm.fight_id].attacker.boolen = false; 
        }           
      }
      vm.monsters_fight.push(history_arr[vm.fight_id].attacker);   
      vm.monsters_fight.push(history_arr[vm.fight_id].defender);   
    // });
  }
// история и страница боев обработик 

// информация о игроке
  function user_info() {
    var to = dappAddress;
    var value = 0;
    var callFunction = 'getMyInfo';
    var callArgs = "[]";    
    nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbMyInfo
    });    
  }

  function cbMyInfo(resp) {
    console.log('info ' + JSON.stringify(resp));    
    var info = JSON.parse(resp.result);
    if (info == null) {
      $('.lvl_user').html('<span class="value">1</span> lvl');
      $('.win_user').html('chance to win: <span class="value">12%</span>');
      $('.exp_user').html('exp: <span class="value">0/100</span>');
    } else {
      var lvl = info.lvl;
      var chance = info.chance;
      var exp = info.expirenece;
      var current = info.current;
      $('.lvl_user').html('<span class="value">' + lvl + '</span> lvl');
      $('.win_user').html('chance to win: <span class="value">' + chance + '%</span>');
      $('.exp_user').html('exp: <span class="value">' + current + '/' + exp + '</span>');
    }    
  }
// информация о игроке


