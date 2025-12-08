function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
//倒计时
function TimeTo(c) {
	// var t = new Date(dd), //取得指定时间的总毫秒数  
	//     n = new Date().getTime(), //取得当前毫秒数  
	//w = (t - n)*1000;//得到时间差
	if (c <= 0) { //如果差小于等于0  也就是过期或者正好过期，则推出程序  

		// clearInterval(window['ttt']); //清除计时器  
		return "订单已超时"; //结束执行  
	}
	let d = parseInt(c / 1000 / 60 / 60 / 24) //总毫秒除以一天的毫秒 得到相差的天数  
	let h = parseInt(c / 1000 / 60 / 60 - (24 * d)) //然后取完天数之后的余下的毫秒数再除以每小时的毫秒数得到小时 
	let m = parseInt(c / 1000 / 60 - (24 * 60 * d) - (60 * h)) //减去天数和小时数的毫秒数剩下的毫秒，再除以每分钟的毫秒数，得到分钟数 
	let s = parseInt(c / 1000 - (24 * 60 * 60 * d) - (60 * 60 * h) - (60 * m)); //得到最后剩下的毫秒数除以1000 就是秒数，再剩下的毫秒自动忽略即可
	let hm = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 10);
	if (hm < 10) {
		hm = "0" + hm;
	}
	if (s < 10) {
		s = "0" + s;
	}
	if (m < 10) {
		m = "0" + m;
	}
	if (h < 10) {
		h = "0" + h;
	}
	return '距订单关闭时间：' + d + '天' + h + '小时' + m + '分钟' + s + '秒'; //最后这句讲定义好的显示 更新到 ID为 timer的 div中

}
//时间戳友好格式化 dateTimeStamp = new Date().getTime()
function getDateDiff(dateTimeStamp) {
	var publishTime = dateTimeStamp / 1000,
		d_seconds,
		d_minutes,
		d_hours,
		d_days,
		timeNow = parseInt(new Date().getTime() / 1000),
		d,
		date = new Date(publishTime * 1000),
		Y = date.getFullYear(),
		M = date.getMonth() + 1,
		D = date.getDate(),
		H = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds();
	//小于10的在前面补0
	if (M < 10) {
		M = '0' + M;
	}
	if (D < 10) {
		D = '0' + D;
	}
	if (H < 10) {
		H = '0' + H;
	}
	if (m < 10) {
		m = '0' + m;
	}
	if (s < 10) {
		s = '0' + s;
	}
	d = timeNow - publishTime;
	d_days = parseInt(d / 86400);
	d_hours = parseInt(d / 3600);
	d_minutes = parseInt(d / 60);
	d_seconds = parseInt(d);
	// if (d_days > 0 && d_days < 3) {
	// 	return d_days + '天前';
	// } else if (d_days <= 0 && d_hours > 0) {
	// 	return d_hours + '小时前';
	// } else if (d_hours <= 0 && d_minutes > 0) {
	// 	return d_minutes + '分钟前';
	// } else if (d_seconds < 60) {
	// 	if (d_seconds <= 0) {
	// 		return '刚刚';
	// 	} else {
	// 		return d_seconds + '秒前';
	// 	}
	// }
	//  else if (d_days >= 3 && d_days < 30) {
	// 	return M + '-' + D + ' ' + H + ':' + m;
	// } else if (d_days >= 30) {
	// 	return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
	// }
	return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
}

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

