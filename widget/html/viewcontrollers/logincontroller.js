var app = new Vue({
	el: '#app',
	data: {
		username: "",
		password: "",
		passwordshowstate:false
	},
	methods: {
		login: function() {
			$httptools.post("/Service/GetToken", {
				UserName: this.username,
				PassWord: this.password
			}, function(ret, err) {

				if(ret) {
					alert('登陆成功');
					alert(JSON.stringify(ret));
					$api.setStorage("token", ret)
					api.sendEvent({
						name: 'loading'
					});
					api.closeWin();
				} else {
					this.password = "";
						alert('失败结果'+JSON.stringify(ret)) ;
					alert("登录失败");
				}
			})
		},
		passwordshow:function(){
			app.passwordshowstate=!app.passwordshowstate;
		}
	}
})
apiready = function() {
	if($api.getStorage("token")) {
			alert(JSON.stringify($api.getStorage("token"))) ;
		$common.IsExistToken($api.getStorage("token"), function(ret, err) {
			if(ret) {
				alert(JSON.stringify(ret)) ;
				api.closeWin();
			}
		})
	}
	api.addEventListener({
		name: 'keyback'
	}, function(ret, err) {
		api.toLauncher();
	});
};
