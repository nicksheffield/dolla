"use strict"
function dolla(selector, context){

	var d = {}

	d.splice = function(index, howMany){
		return Array.prototype.splice.call(d, index, howMany);
	}

	d.select = function(selector, context){
		if(!context) context = document;
		var elements = context.querySelectorAll(selector);
		become(elements);
		return d;
	}

	d.find = function(selector){
		d.select(selector, d[0]);
		return d;
	}

	d.each = function(callback){
		for(var i = 0; i < d.length; i++){
			callback(d[i], i);
		}
		return d;
	}

	d.addClass = function(c){
		d.each(function(el){
			if(el.hasOwnProperty('classList')){
				var cs = c.split(' ');
				for(var i = 0; i < cs.length; i++){
					el.classList.add(cs[i]);
				}
			}else{
				var p = el.className.indexOf(c);
				if(p == -1) el.className += ' ' + c;
			}
		})
		return d;
	}

	d.removeClass = function(c){
		d.each(function(el){
			if(el.hasOwnProperty('classList')){
				el.classList.remove(c);
			}else{
				var cs = el.className.split(' ');
				var p = cs.indexOf(c);
				cs.splice(p, 1);
				el.className = cs.join(' ');
			}
		})
		return d;
	}

	d.hasClass = function(c){
		var has = false;

		d.each(function(el){
			if(el.className.indexOf(c)!= -1) has = true;
		});

		return has;
	}

	d.next = function(){
		var nexts = [];
		d.each(function(el){
			if(el.nextElementSibling){
				nexts.push(el.nextElementSibling);
			}
		});
		return dolla(nexts);
	}

	d.prev = function(){
		var prevs = [];
		d.each(function(el){
			if(el.previousElementSibling){
				prevs.push(el.previousElementSibling);
			}
		});
		return dolla(prevs);
	}

	d.firstChild = function(){
		var firsts = [];
		d.each(function(el){
			if(el.firstElementChild){
				firsts.push(el.firstElementChild);
			}
		});
		return dolla(firsts);
	}

	d.lastChild = function(){
		var lasts = [];
		d.each(function(el){
			if(el.lastElementChild){
				lasts.push(el.lastElementChild);
			}
		});
		return dolla(lasts);
	}

	d.parent = function(){
		return dolla(d[0].parentElement);
	}

	d.closest = function(selector){
		function matches(el, s){
			if(!!el.matches) return el.matches(s);
			else if(!!el.matchesSelector) return el.matchesSelector(s);
			else return false;
		}

		function check(el){
			if(matches(el, selector)){
				return el;
			}else if(matches(el, 'html')){
				return false;
			}else{
				return check(el.parentElement);
			}
		}

		return check(d[0]);
	}

	d.eq = function(n){
		return dolla(d[n]);
	}

	d.get = function(n){
		return d[n];
	}

	d.first = function(){
		return dolla(d[0]);
	}

	d.last = function(){
		return dolla(d[d.length-1]);
	}

	d.on = function(event, callback){
		d.each(function(el, i){
			el.addEventListener(event, function(event){
				callback.call(el, event, i);
			});
		});
		return d;
	}

	d.css = function(prop, val){
		if(typeof prop == 'object'){
			d.each(function(el){
				for(property in prop){
					el.style[property] = prop[property];
				}
			});
		}else{
			d.each(function(el){
				el.style[prop] = val;
			});
		}

		return d;
	}

	d.append = function(new_element){
		return d.insert('beforeend', new_element);
	}

	d.prepend = function(new_element){
		return d.insert('afterbegin', new_element);
	}

	d.before = function(new_element){
		return d.insert('beforebegin', new_element);
	}

	d.after = function(new_element){
		return d.insert('afterend', new_element);
	}

	d.insert = function(position, new_element){
		d.each(function(el){
			if(typeof new_element == 'string'){
				el.insertAdjacentHTML(position, new_element);
			}else{
				el.insertAdjacentHTML(position, new_element.outerHTML);
			}
		});

		switch(position){
			case 'beforeend':   return dolla(d.lastChild());
			case 'afterend':    return dolla(d.next());
			case 'beforebegin': return dolla(d.prev());
			case 'afterbegin':  return dolla(d.firstChild());
		}

		return d;
	}

	d.html = function(content){
		if(!content) return d[0].innerHTML;
		else d.each(function(el){ el.innerHTML = content });
		return d;
	}

	d.text = function(content){
		if(!content) return d[0].textContent;
		else d.each(function(el){ el.textContent = content });
		return d;
	}

	d.attr = function(attr, value){
		if(!value){
			if(d[0].attributes[attr]) return d[0].attributes[attr].value;
			else return undefined;
		}else{
			d.each(function(el){
				if(el.attributes[attr]) el.attributes[attr].value = value;
			});
		}
		return d;
	}

	d.data = function(name, value){
		if(!value) return d[0].dataset[name];
		else d.each(function(el){ el.dataset[name] = value });
		return d;
	}

	function become(element){

		if (typeof element.length === 'number'){
			for(var i = 0; i < element.length; i++){
				d[i] = element[i];
			}
			d.length = element.length;
		}else{
			d[0] = element;
			d.length = 1;
		}
		
		return d;
	}

	if(typeof selector == 'string'){
		return d.select(selector, context);
	}else{
		return become(selector);
	}
	
}
