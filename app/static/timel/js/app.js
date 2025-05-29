
$( document ).ready(function() {

	//////////// Image Changers
	var $imgCard = $('.imgCard'),
		totalCard = $imgCard.length,
		$swiperHolder = $('.swiperHolder'),
		slideIndex = 0;

	// function nextPlease(){

	// 	var now = $('.active').index(),
	// 		next = now + 1;
	// 		if(now == totalCard - 1){
	// 			next = 0;
	// 		}
	// 		$imgCard.removeClass('old');
	// 		$('.imgCard:eq('+now+')').addClass('old').removeClass('active');
	// 		$('.imgCard:eq('+next+')').addClass('active');

	// }

	// nextPlease();
	// var interval = setInterval(function(){ 
	// 					nextPlease();
	// 				}, 5000);

	$KV = $('#KV');

	// $KV.click(function(){
	// 	clearInterval(interval);
	// 	nextPlease();
	// 	interval = setInterval(function(){ 
	// 					nextPlease();
	// 				}, 5000);
	// });


	//////////// Nav Manager
	var starting = 1,
		flagSingle = 0,
		$nav = $('#Nav'),
		$Consept = $('#Consept'),
		windowH = window.innerHeight;


	if($('.index').length){
		NavRunner();
	}

	function NavRunner(){

		window.addEventListener("scroll", function (event) {

			var scrollAt = this.scrollY;

			if(starting && scrollAt >= windowH){
				$nav.addClass('fixed');
				flagSingle = 1;
				starting = 0;
				return false;

			} else if(scrollAt <= windowH - 80 && flagSingle){
				interval = setInterval(function(){ 
					nextPlease();
				}, 5000);
				$Consept.removeClass('open');
				$nav.removeClass('fixed');
				flagSingle = 0;


			} else if( scrollAt >= windowH - 80 && !flagSingle){
				$Consept.addClass('open');
				$nav.addClass('fixed');
				flagSingle = 1;
				clearInterval(interval);

			}

			if(scrollAt >= windowH){$Consept.addClass('open'); }
			
		});
	}

	//////////// Menu Click Scroll Too

	var $Nav = $('#Nav'),
		$menu = $('.menu');


	$menu.click(function(){
		$Nav.toggleClass('openMenu');
	});

	//////////// Link Click

	var $links = $('nav#Nav .list'),
		$logo = $('.lineLogo'),
		$body = $('html,body');

		$links.click(function(){

			$Nav.toggleClass('openMenu');
			var whereTo = $(this).attr('where');
			GoThere(whereTo);

		});

		$logo.click(function(){
			$Nav.removeClass('openMenu');
			var whereTo = $(this).attr('where');
			GoThere(whereTo);

		});


	function GoThere(local){

		if(local){

			var value = $('#'+local+'').offset().top;

			window.scrollTo({
				top: value - 40,
				behavior: 'smooth'
			});

			$body.animate({ scrollTop: value }, 1000);
		 	return false; 
     	}

	}


	//////////// Event Gallery Slider

	// ① スライド数と数字ナンバー生成部分はそのまま
	var ScreeNO       = $('#EventGallery .swiper-slide').length,
		html          = '',
		$NumHolder    = $('.numberHolder .cageMover'),
		// info 表示用要素をキャッシュ
		$EventTitle   = $('#EventGallery .infomation .title'),
		$EventText    = $('#EventGallery .infomation .text');

	// 数字ナンバーを入れる
	for (var i = 0; i < ScreeNO; i++) {
	html += '<div>' + (i + 1) + '</div>';
	}
	$NumHolder.append(html);
	$NumHolder.find('div:eq(0)').addClass('active');


	// ② Swiper 初期化
	var EventGallery = new Swiper('#EventGallery .swiper-container', {
	navigation: {
		nextEl: '#EventGallery .arrowF',
		prevEl: '#EventGallery .arrowB',
	},
	on: {
		slideChange: function () {
		var idx       = EventGallery.activeIndex,
			moveValue = idx * 49;

		// ナンバー上下スクロール
		$NumHolder.css('top', '-' + moveValue + 'px');
		$NumHolder.find('div').removeClass('active')
					.eq(idx).addClass('active');

		// タイトル・テキスト更新
		updateTitle();
		},
	},
	keyboard: {
		enabled: true,
		onlyInViewport: false,
	},
	});

	// ③ 初回表示
	updateTitle();


	// ④ updateTitle 関数
	function updateTitle(){
	var $slide = $('#EventGallery .swiper-slide-active'),
		// data 属性から取得
		title  = $slide.data('title') || $slide.attr('data-title'),
		text   = $slide.data('text')  || $slide.attr('data-text');

	// 既存の要素に差し替え
	$EventTitle.text(title || '');
	$EventText.text(text || '');
	}


	//////////// Location Gallery Slider

	var AreaGallery = new Swiper('#AreaGallery .swiper-container', {
		slidesPerView: 'auto',
		autoHeight: true,
		spaceBetween: 0,
		loop: true,
		navigation: {
			nextEl: '#AreaGallery .pagination .total',
			prevEl: '#AreaGallery .pagination .current',
		},
		pagination: {
			el: '#AreaGallery .pagination',
			clickable: true,
		},
		pagination: {
			el: '#AreaGallery .pagination .line',
			type: 'progressbar',
		},
		on: {
			slideChange: function () {
				setTimeout(function(){ 
					var index = $('#AreaGallery .swiper-slide-active').attr('data-swiper-slide-index');
					AreaUpdateSlider( Number(index)+1 );
				}, 300);

			},
		},
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
	});


	var $current = $('#AreaGallery .current'),
		$total = $('#AreaGallery .total');

		$total.append('0'+ $('#AreaGallery .swiper-slide').length/3 +'');

	function AreaUpdateSlider( index ){
		$current.empty();
		$current.append('0'+ index +'');
		console.log(Number(index));

	}




	//////////// Product Gallery Slider

	var ProductListing = new Swiper('#ProductListing .swiper-container', {
		slidesPerView: 'auto',
		autoHeight: true,
		spaceBetween: 0,
		loop: true,
		navigation: {
			nextEl: '#ProductListing .pagination .total',
			prevEl: '#ProductListing .pagination .current',
		},
		pagination: {
			el: '#ProductListing .pagination',
			clickable: true,
		},
		pagination: {
			el: '.productList .pagination .line',
			type: 'progressbar',
		},
		on: {
			slideChange: function () {
				setTimeout(function(){ 
					var index = $('#ProductListing .swiper-slide-active').attr('data-swiper-slide-index');
					AreaUpdateSlider2( Number(index)+1 );
				}, 300);

			},
		},
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
		autoplay: {
			delay: 10000,
		},
	});


	var $current2 = $('.productList .current'),
		$total2 = $('.productList .total');

		$total2.append('0'+ $('#ProductListing .swiper-slide').length/3 +'');

	function AreaUpdateSlider2( index ){
		$current2.empty();
		$current2.append('0'+ index +'');
	}



	//////////// Other Products

	var OtherBooks = new Swiper('#OtherBooks .swiper-container', {
		slidesPerView: 'auto',
		autoHeight: true,
		spaceBetween: 0,
		loop: true,
		navigation: {
			nextEl: '#OtherBooks .pagination .total',
			prevEl: '#OtherBooks .pagination .current',
		},
		pagination: {
			el: '#OtherBooks .pagination',
			clickable: true,
		},
		pagination: {
			el: '#OtherBooks .pagination .line',
			type: 'progressbar',
		},
		on: {
			slideChange: function () {
				setTimeout(function(){ 
					var index = $('#OtherBooks .swiper-slide-active').attr('data-swiper-slide-index');
					AreaUpdateSlider3( Number(index)+1 );
				}, 300);

			},
		},
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
	});


	var $current3 = $('#OtherBooks .current'),
		$total3 = $('#OtherBooks .total');

		$total3.append('0'+ $('#OtherBooks .swiper-slide').length/3 +'');

	function AreaUpdateSlider3( index ){
		$current3.empty();
		$current3.append('0'+ index +'');
		console.log(Number(index));

	}




	//////////// MENU SCROLL CONTROL


	if($('.meunList').length){
		$('footer').hide();
	}

	var $scrollBox = $('#MenuPage .meunList .content'),
		$menuBlock = $('#MenuPage .meunList .block'),
		$imageBlock = $('#MenuPage .imageBlock'),
		sectionIds = {},
		oldStep = 1,
		step = 1;

	var $menublock = $('.menublock'),
		menuSectionIds = {};

	var skip = 0;
	$menuBlock.each(function(){	
		var $this = $(this);
		sectionIds[$this.attr("id")] = $this.position().top + skip;
		skip += 80;
	});	
	
	var vlaue = 0;
	$menublock.each(function(){	
		var $this = $(this);
		menuSectionIds[$this.attr("data-nameTag")] = $this.position().top + vlaue;
		vlaue += 30;
	});	

	console.log(sectionIds);
	
	
	$scrollBox.scroll(function(event){		

		var scrolled = $(this).scrollTop();	

		step = 1;

		for (key in sectionIds){
			if (scrolled >= sectionIds[key]){
				var c = $("[data-row-id="+key+"]");
				$(".tabsLink").removeClass("active");
				c.addClass("active");


			}
		}

		for (key in menuSectionIds){
			if (scrolled >= menuSectionIds[key]){
				var z = $("[data-nameTag="+key+"]");
				step += 1;
			}
		}

		if(step != oldStep){
			oldStep = step;
			var KVAdd = z.attr('imgKV');
			$imageBlock.append('<div class="imageHolder new" style="background-image: url('+KVAdd+')"></div>')
		}

	});


	$(".tabsLink").click(function(){
		
		var finding = $(this).attr("data-row-id");
		$scrollBox.animate({scrollTop: sectionIds[finding]+'px'}, 350);
		
	});



	$('.menublock').each(function(){
		var amount = $(this).find('.item').length;
		if(amount < 6){
			$(this).addClass('single');
		}
	});	



	//////////// Animation Section

	var slideUp = {
		distance: '10px',
		origin: 'bottom',
		viewFactor: 0.3,
		interval: 300,
		duration: 1500,
		mobile: true,
		scale: 1
	};

	var slideUp2 = {
		distance: '20px',
		origin: 'bottom',
		interval: 300,
		duration: 1500,
		mobile: true,
		scale: 1
	};

	var slideUp3 = {
		distance: '32px',
		origin: 'bottom',
		duration: 1500,
		mobile: true,
		scale: 1
	};

	var scroller = new ScrollReveal();

	scroller.reveal('#KV .logo', {
		distance: '10px',
		origin: 'bottom',
		viewFactor: 0.3,
		interval: 300,
		duration: 1500,
		mobile: true,
		reset: true,
		scale: 1
	} );

	scroller.reveal('#KV .holder, .mainEvent', {
		distance: '20px',
		origin: 'bottom',
		interval: 300,
		duration: 1500,
		mobile: true,
		reset: true,
		scale: 1
	} );

	scroller.reveal('section#MenuPage .meunList .tabs', {
		distance: '20px',
		origin: 'top',
		duration: 1500,
		mobile: true,
		scale: 1
	} );

	

	scroller.reveal('.productInfo #productInfo .product', {
		distance: '35px',
		origin: 'bottom',
		duration: 1500,
		mobile: true,
		scale: 1
	} );

	scroller.reveal('.productInfo #productInfo .content div', {
		distance: '20px',
		origin: 'bottom',
		duration: 1500,
		mobile: true,
		scale: 1
	}, 200 );


	scroller.reveal('#NewsMV', {
		distance: '20px',
		origin: 'top',
		duration: 1500,
		mobile: true,
		scale: 0.95
	}, 200 );

	

	scroller.reveal('#Gallery .card, #Events .card, #Product .card, .menublock, .cage .block, #OtherBooks .swiper-container, #OtherBooks .pagination, #ContactForm .row, section#SpaceInfo p', slideUp, 200);

	scroller.reveal('.header h3.title, .infomation, #section#AreaGallery .title, #Aboutsofa .title, #TextCopy .title, table', slideUp );
	
	scroller.reveal('.header .jpSub, .FPDetail, #Access .details, #Access .mapHolder, #section#AreaGallery .description, #Aboutsofa p, #TextCopy .timeStamp, section#SpaceInfo .details .cell, .fp', slideUp2 );

	scroller.reveal('#TextCopy .breaker', slideUp3 );



});

