export const rangexy = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

export const ucFirst = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const animEvent = () => {
	let el = document.createElement("fakeelement");

	let animations={
		"animation"      : "animationend",
		"OAnimation"     : "oAnimationEnd",
		"MozAnimation"   : "animationend",
		"WebkitAnimation": "webkitAnimationEnd"
	}

	for(let t in animations){
		if(el.style[t]!==undefined)return animations[t];
	}
}

export const transEvent = () => {
	let el = document.createElement("fakeelement");

	let transitions={
		"transition"      : "transitionend",
		"OTransition"     : "oTransitionEnd",
		"MozTransition"   : "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	}

	for(let t in transitions){
		if(el.style[t]!==undefined)return transitions[t];
	}
}

export let whichEvents = {
	"animation":animEvent(),
	"transition":transEvent()
}

export const isEquivalent = (a,b) => {
	// Create arrays of property names
	var aProps = Object.getOwnPropertyNames(a);
	var bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length != bProps.length) {
		return false;
	}

	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false;
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
}

export const findDeep = (cats, id) => {
	if (cats) {
		for (var i = 0; i < cats.length; i++) {
			if (cats[i].id == id) {
				return cats[i];
			};
			var found = findDeep(cats[i].children, id);
			if (found) return found;
		}
	}
};

export const humanFileSize = (bytes, si=true) => {
	var thresh = si ? 1000 : 1024;
	if(Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}
	var units = si
		? ['kB','MB','GB','TB','PB','EB','ZB','YB']
		: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while(Math.abs(bytes) >= thresh && u < units.length - 1);
	return bytes.toFixed(1)+' '+units[u];
}

export const recFieldName = (fname) =>{
	let match = fname.match(/(\w+)|\[(.+?)\]/gi);
	for(let [i, r] of match.entries()){
		match[i]=r.replace(/\[|\]/ig,"");
	}
	return match;
}

export const objFromFieldName = (parts,value=null) =>{
	if(parts.length==0) return value;
	let obj = {};
	obj[head(parts)]=objFromFieldName(tail(parts), value )
	return obj;
}

export const leadZeros = (number, digits=2) => ("0000000000000000000"+number).slice(number.toString().length>digits?number.toString().length*-1:-digits);
export const formatDate = (date) =>{const d=new Date(date);return [d.getFullYear(),leadZeros(d.getMonth()+1),leadZeros(d.getDate())].join("-").trim()}

export const def = x => typeof x !== 'undefined'; //Return if argument supplied is defined.
export const undef = x => !def(x);//Return if argument supplied is undefined.
export const copy = array => [...array];//Returns a copy of an array without using Array.slice().
export const head = ([x]) => x; //Return the first item in an array.
export const tail = ([x, ...xs]) => xs; //Return all but the first item in an array.
export const isArray = x => Array.isArray(x); //Returns if the value supplied is an array.
export const reverse = ([x, ...xs]) => def(x) ? [...reverse(xs), x] : []; //Similar to reduce, but applies the function from right-to-left.
export const first = ([x, ...xs], n = 1) => def(x) && n ? [x, ...first(xs, n - 1)] : []; //Returns a new array that contains the first n items of the given array.
export const last = (xs, n = 1) => reverse(first(reverse(xs), n)); //Returns a new array that contains the last n items of the given array.
export const filter = ([x, ...xs], fn) => def(x)
	? fn(x)
		? [x, ...filter(xs, fn)] : [...filter(xs, fn)]
	: [] // creates a new array with all elements that pass the test implemented by the provided function.
export const reject = ([x, ...xs], fn) => {
	if (undef(x)) return []
	if (!fn(x)) {
		return [x, ...reject(xs, fn)]
	} else {
		return [...reject(xs, fn)]
	}
} //The opposite of filter, returns an array that does not pass the filter function.
export const unique = (x) => x.filter((i,p,s)=>s.indexOf(i)==p);
export const partition = (xs, fn) => [filter(xs, fn), reject(xs, fn)]; //Splits an array into two arrays. One whose items pass a filter function and one whose items fail.
export const reduce = ([x, ...xs], fn, memo, i = 0) => def(x)
	? reduce(xs, fn, fn(memo, x, i), i + 1) : memo //Applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.
export const scrollArr = ([x, ...xs]) => { return [...xs,x]; }

export const flow = (...args) => init => reduce(args, (memo, fn) => fn(memo), init) //Each function consumes the return value of the function that came before.

