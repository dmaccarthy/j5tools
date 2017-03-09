/*

Copyright 2017 D.G. MacCarthy <http://dmaccarthy.github.io/ccLatex>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/


/*** Parse query strings ***/

function qsAll(qs) {
// Parse a query string (keep all occurrences of each key)
	var obj = {}
	qs = (qs ? qs : location.search.slice(1)).split("&");
	qs.forEach(function(v, i, a) {
		v = v.split("=");
		var key = decodeURIComponent(v[0].trim());
		if (!obj[key]) obj[key] = [];
		obj[key].push(v.length > 1 ? decodeURIComponent(v[1].trim()) : null);
	})
	return obj;
}

function qsFirst(qs) {
// Parse a query string (keep first occurrence of each key)
	var k, obj = qsAll(qs);
	for (k in obj) obj[k] = obj[k][0];
	return obj;
}


/*** LaTeX operations using codecogs.com ***/

function latex(elem, rerender) {
/* Replace latex code by a rendered image
	elem = an element or sequence of elements to render, defaults to $(".latex")
	rerender = if true, replace previously rendered iamges by rerendering
*/
	elem = latex._elem(elem);
	for (var i=0;i<elem.length;i++) {
		var e = $(elem[i]);
		var img = e.find("img");
		if (rerender || img.length == 0) {
			var lx;
			var sz = "\\dpi{" + latex._dpi(e) + "}";
			var html = img.length ? img.attr("alt") : e.html();
			var color = e.attr("data-color");
			if (color) {
				color = color.trim();
				if (color.charAt(0) == "{") color = "[RGB]" + color;
				else color = "{" + color + "}";
				lx = "{\\color" + color + html + "}";
			}
			else lx = html;
			var src = "http://latex.codecogs.com/png.latex?" + encodeURIComponent(sz + lx);
			e.html($("<img>").attr({src:src, alt:html}));
		}
	}
}

latex._elem = function(e) {
// Create a sequence of elements from a null or single element argument 
	if (e == null) e = $(".LaTeX");
	else if (!(e instanceof Array) && !e[0]) e = [e];
	return e;
}

latex._dpi = function(e) {
// Calculate the image dpi corresponding to the specified data-zoom
	var sz = e.attr("data-zoom");
	sz = (108 / 16) * parseFloat(e.css("fontSize")) * (sz ? parseFloat(sz) : 1);
	return Math.round(sz);
}

latex.unrender = function(elem) {
// Remove rendered image and replace it with latex code
	elem = latex._elem(elem);
	for (var i=0;i<elem.length;i++) {
		var e = $(elem[i]);
		var img = e.find("img");
		if (img.length) e.html(img.attr("alt"));
	}
}


/*** Scientific notation ***/

function SciNot(x) {
	if (!$.isNumeric(x)) throw("A number is required");
	this.value = x = parseFloat(x);
	var n = 0; //Math.floor(Math.log10(Math.abs(x)));
	while (x >= 10) {n++; x /= 10}
	while (x < 1) {n--; x *= 10}
	this.coef = x;
	this.exp = n;
}

SciNot.prototype.html = function(sd) {
	var x = this.coef;
	x = sd ? x.toPrecision(sd) : x.toString();
	if (this.exp) x += " × 10 <sup>" + this.exp + "</sup>"
	return x;
}

SciNot.prototype.altHtml = function(sd, minExp) {
	if (minExp == null) minExp = -2;
	if (this.exp >= minExp && this.exp < sd) return this.value.toPrecision(sd);
	return this.html(sd);
}