'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
// 正则表达式，判断是否为generator
// generator的典型toString为 function* () {}, 该正则表示 文本开始为空格或者无空格，后面为function或者为0/1个，然后紧跟一个*，符合这种的才是generation
var isFnRegex = /^\s*(?:function)?\*/;

// 标识是否支持Symbol且存在Symbol.toStringTag
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var generatorFunc = getGeneratorFunc();
var GeneratorFunction = generatorFunc ? getProto(generatorFunc) : {};

module.exports = function isGeneratorFunction(fn) {
	// 如果传入的参数不是function，则肯定不是generator function
	if (typeof fn !== 'function') {
		return false;
	}
	// 如果把function转换为字符串之后，符合function*() {}的正则，那么肯定是一个generator function
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	// 如果fn不支持function.toString()，所以需要手动调用Object.prototype.toString()来看下fn的类型是啥
	// 如果是[object GeneratorFunction]，则认为是generator function
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	return getProto(fn) === GeneratorFunction;
};