export const min = ([x, ...xs], result = Infinity) => def(x)
	? x < result
		? min(xs, x)
		: result
	: result //Return the smallest number in an array. Returns Infinity if array supplied is empty.

export const max = ([x, ...xs], result = -Infinity) => def(x)
	? x > result
		? max(xs, x)
		: max(xs, result)
	: result //Return the largest number in an array. Returns -Infinity if array supplied is empty.

export const factorial = (x, acum = 1) => x ? factorial(x - 1, x * acum) : acum //Returns the factorial of a number. Uses an accumulator to allow replacing of stack frames to allow larger factorials to be returned.

export const fib = x => x > 2 ? fib(x - 1) + fib(x - 2) : 1 //Returns the Fibonacci number at the given place.

export const quicksort = (xs) => length(xs)
  ? flatten([
	quicksort(filter(tail(xs), x => x <= head(xs))),
	head(xs),
	quicksort(filter(tail(xs), x => x > head(xs)))
  ])
  : [] //Sort an array from smallest to largest. This is done by re-ordering the array so that it contains two sub-arrays, one with smaller values, the other with larger values. The above steps are recursively applied to each sub-array until there are no arrays left, which is flatten to return a sorted array.

export const random = (min,max) => Math.floor(Math.random() * (Math.ceil(max) - Math.floor(min + 1) ) + Math.floor(min) )

export const scale = function(domain,range){
  var istart = domain[0],
	  istop  = domain[1],
	  ostart = range[0],
	  ostop  = range[1];

  return function scale(value) {
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }
}

export const snakeToCamel = (string) => string.replace(/(_\w)/g, m=>m[1].toUpperCase());

export const camelToSnake = (string) => string.replace(/[\w]([A-Z])/g, m => (m[0]+'_'+m[1]).toLowerCase())

export const getRangeData = (string, onlyField = true) => string.replace(/(\w+)(Range)(Min|Max)$/i,(full,field, prefix, range)=>onlyField?field+prefix:range.toLowerCase());

export const getFieldData = (string, onlyField = true) => string.replace(/^(address)(Street|StateId|CityId|District|Number)/, (full, field, sub)=>onlyField?field:camelToSnake(sub).toLowerCase());

export const sanitizeUrl = (url) => {
	if(!url.match(/^https?:\/\//))
		url = window.location.protocol+url;

	return new URL(url);
}

export const valFromPath = (obj, path) =>{
	if(/\+/g.test(path)){
		let fields = path.split(/\+/g);
		let res=[];

		fields.forEach(field=>{
			let levels = field.split(/\./g);

		if(levels.length>1)
			res.push(valFromPath(obj[levels.shift()],levels.join('.')));
		else
			res.push(obj[levels.join('.')]);
		});

		return res.join(' - ');
	} else {
		let levels=path.split(/\./ig);
		if(levels.length>1)
			return valFromPath(obj[levels.shift()],levels.join('.'));
		else
			return obj[path];
	}
}

export const setToValue = (obj, value, path) => {
	let i;
	if(obj==null) obj={};
	path = path.split('.');
	for (i = 0; i < path.length - 1; i++){
		if(obj[path[i]]==null) obj[path[i]]={};
		obj = obj[path[i]];
	}
	obj[path[i]] = value;
}

export const formatCep = (cep) => cep.substring(0,5)+'-'+cep.substring(5,8);

export const between = (number, min, max) => min<= number && number<=max;

export const ceil5 = (number) => Math.ceil(number/5)*5;
export const floor5 = (number) => Math.floor(number/5)*5;

export const capitalize = (s) => typeof s !== 'string'?'':s.charAt(0).toUpperCase() + s.slice(1);

export const youtubeVideoId = (url) =>{
	let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	let matches = url.match(rx);
	return matches && matches.length > 0? matches[1] : null;
}

export const diffDates = (start, end, days=true) => days?Math.floor((end - start) / (1000*60*60*24)):(end-start)/(1000*60*60);

export const getRanges = (arr,diff=1) => {
	let prev;

	return arr.reduce((acc, value, i)=>{
		if (prev !== value - diff) {
			acc.push({ startIndex: i, startValue: value, length: 1 });
		} else {
			acc[acc.length - 1].length++;
		}

		prev = value;
		return acc;
	},[]).map(range=>[arr[range.startIndex], arr[range.startIndex+range.length-1]]);
}
