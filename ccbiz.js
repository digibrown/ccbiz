/*
 * CurrencyConverter.biz
 * https://currencyconverter.biz
 *
 * @author   David Brown
 * @website  https://www.digibrown.com
 *
 */

ccbiz = {};
var ccy1 = "EUR";
var ccy2 = "USD";
var type = "mid"
	var calcside = 2;



(function($) {
	  var oldHTML = $.fn.html;

	  $.fn.formhtml = function() {
	    if (arguments.length) return oldHTML.apply(this,arguments);
	    $("input,textarea,button", this).each(function() {
	      this.setAttribute('value',this.value);
	    });
	    $(":radio,:checkbox", this).each(function() {
	      // im not really even sure you need to do this for "checked"
	      // but what the heck, better safe than sorry
	      if (this.checked) this.setAttribute('checked', 'checked');
	      else this.removeAttribute('checked');
	    });
	    $("option", this).each(function() {
	      // also not sure, but, better safe...
	      if (this.selected) this.setAttribute('selected', 'selected');
	      else this.removeAttribute('selected');
	    });
	    return oldHTML.apply(this);
	  };

	  //optional to override real .html() if you want
	  $.fn.html = $.fn.formhtml;
	  
	})(jQuery);


var qsParm = new Array();
function qs() {
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	for (var i=0; i<parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0) {
			var key = parms[i].substring(0,pos);
			var val = parms[i].substring(pos+1);
			qsParm[key] = val;
		}
	}
} 

function switchChartCcy() {
	if (ccy1=="USD" && ccy2=="AUD") { ccy1="AUD";ccy2="USD"; }
	else if (ccy1=="NZD" && ccy2=="AUD") { ccy1="AUD";ccy2="NZD"; }

}


function addBR(div) {
	div.append($('<br/>'));
	return div;
}
function addSP(div) {
	div.append($('<span>&nbsp;&nbsp;</span>'));
	return div;
}
function addBut(div, id, val, cl, nm) {
	if (nm == null) nm = "";
	//make a but with the id, class and value
	var but = $('<div />').attr('id', id);

	but.addClass('butdiv ' + cl );
	but.html(val);
	// make an e element with the href to butclick()
	var a = $('<a />').attr({href : "javascript:butclick('" + id + "','" + val + "')", 
		title : nm });
	// append the but div to the a
	a.append(but);
	// append the a elem to the passed in div
	div.append(a);
	return div;
}

function updDisp(id, val) {

	var val_sav = val;
	var curval = $('#value' + id).html();

	if (curval.length > 7 && val != "&nbsp;&nbsp;" && val != "C")
		return;
	if (val == "." && curval.indexOf(".") != -1)
		return;
	if (val == "C")
		val = "0.0";
	else if (val == "&nbsp;&nbsp;" && curval.length > 0 && curval != "0.0")
		val = curval.substring(0, curval.length - 1);
	else if (val == "&nbsp;&nbsp;" && curval == "0.0")
		return;
	else if (curval == "0.0")
		curval = "";
	else if (val != "." && curval.length > 0 && curval.indexOf(".") != -1
			&& curval.indexOf(".") == (curval.length - 3))
		return; // max 2 dp
	else
		val = curval + val;
	if (val_sav != "." && val[val.length - 1] == ".")
		val = val.substring(0, val.length - 1); // remove dangling dp
	if (val != "0.0" && val.length > 1 && val[0] == "0")
		val = val.substring(1, val.length);
	if (val == "" || val == "0.")
		val = "0.0";
	$('#value' + id).html(Comma(val));

}
function selCcy(id, newccy) {
	var curccy = ccy1;
	if (id == 2)
		curccy = ccy2;
	$("#valccy" + id).removeClass(curccy);
	$("#valccy" + id).addClass(newccy);
	$("#valccy" + id).html(newccy);
	$("#cb" + id + curccy).removeClass("ccy" + id + "sel");
	$("#cb" + id + newccy).addClass("ccy" + id + "sel");
	if (id == 1)
		ccy1 = newccy;
	else
		ccy2 = newccy;
	// if (ccy1 != ccy2)
	// 	_gaq.push(['_trackEvent','selCcy',ccy1+ccy2,newccy]);
}
function getCrossRate(ccypair) {
	var s1 = ccypair.substring(0,3);
	var s2 = ccypair.substring(3,6);
	var r1 = getRate(s1);
	var r2 = getRate(s2);
//	alert(s1+" "+r1 + " " +s2 + " " + r2);
	var mult = 1.0;

	if (isNaN(r1) || isNaN(r2) ) { return "N/A";}
	if (s1 == s2)
		mult = 1.0;

	var result = roundNumber(r1 / r2 * mult, 4);
	return result;
}
function setRate() {
	$('#rate').html("-");
	var r1 = getRate(ccy1);
	var r2 = getRate(ccy2);
	var mult = 1.0;
	if (isNaN(r1) || isNaN(r2) ) { $('#rate').html("N/A"); return;}
	if (ccy1 == ccy2)
		mult = 1.0;
	else if (type == "cash")
		mult = 0.96;
	else if (type == "cred")
		mult = 0.98;
	var result = roundNumber(r1 / r2 * mult, 4);
	if (result < 0.05) result = roundNumber(r1/ r2, 7);
	if (result > 10) result = roundNumber(r1/ r2, 2);
	$('#rate').html(result);
}
function Comma(number) {
	return number;
	/*
	number = '' + number;
	if (number.length > 4) {
	var mod = number.length % 3;
	var output = (mod > 0 ? (number.substring(0,mod)) : '');
	for (i=0 ; i < Math.floor(number.length / 3); i++) {
	if ((mod == 0) && (i == 0))
	output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
	else
	output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
	}
	return (output);
	}
	else return number;*/
}
function roundNumber(num, dec) {
	var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);

	return result;
}
function calc(id) {

	var v1 = $('#value1').html();
	var v2 = $('#value2').html();
	v1 = v1.replace(/\,/g,'');v2 = v2.replace(/\,/g,'');
	var r = $('#rate').html();

	if (id == 1) {
		var result = Comma(roundNumber(v2 / r, 2));
		if (r == "N/A" ) $('#value1').html("0");
		else $('#value1').html(result);
	} else {
		var result = Comma(roundNumber(v1 * r, 2));
		if (r == "N/A" ) $('#value2').html("0");
		else $('#value2').html(result);
	}
}
function getRate(ccy) {
	for ( var i = 0; i < ccys.values.length; i++)
		if (ccys.values[i].code == ccy)
			return ccys.values[i].rate;
	return 0.0;
}
function getRateTime () {
	var t = "N/A";
	if (ccys.values.length > 0) {
//	 t = ccys.values[0].time;
//	 
	 var ts = new Date( ccys.values[0].time*1000);
	     var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
	         t = ts.toLocaleDateString('en-US', options);
}
	return t;
}
function setCalcSide(i) {
	calcside=i;
	if (i == 1) {
		$('#display2').addClass("calcside");
		$('#display1').removeClass("calcside");
	} else {
		$('#display1').addClass("calcside");
		$('#display2').removeClass("calcside");
	}
}
function yellowFade(b) {
b.css('opacity',0).animate({opacity:1.0},800) ;
}



