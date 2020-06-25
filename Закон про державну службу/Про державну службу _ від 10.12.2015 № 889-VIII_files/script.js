// Не дадим размещаться во фреймах!
//var f = self.parent.frames;
//if (f.length != 0) top.location.href = self.location.href;

// Для удобства
var w=window;
var d=w.document;
var b=d.body;
var el=d.documentElement;
var heightWindow = el.clientHeight;
var widthWindow = el.clientWidth;

// Простое определение броузера
var ie		= d.all?true:false;
var dom		= d.getElementById?true:false;
var ns4		= d.layers?true:false;
var opera	= w.opera?true:false;
var safari	= navigator.appVersion.match(/Konqueror|Safari|KHTML|WebKit/i);
var chrome	= navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

// Отрисовка текста в документе
function dw(t){d.write(""+t);}
function elid(id){d.getElementById(id);}

// Текущая дата
var today = new Date();
// Для "кук"
var domain = '.rada.gov.ua';
var path = "/";
var expires = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
// Запоминание одного значения (на год)
function setCookie(name, value, only) {
	d.cookie = name + "=" + escape(value) +
                ((path) ? "; path=" + path : "") +
		((!only && expires) ? "; expires=" + expires.toGMTString() : "") +
		((domain) ? "; domain=" + domain : "");
}
// Получение одного значения
function getCookie(name) {
	var dc = d.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);

	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
	} else {
		begin += 2;
	}

	var end = dc.indexOf(";", begin);

	if (end == -1) {
		end = dc.length;
	}

	return unescape(dc.substring(begin + prefix.length, end));
}

// Убрать глюк IE -> indexOf
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex){
		for(var i = fromIndex||0, length = this.length; i<length; i++)
			if(this[i] === searchElement) return i;
		return -1
	}
}
String.prototype.replaceAll = function(search, replace){
	return this.split(search).join(replace);
}
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.trims = function(){
	return this.replace(/[\r\n]+/g," ").replace(/^\s+|\s+$/g,"");
}
	
function clearSelection() {
try{
	var selection=null;
	if (w.getSelection) {
		selection=w.getSelection();
	} else {
		if (d.getSelection) {
			selection=d.getSelection();
		} else {
			selection=d.selection;
		}
	}
	if (selection!=null) {selection.removeAllRanges();}
} catch(e) {
	return null;
}}

function stripHTML(text) { return text ? text.replace(/<(?:.|\s)*?>/g, "") : ''; }
function escapeRE(s) { return s ? s.replace(/[.*+?^${}()|[\]\/\\]/g, '\\$0') : ''; }
// Стандартный escape не преобразовывает '+' в ссылках
function esc(s) {
	return escape(s).replace(/\+/g, '%2B');
}
function unesc(s) {
	return unescape(s.replace(/\+/g, '%20'));
}

function parseQuery(s) {
	var query = {};
	s.replace(/b([^&=]*)=([^&=]*)b/g, function (m, a, d) {
		if (typeof query[a] != 'undefined') {
			query[a] += ',' + d;
		} else {
			query[a] = d;
		}
	});
	return query;
}