// document.addEventListener("DOMContentLoaded", () => {
// 	// サービスカードの要素を取得
// 	const serviceCards = document.querySelectorAll(".service-card")
  
// 	// 各カードにマウスイベントを追加
// 	serviceCards.forEach((card) => {
// 	  card.addEventListener("mouseenter", function () {
// 		const index = this.getAttribute("data-index")
// 		handleHover(index)
// 	  })
  
// 	  card.addEventListener("mouseleave", () => {
// 		handleHover(null)
// 	  })
// 	})
  
// 	// ホバー状態を処理する関数
// 	function handleHover(index) {
// 	  serviceCards.forEach((card) => {
// 		const cardIndex = card.getAttribute("data-index")
// 		if (cardIndex === index) {
// 		  card.classList.add("hovered")
// 		} else {
// 		  card.classList.remove("hovered")
// 		}
// 	  })
// 	}
  
// 	// Chevronアイコンのアニメーション
// 	const chevronIcon = document.querySelector(".chevron-icon")
  
// 	function animateChevron() {
// 	  chevronIcon.style.animation = "chevronAnimation 1.5s infinite"
// 	}
  
// 	animateChevron()
  
// 	// ビューモアボタンのクリックイベント
// 	const viewMoreButton = document.querySelector(".view-more-button")
  
