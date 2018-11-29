(function(window) {
	var uiloading;
	var u = {};
	 //var cmpip = "http://10.126.75.7:567";
     //var ip = "http://10.126.75.7:999/api";
	//var cmpip = "http://cmp.tcl.com:82";
	//var cmpip = "http://10.126.75.7";
    //var ip = "http://10.126.75.7:85/api";
	var cmpip = "http://10.118.56.229:3006";
	//var cmpip="http://157.122.116.78:82";
	//var ip = "http://localhost:1034/api";
	var ip = "http://10.118.56.229:3006/api";




	u.get = function(url, callback) {
		alert('get:'+ip + url);
		loading(function(id) {
			api.ajax({
				url: ip + url,
				method: 'get',
				headers: {
					token: $api.getStorage("token")
				}
			}, function(ret, err){
				closeloading(id);
				if(callback) {
					if(err) {
						if(err.statusCode == "403") {
							openlogin();
							return;
						}
					}
					callback(ret, err)
				}
			});
		});

	}


	u.post_废弃 = function(url, values, callback) {
		loading(function(id) {
			api.ajax({
				url: ip + url,
				method: 'post',
				data: {
					values: values
				},
				headers: {
					token: $api.getStorage("token")
				}
			}, function(ret, err) {
				closeloading(id);
				if(callback) {
					if(err) {
						if(err.statusCode == "403") {
							openlogin();
							return;
						}
					}
					callback(ret, err)
				}
			});
		});

	}
	u.post = function(url, body, callback) {
	    alert('POST:'+ip + url);
		loading(function(id) {
			api.ajax({
				url: ip + url,
				method: 'post',
				data: {
					body: body
				},
				headers: {
					'Content-Type': 'application/json',
					token: $api.getStorage("token")
				}
			}, function(ret, err) {
				closeloading(id);
				if(callback) {
					if(err) {
						if(err.statusCode == "403") {
							if(confirm("没有权限访问该页面，是否重新登录？")){
								openlogin();
							}
							return;
						}
					}
					callback(ret, err)
				}
			});
		});

	}
	u.put = function(url, body, callback) {
		loading(function(id) {
			api.ajax({
				url: ip + url,
				method: 'put',
				data: {
					body: body
				},
				headers: {
					'Content-Type': 'application/json',
					token: $api.getStorage("token")
				}
			}, function(ret, err) {
				closeloading(id);
				if(callback) {
					if(err) {
						if(err.statusCode == "403") {
							if(confirm("没有权限访问该页面，是否重新登录？")){
								openlogin();
							}
							return;
						}
					}
					callback(ret, err)
				}
			});
		});

	}
	u.uploadfile = function(url, values, files, callback) {
		loading(function(id) {
			api.ajax({
				url: ip + url,
				method: 'post',
				data: {
					values: values,
					files: files
				},
				headers: {
					token: $api.getStorage("token")
				}
			}, function(ret, err) {
				closeloading(id);
				if(err) {
					if(err.statusCode == "403") {
						openlogin();
						return;
					}
				}
				if(callback) {
					callback(ret, err)
				}
			});
		});

	}
	var openlogin = function() {
		var widget = api.wgtRootDir;
		api.openWin({
			name: 'login',
			url: widget+'/html/view/login.html',
			pageParam: {

			}
		});
	}
	var closeloading = function(id) {
		uiloading.closeFlower({
			id: id
		});
	}
	var loading = function(callback) {
		if(!!uiloading == false) {
			uiloading = api.require('UILoading');
		}
		uiloading.flower({
			center: {
				x: api.winWidth / 2.0,
				y: api.winHeight / 2.0
			},
			size: 30,
			fixed: true
		}, function(ret) {
			callback(ret.id)
		});
	}
	window.$httptools = u;
	window.$cmphost = cmpip;
})(window)