function get_referer() {
	var referer = d.referrer.replace(/^\w+:\/\//, '')
	if (referer) {
		// Без протокола
		var host = w.location.host;
		if (referer.split('/')[0]!=host) {
			// Не более 500 символов
			return escape(referer.slice(0,500));
		} else {
			// Отрезаем текущий домен
			return escape(referer.substring(host.length, referer.length).slice(0,500));
		}
	}
	return '';
}

function viewPortHeight() {
//	return self.innerHeight || el.clientHeight || b.clientHeight;
	return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
}
function viewPortWidth(){
//	return self.innerWidth || el.clientWidth || b.clientWidth;
	return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}
function scrollOffsetHeight() {
//	return self.pageYOffset || el.scrollTop || b.scrollTop;
	return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
}
function scrollOffsetWidth(){
//	return self.pageXOffset || el.scrollLeft || b.scrollLeft;
	return self.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft);
}
function elementInViewport(el){
 	var bounds = el.getBoundingClientRect();
	return (
		(bounds.top + bounds.height > 0) && // Елемент ниже верхней границы
		(window.innerHeight - bounds.top > 0) && // Выше нижней
		(bounds.left + bounds.width > 0) && // Правее левой
		(window.innerWidth - bounds.left > 0)// Левее правой
	);
}
(function($){
	$.closer = function(nam, msg, effect) {
		if (nam == null || nam == '') return;
		msg = msg || "закрити";
		effect = effect || Simple?'toggle()':'fadeOut()';
		dw("<a href=\"#\" class=\"closer\" onclick=\"$('#"+nam+"')."+effect+"; return false;\">"+msg+"</a>");
	}

	$.finder = function(nam, msg){
		nam = nam || 'qs';
		msg = msg || "Пошук";
		dw('<input type="text" id="'+nam+'" name="search" class="default" maxlength="40" value="'+msg+'" onfocus="'+"if(this.value=='"+msg+"'){this.value = '';this.className=''}\" onblur=\"if(this.value==''){this.value = '"+msg+"';this.className='default'}"+'" />');
	}

	/*!
	 * From jQuery Form Plugin
	 */
	$.fn.clearForm = function() {
		return this.each(function() {
			$('input,select,textarea', this).clearFields();
		});
	};

	/**
	 * Clears the selected form elements.
	 */
	$.fn.clearFields = $.fn.clearInputs = function() {
		return this.each(function() {
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'password' || tag == 'textarea')
				this.value = '';
			else if (t == 'checkbox' || t == 'radio')
				this.checked = false;
			else if (tag == 'select')
				this.selectedIndex = -1;
		});
	};

	// Положение элемента по центру (абсолютное или фиксированное)
	$.fn.center = function(position){
		if (ie || position=='absolute'){
			var top = Math.round((viewPortHeight() - this.height())/2) + scrollOffsetHeight();	//outerHeight
			var left = Math.round((viewPortWidth()- this.width())/2) + scrollOffsetWidth();		//outerWidth
			this.css({
				'top': top + 'px',
				'left': left + 'px',
				'position': 'absolute'
			});
		} else {
			this.css({
				'top': '50%',
				'left': '50%',
				'margin-top': '-' + Math.round(this.height()/2) + 'px',				//innerHeight
				'margin-left': '-' + Math.round(this.width()/2) + 'px',				//innerWidth
				'position': 'fixed'
			});
		}
		return this;  
	};

	// Положение элемента в координатах (абсолютное или фиксированное)
	$.fn.fixed = function(top, left, position){
		if (ie || position=='absolute'){
			top = top + scrollOffsetHeight();
			left = left + scrollOffsetWidth();
			this.css({
				'top': top + 'px',
				'left': left + 'px',
				'position': 'absolute'
			});
		} else {
			this.css({
				'top': top + 'px',
				'left': left + 'px',
				'position': 'fixed'
			});
		}
		return this;  
	};

	// Режим "перекрытия" элемента
	$.fn.overlay = function(position){
		if (ie || position=='absolute'){
			var height = el.offsetHeight + el.scrollTop - 4;
			var width = el.offsetWidth - 21;
			this.css({
				'height': height +'px',
				'width': width+'px',
				'position': 'absolute'
			});
		} else {
			this.css({
				'height': '100%',
				'width': '100%',
				'position': 'fixed'
			});
		}	
	};

	// Картинка вращающейся загрузки
	$.loader = function(show, settings){
		settings = $.extend({
			id:		'ajax',
			loaderImage:	'', //'//zakonst.rada.gov.ua/images/loader.gif',
			loaderWidth:	50,
			loaderHeight:	50,
			zindex:		4000
		}, settings || {});
		with (settings) {
			if (!$('#'+id+'Loader').length) {
				if(!loaderImage){
					$('body').append('<div id="'+id+'Loader" style="z-index:'+(zindex+10)+';position:absolute;"><div class="loader"></div></div>');
				} else {
					$('body').append('<div id="'+id+'Loader" style="z-index:'+(zindex+10)+';position:absolute;"><img src="'+loaderImage+'" width='+loaderWidth+' height='+loaderHeight+'></div>');
				}
			}
			$('#'+id+'Loader').css({'display':(show!=undefined&&show?'block':'none')}).center();
		}
	};
	//$.loader(1, {loaderImage: 'i/ajax/ajax-loader.gif'});
})(jQuery);