function butclick(id, val) {

var b = $('#'+id);
	if (b.hasClass("chartbut")) {
		var pair = b.attr("rel").substring(0,7);
		document.location = '/charts?ccy1='+pair.substring(0,3)+'&ccy2='+pair.substring(4,7);
		// _gaq.push(['_trackEvent','chartBut',pair]);
	}
	else if ($('#' + id).hasClass("dig")) {
		// digit button pressed
		if ($('#' + id).hasClass("ccy1")) {
			updDisp(1, val);
			setCalcSide(2);
			calc(calcside);
		} else if ($('#' + id).hasClass("ccy2")) {
			updDisp(2, val);
			setCalcSide(1);
			calc(calcside);
		}
	} else if ($('#' + id).hasClass("ccy")) {
		// ccy button pressed
		if ($('#' + id).hasClass("ccy1")) {
			selCcy(1, val);
			setRate();
			calc(calcside);
		} else if ($('#' + id).hasClass("ccy2")) {
			selCcy(2, val);
			setRate();
			calc(calcside);
		}
		if (ccy1=="XAU" || ccy2=="XAU") {$("#rbcred").hide();$("#rbcash").hide(); } else {$("#rbcred").show();$("#rbcash").show(); } 
		showChartBut();
	} else if ($('#' + id).hasClass("ratebut")) {
		$(".ratebut").removeClass("ratebutsel");
		// rate button pressed
		if (id == "rbmid") {
			type = "mid";
			setRate();
			calc(calcside);
			$("#rbmid").addClass("ratebutsel");
			// _gaq.push(['_trackEvent','setRate',type]);
		} else if (id == "rbcred") {
			type = "cred";
			setRate();
			calc(calcside);
			$("#rbcred").addClass("ratebutsel");
			// _gaq.push(['_trackEvent','setRate',type]);
		} else if (id == "rbcash") {
			type = "cash";
			setRate();
			calc(calcside);
			$("#rbcash").addClass("ratebutsel");
			// _gaq.push(['_trackEvent','setRate',type]);
		}
	}
	//setTimeout( ignoreKeys=false, 600);
}


function stripDuplicateChars(str, strip, n, s) {
	var count = 0;
	var stripped = str.substring(0, s);
	var chr;
	for ( var i = s; i < str.length; i++) {
		chr = str.substring(i, i + 1);
		if (chr == strip) {
			count++;
			if (count < n + 1) {
				stripped = stripped + chr;
			}
		} else {
			stripped = stripped + chr;
		}
	}
	return stripped;
}
function allowOnlyFloatingPointNumbers(val) {
	val = val.replace(/[^0-9.-]/g, ''); // strip non-digit chars
	val = stripDuplicateChars(val, '.', 1, 0); // strip excess decimals
	val = stripDuplicateChars(val, '-', 0, 1); // strip excess minus
	return val
}

function makeRates() {
	var overlay = $('<img class="overlay" width="725px" height="510px" src="metalOverlay.png"></img>');
	$('#rates').append(overlay);
	$('.cell').each(function(index) {
		var c1 = $(this).attr('id').substring(0,3);
		var c2= $(this).attr('id').substring(3,6);
		var link = $('<a />').attr('href', '/?ccy1='+c1+'&ccy2='+c2);
		link.html(getCrossRate($(this).attr('id')));
		link.attr('title', 'Calculate from ' + c1 + ' to ' + c2);
		$(this).append(link);
	});

	$('#loading').fadeOut();
}

