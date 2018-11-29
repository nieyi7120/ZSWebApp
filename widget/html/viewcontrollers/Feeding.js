var FNScanner;
var vueapp = new Vue({
	el : '#app',
	data : {
		dataList : {},
		FeedingMachine : "",
		MaterialCode : "",
		Qty : ""
	},
	methods : {
		closeWin : function() {
			api.closeWin();
		},
		FeedingScaner : function() {//扫描拌料机条码
			FNScanner.openScanner({
				autorotation : true
			}, function(ret, err) {

				if (ret.eventType == "success") {
					var FeedingNo = ret.content;
					
					//验证拌料机是否正确
				$httptools.post("/Feeding/IsExsitFeedingMachine", {
				FeedingNo: this.FeedingNo
			}, function(ret, err) {
                if(ret)
                {
                	
                }
                else
                {
                	alert('找不到拌料机:'+FeedingNo);
                	return;
                }
			    	} 
			    	else {

				}

			})
		},