// 	viewMoreButton.addEventListener("click", () => {
// 	  alert("詳細ページへ移動します")
// 	})
//   })

// ステップバブルのアクティブ状態を切り替える機能
document.addEventListener('DOMContentLoaded', function() {
	const stepBubbles = document.querySelectorAll('.step-bubble');
	
	stepBubbles.forEach((bubble, index) => {
	  bubble.addEventListener('click', function() {
		// すべてのバブルから active クラスを削除
		stepBubbles.forEach(b => {
		  const circleDiv = b.querySelector('div:first-child');
		  circleDiv.classList.remove('bg-primary');
		  circleDiv.classList.add('bg-secondary-40');
		  circleDiv.classList.remove('text-white');
		  circleDiv.classList.add('text-primary');
		});
		
		// クリックされたバブルに active クラスを追加
		const thisCircle = this.querySelector('div:first-child');
		thisCircle.classList.remove('bg-secondary-40');
		thisCircle.classList.add('bg-primary');
		thisCircle.classList.remove('text-primary');
		thisCircle.classList.add('text-white');
		
		// スクロール位置を調整（オプション）
		const stepSections = document.querySelectorAll('.mb-24, .mb-16');
		if (stepSections[index]) {
		  stepSections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	  });
	});
	
	// ボタンのホバーエフェクト
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
	  button.addEventListener('mouseenter', function() {
		if (this.classList.contains('bg-primary')) {
		  this.style.backgroundColor = 'rgba(57, 82, 70, 0.9)';
		} else if (this.classList.contains('border-primary')) {
		  this.style.backgroundColor = 'rgba(57, 82, 70, 0.1)';
		}
	  });
	  
	  button.addEventListener('mouseleave', function() {
		if (this.classList.contains('bg-primary')) {
		  this.style.backgroundColor = '';
		} else if (this.classList.contains('border-primary')) {
		  this.style.backgroundColor = '';
		}
	  });
	});
});