// Помещение в закладки для большинства броузеров
function addBookmark(a, url, title) {
	if (!url) url = location.href;
	if (!title) title = d.title;
	try {
		// Internet Explorer
		window.external.AddFavorite(url, title);
	} 
	catch (e) {
		try {
			// Mozilla
			window.sidebar.addPanel(title, url, "");
		}
		catch (e) {
			// Opera 
			if (a && opera) {
				a.rel="sidebar";
				a.title=title;
				a.url=url;
				return true;
			}
			else {
				// Unknown
				alert('This browser doesn\'t support of automatic bookmarks!');
			}
		}
	}
	return false;
}

// Вернуть ссылку для указанной соцсети:
// fb - Facebook,
// tw - Twitter,
// tg - Telegram,
// gp - Google+
// in - LinkedIn
// vk - VKontakte
// ok - Odnoklassniki
function getSocialLink(id, url, title, desc) {
	if (!url) url = location.href;
	if (!title) title = d.title;
	url_esc = encodeURIComponent(url);
	title = encodeURIComponent(title);
	desc = encodeURIComponent(desc);
	switch(id) {
		case 'fb':
			return 'https://www.facebook.com/sharer/sharer.php?u=' + url_esc;
		case 'tw':
			var text = title || desc || '';
			if(title.length > 0 && desc.length > 0)
				text = title + '. ' + desc;
			if(text.length > 0)
				text = '&text=' + text;
			return 'https://twitter.com/intent/tweet?url=' + url_esc + text;
		case 'tg':
			return 'https://t.me/share/url?url=' + url_esc + '&text=' + title + '. ' + desc;
		case 'gp':
			return 'https://plus.google.com/share?url=' + url_esc;
       		case 'in':
			return 'https://linkedin.com/shareArticle?mini=true&url=' + url_esc;
		case 'vk':
			return 'https://vk.com/share.php?url=' + url_esc + '&title=' + title + '&description='+ desc;
       		case 'ok':
			return 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=' + url_esc;
       		case 'mail':
			return 'mailto:?subject=' + title + '&body=' + title + '. ' + desc + '%0A' + url_esc;
		default:
			return url;
	};
}


