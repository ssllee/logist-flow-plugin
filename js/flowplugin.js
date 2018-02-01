
/*------------------------
 * 
 * JAVASCRIPT "flowplugin.js"
 * 
 * show flow on date
 * 
 ----------------------------------*/

(function($){
	$.fn.flowplugin = function(opt) {
		opt = $.extend({
			jsonDate:[],//json数据
			imgSrcStart:"img/f1.png",//最新流程节点图片
			imgSrcOther:"img/f2.png",//其它流程节点图片
			imgWidth:"20px",//图片宽  设置第一个图片的宽度
			imgHeight:"20px",//图片高  设置第一个图片的高度
			imgClass: undefined//图片宽高样式   （如果传入imgClass 则不需要设置imgHeight,imgHeight）
        }, opt);
		
		var flowHtml = '<div class="flowSwrap"><div class="flow-line"></div></div>';
        var cellHtml = '<div id="CELL_ID" class="flowCell"><div class="cell-left"></div><div class="cell-center"></div><div class="cell-right"></div></div>';
        
        //组织流程内容区域
        function _makeContent(obj) {
        	if (opt.jsonDate == null) return;
        	if (opt.jsonDate.data == null) return;
        	if (opt.jsonDate.data.length == 0) return;
        	
        	var data = opt.jsonDate.data;//流程节点数组数据
        	var cellSize = data.length;//定义流程节点的个数
        	
        	//创建外层框架
            obj.append(flowHtml);
        	
        	//遍历生成一行一行 流程信息
        	$.each(data,function(index,item){
        		var v_date = item.createDate.split(/\s/)[0];
        		var v_time = item.createDate.split(/\s/)[1];
        		var v_name = item.jobName;
        		//var v_other_arr = item.jobOther == undefined ? [] : item.jobOther;// 判空处理
        		var v_other_arr = item.jobOther == undefined ? "" : item.jobOther.split(/,/);// 判空处理
        		
        		//console.log(index+" "+v_date+" "+v_time);
        		
        		//添加cell外层元素
        		var cell_id = "cell_"+index;
        		var flowCellHtml = cellHtml.replace("CELL_ID",cell_id);
        		$(".flowSwrap").append(flowCellHtml);
        		
        		//左边时间
        		var cellLeftHtml = '<p class="t1">'+v_time+'</p><p class="t2">'+v_date+'</p>';
        		var $cellLeft = $("#"+cell_id+" .cell-left");
        		$cellLeft.append(cellLeftHtml);
        		
        		//中间节点图片
        		if (index == 0) {//第一个节点
        			if (opt.imgClass) {//如果是手机端 则传入class 定义 height:1rem;width:1rem;
        				cellCenterHtml = '<img id="startImg" src="'+opt.imgSrcStart+'" class="'+opt.imgClass+'" />';
        			} else {//如果是pc端直接传入 width:20px; height:20px;
        				cellCenterHtml = '<img id="startImg" src="'+opt.imgSrcStart+'" width="'+opt.imgWidth+'" height="'+opt.imgHeight+'" />';
        			}
        			
        		} else if ((index+1) == cellSize) {//最后一个节点
        			cellCenterHtml = '<img id="endImg" src="'+opt.imgSrcOther+'" class="'+opt.imgClass+'" />';
        		} else {//中间节点
        			cellCenterHtml = '<img src="'+opt.imgSrcOther+'" class="'+opt.imgClass+'" />';
        		}
        		$("#"+cell_id+" .cell-center").append(cellCenterHtml);
        		
        		
        		//右边内容
        		var cellRightHtml = index ==0 ? '<p class="t1_start">'+v_name+'</p>' : '<p class="t1">'+v_name+'</p>' ;
        		var $cellRight = $("#"+cell_id+" .cell-right")
        		$cellRight.append(cellRightHtml);
        		//右边其它内容
        		$.each(v_other_arr,function(index_sub,item_sub){
        			var cellRightOtherHtml = '<p class="t2">'+item_sub+'</p>';
        			$cellRight.append(cellRightOtherHtml);
        		});
        		
        		//字体颜色设置
        		index ==0 ? $cellLeft.addClass("fc-orange") : $cellLeft.addClass("fc-grey");
        		index ==0 ? $cellRight.addClass("fc-orange") : $cellRight.addClass("fc-grey");
        		
        	});
        	
        	// 两个以上节点才画线
        	if (cellSize > 1) {
        		//获取生成的流程节点画线
        		getImgPosition();
        	}
        	
        }
        
        //获取开始和结束节点的位置，计算出线的位置
		function getImgPosition(){
			//获取相对(父元素)位置  class="flowSwrap"
			//开始节点 
			var x1 = $('#startImg').position().left;
			var y1 = $('#startImg').position().top;
			var w1 = $('#startImg').width();// 第一个图片尚未加载成功时，取值为0，所以需要设置第一个img的height,width
			var h1 = $('#startImg').height();
			//结束节点
			var x2 = $('#endImg').position().left;
			var y2 = $('#endImg').position().top;
			
			//线的宽度
			var wfl = $(".flow-line").width()
			
			console.log(x1,y1,x2,y2,w1);
			
			//流程线的位置计算
			var imgLeft = x1 + w1/2 - wfl/2;
			var imgTop = y1 + h1/2;
			var imgHeight = y2 - y1 - h1/2;
			
			$(".flow-line").css({
				left:imgLeft,
				top:imgTop,
				height:imgHeight
			});
		}
		
		//最后返回
        return $.each(this,function () {
            var obj = $(this);//必须
           
            // 根据数据内容填充html
			_makeContent(obj);
            
        });
	}
})(jQuery);
