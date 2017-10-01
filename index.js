$(document).ready(function() {

    let aUrl = 'https://min-api.cryptocompare.com/data/histoday';
    let bUrl = 'https://api.coinmarketcap.com/v1/ticker';
    let cUrl = 'https://www.cryptocompare.com/api/data/coinlist';
    let dUrl = 'https://min-api.cryptocompare.com/data/all/exchanges';



    function getCrypCompApi() {
        let query = {
            // ts: $.now(),
            fsym: 'ETH',
            tsym: 'USD',

        }
        $.getJSON(aUrl, query, getData);
    };

    function getExchangeApi() {
    	$.getJSON(dUrl,renderExchangeList);
    }

    function getCoinMarkCapApi() {
        $.ajax({
            type: 'GET',
            url: 'https://api.coinmarketcap.com/v1/ticker/?limit=10'
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
    	console.log(coinChoice);
    	$.getJSON(dUrl, function(data){
    		let data2 = Object.values(data);
    		let data3 = Object.keys(data);
			for(let i=0; i < data2.length; i++){
				if(coinChoice in data2[i])
				$('.exchangeList').append(`
					<li class=exchangeItem'>${data3[i]}</li>

				`)
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


    getCrypCompApi();
    getCoinMarkCapApi();
    clickCoin();


})


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