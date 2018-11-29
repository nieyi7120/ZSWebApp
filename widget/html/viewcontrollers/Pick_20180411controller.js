var pageParam;
var FNScanner;
var EnableAddressCode = [];
var app = new Vue({
	el: '#app',
	data: {
		pick: {
			ODF: "",
			WorkCenter: "",
			DemandQuantity: "",
			MaterialCode: "",
			Boxs: [],
			Acceptor: "",
			AcceptorCode: "",
			IsPrint: "true"
		},
		LackQty: 0,
		BoxCode: "",
		IsShow: false,
		IsSmallPick: false,
		canSave: true,
		AddressCode: "",
		ODF: "",
		WorkCenter: ""
	},
	methods: {
		closeWin: function() {
			api.closeWin();
		},
		update: function() {
			update();
		},
		delete: function(index) {
			alert(index);
			//app.pick.Boxs.splice(idnex,1);
			//update();
		},
		SmallPick: function() {
			app.IsSmallPick = !app.IsSmallPick;
		},
		FNScanner: function() {
			FNScanner.openScanner({
				autorotation: true
			}, function(ret, err) {
				if(ret) {
					if(ret.eventType == "success") {
						try {
							if(/\S{2}[1-9]{1}[A-Z]{1}[H,K]{1}[0-9]{5}/.test(ret.content) && ret.content.length == 10) {
								$common.commonspeech("地址码已扫描");
								app.AddressCode = ret.content;
								return;
							}
							app.boxcode = ret.content.split("[*]")[12];
							getbox(app.boxcode);
						} catch(e) {
							$common.commonspeech("请扫描二维码！", function() {});
						}
					}

				} else {
					alert(JSON.stringify(err));
				}
			});
		},
		getbox: function() {
			getbox(this.BoxCode);
		},
		openOutSupplierWin: function() {
			api.openWin({
				name: 'OutSupplierList',
				url: '../view/OutSupplierList.html',
				pageParam: {}
			});
		},
		save: function() {
			if(app.canSave) {
				if(!!pageParam.MATNR) {
					app.pick.PlanDate = pageParam.PlanDate;
				}
				app.canSave = false;
				app.pick.IsTailBox = "Y";
				$httptools.post("/CMP/WM/Pick", app.pick, function(ret, err) {
					if(ret.Flag == "N") {
						$common.commonspeech(ret.Msg);
						if(confirm(ret.Msg)) {
							app.pick.IsTailBox = "N";
							$httptools.post("/CMP/WM/Pick", app.pick, function(ret, err) {
								if(ret.Flag == 'Y') {
									$common.commonspeech("出库成功", function() {
										if(ret.Msg.length > 0) {
											if(confirm("存在尾数箱，是否需要打印标签？")) {
												$common.PrintTrailBox(ret.Msg, function() {
														//orig call  $common.Print
												})
											}
										}

										app.pick = {
											ODF: "",
											WorkCenter: "",
											DemandQuantity: "",
											MaterialCode: "",
											Boxs: []
										};
										app.IsShow = false;
									});
								} else {
									$common.commonspeech(ret.Msg);
								}
								//alert(JSON.stringify(ret)+"-"+JSON.stringify(err));
								app.canSave = true;
							})
						}
					} else {
						app.pick.IsTailBox = "N";
						$httptools.post("/CMP/WM/Pick", app.pick, function(ret, err) {
							if(ret.Flag == 'Y') {
								$common.commonspeech("出库成功", function() {
									if(ret.Msg.length > 0) {
										if(confirm("存在尾数箱，是否需要打印标签？")) {
											$common.PrintTrailBox(ret.Msg, function() {
														//orig call  $common.Print
												})
										}
									}
									app.pick = {
										ODF: "",
										WorkCenter: "",
										DemandQuantity: "",
										MaterialCode: "",
										Boxs: []
									};
									app.IsShow = false;
								});
							} else {
								$common.commonspeech(ret.Msg);
							}
							//alert(JSON.stringify(ret)+"-"+JSON.stringify(err));
							app.canSave = true;
						})
					}
				})
			}
		}
	}
})
var getbox = function(boxcode) {
	if(!!pageParam.MATNR) {
		app.LackQty = pageParam.LackQty;
		app.ODF = pageParam.ODF;
		app.WorkCenter = pageParam.WorkCenter;
	}
	if(boxcode) {
		for(var i = 0; i < app.pick.Boxs.length; i++) {
			if(boxcode == app.pick.Boxs[i].BoxCode) {
				$common.commonspeech("该箱已扫描");
				return;
			}
		}
		$httptools.get("/CMP/WM/Pick?id=" + boxcode + "&odf=" + app.ODF + "&workcenter=" + app.WorkCenter, function(ret, err) {
			if(ret.Flag == "Y") {
				for(var i = 0; i < EnableAddressCode.length; i++) {
					if(ret.Msg.MaterialCode.indexOf(EnableAddressCode[i]) == 0) {
						if(!!ret.Msg.AdCode) {
							if(ret.Msg.AdCode != app.AddressCode) {
								$common.commonspeech("请扫描地址码");
								return;
							}
						}

					}
				}
				for(var i = 0; i < app.pick.Boxs.length; i++) {
					if(ret.Msg.BoxCode == app.pick.Boxs[i].BoxCode) {
						$common.commonspeech("该箱已扫描");
						return;
					}
				}
				if(!!pageParam.MATNR) {
					if(pageParam.MATNR != ret.Msg.MaterialCode) {
						$common.commonspeech("物料编号不一致!");
						return;
					}
					if(pageParam.ODF != ret.Msg.ODF) {
						$common.commonspeech("批次不一致!");
						return;
					}
					if(pageParam.WorkCenter != ret.Msg.WorkCenter) {
						$common.commonspeech("工作中心不一致!");
						return;
					}
				}
				if(!!app.pick.MaterialCode) {

					if(app.pick.MaterialCode != ret.Msg.MaterialCode) {
						$common.commonspeech("物料编号不一致!");
						return;
					}

					if(app.pick.ODF != ret.Msg.ODF) {
						$common.commonspeech("批次不一致!");
						return;
					}

					if(app.pick.WorkCenter != ret.Msg.WorkCenter) {
						$common.commonspeech("工作中心不一致!");
						return;
					}
					if(app.pick.BillCode != ret.Msg.BillCode) {
						$common.commonspeech("送货单不一致!");
						return;
					}
					app.pick.Boxs.push(ret.Msg);
				} else {
					app.pick = ret.Msg;
					app.pick.Warehouseman=pageParam.Warehouseman
					app.pick.Boxs = [];
					app.pick.Boxs.push({
						BoxCode: ret.Msg.BoxCode,
						Lifnr: ret.Msg.Lifnr,
						ActualQuantity: ret.Msg.ActualQuantity,
						Qty: ret.Msg.Qty,
						Type:ret.Msg.Type
					});
					app.IsShow = true;
				}
				update();
				$common.commonspeech("扫描成功");
			} else {
				$common.commonspeech(ret.Msg);
			}
			app.BoxCode = "";
		})
	}
}
var update = function() {
	app.pick.ActualQuantity = 0;
	app.pick.Qty = 0;
	for(var i = 0; i < app.pick.Boxs.length; i++) {
		app.pick.ActualQuantity = app.pick.ActualQuantity + parseFloat(app.pick.Boxs[i].ActualQuantity);;
		app.pick.Qty = app.pick.Qty + parseFloat(app.pick.Boxs[i].Qty);
	}

}
apiready = function() {
	pageParam = api.pageParam;
	api.addEventListener({
		name: 'eventOutSupplierReturn'
	}, function(ret, err) {
		app.pick.Acceptor = ret.value.name;
		app.pick.AcceptorCode = ret.value.code;
	});
	$httptools.get("/CMP/Base/BaseCode/GetEnableList?id=111", function(ret, err) {
		EnableAddressCode = ret;
	})
	$common.Pad(function(data) {
		try {
			if(/\S{2}[1-9]{1}[A-Z]{1}[H,K]{1}[0-9]{5}/.test(data) && data.length == 10) {
				$common.commonspeech("地址码已扫描");
				app.AddressCode = data;
				return;
			}
			getbox(data.split("[*]")[12]);
		} catch(e) {
			$common.commonspeech("请扫描二维码！", function() {});
		}
	})
	FNScanner = api.require('FNScanner');
	api.addEventListener({
		name: 'keyback'
	}, function(ret, err) {
		api.toLauncher();
	});
};