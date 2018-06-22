var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1vpDJzHaKARfbAY6Xi1ACJfTAQUHe7XP2u";

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
    // lab_monsters: false,
    lab_gift: false,
    congrat: false, 
    versus: false,
    lab_nav: true,
    account_page: false,
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
    player_history_arr: [],
    id_pack: [],
    player_monsters: [],
    id_monster: 0,
    id_defender: 0,
    id_attacker: 0,
    id_for_history: 0,    
    fight_id: 0,
    history_arr_frontned: [],
    owner: 0,    
    monster_view: [
      { 
        name: 'Snake',
        drop: '30',
      },
      { 
        name: 'Montgomery',
        drop: '30',
      },
      { 
        name: 'Fallout Boy',
        drop: '20',
      },
      { 
        name: 'Scratchy',
        drop: '15',
      },
      { 
        name: 'Grampa',
        drop: '5',
      },
      { 
        name: 'Cyndaquil',
        drop: '30',
      },
      { 
        name: 'Hoppip',
        drop: '30',
      },
      { 
        name: 'Squirtle',
        drop: '20',
      },
      { 
        name: 'Bulbasaur',
        drop: '15',
      },
      { 
        name: 'Ash&Pikachu',
        drop: '5',
      },
      { 
        name: 'Buterin',
        drop: '30',
      },
      { 
        name: 'Aero',
        drop: '30',
      },
      { 
        name: 'DimOk',
        drop: '20',
      },
      { 
        name: 'Hitters',
        drop: '15',
      },
      { 
        name: 'Satoshi Nakamoto',
        drop: '5',
      },
    ],
    player_lvl_info: 1,
    player_chance_info: 1,
    player_owner_info: 1,
    player_exp_info: 1,
    player_current_info: 1,
  },
   methods: {
    monsterPage: function(id, owner) {
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
      var callFunction = 'getCapsById';
      var id_this = id;
      var args = [];
      args.push(id_this);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbMonsterPage              
      });        
            
      var callFunction2 = 'getCapsHistory';   
      nebPay.simulateCall(to, value, callFunction2, callArgs, { 
        listener: cbPogPageHistory
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
    },
    owner_click: function(owner) {      
      vm.market = false;      
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
      vm.account_page = true;

      var to = dappAddress;
      var value = 0;
      var callFunction = 'getFullUserInfo';          
      var from = owner;      
      var args = [];
      args.push(from);
      var callArgs = JSON.stringify(args);    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
        listener: cbUserPage
      }); 
    },
  }
})  

// монстер маркет
    Vue.component('monster-market', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale', 'owner', 'price', 'rare'],           
    template: `<div class="monster">\
                <h3 v-bind:class="rare">{{name}}</h3>
                <img v-bind:src="src" alt="">\
                <span class="prize">{{price}}</span>\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\
                <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <button class="buy" v-on:click="vm.buy(id, price)">Buy</button>\
              </div>`,
    })
// монстер маркет

// монстер маркет
    Vue.component('monster-view', {
    props: ['name', 'src', 'drop', 'rare'],           
    template: `<div class="monster">\
                <h3 v-bind:class="rare">{{name}}</h3>
                <img v-bind:src="src" alt="">\                                
                <div class="stats">\
                  <span class="speed">drop from pack: <span class="value">{{drop}}%</span></span>\                  
                </div>\                              
              </div>`,
    })
// монстер маркет

// страница боя
  Vue.component('monster-fight', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'owner', 'price', 'result', 'boolen', 'draw', 'rare', 'dropped'],
    template: `<div class="monster">\
                <h3 v-bind:class="rare">{{name}}</h3>
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\
                <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <button v-if="boolen" class="result winner">Winner</button><button v-else class="result loose">Looser</button>\
                <button v-if="draw" class="result draw">Draw</button>\                                
                <span v-if="dropped" class="dropped_pog">DROPPED</span>                
              </div>`,
    })
// страница боя

// мои монстры лаб  
  Vue.component('my-monster-lab', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale', 'owner', 'rare'],           
    template: `<div class="monster">\                
                <div class="name"><h3 v-bind:class="rare">{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\                  
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\                                
                <a v-if="sale"><button  v-on:click="vm.unsell(id)" class="unsell">Cancel sell</button></a> <a v-else v-on:click="vm.sell(id)"><button class="sell" href="#sell">Sell</button></a> \
              </div>`,              
  })