document.addEventListener('DOMContentLoaded', function() {
	// タブ切り替え機能
	const tabButtons = document.querySelectorAll('.tab-button');
	const tabContents = document.querySelectorAll('.tab-content');

	tabButtons.forEach(button => {
		button.addEventListener('click', function() {
		// アクティブなタブボタンのクラスを削除
		tabButtons.forEach(btn => {
			btn.classList.remove('active');
		});
		
		// クリックされたボタンにアクティブクラスを追加
		this.classList.add('active');
		
		// タブコンテンツを非表示にする
		tabContents.forEach(content => {
			content.classList.remove('active');
		});
		
		// クリックされたボタンに対応するコンテンツを表示
		const tabId = this.getAttribute('data-tab');
		document.getElementById(tabId).classList.add('active');
		});
	});

	// ホバーエフェクト
	const hoverItems = document.querySelectorAll('.price-item, .pack-item');

	hoverItems.forEach(item => {
		item.addEventListener('mouseenter', function() {
		this.style.transform = 'scale(1.05)';
		});
		
		item.addEventListener('mouseleave', function() {
		this.style.transform = 'scale(1)';
		});
	});
	const items = document.querySelectorAll('.feature-item');
	const io = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			obs.unobserve(entry.target);
		}
		});
	}, { threshold: 0.1 });

	items.forEach(item => io.observe(item));

	const ticker = document.querySelector('.text-ticker');
	if (!ticker) return;
	// 中身を複製してループ用に２セットに
	ticker.innerHTML += ticker.innerHTML;

	/* strength */
	const strengthItems = document.querySelectorAll('.strength-item');
      
	// タッチデバイス用の対応
	strengthItems.forEach(item => {
	  item.addEventListener('touchstart', function() {
		const currentActive = document.querySelector('.strength-item.active');
		if (currentActive && currentActive !== item) {
		  currentActive.classList.remove('active');
		}
		item.classList.toggle('active');
	  }, {passive: true});
	});
	// スクロールアニメーション
	const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
		entry.target.classList.add('animate');
		observer.unobserve(entry.target);
		}
	});
	}, {
	threshold: 0.1
	});

	strengthItems.forEach(item => {
	observer.observe(item);
	});
});

