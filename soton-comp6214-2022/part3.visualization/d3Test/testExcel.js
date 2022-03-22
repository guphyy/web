function importFileDemo(files){//1.onchange事件绑定方法出发
    //2.如果没有选中文件则取消
    if (!files){
        return
    }
    //3.获得选择的文件对象
    var f = files[0]
    //4.初始化新的文件读取对象，浏览器自带，不用导入
    var reader = new FileReader();
    //5.绑定FileReader对象读取文件对象时的触发方法
    reader.onload = function(e){
        //7.获取文件二进制数据流
        var data = e.currentTarget.result;
        //8.利用XLSX解析二进制文件为xlsx对象
        var wb = XLSX.read(data,{type:'binary'})
        //9.利用XLSX把wb第一个sheet转换成JSON对象
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
		//wb.Sheets[Sheet名]获取第一个Sheet的数据
        var j_data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        //10.在终端输出查看结果
        //不过在这里因为是object不能显示在页面上
        console.log(j_data)
    }
    //6.使用reader对象以二进制读取文件对象f，
    reader.readAsBinaryString(f)
    
}


var tt = importFileDemo('covid_test1', )

console.log(tt)

