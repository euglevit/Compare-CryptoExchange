$(document).ready(function() {

    let aUrl = 'https://min-api.cryptocompare.com/data/price';
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
        newStatus = parseInt(newStatus);
    	console.log(newStatus+4);
    	for(let i=newStatus+1;i < newStatus+5; i++){
            console.log(newStatus+5);
            $('.cryptoList').append(`
    				<button class='cryptoCoin coin' val=${data[i].symbol}>${data[i].id}(${data[i].symbol})</button>
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
            nextLoop(newStatus,allCoins);

        });

    function renderCoinList(data) {
    	allCoins = data;
        console.log(data);
        for(let i=0;i < 4; i++){
            $('.cryptoList').append(`
    				<button class='cryptoCoin coin' val=${allCoins[i].symbol}>${allCoins[i].id} (${allCoins[i].symbol})</button>
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
                    $.getJSON(aUrl, { fsym: coinChoice, tsyms: 'USD', e: data3[i] }, function(info) {
                        if (info.USD != undefined) {
                            total.push(coinChoice);
                            $('.exchangeList').append(`
						<button class='exchangeItem' href='https://www.${data3[i]}.com'>${data3[i]} : $${info.USD}</button>
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