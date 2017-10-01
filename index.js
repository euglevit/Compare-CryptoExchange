$(document).ready(function() {

    let aUrl = 'https://min-api.cryptocompare.com/data/price';
    let bUrl = 'https://api.coinmarketcap.com/v1/ticker';
    let cUrl = 'https://www.cryptocompare.com/api/data/coinlist';
    let dUrl = 'https://min-api.cryptocompare.com/data/all/exchanges';





    function getExchangeApi() {
        $.getJSON(dUrl, renderExchangeList);
    }

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
    				<li class='cryptoCoin'><button class='coin' val=${name.symbol}>${name.id}</button></li>
			`)
        )
    };

    function getData(data) {
        console.log(Date(data.Data[0].time));
        console.log(data.Data[0].close);
    }

    function getCoins(data) {
        console.log(data[1].id);
    }

    function renderExchangeList(coinChoice) {
    	$('.exchangeList').html('');
        console.log(coinChoice);
        $.getJSON(dUrl, function(data) {
            let data2 = Object.values(data);
            let data3 = Object.keys(data);
            for (let i = 0; i < data2.length; i++) {
                if (coinChoice in data2[i]) {
                    $.getJSON(aUrl, { fsym: coinChoice, tsyms: 'USD', e: data3[i] }, function(info) {
                        if (info.USD != undefined) {
                            $('.exchangeList').append(`
						<li class=exchangeItem'>${data3[i]}</li>
						<li class="dollars">${info.USD}</li>
						`)
                        } else(console.log('did not work'))
                    });
                }
            };
        })

    }




    function clickCoin() {
        $(document).on('click', '.coin', function(event) {
            event.preventDefault();
            console.log($(this).attr('val'));
            renderExchangeList($(this).attr('val'));
        })
    }


    // getCrypCompApi();
    getCoinMarkCapApi();
    clickCoin();


});


// renderCoinList();

//https://min-api.cryptocompare.com/data/all/exchanges

// let aUrl = 'https://min-api.cryptocompare.com/data/histominute';
// let searchTerm= {
// 	fsym: 'ETH',
// 	tsyms: 'BTC'

// }

// function setup() {
// 	let query = {
// 		url:'https://min-api.cryptocompare.com/data/histominute',
// 		fsym: 'BTC',
// 		tsym: 'USD'
// 	}
// 	$.getJSON(aUrl,query,getData);

// 	};


// function getData(data) {
// 	console.log(data.Data[0]);
// }