function makeCalc() {



	var overlay = $('<img class="overlay" width="725px" height="510px" src="metalOverlay.png"></img>');
	$('#calc').append(overlay);
	var displays = $('<div />').attr('id', 'displays');

	var display1 = $('<div />').attr('id', 'display1');
	display1.addClass('display display1');

	var value1 = $('<div />').attr('id', 'value1');
	value1.addClass('value');
	display1.append(value1);
	var b = $('<div />').attr('id', 'valccy1');
	b.addClass(ccy1 + ' valccy');
	b.html(ccy1);
	display1.append(b);

	var display2 = $('<div />').attr('id', 'display2');
	display2.addClass('display display2');

	var value2 = $('<div />').attr('id', 'value2');
	value2.addClass('value');
	display2.append(value2);
	var b2 = $('<div />').attr('id', 'valccy2');
	b2.addClass(ccy2 + ' valccy');
	b2.html(ccy2);
	display2.append(b2);

	var rate = $('<div />').attr('id', 'rate');
	rate.addClass('display rate');
	var ratev = $('<div />').attr('id', 'rateval');
	ratev.addClass('value');
	rate.append(ratev);

	displays.append(display1);
	displays.append(display2);
	displays.append(rate);

	$('#calc').append(displays);

	var digbuts = $('<div />').attr('id', 'digbuts1');
	digbuts.addClass('digbuts digbuts1 ccy1');

	for (i = 0; i < 10; i++) {
		digbuts = addBut(digbuts, 'db' + i, i, 'dig ccy1');
		if (i == 6)
			digbuts = addBR(digbuts);
	}
	digbuts = addSP(digbuts);
	digbuts = addBut(digbuts, 'dbdp', '.', 'dig ccy1');
	digbuts = addSP(digbuts);
	digbuts = addBut(digbuts, 'dbbs', '&nbsp;&nbsp;', 'dig ccy1 backspace');
	digbuts = addSP(digbuts);
	digbuts = addBut(digbuts, 'dbc', 'C', 'dig ccy1');
	$('#calc').append(digbuts);

	var digbuts2 = $('<div />').attr('id', 'digbuts2');
	digbuts2.addClass('digbuts digbuts2 ccy2');

	for (i = 0; i < 10; i++) {
		digbuts2 = addBut(digbuts2, 'db2' + i, i, 'dig ccy2');
		if (i == 6)
			digbuts2 = addBR(digbuts2);
	}
	digbuts2 = addSP(digbuts2);
	digbuts2 = addBut(digbuts2, 'db2dp', '.', 'dig ccy2');
	digbuts2 = addSP(digbuts2);
	digbuts2 = addBut(digbuts2, 'db2bs', '&nbsp;&nbsp;', 'dig ccy2 backspace');
	digbuts2 = addSP(digbuts2);
	digbuts2 = addBut(digbuts2, 'db2c', 'C', 'dig ccy2');
	$('#calc').append(digbuts2);

	var ratebuts = $('<div />').attr('id', 'ratebuts');
	ratebuts.addClass('ratebuts');
	ratebuts = addBut(ratebuts, 'rbmid', 'Interbank Rates',
			'ratebut ratebutsel', 'Interbank/Mid Market Rates');
	ratebuts = addBR(ratebuts);
	ratebuts = addBut(ratebuts, 'rbcred', 'Credit Card Rates', 'ratebut', 'Typical Credit Card Rates +/-2%');
	ratebuts = addBR(ratebuts);
	ratebuts = addBut(ratebuts, 'rbcash', 'Cash Rates', 'ratebut', 'Typical Cash Rates +/-4%');
	ratebuts = addBR(ratebuts);
	ratebuts = addBR(ratebuts);
	ratebuts = addBut(ratebuts, 'chartbut', 'Chart', 'chartbut hidden', 'Real-time candlestick chart');
	$('#calc').append(ratebuts);

	var ccybuts1 = $('<div />').attr('id', 'ccybuts1');
	ccybuts1.addClass('ccybuts ccybuts1 ccy1');

ccybuts1 = addBR(ccybuts1);

	var c = 0;
	for ( var i = 0; i < ccys.values.length; i++) {

		if (!(ccys.values[i].code == "AUD" ||
			 ccys.values[i].code == "CAD" || 
			 ccys.values[i].code == "CHF" || 
			 ccys.values[i].code == "CNY" || 
			 ccys.values[i].code == "BRL" || 
			 ccys.values[i].code == "CLP" || 
			 ccys.values[i].code == "CZK" || 
			 ccys.values[i].code == "DKK" || 
			 ccys.values[i].code == "EGP" || 
			 ccys.values[i].code == "EUR" || 
			 ccys.values[i].code == "GBP" || 
			 ccys.values[i].code == "HKD" || 
			 ccys.values[i].code == "ILS" || 
			 ccys.values[i].code == "HUF" || 
			 ccys.values[i].code == "IDR" || 
			 ccys.values[i].code == "JPY" || 
			 ccys.values[i].code == "NZD" || 
			 ccys.values[i].code == "USD" || 
			 ccys.values[i].code == "TRY" || 
			 ccys.values[i].code == "SEK" || 
			 ccys.values[i].code == "TWD" || 
			 ccys.values[i].code == "RUB" || 
			 ccys.values[i].code == "VND" || 
			 ccys.values[i].code == "NOK"  
			)) continue;


		if (c && c % 6 == 0)
			ccybuts1 = addBR(ccybuts1);
		c++;
		var cl = "ccy ccy1 flag " + ccys.values[i].code;
		if (ccy1 == ccys.values[i].code)
			cl += " ccy1sel";
		else
			cl += " ccynotsel";

		ccybuts1 = addBut(ccybuts1, 'cb1' + ccys.values[i].code,
				ccys.values[i].code, cl, "From Currency");

	}

	$('#calc').append(ccybuts1);

	var ccybuts2 = $('<div />').attr('id', 'ccybuts2');
	ccybuts2.addClass('ccybuts ccybuts2 ccy2');

ccybuts2 = addBR(ccybuts2);
	c = 0;
	for ( var i = 0; i < ccys.values.length; i++) {
     if (!(ccys.values[i].code == "AUD" || 
                         ccys.values[i].code == "CAD" ||
                         ccys.values[i].code == "CHF" ||
                         ccys.values[i].code == "CNY" ||
                         ccys.values[i].code == "BRL" ||
                         ccys.values[i].code == "CLP" ||
                         ccys.values[i].code == "CZK" ||
                         ccys.values[i].code == "DKK" ||
                         ccys.values[i].code == "EGP" ||
                         ccys.values[i].code == "EUR" ||
                         ccys.values[i].code == "GBP" ||
                         ccys.values[i].code == "HKD" ||
                         ccys.values[i].code == "ILS" ||
                         ccys.values[i].code == "HUF" ||
                         ccys.values[i].code == "IDR" ||
                         ccys.values[i].code == "JPY" || 
                         ccys.values[i].code == "NZD" ||
                         ccys.values[i].code == "USD" ||
                         ccys.values[i].code == "TRY" ||
                         ccys.values[i].code == "SEK" ||
                         ccys.values[i].code == "TWD" ||
                         ccys.values[i].code == "RUB" ||
                         ccys.values[i].code == "VND" ||
                         ccys.values[i].code == "NOK"   
                        )) continue;


		if (c && c % 6 == 0)
			ccybuts2 = addBR(ccybuts2);
		c++;
		var cl = "ccy ccy2 " + ccys.values[i].code;
		if (ccy2 == ccys.values[i].code)
			cl += " ccy2sel";
		else
			cl += " ccynotsel";
		ccybuts2 = addBut(ccybuts2, 'cb2' + ccys.values[i].code,
				ccys.values[i].code, cl, "To Currency");

	}

	$('#calc').append(ccybuts2);

	$('#value1').html("100.0");
	$('#value2').html("0.0");
	$('#rate').html("&nbsp;");
	$('#loading').remove();
	setRate();
	calc(2);
}


