$(document).ready(function() {

    let aUrl = 'https://min-api.cryptocompare.com/data/price';
    let bUrl = 'https://min-api.cryptocompare.com/data/all/exchanges';


    function getCoinMarkCapApi() {
        $.ajax({
            type: 'GET',
            url: 'https://api.coinmarketcap.com/v1/ticker/?limit=20'
        }).done(renderCoinList);
    }

    function renderCoinList(data) {
        console.log(data);
        data.forEach(name =>
            $('.cryptoList').append(`
    				<button class='cryptoCoin coin' val=${name.symbol}>${name.id}</button>
			`)
        );
    }

    function renderExchangeList(coinChoice) {
        $('.exchangeList').html('');
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
        })
    }

    function clickCoin(className) {
        // $(document).on('click', className, function(event) {
            // event.preventDefault();
            $('.main-container').append(`<div class='exchangeList'></div>`);
            console.log($(this).attr('val'));
            $('html, body').animate({
            	scrollTop: $(".exchangeList").offset().top
            }, 2000);
            $('.exchangeList').css('height','100vh');

            renderExchangeList(className);
        // })
    }

    // function submitCoin() {
    //     $('.search-term').val('');
    //     $(document).on('click', '.search-button', function(event) {
    //         event.preventDefault();
    //         $('.main-container').append(`<div class='exchangeList'></div>`);
    //         console.log($('.search-term').val().toUpperCase());
    //         $('html, body').animate({
    //         	scrollTop: $(".exchangeList").offset().top
    //         }, 2000);
    //         $('.exchangeList').css('height','1000px');
    //         renderExchangeList($('.search-term').val().toUpperCase());
            
    //         })
        
    // }




    getCoinMarkCapApi();
    $(document).on('click', '.coin, .search-button', function(event){
    	event.preventDefault();
    	let searching = $('.search-term').val().toUpperCase();
    	$('.search-button').attr('val',searching);
   		clickCoin($(this).attr('val'));
   	});
    // submitCoin();

//loading over and over again
//scroll back up
//prices with the names
//search button more prominent
//filter out zero results

});