(function(window) {
	var u = {};
	u.IsExistToken = function(token, callback) {
		$httptools.get("/Service/IsExistToken?UserAccount=" + token.UserAccount+'&Token='+token.Token+'&PassWord='+token.PassWord, function(ret, err) {
			if(callback) {
				callback(ret, err);
			}
		})
	}
	u.Pad = function(callback) {
		$(window).keydown(function(event) {
			var $input = $("input[type='search']:last");
			if(event.keyCode == 0) {
				$input.val("");
				$input.focus();
			}
			if(event.keyCode == "13") {
				$input.blur();
				var data = $input.val();
				$input.val("");
				callback(data);
			}
		});
	}
	u.PadPosScaner = function(callback) {
		var scannerModule = api.require('posScanner');
		scannerModule.startListenKeyboardScan(function(ret) {
			if(ret) //这里必须判断是否有值
			{
				callback(ret.result);
			}
		});
	}
	u.PrintByContents = function(callback) {
		var address = $api.getStorage("address");
		if(!!address) {
			var printModule = api.require('posPrinter');
			printModule.getPrinterStatus({
				printerAddr: address
			}, function(ret, err) {
				var taskList = [];
				for(var i = 0; i < contents.length; i++) {
					taskList.push({
						printerAddr: address,
						content: contents[i],
						keepAlive: true, //蓝牙打印机，建议把keepAlive设为true
						copyNum: 1
					})
				}
				var param = {
					taskList: taskList
				};
				printModule.printOnSpecifiedPrinters(param, function(ret, err) {
					if(callback) {
						callback(ret, err);
					}
				});
			});
		} else {
			alert("请先绑定打印机!");
		}
	}
	u.PrintByJson = function(jsons, callback) {
		var address = $api.getStorage("address");
		if(!!address) {
			var printer = api.require('modulePrinter');
			printer.openBluetooth({}, function(retB, errB) {
				if(retB.result) {
					printer.connectionPrinter({
						ip: address
					}, function(retC, errC) {
						if(retC.result) {
							for(var i = 0; i < jsons.length; i++) {
								printer.printTag(jsons[i], function(retP, errP) {
									if(callback) {
										callback(retP, errP);
									}
								});
							}
						} else {
							if(retC.msg) {
								alert(retC.msg);
							} else {
								alert(retC.exception);
							}
						}
					});
				} else {
					if(retB.msg) {
						alert(retB.msg);
					} else {
						alert(retB.exception);
					}
				}
			});

		} else {
			alert("请先绑定打印机!");
		}
	}
	u.Print = function(boxs, callback) {
		//alert("/Tab/" + boxs.join(','));
		$httptools.get("/Tab/" + boxs.join(','), function(ret, err) {
			//u.PrintByImgs(ret,callback);
			var address = $api.getStorage("address");
			if(!!address) {
				var printer = api.require('modulePrinter');
				printer.openBluetooth({}, function(retB, errB) {
					if(retB.result) {
						printer.connectionPrinter({
							ip: address
						}, function(retC, errC) {
							if(retC.result) {
								for(var i = 0; i < ret.length; i++) {
									printer.printTag(ret[i], function(retP, errP) {
										if(callback) {
											callback(retP, errP);
										}
									});
								}
							} else {
								if(retC.msg) {
									alert(retC.msg);
								} else {
									alert(retC.exception);
								}
							}
						});
					} else {
						if(retB.msg) {
							alert(retB.msg);
						} else {
							alert(retB.exception);
						}
					}
				});

			} else {
				alert("请先绑定打印机!");
			}
		})
	}
	u.PrintTrailBox = function(boxs, callback) {
		//alert("/Tab/" + boxs.join(','));
		$httptools.get("/MantissaPrint/" + boxs.join(','), function(ret, err) {
			//u.PrintByImgs(ret,callback);

			var address = $api.getStorage("address");
			if(!!address) {
				var printer = api.require('modulePrinter');
				printer.openBluetooth({}, function(retB, errB) {
					if(retB.result) {
						printer.connectionPrinter({
							ip: address
						}, function(retC, errC) {
							if(retC.result) {
								for(var i = 0; i < ret.length; i++) {
									printer.printTag(ret[i], function(retP, errP) {
										if(callback) {
											callback(retP, errP);
										}
									});
								}
							} else {
								if(retC.msg) {
									alert(retC.msg);
								} else {
									alert(retC.exception);
								}
							}
						});
					} else {
						if(retB.msg) {
							alert(retB.msg);
						} else {
							alert(retB.exception);
						}
					}
				});

			} else {
				alert("请先绑定打印机!");
			}
		})
	}
	u.PrintByTSCC = function(boxs, callback) {
		//alert("/Tab/Get?id=" + boxs);
		$httptools.get("/Tab/Get?id=" + boxs + "&type=", function(ret, err) {
			//u.PrintByImgs(ret,callback);
			var address = $api.getStorage("address");
			if(!!address) {
				var printer = api.require('modulePrinter');
				printer.openBluetooth({}, function(retB, errB) {
					if(retB.result) {
						printer.connectionPrinter({
							ip: address
						}, function(retC, errC) {
							if(retC.result) {
								for(var i = 0; i < ret.length; i++) {
									printer.printTag(ret[i], function(retP, errP) {
										if(callback) {
											callback(retP, errP);
										}
									});
								}
							} else {
								if(retC.msg) {
									alert(retC.msg);
								} else {
									alert(retC.exception);
								}
							}
						});
					} else {
						if(retB.msg) {
							alert(retB.msg);
						} else {
							alert(retB.exception);
						}
					}
				});

			} else {
				alert("请先绑定打印机!");
			}
		})
	}
	u.PrintByImgs = function(imgs, callback) {
		var address = $api.getStorage("address");
		if(!!address) {
			var printModule = api.require('posPrinter');
			var taskList = [];
			for(var i = 0; i < imgs.length; i++) {
				taskList.push({
					printerAddr: address,
					content: "<BASE64>" + imgs[i] + "</BASE64>",
					keepAlive: true, //蓝牙打印机，建议把keepAlive设为true
					copyNum: 1
				})
			}
			var param = {
				taskList: taskList
			};
			printModule.printOnSpecifiedPrinters(param, function(ret, err) {
				if(callback) {
					callback(ret, err);
				}
			});
		} else {
			alert("请先绑定打印机!");
		}
	}

	u.commonspeech = function(data, callback) {
		var iflyRecognition = api.require('iflyRecognition');
		iflyRecognition.createUtility({
			ios_appid: '5b5ed592',
			android_appid: '5b5ed592'
		}, function(ret, err) {
			if(ret.status) {
				iflyRecognition.read({
					readStr: data,
					speed: 60,
					volume: 60,
					voice: 0,
					rate: 16000
				}, function(ret, err) {
					if(ret.status) {
						if(ret.speakProgress == 100) {
							try {
								callback();
							} catch(e) {

							}
						}
					} else {
						api.alert({
							msg: "语音朗读失败，亲联系IT处理,错误码" + err.msg
						});
					}
				});
			} else {
				api.alert({
					msg: "语音朗读失败，亲联系IT处理，引擎初始化失败"
				});
			}
		});
	}
	/*
	u.commonspeech = function(data, callback) {
         alert(data);
    }
    */
	window.$common = u;

})(window)

/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
	switch(interval) {
		case "y":
			{
				date.setFullYear(date.getFullYear() + number);
				return date;
				break;
			}
		case "q":
			{
				date.setMonth(date.getMonth() + number * 3);
				return date;
				break;
			}
		case "m":
			{
				date.setMonth(date.getMonth() + number);
				return date;
				break;
			}
		case "w":
			{
				date.setDate(date.getDate() + number * 7);
				return date;
				break;
			}
		case "d":
			{
				date.setDate(date.getDate() + number);
				return date;
				break;
			}
		case "h":
			{
				date.setHours(date.getHours() + number);
				return date;
				break;
			}
		case "m":
			{
				date.setMinutes(date.getMinutes() + number);
				return date;
				break;
			}
		case "s":
			{
				date.setSeconds(date.getSeconds() + number);
				return date;
				break;
			}
		default:
			{
				date.setDate(d.getDate() + number);
				return date;
				break;
			}
	}
}