function setupRates() {

	makeRates();
	$('#ratetime').html( "FX rates updated " + getRateTime () + " GMT");
	$("#rates").fadeIn('slow');
	$('.cell').hover( function() {
		$(this).addClass('cellhover shadow');
	}, function() {
		$(this).removeClass('cellhover shadow');
	});
	$("a").tooltip({
		track: true,
		delay: 0,
		showURL: false,
		showBody: " - ",
		fade: 150  });

}
var ignoreKeys = false;
function keydown(e)
{
	if (ignoreKeys) return;
	var keynum;
	if(window.event) // IE
	{
		keynum = e.keyCode
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which
	}
	// alert(keynum);
	if (keynum >=48 && keynum <= 57) {
		var s = "";
		if (calcside == 1) s = "2";
		ignoreKeys=true;
		var num = keynum-48;butclick('db'+s+num,num); 
	} else if (keynum >=96 && keynum <= 105) {
		var s = "";
		if (calcside == 1) s = "2";
		ignoreKeys=true;
		var num = keynum-96;butclick('db'+s+num,num); 
	} 
	else if (keynum == 8 || keynum == 13 || keynum == 46 ) {
		var s = "";
		if (calcside == 1) s = "2";
		ignoreKeys=true;
		butclick('db'+s+'bs','&nbsp;&nbsp;');
	} else if (keynum == 9) {
		if (calcside == 1) setCalcSide(2); else setCalcSide(1);
		ignoreKeys=true;
		//	setTimeout( ignoreKeys=false, 600);
	} else if (keynum == 190 || keynum == 110) {
		var s = "";
		if (calcside == 1) s = "2";
		ignoreKeys=true;
		butclick('db'+s+'dp','.');
	} 
	return false;
}
function keyup(e)
{
	var keynum
	if(window.event) // IE
	{
		keynum = e.keyCode
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which
	}
	ignoreKeys=false;
}

function changeTitle() {
	var changemetaflag=false;
	qs();
	if (qsParm["ccy1"] != null) {changemetaflag=true; ccy1 = qsParm["ccy1"];}
	if (qsParm["ccy2"] != null) {changemetaflag=true;ccy2 = qsParm["ccy2"];}
	if (changemetaflag) document.title = ccy1+" to "+ccy2+" : " + document.title;
	else getCO(); //no ccy params so get country
}

var ccys ={values:[]}