document.addEventListener('DOMContentLoaded', () => {
	const mainImg   = document.getElementById('mainImage');
	const thumbs    = Array.from(document.querySelectorAll('.thumb'));
	const indicator = document.querySelector('.indicator');
  
	// ① 静的な画像リストを保持（indicator用）
	const imageList = [ mainImg.src, ...thumbs.map(t => t.src) ];
	const total     = imageList.length;
  
	// ② ドットを生成
	for (let i = 0; i < total; i++) {
	  const dot = document.createElement('span');
	  if (i === 0) dot.classList.add('active');
	  indicator.appendChild(dot);
	}
	const dots = Array.from(indicator.children);
  
	// ドット表示だけ更新する関数
	function updateIndicator() {
	  const idx = imageList.findIndex(src => src === mainImg.src);
	  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
	}
  
	// ③ サムネクリックで main⇔thumb をスワップ＆indicator更新
	thumbs.forEach(thumb => {
	  thumb.addEventListener('click', () => {
		const tmp = mainImg.src;
		mainImg.src = thumb.src;
		thumb.src   = tmp;
		updateIndicator();
	  });
	});
  
	// ④ スワイプで前後切替も同じく swap＆indicator更新
	let startX = 0;
	mainImg.addEventListener('touchstart', e => {
	  startX = e.touches[0].clientX;
	});
	mainImg.addEventListener('touchend', e => {
	  const diff = e.changedTouches[0].clientX - startX;
	  if (Math.abs(diff) > 50) {
		// static list から今の位置を取って次/前を決定
		const idx = imageList.findIndex(src => src === mainImg.src);
		const nextIdx = diff < 0
		  ? (idx + 1) % total
		  : (idx - 1 + total) % total;
		const nextSrc = imageList[nextIdx];
  
		// nextSrc を持つサムネを探して swap
		const target = thumbs.find(t => t.src === nextSrc);
		if (target) {
		  const tmp = mainImg.src;
		  mainImg.src = nextSrc;
		  target.src  = tmp;
		} else {
		  // 念のため直接 main だけ切り替え
		  mainImg.src = nextSrc;
		}
		updateIndicator();
	  }
	});
  });
  
  
  