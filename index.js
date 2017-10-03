$(document).ready(function() {

    let aUrl = 'https://min-api.cryptocompare.com/data/histoday';
    let bUrl = 'https://min-api.cryptocompare.com/data/all/exchanges';
    let saveStatus = '';
    let newStatus = 0;
    let allCoins = '';

    function getCoinMarkCapApi() {

      $.ajax({
         type: 'GET',
         url: 'https://api.coinmarketcap.com/v1/ticker/?limit=1000'
      }).done(renderCoinList);
    }

    function nextLoop(num,data){
        $('.cryptoList').html('');
        $('.cryptoList').animate({left: '15%'}, 1000);
        newStatus = parseInt(newStatus);
    	console.log(newStatus+3);
    	for(let i=newStatus+1;i < newStatus+4; i++){
            console.log(newStatus+4);
            $('.cryptoList').append(`
    				<button class='cryptoCoin coin' val=${allCoins[i].symbol}>
                    1 ${allCoins[i].name} (${allCoins[i].symbol})</br>
                    ${allCoins[i].price_usd} US Dollars</button>
			`);
            saveStatus = data[i].symbol;
            
        }
        $('.cryptoList').append(`
            <button class='next-button'>Next Button</button>`);
        newStatus = Object.keys(data).find(key => data[key].symbol === saveStatus);
        console.log(newStatus);
    }

    $(document).on('click','.next-button',function(){
            console.log(saveStatus);
            $('.cryptoList').animate({left: '300vh'}, 1000);

            setTimeout(function(){nextLoop(newStatus,allCoins)},1000);

        });

    function renderCoinList(data) {
    	allCoins = data;
        let byTime = allCoins.slice(0)
        byTime.sort(function(a,b){return a.last_updated-b.last_updated});
        console.log(data);
        for(let i=0;i < 3; i++){
            let date = new Date(allCoins[i].last_updated);
            let components = Date(allCoins[i].last_updated).split(' ').slice(1, 4);
            components[1].replace(/^0/, '');
            $('.cryptoList').append(`
    				<button class='cryptoCoin coin' val=${allCoins[i].symbol}>
                    1 ${allCoins[i].name} (${allCoins[i].symbol})</br>
                    =</br>
                    $${allCoins[i].price_usd} US Dollars</button>
			`);
            saveStatus = allCoins[i].symbol;


        }
        newStatus = Object.keys(allCoins).find(key => allCoins[key].symbol === saveStatus);
        $('.cryptoList').append(`
        	<button class='next-button'>Next Button</button>`);
        
      }
        

    

    function renderExchangeList(coinChoice) {
        $('.exchangeList').html('');
        $('.exchangeList').css('height', '100vh');
        $('.second-page-container').css('height', '100vh');
        $('.exchangeList').html(`<span class='coin-choice-button'>Coin Name: ${coinChoice}</span>`);

        let total = [];
        console.log(coinChoice);
        $.getJSON(bUrl, function(data) {
            let data2 = Object.values(data);
            let data3 = Object.keys(data);
            for (let i = 0; i < data2.length; i++) {
                if (coinChoice in data2[i]) {
                    $.getJSON(aUrl, { fsym: coinChoice, tsym: 'USD', e: data3[i] }, function(info) {
                        if (info.Data[i].close != undefined) {
                            total.push(coinChoice);
                            $('.exchangeList').append(`
						<button class='exchangeItem' href='https://www.${data3[i]}.com'>${data3[i]} : $${info.Data[i].close}</button>
						`)
                        } else(console.log('did not work'))
                    });
                };
            };
            console.log('beforebutton');
            $('.exchangeList').append(`<button class='startOver'>Start Over</button>`);
            console.log($('.startOver').val());
            console.log('afterbutton');

        })
    }

    function startOver() {
    	$(document).on('click', '.startOver', function(event){
    		event.preventDefault();
    		$('html, body').animate({
            scrollTop: $(".first-page-container").offset().top
        }, 1000);
        setTimeout(function() {$('.exchangeList').html('')}, 850);
        setTimeout(function() {$('.second-page-container, .exchangeList').css('height','0%')}, 900)
    		
    	})
    }

    function clickCoin(className) {
        console.log($(this).attr('val'));
        $('.search-button').val('');
        $('html, body').animate({
            scrollTop: $(".second-page-container").offset().top
        }, 2000);
        

        renderExchangeList(className);

    }

 $(window).scroll(function() {
  
  // selectors
  var $window = $(window),
      $body = $('body'),
      $panel = $('.panel');
  
  // Change 33% earlier than scroll position so colour is there when you arrive.
  var scroll = $window.scrollTop() + ($window.height() / 3);
 
  $panel.each(function () {
    var $this = $(this);
    
    // if position is within range of this panel.
    // So position of (position of top of div <= scroll position) && (position of bottom of div > scroll position).
    // Remember we set the scroll to 33% earlier in scroll var.
    if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {
          
      // Remove all classes on body with color-
      $body.removeClass(function (index, css) {
        return (css.match (/(^|\s)color-\S+/g) || []).join(' ');
      });
       
      // Add class of currently active div
      $body.addClass('color-' + $(this).data('color'));
    }
  });    
  
}).scroll();

 // function moreCoins(){

 // 	$(document).on('click', '.next-button' function(event){
 // 		event.preventDefault();
 // 		getCoinMarkCapApi()

 // 	})

 // }




    getCoinMarkCapApi();
    startOver();

    $(document).on('click', '.cryptoCoin, .search-button', function(event) {
        event.preventDefault();
        let searching = $('.search-term').val().toUpperCase();
        $('.search-button').attr('val', searching);
        clickCoin($(this).attr('val'));

    });



    //git push origin master


    //loading over and over again - done
    //scroll back up - done need styling
    //prices with the names
    //search button more prominent
    //filter out zero results

});