function setupCalc() {

//    var url = "https://bestexchangerates.net/stash/ccys";

	var url="https://bestexchangerates.com/midrates.php";

	// {"midarray": [ {"id":"AED","u":"1","r":"3.6725","ts":"1761523201"},{"id":"AFN","u":"1","r":"66.268842","ts":"1761523201"},{"id":"ALL","u":"1","r":"83.087551","ts":"1761523201"},{"id":"AMD","u":"1","r":"381.962672","ts":"1761523201"},{"id":"ANG","u":"1","r":"1.79","ts":"1761523201"},{"id":"AOA","u":"1","r":"915.326","ts":"1761523201"},{"id":"ARS","u":"1","r":"1480.717328","ts":"1761523201"},{"id":"AUD","u":"","r":"0.65334496287367","ts":"1761523201"},{"id":"AWG","u":"1","r":"1.8","ts":"1761523201"},{"id":"AZN","u":"1","r":"1.7","ts":"1761523201"},{"id":"BAM","u":"1","r":"1.681707","ts":"1761523201"},{"id":"BBD","u":"1","r":"2","ts":"1761523201"},{"id":"BDT","u":"1","r":"122.348965","ts":"1761523201"},{"id":"BGN","u":"1","r":"1.682192","ts":"1761523201"},{"id":"BHD","u":"1","r":"0.37637","ts":"1761523201"},{"id":"BIF","u":"1","r":"2944.053581","ts":"1761523201"},{"id":"BMD","u":"1","r":"1","ts":"1761523201"},{"id":"BND","u":"1","r":"1.297948","ts":"1761523201"},{"id":"BOB","u":"1","r":"6.899754","ts":"1761523201"},{"id":"BRL","u":"1","r":"5.389276","ts":"1761523201"},{"id":"BSD","u":"1","r":"1","ts":"1761523201"},{"id":"BTC","u":"","r":"114510.4688906","ts":"1761523201"},{"id":"BTN","u":"1","r":"87.617735","ts":"1761523201"},{"id":"BWP","u":"1","r":"14.256356","ts":"1761523201"},{"id":"BYR","u":"1","r":"","ts":""},{"id":"BZD","u":"1","r":"2.008263","ts":"1761523201"},{"id":"CAD","u":"1","r":"1.399412","ts":"1761523201"},{"id":"CDF","u":"1","r":"2291.677004","ts":"1761523201"},{"id":"CHF","u":"1","r":"0.796105","ts":"1761523201"},{"id":"CLP","u":"1","r":"942.99177","ts":"1761523201"},{"id":"CNY","u":"1","r":"7.12156","ts":"1761523201"},{"id":"COP","u":"1","r":"3881.032845","ts":"1761523201"},{"id":"CUP","u":"1","r":"25.75","ts":"1761523201"},{"id":"CVE","u":"1","r":"94.815742","ts":"1761523201"},{"id":"CZK","u":"1","r":"20.89925","ts":"1761523201"},{"id":"DJF","u":"1","r":"177.816774","ts":"1761523201"},{"id":"DKK","u":"1","r":"6.42176","ts":"1761523201"},{"id":"DOP","u":"1","r":"63.973042","ts":"1761523201"},{"id":"DZD","u":"1","r":"130.147893","ts":"1761523201"},{"id":"EGP","u":"1","r":"47.492251","ts":"1761523201"},{"id":"ETB","u":"1","r":"152.851765","ts":"1761523201"},{"id":"ETH","u":"1","r":"0.0002405717","ts":"1761523201"},{"id":"EUR","u":"","r":"1.1631220522125","ts":"1761523201"},{"id":"FJD","u":"1","r":"2.2718","ts":"1761523201"},{"id":"FKP","u":"1","r":"0.750652","ts":"1761523201"},{"id":"GBP","u":"","r":"1.3321752290009","ts":"1761523201"},{"id":"GEL","u":"1","r":"2.715","ts":"1761523201"},{"id":"GHS","u":"1","r":"10.784735","ts":"1761523201"},{"id":"GIP","u":"1","r":"0.750652","ts":"1761523201"},{"id":"GMD","u":"1","r":"73.250001","ts":"1761523201"},{"id":"GNF","u":"1","r":"8667.324802","ts":"1761523201"},{"id":"GTQ","u":"1","r":"7.648718","ts":"1761523201"},{"id":"GYD","u":"1","r":"208.918705","ts":"1761523201"},{"id":"HKD","u":"1","r":"7.769665","ts":"1761523201"},{"id":"HNL","u":"1","r":"26.240123","ts":"1761523201"},{"id":"HRK","u":"1","r":"6.478358","ts":"1761523201"},{"id":"HTG","u":"1","r":"130.757777","ts":"1761523201"},{"id":"HUF","u":"1","r":"335.165","ts":"1761523201"},{"id":"IDR","u":"1","r":"16614.383403","ts":"1761523201"},{"id":"ILS","u":"1","r":"3.28496","ts":"1761523201"},{"id":"INR","u":"1","r":"87.8365","ts":"1761523201"},{"id":"IQD","u":"1","r":"1308.089723","ts":"1761523201"},{"id":"IRR","u":"1","r":"42075","ts":"1761523201"},{"id":"ISK","u":"1","r":"122.443022","ts":"1761523201"},{"id":"JMD","u":"1","r":"160.121039","ts":"1761523201"},{"id":"JOD","u":"1","r":"0.709","ts":"1761523201"},{"id":"JPY","u":"1","r":"153.074","ts":"1761523201"},{"id":"KES","u":"1","r":"128.806462","ts":"1761523201"},{"id":"KGS","u":"1","r":"87.45","ts":"1761523201"},{"id":"KHR","u":"1","r":"4022.365929","ts":"1761523201"},{"id":"KMF","u":"1","r":"423.999883","ts":"1761523201"},{"id":"KPW","u":"1","r":"900","ts":"1761523201"},{"id":"KRW","u":"1","r":"1438.97","ts":"1761523201"},{"id":"KWD","u":"1","r":"0.306549","ts":"1761523201"},{"id":"KYD","u":"1","r":"0.832162","ts":"1761523201"},{"id":"KZT","u":"1","r":"537.654475","ts":"1761523201"},{"id":"LAK","u":"1","r":"21682.138587","ts":"1761523201"},{"id":"LBP","u":"1","r":"89411.999299","ts":"1761523201"},{"id":"LKR","u":"1","r":"303.251406","ts":"1761523201"},{"id":"LRD","u":"1","r":"182.735095","ts":"1761523201"},{"id":"LSL","u":"1","r":"17.32759","ts":"1761523201"},{"id":"LTL","u":"1","r":"","ts":""},{"id":"LVL","u":"1","r":"","ts":""},{"id":"LYD","u":"1","r":"5.430829","ts":"1761523201"},{"id":"MAD","u":"1","r":"9.216125","ts":"1761523201"},{"id":"MDL","u":"1","r":"17.094657","ts":"1761523201"},{"id":"MGA","u":"1","r":"4512.521927","ts":"1761523201"},{"id":"MKD","u":"1","r":"52.987212","ts":"1761523201"},{"id":"MMK","u":"1","r":"2098.8","ts":"1761523201"},{"id":"MNT","u":"1","r":"3596.8","ts":"1761523201"},{"id":"MOP","u":"1","r":"7.991676","ts":"1761523201"},{"id":"MRO","u":"1","r":"356.999828","ts":"1640174940"},{"id":"MUR","u":"1","r":"45.519999","ts":"1761523201"},{"id":"MVR","u":"1","r":"15.3","ts":"1761523201"},{"id":"MWK","u":"1","r":"1731.486934","ts":"1761523201"},{"id":"MXN","u":"1","r":"18.423105","ts":"1761523201"},{"id":"MYR","u":"1","r":"4.224","ts":"1761523201"},{"id":"MZN","u":"1","r":"63.899993","ts":"1761523201"},{"id":"NAD","u":"1","r":"17.32759","ts":"1761523201"},{"id":"NGN","u":"1","r":"1458.400899","ts":"1761523201"},{"id":"NOK","u":"1","r":"9.996615","ts":"1761523201"},{"id":"NPR","u":"1","r":"140.188658","ts":"1761523201"},{"id":"NZD","u":"","r":"0.57593501610026","ts":"1761523201"},{"id":"OMR","u":"1","r":"0.383995","ts":"1761523201"},{"id":"PAB","u":"1","r":"1","ts":"1761523201"},{"id":"PEN","u":"1","r":"3.390586","ts":"1761523201"},{"id":"PGK","u":"1","r":"4.264869","ts":"1761523201"},{"id":"PHP","u":"1","r":"58.726003","ts":"1761523201"},{"id":"PKR","u":"1","r":"282.885324","ts":"1761523201"},{"id":"PLN","u":"1","r":"3.646685","ts":"1761523201"},{"id":"PYG","u":"1","r":"7065.395464","ts":"1761523201"},{"id":"QAR","u":"1","r":"3.649801","ts":"1761523201"},{"id":"RON","u":"1","r":"4.3747","ts":"1761523201"},{"id":"RSD","u":"1","r":"100.818167","ts":"1761523201"},{"id":"RUB","u":"1","r":"80.685381","ts":"1761523201"},{"id":"RWF","u":"1","r":"1449.883662","ts":"1761523201"},{"id":"SAR","u":"1","r":"3.7498","ts":"1761523201"},{"id":"SBD","u":"1","r":"8.244425","ts":"1761523201"},{"id":"SCR","u":"1","r":"13.86177","ts":"1761523201"},{"id":"SDG","u":"1","r":"601.5","ts":"1761523201"},{"id":"SEK","u":"1","r":"9.385445","ts":"1761523201"},{"id":"SGD","u":"1","r":"1.298155","ts":"1761523201"},{"id":"SHP","u":"1","r":"0.750652","ts":"1761523201"},{"id":"SLL","u":"1","r":"20969.5","ts":"1761523201"},{"id":"SOS","u":"1","r":"570.681384","ts":"1761523201"},{"id":"SRD","u":"1","r":"39.733","ts":"1761523201"},{"id":"SYP","u":"1","r":"13002","ts":"1761523201"},{"id":"SZL","u":"1","r":"17.325171","ts":"1761523201"},{"id":"THB","u":"1","r":"32.635814","ts":"1761523201"},{"id":"TJS","u":"1","r":"9.311304","ts":"1761523201"},{"id":"TMT","u":"1","r":"3.51","ts":"1761523201"},{"id":"TND","u":"1","r":"2.934631","ts":"1761523201"},{"id":"TOP","u":"1","r":"2.407759","ts":"1761523201"},{"id":"TRY","u":"1","r":"42.017855","ts":"1761523201"},{"id":"TTD","u":"1","r":"6.778189","ts":"1761523201"},{"id":"TWD","u":"1","r":"30.84865","ts":"1761523201"},{"id":"TZS","u":"1","r":"2471.398491","ts":"1761523201"},{"id":"UAH","u":"1","r":"41.993485","ts":"1761523201"},{"id":"UGX","u":"1","r":"3474.78903","ts":"1761523201"},{"id":"USD","u":"","r":"1","ts":"1761523201"},{"id":"UYU","u":"1","r":"39.870748","ts":"1761523201"},{"id":"UZS","u":"1","r":"12111.84018","ts":"1761523201"},{"id":"VEF","u":"1","r":"248487.642241","ts":"1609787160"},{"id":"VND","u":"1","r":"26305.428059","ts":"1761523201"},{"id":"VUV","u":"1","r":"122.1","ts":"1761523201"},{"id":"WST","u":"1","r":"2.801","ts":"1761523201"},{"id":"XAF","u":"1","r":"563.962024","ts":"1761523201"},{"id":"XAG","u":"","r":"48.162689712835","ts":"1761523201"},{"id":"XAU","u":"","r":"4064.7101861637","ts":"1761523201"},{"id":"XCD","u":"1","r":"2.70255","ts":"1761523201"},{"id":"XDR","u":"1","r":"0.701468","ts":"1761523201"},{"id":"XOF","u":"1","r":"563.962024","ts":"1761523201"},{"id":"XPF","u":"1","r":"102.59601","ts":"1761523201"},{"id":"XPD","u":"1","r":"0.00069348","ts":"1761523201"},{"id":"XPT","u":"1","r":"0.00063616","ts":"1761523201"},{"id":"XRP","u":"1","r":"0.37784327","ts":"1761523201"},{"id":"YER","u":"1","r":"238.900102","ts":"1761523201"},{"id":"ZAR","u":"1","r":"17.209685","ts":"1761523201"},{"id":"ZMW","u":"1","r":"22.042227","ts":"1761523201"},{"id":"ZWL","u":"1","r":"322","ts":"1761523201"},{"id":"LTC","u":"1","r":"0.0100010001","ts":"1761523201"},{"id":"OIL","u":"","r":"66.349999999998","ts":"1761523020"} ]}

    $.ajax({
        url: url,
        crossDomain:true,
        dataType: "json",

        success: function(data,text,xhqr){

            for (var r in data.midarray) {

                var r2 = {};
                r2.code = data.midarray[r].id;

                r2.rate = data.midarray[r].r;
//                r2.name = data.midarray[r].name;
                r2.time = data.midarray[r].ts;

                ccys.values.push(r2);
            }

 $('#ratetime').html( "Currency rates updated " + getRateTime () + " GMT");
      setRate();

            makeCalc();
        }
    });


//	$('#ratetime').html( "Currency rates updated " + getRateTime () + " GMT");
//	setRate();
	$('.ccy1 div').hover( function() {
		$(this).addClass('ccy1hover');
	}, function() {
		$(this).removeClass('ccy1hover');
	});
	$('.ratebut').hover( function() {
		$(this).addClass('ccy1hover');
	}, function() {
		$(this).removeClass('ccy1hover');
	});
	$('.ccy2 div').hover( function() {
		$(this).addClass('ccy2hover');
	}, function() {
		$(this).removeClass('ccy2hover');
	});

	$('.butdiv').mousedown( function() {
		$(this).addClass('butpress');
	});
	$('.butdiv').mouseup( function() {
		$(this).removeClass('butpress');
	});
	window.onkeydown = keydown;
	window.onkeyup = keyup;

	$('#display1').click( function() { setCalcSide(2); });
	$('#display2').click( function() { setCalcSide(1); });
//	$("#calc").fadeIn('slow');
	$('#equals').fadeIn();
	$('#at').fadeIn();
//	$("a").tooltip({ 
//		track: true, 
//		delay: 0, 
//		showURL: false, 
//		showBody: " - ", 
//		fade: 150  });
	setCalcSide(2);
	$("#display1").focus(); // needed by ie for keyboard input
showChartBut();

}

