/*
 * CurrencyConverter.biz
 * http://currencyconverter.biz
 *
 * @author   David Brown
 * @website  http://www.digibrown.com
 *
 */

ccbiz = {};
var ccy1 = "EUR";
var ccy2 = "USD";
var type = "mid"
var calcside = 2;

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
	but.addClass('butdiv ' + cl);
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
	if (ccy1 != ccy2)
		_gaq.push(['_trackEvent','selCcy',ccy1+ccy2,newccy]);
}
function getCrossRate(ccypair) {
        var s1 = ccypair.substring(0,3);
        var s2 = ccypair.substring(3,6);
	var r1 = getRate(s1);
	var r2 = getRate(s2);
//alert(s1+" "+r1 + " " +s2 + " " + r2);
	var mult = 1.0;
	
   if (isNaN(r1) || isNaN(r2) ) { return "N/A";}
	if (s1 == s2)
		mult = 1.0;

	var result = roundNumber(r1 / r2 * mult, 4);
	return result;
}
function setRate() {
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
	if (ccys.values.length > 0) t = ccys.values[0].time;
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
function butclick(id, val) {

	if ($('#' + id).hasClass("dig")) {
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
	} else if ($('#' + id).hasClass("ratebut")) {
		$(".ratebut").removeClass("ratebutsel");
		// rate button pressed
		if (id == "rbmid") {
			$("#rbmid").addClass("ratebutsel");
			type = "mid";
			setRate();
			calc(calcside);
			_gaq.push(['_trackEvent','setRate',type]);
		} else if (id == "rbcred") {
			$("#rbcred").addClass("ratebutsel");
			type = "cred";
			setRate();
			calc(calcside);
			_gaq.push(['_trackEvent','setRate',type]);
		} else if (id == "rbcash") {
			$("#rbcash").addClass("ratebutsel");
			type = "cash";
			setRate();
			calc(calcside);
			_gaq.push(['_trackEvent','setRate',type]);
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
	var overlay = $('<img class="overlay" width="725px" height="450px" src="metalOverlay.png"></img>');
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

	var overlay = $('<img class="overlay" width="725px" height="450px" src="metalOverlay.png"></img>');
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
	$('#calc').append(ratebuts);

	var ccybuts1 = $('<div />').attr('id', 'ccybuts1');
	ccybuts1.addClass('ccybuts ccybuts1 ccy1');

 var c = 0;
	for ( var i = 0; i < ccys.values.length; i++) {
              if (ccys.values[i].code == "KRW" || ccys.values[i].code == "VND") continue;
		if (c && c % 6 == 0)
			ccybuts1 = addBR(ccybuts1);
		c++;
		var cl = "ccy ccy1 " + ccys.values[i].code;
		if (ccy1 == ccys.values[i].code)
			cl += " ccy1sel";
		else
			cl += " ccynotsel";
		ccybuts1 = addBut(ccybuts1, 'cb1' + ccys.values[i].code,
				ccys.values[i].code, cl, "From "+ccys.values[i].name);

	}

	$('#calc').append(ccybuts1);

	var ccybuts2 = $('<div />').attr('id', 'ccybuts2');
	ccybuts2.addClass('ccybuts ccybuts2 ccy2');

	 c = 0;
	for ( var i = 0; i < ccys.values.length; i++) {
              if (ccys.values[i].code == "KRW" || ccys.values[i].code == "VND") continue;
		if (c && c % 6 == 0)
			ccybuts2 = addBR(ccybuts2);
		c++;
		var cl = "ccy ccy2 " + ccys.values[i].code;
		if (ccy2 == ccys.values[i].code)
			cl += " ccy2sel";
		else
			cl += " ccynotsel";
		ccybuts2 = addBut(ccybuts2, 'cb2' + ccys.values[i].code,
				ccys.values[i].code, cl, "To "+ccys.values[i].name);

	}

	$('#calc').append(ccybuts2);

	$('#value1').html("0.0");
	$('#value2').html("0.0");
	$('#rate').html("&nbsp;");
	$('#loading').remove();
	setRate();
	 //calc(2);
}


function setupRates() {

	makeRates();
	$('#ratetime').html( "Currency rates updated " + getRateTime () + " GMT");
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
//alert(keynum);
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
             else if (keynum == 8 || keynum == 13 || keynum == 46 || keynum ==110) {
		var s = "";
		if (calcside == 1) s = "2";
		ignoreKeys=true;
		butclick('db'+s+'bs','&nbsp;&nbsp;');
	} else if (keynum == 9) {
		if (calcside == 1) setCalcSide(2); else setCalcSide(1);
		ignoreKeys=true;
	//	setTimeout( ignoreKeys=false, 600);
	} else if (keynum == 190) {
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
		if (changemetaflag) document.title = ccy1+" to "+ccy2+" : CurrencyConvert.biz :: Quick and Easy Currency Converter";
		else getCO(); //no ccy params so get country
}

function setupCalc() {

		makeCalc();
	$('#ratetime').html( "Currency rates updated " + getRateTime () + " GMT");
		setRate();
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
//		$("#calc").fadeIn('slow');
	$('#equals').fadeIn();
	$('#at').fadeIn();
		$("a").tooltip({ 
		    track: true, 
		    delay: 0, 
		    showURL: false, 
		    showBody: " - ", 
		    fade: 150  });
	setCalcSide(2);
$("#display1").focus(); // needed by ie for keyboard input

}
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
}
