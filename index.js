// This is just a sample script. Paste your real code (javascript or HTML) here.
$(document).ready(function() {

		let aUrl = 'https://min-api.cryptocompare.com/data/histoday';
		let bUrl = 'https://min-api.cryptocompare.com/data/all/exchanges';
		let saveStatus = '';
		let newStatus = 0;
		let allCoins = '';

		//connects the the coinmarketcap API and returns the renderCoinList function
		function getCoinMarkCapApi() {
				$.ajax({
						type: 'GET',
						url: 'https://api.coinmarketcap.com/v1/ticker/?limit=1000'
				}).done(renderCoinList);
		}

		//lets another group of buttons load onto the page
		function nextLoop(num, data) {

				$('.cryptoList').html('');
				newStatus = parseInt(newStatus);
				for (let i = newStatus + 1; i < newStatus + 4; i++) {
						if (isNaN(parseInt(allCoins[i].percent_change_7d))) {
								newStatus++;
						} else if (parseInt(allCoins[i].percent_change_7d) <= 0) {
								$('.cryptoList').append(
										`
												<button class='cryptoCoin coin' val=${allCoins[i].symbol}><span class='stock-name'>
												${allCoins[i].name}<span class='stock-symbol'>(${allCoins[i].symbol})</span></span> <span class='stock-price'>$${allCoins[i].price_usd}<span class='color-red stock-percent'>&#9660 ${allCoins[i].percent_change_7d}</span></span></button>
								`
								);
						} else if (parseInt(allCoins[i].percent_change_7d) >= 0) {
								$('.cryptoList').append(
										`
												<button class='cryptoCoin coin' val=${allCoins[i].symbol}><span class='stock-name'>
												${allCoins[i].name}<span class='stock-symbol'>(${allCoins[i].symbol})</span></span> <span class='stock-price'>$${allCoins[i].price_usd}<span class='color-green stock-percent'>&#9650 ${allCoins[i].percent_change_7d}</span></span></button>
								`
								);
						}
						saveStatus = data[i].symbol;

				}


				$('.cryptoList').append(
						`
						<div class='next-prev'>
						<button class='next-button'></button>
						</div>
						`
				);

				
				$('.cryptoList').css('width');

				newStatus = Object.keys(data).find(key => data[key].symbol === saveStatus);
		}

		//when the user hits the next arrow, another group of coins comes onto the page by activating the nextLoop function
		$(document).on('click', '.next-button', function() {
			let leftValue = $('.cryptoList').css('left');
				$('.cryptoList').animate({
						left: '-300vh'
				}, 500);
				setTimeout(function() {
						$('.cryptoList').css('left', '300vh')
				}, 600);
				setTimeout(function() {
						$('.cryptoList').animate({
								left: leftValue
						}, 500)
				}, 700);
				setTimeout(function() {
						nextLoop(newStatus, allCoins)
				}, 500);
			setTimeout(function(){
				$('.cryptoList').css('left','');
			}, 1400);
				// $('.cryptoList').attr('width','800px');

		});

		//Renders a list of all coins to the DOM, as well as the next button.
		function renderCoinList(data) {
				allCoins = data;
				for (let i = 0; i < 3; i++) {
						if (parseInt(allCoins[i].percent_change_7d) < 0) {
								$('.center').append(
										`
												<div class='coin-width'><button class='cryptoCoin coin' val=${allCoins[i].symbol}><span class='stock-name'>
												${allCoins[i].name}<span class='stock-symbol'>(${allCoins[i].symbol})</span></span> <span class='stock-price'>$${allCoins[i].price_usd}<span class='color-red stock-percent'>&#9660 ${allCoins[i].percent_change_24h}%</span></span></button></div>
								`
								);
						} else if (parseInt(allCoins[i].percent_change_7d) >= 0) {
								$('.center').append(
										`
												<div class='coin-width'><button class='cryptoCoin coin' val=${allCoins[i].symbol}><span class='stock-name'>
												${allCoins[i].name}<span class='stock-symbol'>(${allCoins[i].symbol})</span></span> <span class='stock-price'>$${allCoins[i].price_usd}<span class='color-green stock-percent'>&#9650 ${allCoins[i].percent_change_24h}%</span></span></button></div>
								`
								);
						}
						saveStatus = allCoins[i].symbol;
				}
				newStatus = Object.keys(allCoins).find(key => allCoins[key].symbol ===
						saveStatus);
				// $('.cryptoList').append(
				// 		`
				// 		<div><button class='next-button' role='presentation'></button></div>`);

		}

		//creates the table for the Exchange List
		function renderExchangeList(coinChoice) {
				$('.exchangeList').html('');
				// $('section').css('height', '100%');
				// $('section').css('padding','100px 0');
				$('.second-page-container').css('height', '100vh');
				$('.exchangeList').html(
						`<div class='table-name'><h2 role='presentation' class='coin-choice-button'>${coinChoice}</h2><button class='startOver'></button></div><div class="exchange-container"></div>`
				);
				$('.exchange-container').append(
					`
					<div class='each header'>Exchange</div>
					<div class='each header'>Price</div>
					<div class='each header'>Price(1 Week Prior)</div>
					<div class='each header'>High</div>
					<div class='each header'>Low</div>
					`
					);


				// $('.exchangeList').append(
				// 		`<div class='table'><div class='row exchanges-list'><span class='underline'>Exchange Name</span></div><div class='row usd-list'><span class='underline'>Price</span></div><div class='row usd7-list'><span class='underline'>Price(7 Days Ago)</span></div><div class='row high-list'><span class='underline'>High</span></div><div class='row low-list'><span class='underline'>Low</span></div></div>`
				// );
			}

			//renders the info that is in the Exchange List by connecting to the Crypto Compare API
			function renderHTMLExchangeList(coinChoice){
				$.getJSON(bUrl, function(data) {
						let data2 = Object.values(data);
						let data3 = Object.keys(data);
						for (let i = 0; i < data2.length; i++) {
								if (coinChoice in data2[i]) {
										$.getJSON(aUrl, {
												fsym: coinChoice,
												tsym: 'USD',
												e: data3[i]
										}, function(info) {
											if (info.Data[i] === undefined){
												console.log('no market');
											}
												else if (parseInt(info.Data[i].volumefrom) !=
														0) {
													$('.exchange-container').append(
														`
														<div class='exchange-table'>
														<div class='each exchange1'><a class='''links' href='https://www.${data3[i]}.com'>${data3[i]}</a></div>
														<div class="each usd1">$ ${info.Data[30].close}</div>
														<div class="each sevendays">$ ${info.Data[23].close}</div>
														<div class="each high1">$ ${info.Data[30].high}</div>
														<div class="each low1">$ ${info.Data[30].low}</div>
														</div>
														`

														);
												} else{
													console.log('not in exchange');
												}
										});
								};
						};
				})
				setTimeout(function(){
					let sectionHeight = $('.exchangeList').css('height');
					console.log(sectionHeight);
				$('section').css('min-height',sectionHeight);
			},700);
				
		}

		//closes the second-page-container and opens the first-page-container up again
		function startOver() {
				$(document).on('click', '.startOver', function(event) {
						event.preventDefault();
						console.log('one');
						$('html, body').animate({
								scrollTop: $(".masthead").offset().top
						}, 1000);
						console.log('two');
						setTimeout(function() {
								$('.exchangeList').html('')
						}, 850);
						setTimeout(function() {
								$('.second-page-container').css('height', '0%')
						}, 900);

				})
		}

		//the body of the page will scroll down until it hits the second-page-cointainer class. The first-page-container class will hide, and the renderExchangeList function and renderHTMLExchangeList function will activate
		function clickCoin(coinChoice) {
				$('.search-button').val('');
				$('html, body').animate({
						scrollTop: $(".second-page-container").offset().top
				}, 2000);
				setTimeout(function() {
						$('.first-page-container').hide();
				}, 2100);


				renderExchangeList(coinChoice);
				renderHTMLExchangeList(coinChoice);

		}




		getCoinMarkCapApi();
		startOver();

		//If the user hit's one of the coin buttons or the search button, the clickCoin function will activate with the parameter = to that coin.
		$(document).on('submit', '.search-form', function(event) {
				event.preventDefault();
				let searching = $('.search-term').val().toUpperCase();
				console.log(searching);
				clickCoin(searching);

		});

		$(document).on('click', '.cryptoCoin', function(event) {
				event.preventDefault();
				let searching = $(this).attr('val').toUpperCase();
				$('.search-button').attr('val', searching);
				console.log(searching);
				clickCoin(searching);

		});

		$(window).resize(function(){
			let cutoff = 540;

			if($(window).width() < cutoff){
				let sectionHeight = $('.exchangeList').css('height');
				console.log(sectionHeight);
				$('section').css('min-height',sectionHeight);
			};
			if($(window).width() > cutoff){
				let sectionHeight = $('.exchangeList').css('height');
				console.log(sectionHeight);
				$('section').css('min-height',sectionHeight);
			};
		});


		//changes placeholder text depending on Window Size
		// $(window).resize(function(){
		// 	let cutoff = 653,
  //       	placeholderShort = "Search Coins by symbol(BTC,ETH)",
  //       	placeholderLong = "Type in the symbol for your favorite CryptoCoin(e.g BTC,ETH) to prices";
    
  //   		if($(window).width() >= cutoff) {
		//       $('.search-term').attr('placeholder', placeholderLong); 
		//     }
		//     else {
		//       $('.search-term').attr('placeholder', placeholderShort); 
		//     } 
		// });

		// if ($(window).width() < 667 ) {
		// 	$(".search-term").attr("placeholder","Search Coins by symbol(BTC,ETH)");
		// }else { 
		// 	$(".search-term").attr("placeholder","Type in the symbol for your favorite CryptoCoin(e.g BTC,ETH) to prices");
		// }



		//git push origin master


});