function setLocation(curLoc){
	try { history.pushState(null, null, '#' + curLoc); return; } catch(e) {}
	location.hash = '#' + curLoc;
}
function scrollToName(gotoName, start){
	if (!gotoName || (start && document.location.hash == gotoName)) return false;
	if (gotoName = gotoName.replace(/^\#+/, '')) {
		var $para = $("a[name=\""+gotoName+"\"]");
		console.log('scroll', gotoName, $para.length);
		if ($para.length) {
			var panelHeight = 0;
			if ($("#panel").length) panelHeight = 70;
			setLocation(gotoName);
			console.log(gotoName, $para.offset().top, panelHeight);
			$('html, body').stop().animate({
				scrollTop: $para.offset().top - panelHeight
				}, "fast");
			$para.focus();
			if ($para.data('tree')) {
				blinkBackground($para.parent(), '#ffd8d5', 1, 500);
			}
			console.log(gotoName, $('html, body').offset().top);
		}
		return true;
	}
	return false;
}
function blinkBackground(element, color, i, x) {
	if (i===undefined || i<=0) i = 3;
        if (x===undefined || x<=0) x = 500;
	if (color===undefined) color = '#e6c04d';
	if (element.data("blink")===undefined) element.data("blink", element.css("background-color"));
	(function loop() { //recurisve IIFE
		element.css("background-color", color);
		setTimeout(function() {
			element.css("background-color", element.data("blink"));
			if (--i) setTimeout(loop, x); //restart loop
			else element.css("background-color", '');
		}, x);
	}());
}

///////////////////////////////////////////////////////////////////////////////

function sectionReload() {
	// Scroll on top
	$(function () {
		var scroll_timer;
		var displayed = false;
		var $gotop = $('#gotop');
		var $window = $(window);
		// Window Top
		var top = $(document.body).children(0).position().top;
		var toploc = 'top';
		if ($('#article').length) toploc = 'Text';
		// Document Panel
		var TopPanel = 0;
		if ($('#Document').length) TopPanel = $('#Document').offset().top;
		console.log('TopPanel', TopPanel);

		$window.scroll(function () {
			window.clearTimeout(scroll_timer);
			scroll_timer = window.setTimeout(function () {
				if (($window.scrollTop() - top < 200) || $('#topmenu').hasClass('show')) {
					displayed = false;
					$gotop.stop(true, true).fadeOut('fast');
				} else if (displayed == false) {
					displayed = true;
					$gotop.stop(true, true).fadeIn('fast');
				}
			}, 100);
			if (TopPanel>0) {
				if ( $(this).scrollTop() > TopPanel) {
					$("#panel").css('position', 'fixed');
					$("#Text").css('padding-top', '70px');
				} else {
					$("#panel").css('position', 'relative');
					$("#Text").css('padding-top', '0px');
				}
			}
		});
		$gotop.click(function (e) {
			e.preventDefault();
			var pos = top;
			if (toploc != 'top' && document.location.hash != '#'+toploc) {
				pos = $("#Document").offset().top;
				setLocation(toploc);
			} else {
				setLocation('top');
			}
			$("html, body").animate({ scrollTop: pos }, "fast");
		});
		$window.scroll();
	});

	$('#article a[href^="#"], a.word[href^="#"], a.stru[href^="#"]').click(function (e) {
		scrollToName($(this).attr('href'));
		e.preventDefault();
	});

	$('#commentToggle').click(function (e) {
        	e.preventDefault();
		var $article = $('#article');
		$article.toggleClass('nocomment');
		if ($article.hasClass("nocomment")) {
			$(this).removeClass('text-muted');
			$(this).addClass('text-success');
		} else {
			$(this).removeClass('text-success');
			$(this).addClass('text-muted');
		}
		//scrollToName(document.location.hash);
		return false;
	});

	$('#compareToggle').click(function (e) {
        	e.preventDefault();
		var $article = $('#article');
		var $para = $("#article .dif,#article .ins,#article .del,#article .ord");
		if ($para.length) {
			var wt = $(window).scrollTop();
			var wh = wt + heightWindow;
			var inViewport = false;
			var pos = 0;
			for (var i = 0; i < $para.length; i++) {
				var el = $para.eq(i);
				var bot = el.height();
				if (bot==0) continue;
				var top = el.offset().top;
				bot += top;
				if ((top >= wt) && (bot <= wh)) {
					inViewport = true;
					break;
				}
				if (pos == 0 || pos < top) {
					pos = top;
					if (pos >= wt) break;
				}
			}
			if (inViewport == false && pos>0) {
				if ($("#panel").length) pos -= 70;
				$("html, body").animate({ scrollTop: pos }, "fast");
				if ($article.hasClass("compare")) {
					return false;
				}
			}
		}
		$article.toggleClass('compare');
		if ($article.hasClass("compare")) {
			$(this).removeClass('text-muted');
			$(this).addClass('text-danger');
			//$("#compare").removeClass('hide');
		} else {
			$(this).removeClass('text-danger');
			$(this).addClass('text-muted');
			//$("#compare").addClass('hide');
		}
		return false;
	});

	$('#compareSelect').click(function (e) {
		var $sele = $("#compare");
		if ($sele.hasClass("hide")) {
			$(this).removeClass('btn-secondary');
			$(this).addClass('btn-danger');
			$sele.removeClass('hide');
			return false;
		} else {
			return true;
		}
	});

	if ($('#Stru').length) $('#struToggle').click(function (e) {
        	e.preventDefault();
		$('#Stru').toggleClass('show');
		$('#article').parent().toggleClass('col-lg-9').toggleClass('col-md-8').toggleClass('col-sm-12');
		if (widthWindow<=640 && $('#Stru').hasClass('show')) $("html, body").animate({ scrollTop: $('#Stru').offset().top - 70 }, "fast");
		return false;
	});

	if (typeof layzr != 'undefined')
		layzr = new Layzr({});

	// Окошко проверки
	if (typeof Orfo != 'undifined')
		$('#orfoButton').click($.checkOrfo);
	
	// Goto text paragraph
	scrollToName(document.location.hash || $('#article').data('goto') || $('body').data('goto'));

	// Передача статистики
	if (typeof statistic != 'undefined')
		with (statistic) {
			// Без протокола
			if (link.replace(/^\w+:\/\//, '').indexOf(w.location.host+'/')==0) {
				var REF = get_referer();
				var URL = link + '?stat=' + esc(stat) + (REF && REF!='/' ? '&referer='+REF : '');
				//console.log(URL);
				$.getScript(URL);
			}
		}
}

$(document).ready(function () {
	// Проверка автозагрузки
	var $section = $("#content section");
	if ($section.data('load')) {
		$.loader(true, {});
		$.ajax({
			url: $section.data('load'),
			context: document.body
		}).done(function(response) {
			$section.replaceWith(response);
			$.loader(false, {});
			sectionReload();
		});
	} else {
		sectionReload();
	}

	$('#toggle_headbar,#toggle_headmenu').click(function (e) {
        	e.preventDefault();            
		$('body').toggleClass('head');
		return false;
	});

	$('#eurotree_details').click(function (e) {
		var $treeGroups = $("#eurotree").find("details");
		var $expandLink = $("#eurotree_details");
		var $detailsOpen = $treeGroups.prop("open");
		var $detailsActive = $expandLink.hasClass("active");
		if ($detailsActive == true) {
			$treeGroups.prop('open', false);
			$expandLink.toggleClass("active");
		} else if (($detailsOpen == true) && ($detailsActive == false))  {
			$treeGroups.prop('open', true);
			$expandLink.toggleClass("active");
		} else  {
			$treeGroups.prop('open', true);
			$expandLink.toggleClass("active");
		};
		return false;
	});
	$('#eurotree_nort').click(function (e) {
		var $treeGroups = $("#eurotree");
		var $detailsOpen = $treeGroups.find("details").prop("open");
		if ($detailsOpen == false) {
			$('#eurotree_details').click();
		}
		$treeGroups.toggleClass('nort');
		$(this).toggleClass("active");
		return false;
	});
	$('#eurolist_nouse').click(function (e) {
		$("#eurolist").toggleClass('nouse');
		$(this).toggleClass("active");
		return false;
	});
	$('#filter_lang a.filter').click(function (e) {
		var langtype = $(this).data('id');
		$(this).toggleClass("active");
		var $termGroups = $("#euroterms");
		$termGroups.toggleClass(langtype);
		if ($("#filter_lang").find("a.filter").hasClass("active")) {
			$termGroups.addClass('filter');
		} else {
			$termGroups.removeClass('filter');
		}
		return false;
	});

	$('.social a').each(function( index ) {
		var id = $(this).data('id');
		if (!id) return;
		var data = $(this).parent('.social');
		var url = data.data('url') || location.href, title = data.data('title') || '', desc = data.data('desc') || '';
		$(this).attr("href", getSocialLink(id, url, title, desc));
		if (id != 'dl') $(this).attr("target", id+"_blank");
	});	

	$('[data-toggle="tooltip"]').tooltip({'sanitize':false});

});