// мои монстры лаб

// страница монстра гет
  Vue.component('my-monster-page', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale', 'owner', 'rare'],           
    template: `<div class="monster">\                
                <div class="name"><h3 v-bind:class="rare">{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\                  
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\                  
                </div>\                                
                <a v-if="sale"><button  v-on:click="vm.unsell(id)" class="unsell">Cancel sell</button></a> <a v-else v-on:click="vm.sell(id)"><button class="sell" href="#sell">Sell</button></a> \
              </div>`,              
  })   

  function cbMonsterPage(resp) {
     var page_monster = JSON.parse(resp.result);    
      vm.monster_page_arr = [];
      page_monster.win = page_monster.chanceToWin;
      page_monster.drop = page_monster.chanceDrop;
      var new_data = fix_name(page_monster.name);
      page_monster.name = new_data.name;
      page_monster.rare = new_data.rare;
      page_monster.sale = fix_sale(page_monster.sale);                    
      vm.monster_page_arr.push(page_monster);      
  }
// страница монстра гет

// монстр из коробки  
  var gift_monster_component = Vue.component('monster-gift', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale', 'owner', 'rare'],           
    template: `<div class="monster">\                
                <div class="name"><h3 v-bind:class="rare">{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
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
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'owner', 'rare'],           
    template: `<div class="monster">\
                <h3 v-bind:class="rare">{{name}}</h3>
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\
                   <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\
                </div>\
                <span class="owner">owner <span v-on:click="vm.owner_click(owner)" class="value">{{owner}}</span></span>\                
                <a href="#my_monsters_popup"  v-on:click="vm.attack_monster(id)" class="popup"><button class="attack">Attack</button></a>\
              </div>`,              
  })
// монстр батлграунд

// монстры на странице игрока  
  Vue.component('player-monsters', {
   props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'rare'],           
   template: `<div class="monster">\                
                <div class="name"><h3 v-bind:class="rare">{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
                <div class="stats">\                                    
                  <span class="speed">win: <span class="value">+{{win}}%</span></span>\
                  <span class="agility">drop: <span class="value">{{drop}}%</span></span>\
                  <span class="power">exp: <span class="value">{{exp}}</span></span>\
                </div>\                                                
              </div>`,              
  })
// монстры на странице игрока

// мои монстры лаб попап
  Vue.component('my-monster-lab-popup', {
    props: ['name', 'src', 'id', 'win', 'exp', 'drop', 'sale', 'owner', 'rare'],           
    template: `<div class="monster">\                
                <div class="name"><h3 v-bind:class="rare">{{name}}</h3><a href="#" class="edit"><img src="img/edit.png" alt=""></a></div>\
                <img v-bind:src="src" alt="">\
                <a href="#" class="info" v-on:click="vm.monsterPage(id,owner)"><img src="img/info.png" alt=""></a>\
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
        vm.account_page = false;
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
        vm.account_page = false;
    } else if ($(this).hasClass('battleground')) {
        vm.market = false;
        vm.account_page = false;      
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
        vm.account_page = false;      
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
        vm.account_page = false;
        vm.lab_monsters = true;
        vm.lab_gift = false;
        vm.no_monsters = false;
        vm.congrat = false;
    } else if ($(this).hasClass('lab_gift')) {
        vm.market = false;      
        vm.lab = true;
        vm.battleground = false;
        vm.rank = false;
        vm.account_page = false;
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
    user_info();
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
      var new_data = fix_name(vm.monsters_gift[i].name);
      vm.monsters_gift[i].name = new_data.name;
      vm.monsters_gift[i].rare = new_data.rare;
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
      user_info();
      var market_monsters = JSON.parse(resp.result);        
      vm.monsters_market = [];
      $.each(market_monsters,function(index,value){            
        // var new_sale = fix_sale(market_monsters[index].sale);
        // market_monsters[index].sale = new_sale;
        market_monsters[index].win = market_monsters[index].chanceToWin;
        market_monsters[index].drop = market_monsters[index].chanceDrop;
        var new_data = fix_name(market_monsters[index].name);
        var new_name = new_data.name;
        var new_prize = market_monsters[index].price/1000000000000000000;
        market_monsters[index].price = new_prize;
        market_monsters[index].name = new_name;        
        market_monsters[index].rare = new_data.rare;
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
    user_info();             
    if (resp.result == 'Error: Can\'t find any pogs') {      
      vm.market = false;      
      vm.lab = false;
      vm.battleground = false;
      vm.rank = false;
      vm.lab_nav = true;
      vm.account_page = false;
      vm.lab_monsters = false;
      vm.lab_gift = false;
      vm.no_monsters = true;
    } else {      
      var mymonsters_arr = JSON.parse(resp.result);      
      vm.my_monsters = [];   
      $.each(mymonsters_arr,function(index,value){   
        mymonsters_arr[index].win = mymonsters_arr[index].chanceToWin;
        mymonsters_arr[index].drop = mymonsters_arr[index].chanceDrop;
        var new_data = fix_name(mymonsters_arr[index].name);
        mymonsters_arr[index].name = new_data.name;        
        mymonsters_arr[index].rare = new_data.rare;
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
        user_info();
        $('#transaction .status_trans').html('<p style="color: green"> sucess </p>');                                  
        setTimeout(function(){ $('#transaction button').trigger('click') } , 1500);                            
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.account_page = false;
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
        x = { 
          name: 'Snake',
          rare: 'common' 
        };
        return x;
        break;

      case '1.2':         
        x = {
          name: 'Montgomery',
          rare: 'common'
        };
        return x;
        break;

      case '1.3':                
        x = {
          name: 'Fallout Boy',
          rare: 'rare' 
        };
        return x;
        break;

      case '1.4':         
         x = {
          name: 'Scratchy',
          rare: 'epic'
        };     
        return x;
        break;

      case '1.5':               
         x = {
          name: 'Grampa',
          rare: 'legend' 
        };  
        return x; 
        break;

      case '2.1':         
        x = {
          name: 'Cyndaquil',
          rare: 'common' 
        };  
        return x;
        break;

      case '2.2':         
        x = {
          name: 'Hoppip',
          rare: 'common' 
        };  
        return x;
        break;

      case '2.3':         
        x = {
          name: 'Squirtle',
          rare: 'rare'
        };  
        return x;
        break;

      case '2.4':         
        x = {
          name: 'Bulbasaur',
          rare: 'epic'
        };  
        return x;
        break;

      case '2.5':         
        x = {
          name: 'Ash&Pikachu',
          rare: 'legend'
        };  
        return x;
        break;

      case '3.1':         
        x = {
          name: 'Buterin',
          rare: 'common' 
        };  
        return x;
        break;

      case '3.2':         
        x = {
          name: 'Aero',
          rare: 'common'
        };  
        return x;
        break;

      case '3.3':         
        x = {
          name: 'DimOk',
          rare: 'rare' 
        };  
        return x;
        break;

      case '3.4': 
        x = {
          name: 'Hitters',
          rare: 'epic' 
        };  
        return x;
        break;

      case '3.5':         
        x = {
          name: 'Satoshi Nakamoto',
          rare: 'legend' 
        };  
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
        user_info();
        vm.monster_page = false;
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
        user_info();
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
      var callFunction = 'getAllCapsForFight';          
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
      user_info();
      $.each(battleList,function(index,value){
        battleList[index].win = battleList[index].chanceToWin;
        battleList[index].drop = battleList[index].chanceDrop;
        var new_data = fix_name(battleList[index].name);
        console.log('data ' + JSON.stringify(new_data));
        battleList[index].name = new_data.name;
        battleList[index].rare = new_data.rare;
        battleList[index].sale = fix_sale(battleList[index].sale);        
        console.log('index ' + JSON.stringify(battleList[index]));
        vm.monsters_battle.push(battleList[index]);
      })    
    }
// гет поле боя

// обработчик транзакции на атаку
  function cbTransactionFight(resp) {
    hash_value = resp.txhash;    
    var fight_result = JSON.stringify(resp);     
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
        user_info();                       
        vm.market = false;      
        vm.lab = false;
        vm.battleground = false;
        vm.rank = false;
        vm.lab_nav = false;
        vm.account_page = false;
        vm.lab_monsters = false;
        vm.lab_gift = false;
        vm.monster_page = false;
        vm.versus = true;
        vm.congrat = false;
              
        var to = dappAddress;
        var value = 0;
        var callFunction = 'getMyLastGame';
        var callArgs = "[]";        
        nebPay.simulateCall(to, value, callFunction, callArgs, { 
          listener: cbFightRender
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
    $('history ul').html('');
    vm.history_arr_frontned = [];    
    user_info();    
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
      var new_data = fix_name(el_for_push.name)
      el_for_push.name = new_data.name;
      el_for_push.rare = new_data.rare;
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
      vm.account_page = false;
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
    user_info(); 
    var history_arr = JSON.parse(resp.result);    
    vm.monsters_fight = [];
    // $.each(history_arr,function(index,value){
      history_arr[vm.fight_id].attacker.flex = Math.round(history_arr[vm.fight_id].attacker.flex);
      history_arr[vm.fight_id].attacker.power = Math.round(history_arr[vm.fight_id].attacker.power);
      history_arr[vm.fight_id].attacker.weight = history_arr[vm.fight_id].attacker.weight.toFixed(1);
      history_arr[vm.fight_id].defender.flex = Math.round(history_arr[vm.fight_id].defender.flex);
      history_arr[vm.fight_id].defender.power = Math.round(history_arr[vm.fight_id].defender.power);
      history_arr[vm.fight_id].defender.weight = history_arr[vm.fight_id].defender.weight.toFixed(1);

      var new_data = fix_name(history_arr[vm.fight_id].attacker);
      var new_name = new_data.name;            
      history_arr[vm.fight_id].attacker.name = new_name;        
      history_arr[vm.fight_id].attacker.rare = new_data.rare;            
      var new_data_def = fix_name(history_arr[vm.fight_id].defender.name);
      var new_name = new_data_def.name;                  
      history_arr[vm.fight_id].defender.name = new_name;        
      history_arr[vm.fight_id].defender.rare = new_data_def.rare;            
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
    var info = JSON.parse(resp.result);
    if (info == null) {
      $('.lvl_user').html('<span class="value">1</span> lvl');
      $('.win_user').html('chance to turn: <span class="value">12%</span>');
      $('.exp_user').html('exp: <span class="value">0/100</span>');
    } else {
      var lvl = info.lvl;
      var chance = info.chance;
      var exp = info.expirenece;
      var current = info.current;
      $('.lvl_user').html('<span class="value">' + lvl + '</span> lvl');
      $('.win_user').html('chance to turn: <span class="value">' + chance + '%</span>');
      $('.exp_user').html('exp: <span class="value">' + current + '/' + exp + '</span>');
    }    
  }
// информация о игроке

// страница боя
  function cbFightRender(resp) {        
    var fight_arr = JSON.parse(resp.result);    
    var attacker = fight_arr.atacker;
    var defender = fight_arr.defender;
    attacker.win = attacker.chanceToWin;
    attacker.drop = attacker.chanceDrop;
    var new_data_attac = fix_name(attacker.name)
    attacker.name = new_data_attac.name;
    attacker.rare = new_data_attac.rare;
    defender.win = defender.chanceToWin;
    defender.drop = defender.chanceDrop;
    var new_data_def = fix_name(defender.name);
    defender.name = new_data_def.name;
    defender.rare = new_data_def.rare;            

    if (defender.result == "Tie"){      
      defender.boolen = false;
      defender.draw = true;      
      attacker.boolen = true;
      attacker.draw = true;      
    } else if(defender.result == "Winner") {
      defender.boolen = true;
      defender.draw = false;     
      attacker.boolen = false;
      attacker.draw = false;       
    } else {
      defender.boolen = false;
      defender.draw = false;     
      attacker.boolen = true;
      attacker.draw = false;       
    };
    vm.monsters_fight = [];
    vm.monsters_fight.push(attacker);
    vm.monsters_fight.push(defender);
    user_info();
  }
// страница боя

// история боев кэпса
  function cbPogPageHistory(resp) {     
     vm.history_arr_frontned = [];
     $('.history ul').html('');
     if(resp.execute_err == 'Call: Error: This pog have not any history'){
          $('.history ul').html(resp.result); 
     } else {      
      var PogPageHistory = JSON.parse(resp.result);           
        $.each(PogPageHistory, function(index,value) {
         // if (vm.owner == PogPageHistory[index].atacker.owner || vm.owner == PogPageHistory[index].defender.owner){          
          PogPageHistory[index].opponent = fix_name(PogPageHistory[index].opponent).name;            
          vm.history_arr_frontned.push(PogPageHistory[index]);
         // }
         })         
         $.each(vm.history_arr_frontned,function(index,value){      
          if (vm.history_arr_frontned[index].RESULT == 'Win') {        
            $('.history ul').append('<li fight-id="' + index + '"><img class="opp" src="img/'+ vm.history_arr_frontned[index].opponent + '.png">\
                                  <span class="res winner">Win</span>\
                                  <a href="#" class="info"><img src="img/info.png"></a>\
                                  </li>');
          } else if (vm.history_arr_frontned[index].RESULT == 'Loose'){
            $('.history ul').append('<li fight-id="' + index + '"><img class="opp" src="img/'+ vm.history_arr_frontned[index].opponent + '.png">\
                                  <span class="res loose">Loose</span>\
                                  <a href="#" class="info"><img src="img/info.png"></a>\
                                  </li>')
          } else { 
            $('.history ul').append('<li fight-id="' + index + '"><img class="opp" src="img/'+ vm.history_arr_frontned[index].opponent + '.png">\
                                  <span class="res draw">Draw</span>\
                                  <a href="#" class="info"><img src="img/info.png"></a>\
                                  </li>')
          }
        });
        if (vm.history_arr_frontned.length == 0) {
          $('.history ul').html('<h2>You never fought. Go to fight!</h2>');
        };

        $('.history .info').click(function(){
          vm.market = false;      
          vm.lab = false;
          vm.account_page = false;
          vm.battleground = false;
          vm.rank = false;
          vm.lab_nav = false;
          vm.lab_monsters = false;
          vm.lab_gift = false;
          vm.monster_page = false;
          vm.versus = true;
          vm.congrat = false;                    

          vm.fight_id = $(this).parent().attr('fight-id');      
          var for_push = vm.history_arr_frontned[vm.fight_id];
          var attacker = for_push.atacker;
          var defender = for_push.defender;
          // vm.monsters_fight = [];
          // vm.monsters_fight.push(for_push_attacker);          
          // vm.monsters_fight.push(for_push_defender);                    
          attacker.win = attacker.chanceToWin;
          attacker.drop = attacker.chanceDrop;
          var new_data_attac = fix_name(attacker.name);
          attacker.name = new_data_attac.name;
          attacker.rare = new_data_attac.rare;
          defender.win = defender.chanceToWin;
          defender.drop = defender.chanceDrop;
          var new_data_def = fix_name(defender.name);
          defender.name = new_data_def.name;
          defender.rare = new_data_def.rare;            

          if (defender.result == "Tie"){      
            defender.boolen = false;
            defender.draw = true;      
            attacker.boolen = true;
            attacker.draw = true;      
          } else if(defender.result == "Winner") {
            defender.boolen = true;
            defender.draw = false;     
            attacker.boolen = false;
            attacker.draw = false;       
          } else {
            defender.boolen = false;
            defender.draw = false;     
            attacker.boolen = true;
            attacker.draw = false;       
          };
          vm.monsters_fight = [];
          vm.monsters_fight.push(attacker);
          vm.monsters_fight.push(defender);
          user_info();
        });
     }
  } 

   // getCapsHistory
// история боев кэпса

// страница игрока
  function cbUserPage(resp) {    
    user_info();
    var player_info = JSON.parse(resp.result);        
    var player_monsters = player_info.user_caps;            
    var player_history = player_info.history;
    var chance = player_info.chance;
    var lvl = player_info.lvl;
    var owner = player_monsters[0].owner;
    vm.player_lvl_info = lvl;
    vm.player_chance_info = chance;
    vm.player_owner_info = owner;
    vm.player_current_info = player_info.current;
    vm.player_exp_info = player_info.expirenece;
    console.log('resp ' + JSON.stringify(player_info));    

    if(player_history.length == 0) {
      $('.data_history').html('Player has not played any games')
    } else {
      $('.data_history').html('');
      $.each(player_history, function(index,value) {       
        player_history[index].opponent = fix_name(player_history[index].opponent).name;                    
        if(player_history[index].atacker.owner == vm.player_owner_info) {          
          player_history[index].player = fix_name(player_history[index].atacker.name).name;
        } else {
          player_history[index].player = fix_name(player_history[index].defender.name).name;
        }
        vm.player_history_arr.push(player_history[index]);       
       })         
       $.each(vm.player_history_arr,function(index,value){      
        if (vm.player_history_arr[index].RESULT == 'Win') {        
          $('.data_history').append('<li fight-id="' + index + '">\
                                      <span><img src="img/'+ vm.player_history_arr[index].player + '.png"></span>\
                                      <span><img src="img/'+ vm.player_history_arr[index].opponent + '.png"></span>\
                                      <span class="draw">Draw</span>\
                                      <a href="#" class="info"><img src="img/info.png"></a>\
                                    </li>');
        } else if (vm.player_history_arr[index].RESULT == 'Loose'){
          $('.data_history').append('<li fight-id="' + index + '">\
                                      <span><img src="img/'+ vm.player_history_arr[index].player + '.png"></span>\
                                      <span><img src="img/'+ vm.player_history_arr[index].opponent + '.png"></span>\
                                      <span class="draw">Draw</span>\
                                      <a href="#" class="info"><img src="img/info.png"></a>\
                                    </li>');
        } else { 
          $('.data_history').append('<li fight-id="' + index + '">\
                                      <span><img src="img/'+ vm.player_history_arr[index].player + '.png"></span>\
                                      <span><img src="img/'+ vm.player_history_arr[index].opponent + '.png"></span>\
                                      <span class="draw">Draw</span>\
                                      <a href="#" class="info"><img src="img/info.png"></a>\
                                    </li>');
        }
      });
    }           
    vm.player_monsters = [];
    $.each(player_monsters,function(index,value){                  
      player_monsters[index].win = player_monsters[index].chanceToWin;
      player_monsters[index].drop = player_monsters[index].chanceDrop;
      var new_data = fix_name(player_monsters[index].name);
      var new_name = new_data.name;      
      player_monsters[index].name = new_name;        
      player_monsters[index].rare = new_data.rare;
      vm.player_monsters.push(player_monsters[index]);      
    });    


     $('.history .info').click(function(){
          vm.market = false;      
          vm.lab = false;
          vm.account_page = false;
          vm.battleground = false;
          vm.rank = false;
          vm.lab_nav = false;
          vm.lab_monsters = false;
          vm.lab_gift = false;
          vm.monster_page = false;
          vm.versus = true;
          vm.congrat = false;                    

          vm.fight_id = $(this).parent().attr('fight-id');      
          var for_push = player_history[vm.fight_id];
          var attacker = for_push.atacker;
          var defender = for_push.defender;          
          attacker.win = attacker.chanceToWin;
          attacker.drop = attacker.chanceDrop;
          var new_data_attac = fix_name(attacker.name);
          attacker.name = new_data_attac.name;
          attacker.rare = new_data_attac.rare;
          defender.win = defender.chanceToWin;
          defender.drop = defender.chanceDrop;
          var new_data_def = fix_name(defender.name);
          defender.name = new_data_def.name;
          defender.rare = new_data_def.rare;            

          if (defender.result == "Tie"){      
            defender.boolen = false;
            defender.draw = true;      
            attacker.boolen = true;
            attacker.draw = true;      
          } else if(defender.result == "Winner") {
            defender.boolen = true;
            defender.draw = false;     
            attacker.boolen = false;
            attacker.draw = false;       
          } else {
            defender.boolen = false;
            defender.draw = false;     
            attacker.boolen = true;
            attacker.draw = false;       
          };          
          vm.monsters_fight = [];
          vm.monsters_fight.push(attacker);
          vm.monsters_fight.push(defender);
          user_info();
        });
  }
// страница игрока