// Resolve country code from browser locale only
function guessCountryFromLocale() {
    try {
        var locales = [];
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions) {
            var loc = Intl.DateTimeFormat().resolvedOptions().locale;
            if (loc) locales.push(loc);
        }
        if (typeof navigator !== 'undefined') {
            if (Array.isArray(navigator.languages)) locales = locales.concat(navigator.languages);
            if (navigator.language) locales.push(navigator.language);
            if (navigator.userLanguage) locales.push(navigator.userLanguage);
        }
        for (var i = 0; i < locales.length; i++) {
            var l = (locales[i] || '').toString();
            var m = l.match(/[-_]([A-Za-z]{2})\b/);
            if (m && m[1]) return m[1].toUpperCase();
        }
    } catch (e) { /* ignore */ }
    return null;
}

var geoco = guessCountryFromLocale();

function getCO() {
	//alert(geoco);


	if (geoco == "AU") ccy1 = "AUD";
	else if (geoco == "NZ") ccy1 = "NZD";
	else if (geoco == "HK") ccy1 = "HKD";
	else if (geoco == "GB") ccy1 = "GBP";
	else if (geoco == "FR"  || geoco == "ES" ||geoco == "DE"
		|| geoco == "IT" ||geoco == "PT" ||geoco == "GR"
			|| geoco == "NL" ||geoco == "IE" ||geoco == "AT"
				||geoco == "CY"||geoco == "GR"||geoco == "IE"
					||geoco == "MT"||geoco == "SK"||geoco == "SI"
						|| geoco == "BE" ||geoco == "FI" ||geoco == "LU" )
		ccy1= "EUR"; 
	else if (geoco == "US") {ccy1 = "USD";ccy2="EUR"}
	else if (geoco == "JP") ccy1 = "JPY";
	else if (geoco == "IN") ccy1 = "INR";
	else if (geoco == "SG") ccy1 = "SGD";
	else if (geoco == "CA") ccy1 = "CAD";
	else if (geoco == "NO") ccy1 = "NOK";
	else if (geoco == "DK") ccy1 = "DKK";
	else if (geoco == "SE") ccy1 = "SEK";
	else if (geoco == "ID") ccy1 = "IDR";
	else if (geoco == "PL") ccy1 = "PLN";
	else if (geoco == "PL") ccy1 = "CHF";
	else if (geoco == "CN") ccy1 = "CNY";
	else if (geoco == "KW") ccy1 = "KWD";
	else if (geoco == "MY") ccy1 = "MYR";
	else if (geoco == "PH") ccy1 = "PHP";
	else if (geoco == "AE") ccy1 = "AED";
	else if (geoco == "TW") ccy1 = "TWD";
	else if (geoco == "QA") ccy1 = "QAR";
	else if (geoco == "PK") ccy1 = "PKR";
	else if (geoco == "ZA") ccy1 = "ZAR";
	else if (geoco == "BH") ccy1 = "BHD";
	else if (geoco == "PG") ccy1 = "PGK";
	else if (geoco == "MO") ccy1 = "MOP";
	else if (geoco == "FJ") ccy1 = "FJD";
	else if (geoco == "SA") ccy1 = "SAR";
	else if (geoco == "OM") ccy1 = "OMR";
	else if (geoco == "RU") ccy1 = "RUB";
	else if (geoco == "TH") ccy1 = "THB";
	else if (geoco == "CZ") ccy1 = "CZK";
	else if (geoco == "BR") ccy1 = "BRL";
	else if (geoco == "TR") ccy1 = "TRY";
	else if (geoco == "KE") ccy1 = "KES";
	else if (geoco == "EG") ccy1 = "EGP";
	else if (geoco == "LK") ccy1 = "LKR";
	else if (geoco == "BD") ccy1 = "BDT";
	else if (geoco == "NG") ccy1 = "NGN";
	else if (geoco == "UA") ccy1 = "UAH";
}
function chbut(b,val) {
	b.attr("rel", val);
	b.html(val + " Chart");
}
function showChartBut() {
	//return; // until charts fixed
		yellowFade($("#chartbut"));
	var ccypair = ccy1+ccy2;
	if (ccypair == "AUDUSD" || ccypair == "USDAUD")
		{var b = $("#chartbut");chbut(b,"AUD/USD");b.css("visibility", "visible"); 
		}
	else if (ccypair == "NZDUSD" || ccypair == "USDNZD")
		{var b = $("#chartbut");chbut(b,"NZD/USD");b.css("visibility", "visible");}
	else if (ccypair == "EURUSD" || ccypair == "USDEUR")
		{var b = $("#chartbut");chbut(b,"EUR/USD");b.css("visibility", "visible");}
	else if (ccypair == "AUDNZD" || ccypair == "NZDAUD")
		{var b = $("#chartbut");chbut(b,"AUD/NZD");b.css("visibility", "visible");}
	else if (ccypair == "USDJPY" || ccypair == "JPYUSD")
		{var b = $("#chartbut");chbut(b,"USD/JPY");b.css("visibility", "visible");}
	else if (ccypair == "GBPUSD" || ccypair == "USDGBP")
		{var b = $("#chartbut");chbut(b,"GBP/USD");b.css("visibility", "visible");}
	else if (ccypair == "CHFUSD" || ccypair == "USDCHF")
		{var b = $("#chartbut");chbut(b,"USD/CHF");b.css("visibility", "visible");}
	else if (ccypair == "EURCHF" || ccypair == "CHFEUR")
		{var b = $("#chartbut");chbut(b,"EUR/CHF");b.css("visibility", "visible");}
	else if (ccypair == "USDCAD" || ccypair == "CADUSD")
		{var b = $("#chartbut");chbut(b,"USD/CAD");b.css("visibility", "visible");}
	else if (ccypair == "EURGBP" || ccypair == "GBPEUR")
		{var b = $("#chartbut");chbut(b,"EUR/GBP");b.css("visibility", "visible");}
	else if (ccypair == "EURJPY" || ccypair == "JPYEUR")
		{var b = $("#chartbut");chbut(b,"EUR/JPY");b.css("visibility", "visible");}
	else if (ccypair == "GBPJPY" || ccypair == "JPYGBP")
		{var b = $("#chartbut");chbut(b,"GBP/JPY");b.css("visibility", "visible");}
	else if (ccypair == "EURCAD" || ccypair == "CADEUR")
		{var b = $("#chartbut");chbut(b,"EUR/CAD");b.css("visibility", "visible");}
	else if (ccypair == "EURAUD" || ccypair == "AUDEUR")
		{var b = $("#chartbut");chbut(b,"EUR/AUD");b.css("visibility", "visible");}
	else if (ccypair == "GBPCHF" || ccypair == "CHFGBP")
		{var b = $("#chartbut");chbut(b,"GBP/CHF");b.css("visibility", "visible");}
	else if (ccypair == "CHFJPY" || ccypair == "JPYCHF")
		{var b = $("#chartbut");chbut(b,"CHF/JPY");b.css("visibility", "visible");}
	else if (ccypair == "AUDCAD" || ccypair == "CADAUD")
		{var b = $("#chartbut");chbut(b,"AUD/CAD");b.css("visibility", "visible");}
	else if (ccypair == "AUDJPY" || ccypair == "JPYAUD")
		{var b = $("#chartbut");chbut(b,"AUD/JPY");b.css("visibility", "visible");}
	else if (ccypair == "NZDJPY" || ccypair == "JPYNZD")
		{var b = $("#chartbut");chbut(b,"NZD/JPY");b.css("visibility", "visible");}
	else if (ccypair == "CADJPY" || ccypair == "JPYCAD")
		{var b = $("#chartbut");chbut(b,"CAD/JPY");b.css("visibility", "visible");}
	else if (ccypair == "GBPAUD" || ccypair == "AUDGBP")
		{var b = $("#chartbut");chbut(b,"GBP/AUD");b.css("visibility", "visible");}
	else if (ccypair == "GBPAUD" || ccypair == "AUDGBP")
		{var b = $("#chartbut");chbut(b,"GBP/AUD");b.css("visibility", "visible");}
	else if (ccypair == "USDHKD" || ccypair == "HKDUSD")
		{var b = $("#chartbut");chbut(b,"USD/HKD");b.css("visibility", "visible");}
	else if (ccypair == "USDSGD" || ccypair == "SGDUSD")
		{var b = $("#chartbut");chbut(b,"USD/SGD");b.css("visibility", "visible");}
	else if (ccypair == "USDZAR" || ccypair == "ZARUSD")
		{var b = $("#chartbut");chbut(b,"USD/ZAR");b.css("visibility", "visible");}
	else if (ccypair == "ZARJPY" || ccypair == "JPYZAR")
		{var b = $("#chartbut");chbut(b,"ZAR/JPY");b.css("visibility", "visible");}
	else if (ccypair == "USDMXN" || ccypair == "MXNUSD")
		{var b = $("#chartbut");chbut(b,"USD/MXN");b.css("visibility", "visible");}
	else 	$("#chartbut").css("visibility", "hidden");
}
