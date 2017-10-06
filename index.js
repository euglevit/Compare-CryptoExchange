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

				newStatus = Object.keys(data).find(key => data[key].symbol === saveStatus);
		}

		//when the user hits the next arrow, another group of coins comes onto the page by activating the nextLoop function
		$(document).on('click', '.next-button', function() {
				$('.cryptoList').animate({
						left: '-300vh'
				}, 500);
				setTimeout(function() {
						$('.cryptoList').css('left', '300vh')
				}, 600);
				setTimeout(function() {
						$('.cryptoList').animate({
								left: '0%'
						}, 500)
				}, 700);
				setTimeout(function() {
						nextLoop(newStatus, allCoins)
				}, 500);

		});

		//Renders a list of all coins to the DOM, as well as the next button.
		function renderCoinList(data) {
				allCoins = data;
				for (let i = 0; i < 3; i++) {
						if (parseInt(allCoins[i].percent_change_7d) < 0) {
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
						saveStatus = allCoins[i].symbol;
				}
				newStatus = Object.keys(allCoins).find(key => allCoins[key].symbol ===
						saveStatus);
				$('.cryptoList').append(
						`
						<div><button class='next-button' role='presentation'></button></div>`);

		}

		//creates the table for the Exchange List
		function renderExchangeList(coinChoice) {
				$('.exchangeList').html('');
				$('.exchangeList').css('height', '100vh');
				$('.second-page-container').css('height', '100vh');
				$('.exchangeList').html(
						`<div class='table-name'><h1 role='presentation' class='coin-choice-button'>${coinChoice}</h1><button class='startOver'></button></div>`
				);
				$('.exchangeList').append(
						`<div class='table'><div class='row exchanges-list'><span class='underline'>Exchange Name</span></div><div class='row usd-list'><span class='underline'>Price</span></div><div class='row usd7-list'><span class='underline'>Price(7 Days Ago)</span></div><div class='row high-list'><span class='underline'>High</span></div><div class='row low-list'><span class='underline'>Low</span></div></div>`
				);
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
									
														$('.exchanges-list').append(
																`
																<div class="col" align="center"><a class='links' href='https://www.${data3[i]}.com'>${data3[i]}</a></div>
																
												`
														);
														$('.usd-list').append(
																`
																<div class="col" align="center">$ ${info.Data[30].close}</div>
																
												`
														);
														$('.usd7-list').append(
																`
																<div class="col" align="center">$ ${info.Data[23].close}</div>
																
												`
														);
														$('.high-list').append(
																`
																<div class="col" align="center">$ ${info.Data[30].high}</div>
																
												`
														);
														$('.low-list').append(
																`
																<div class="col" align="center">$ ${info.Data[30].low}</div>
																
												`
														);
												} else{
													console.log('not in exchange');
												}
										});
								};
						};
				})
		}

		//closes the second-page-container and opens the first-page-container up again
		function startOver() {
				$(document).on('click', '.startOver', function(event) {
						event.preventDefault();
						$('.first-page-container').show(1000);
						$('html, body').animate({
								scrollTop: $(".first-page-container").offset().top
						}, 1000);
						setTimeout(function() {
								$('.exchangeList').html('')
						}, 850);
						setTimeout(function() {
								$('.second-page-container, .exchangeList').css('height', '0%')
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
		$(document).on('click', '.cryptoCoin, .search-button', function(event) {
				event.preventDefault();
				let searching = $('.search-term').val().toUpperCase();
				$('.search-button').attr('val', searching);
				clickCoin($(this).attr('val'));

		});



		//git push origin master


});