function ys() {
	! function (l) {
		var e, n = '<svg><symbol id="icon-fenxiang" viewBox="0 0 1024 1024"><path d="M146.663314 635.123178c0 98.298793 79.687924 177.979554 177.972391 177.979554 69.648266 0 129.921002-39.997969 159.170163-98.277304L655.223982 745.018078l-0.061398 4.516874c0 70.220295 56.919361 127.129422 127.125329 127.129422 70.206992 0 127.126352-56.908104 127.126352-127.129422 0-70.217225-56.919361-127.122259-127.126352-127.122259-50.91153 0-94.807273 29.883611-115.118877 73.093738l-167.226652-29.435403c1.76418-10.038634 2.671852-20.395516 2.671852-30.947849 0-46.465265-17.820877-88.76465-46.964638-120.445186l154.6318-154.650219c13.953803 5.262864 29.077246 8.129144 44.880163 8.129144 70.205968 0 127.125329-56.905034 127.125329-127.122259s-56.919361-127.125329-127.125329-127.125329-127.125329 56.908104-127.125329 127.125329c0 35.657104 14.686491 67.86976 38.324864 90.962711L415.972946 482.386542c-26.708292-16.012695-57.929364-25.239847-91.337241-25.239847C226.351238 457.150788 146.663314 536.827455 146.663314 635.123178L146.663314 635.123178 146.663314 635.123178z"  ></path></symbol><symbol id="icon-daifahuo" viewBox="0 0 1024 1024"><path d="M865.8 355.7V195.1c0-20-16.3-36.2-36.4-36.2h-636c-20.2 0-36.4 16.2-36.4 36.2v636.4c0 20.1 16.3 36.3 36.4 36.3h636c20.1 0 36.4-16.2 36.4-36.3V670.8c21.8 0 39.4-17.6 39.4-39.4V395.1c0-21.8-17.6-39.4-39.4-39.4z m-59.1 452.9H216V217.8h590.8v137.8H570.4c-21.7 0-39.4 17.6-39.4 39.4v236.3c0 21.8 17.6 39.4 39.4 39.4h236.3v137.9z m39.4-196.9H708.3V414.8h137.8v196.9z m-256 0V414.8h59.1v196.9h-59.1z" fill="#666666" ></path></symbol></svg>',
			t = (e = document.getElementsByTagName("script"))[e.length - 1].getAttribute("data-injectcss");
		if (t && !l.__iconfont__svg__cssinject__) {
			l.__iconfont__svg__cssinject__ = !0;
			try {
				document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
			} catch (e) {
				console && console.log(e)
			}
		}! function (e) {
			if (document.addEventListener)
				if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) setTimeout(e, 0);
				else {
					var t = function () {
						document.removeEventListener("DOMContentLoaded", t, !1), e()
					};
					document.addEventListener("DOMContentLoaded", t, !1)
				}
			else document.attachEvent && (o = e, i = l.document, c = !1, (d = function () {
				try {
					i.documentElement.doScroll("left")
				} catch (e) {
					return void setTimeout(d, 50)
				}
				n()
			})(), i.onreadystatechange = function () {
				"complete" == i.readyState && (i.onreadystatechange = null, n())
			});

			function n() {
				c || (c = !0, o())
			}
			var o, i, c, d
		}(function () {
			var e, t;
			(e = document.createElement("div")).innerHTML = n, n = null, (t = e.getElementsByTagName("svg")[0]) && (t.setAttribute("aria-hidden", "true"), t.style.position = "absolute", t.style.width = 0, t.style.height = 0, t.style.overflow = "hidden", function (e, t) {
				t.firstChild ? function (e, t) {
					t.parentNode.insertBefore(e, t)
				}(e, t.firstChild) : t.appendChild(e)
			}(t, document.body))
		})
	}(window);
}

function getDateDiff1(dateTimeStamp) {
	var publishTime = dateTimeStamp / 1000,
		d_seconds,
		d_minutes,
		d_hours,
		d_days,
		timeNow = parseInt(new Date().getTime() / 1000),
		d,
		date = new Date(publishTime * 1000),
		Y = date.getFullYear(),
		M = date.getMonth() + 1,
		D = date.getDate(),
		H = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds();
	//小于10的在前面补0
	if (M < 10) {
		M = '0' + M;
	}
	if (D < 10) {
		D = '0' + D;
	}
	if (H < 10) {
		H = '0' + H;
	}
	if (m < 10) {
		m = '0' + m;
	}
	if (s < 10) {
		s = '0' + s;
	}
	return Y + '-' + M + '-' + D;
}

function swiper() {
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		effect: 'coverflow',
		loop: true,
		autoplay: 2000,
		spaceBetween: '15%',
		centeredSlides: true,
		slidesPerView: 'auto',
		autoplayDisableOnInteraction: false,
		observer: true,
		observeParents: true,
		paginationClickable: true,
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		coverflow: {
			rotate: 0,
			stretch: 0,
			depth: 300,
			modifier: 1,
			slideShadows: true
		}
	});
}
module.exports = {
	getDateDiff: getDateDiff,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	getDateDiff1: getDateDiff1,
	ys: ys,
	swiper: swiper,
	TimeTo: TimeTo
}