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
	}

	//creates the table for the Exchange List
	function renderExchangeList(coinChoice) {
		$('.exchangeList').html('');
		$('.second-page-container').css('height', '100vh');
		$('.exchangeList').html(
			`<div class='table-name'><h2 role='presentation' class='coin-choice-button'>${coinChoice}</h2><button class='startOver'></button></div><div class="exchange-container"></div>`
		);
		$('.exchange-container').append(
			`
			<div class='each header'><span class='vertical'>Exchange</span></div>
			<div class='each header'><span class='vertical'>Price</span></div>
			<div class='each header'><span class='vertical'>7 Days Ago</span></div>
			<div class='each header'><span class='vertical'>High</span></div>
			<div class='each header'><span class='vertical'>Low</span></div>
			`
		);
	}

	//renders the info that is in the Exchange List by connecting to the Crypto Compare API
	function renderHTMLExchangeList(coinChoice) {
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
						if (info.Data[i] === undefined) {
							console.log('no market');
						} else if (parseInt(info.Data[i].volumefrom) !=
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
						} else {
							console.log('not in exchange');
						}
					});
				};
			};
		})
		setTimeout(function() {
			let sectionHeight = $('.exchangeList').css('height');
			console.log(sectionHeight);
			$('section').css('min-height', sectionHeight);
		}, 700);

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

	//If the user hit's one of the search button, the clickCoin function will activate with the parameter = to that coin.
	$(document).on('submit', '.search-form', function(event) {
		event.preventDefault();
		let searching = $('.search-term').val().toUpperCase();
		console.log(searching);
		clickCoin(searching);

	});

	//If the user hit's one of the coins button, the clickCoin function will activate with the parameter = to that coin.
	$(document).on('click', '.cryptoCoin', function(event) {
		event.preventDefault();
		let searching = $(this).attr('val').toUpperCase();
		$('.search-button').attr('val', searching);
		console.log(searching);
		clickCoin(searching);

	});

	//resizes the minimum height of the section when the page loads
	$(window).resize(function() {
		let cutoff = 540;

		if ($(window).width() < cutoff) {
			let sectionHeight = $('.exchangeList').css('height');
			console.log(sectionHeight);
			$('section').css('min-height', sectionHeight);
		};
		if ($(window).width() > cutoff) {
			let sectionHeight = $('.exchangeList').css('height');
			console.log(sectionHeight);
			$('section').css('min-height', sectionHeight);
		};
	});

	//git push origin master

});