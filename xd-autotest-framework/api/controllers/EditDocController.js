/**
 * EditDocController
 *
 * @description :: Server-side logic for managing Editdocs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var markdown = require('markdown-js');
var fs=require('fs');

module.exports = {

  editDoc:function (req,res) {
    console.log("hello,EditDoc.editDoc");
    var docName=req.body['docName'];
    console.log(docName);
    mongoService.Find('APIdoc',{name:docName},function (records) {
      res.view('doc/editdoc',{api_docs:records[0]});
    });
  },

  showMdFile:function (req,res) {
    if (req.body.hasOwnProperty("docName")) {
      var mdFileName = req.body["docName"];
      console.log("req.body.mdFileName=" + mdFileName);
      mongoService.Find('APIdoc', {name: mdFileName}, function (found) {
        if (found && found.length != 0) {
          var filename = __dirname + '/mdFiles/' + found[0].name;
          var data = '# ' + found[0].name;
          data += '\r\n### ' + (found[0].docDesc?found[0].docDesc:"暂无文档描述。");
          data += '\r\n### 接口';

          for (var i = 0; i < found[0].APIdoc_items.length; i++) {
            var docItem = found[0].APIdoc_items[i];
            data += '\r\n' + (i + 1) + '. ' + docItem.name;
            data += '\r\n\t* **url**';
            data += '\r\n\t\t* ' + docItem.url;
            data += '\r\n\t* **method**';
            data += '\r\n\t\t* ' + docItem.method;
            data += '\r\n\t* **disabled**';
            data += '\r\n\t\t* ' + docItem.disabled;
            data += '\r\n\t* **dataType**';
            data += '\r\n\t\t* ' + docItem.dataType;
            data += '\r\n\t* **header**';
            data += '\r\n\t\t* ' + JSON.stringify(docItem.header, null, 4);
            data += '\r\n\t* **queryParams**';
            data += '\r\n\t\t* ' + JSON.stringify(docItem.queryParams, null, 4);
          }

          fs.writeFile(filename, data, function () {
            console.log('内容写入文件完成');
            // 读入 Markdown 源文件
            var fileContent = fs.readFileSync(filename, 'utf8');
            var html = markdown.makeHtml(fileContent);
            res.send(html);
          });
        }
        else {
          res.send({retcode: -1, message: '没有找到APIdoc........',data:null});
        }
      });
    }
    else {
      res.send({retcode: -1, message: 'APIdoc查询报错........',data:null});
    }

  },

  testAPImd:function(req,res){

    var testItem={"ReqItems": [
        {
          "name": "第三方登录接口",
          "url": "http://192.168.88.242:8002/user/newLogin",
          "ReqFolderID": "93664a09-6e6b-c858-4430-a3be62796",
          "method": "POST",
          "createdAt": "2016-08-10T07:33:14.814Z",
          "updatedAt": "2016-08-10T07:33:14.814Z",
          "id": "57aad8ba13d9d549494dd554"
        },
        {
          "name": "首页接口",
          "url": "http://192.168.88.242:8020/selftaught/home",
          "ReqFolderID": "93664a09-6e6b-c858-4430-a3be62796",
          "method": "POST",
          "createdAt": "2016-08-10T07:33:14.814Z",
          "updatedAt": "2016-08-10T07:33:14.814Z",
          "id": "57aad8ba13d9d549494dd554"
        }
      ],
      "name": "首页接口业务场景用例",
      "desc": "暂时没有任务描述。"
    };



    var filename=__dirname+'/mdFiles/'+testItem.name;
    var data='# '+testItem.name;
    data+='\r\n### '+testItem.desc;
    data+='\r\n### 接口';
    for(var i=0; i<testItem.ReqItems.length;i++){
      var reqItem=testItem.ReqItems[i];
      data+='\r\n'+(i+1)+'. '+reqItem.name;
      data+='\r\n\t* **url**';
      data+='\r\n\t\t* '+reqItem.url;
      data+='\r\n\t* **method**';
      data+='\r\n\t\t* '+reqItem.method;
    }

    fs.writeFile(filename,data,function () {
      console.log('内容写入文件完成');
      // 读入 Markdown 源文件
      var fileContent = fs.readFileSync(filename, 'utf8');
      var html = markdown.makeHtml(fileContent) ;
      res.send(html,200);
    });

  },

  testUpdate:function(req,res) {
    var modelType = req.param("modelType");
    var queryString=req.param("param");
    var param2
    var item = {Task_name: "1", type: "1", Schedule_ID: param2, Schedule_desc: queryString};
    mongoService.Update(modelType, item,{Task_name:"1"},function(records){
      if(records){
        console.log("更新TaskFolder没有问题。。。");
      }else{
        console.log("有问题???");

      }
    });
  },

  testDelete:function(req,res){
   var modelType=req.param("modelType");

    mongoService.Delete(modelType,null);
  },

  testFind:function(req,res){
    var modelType=req.param("modelType");
    if(modelType=='TaskCase'){
      var taskID=req.param("TaskID");
      mongoService.Find(modelType,{TaskID:taskID},function(records){
        console.log(records);
        res.send(records);
      });
    }else{
      mongoService.Find(modelType,null,function(records){
        console.log(records);
        res.send(records);
      });
    }

  },

  testInsert:function(req,res) {
    if(req.param("type")==='Task'){
      var task_element = {Task_name: 'testTask', Schedule_ID: 1, Schedule_desc: '每周三09:00执行'};
      var task_output;
      var taskCase_output;
      mongoService.Insert('TaskFolder',task_element,function(records){
        task_output=records;
        console.log("+++++++"+JSON.stringify(task_output));
        var taskCase_element={name:'Case in task folder!',  url:"http://www.baidu.com", TaskID:records.id};
        mongoService.Insert('TaskCase',taskCase_element,function(records){
          taskCase_output=records;
          var data={task:task_output, taskCase: taskCase_output};
          console.log(data);
          res.send(data);
        });
      });
    }else if(req.param("type")==='Req'){
          var reqFolder={name:'个人中心接口集合'};
          mongoService.Insert('ReqFolder',reqFolder,function(records){
            var reqItem={name:'个人资料修改接口', url:'http://192.168.31.88:8002/selftaught/user/modifyMyInfo', ReqFolderID:records.id};
              mongoService.Insert('RequestItem',reqItem,function(records){
              res.send(records);
            });
          });
      }else{
      /*
      var ScheduleStrategyItem1={id:'ss00',schedule_time:'-',day_of_week:'-',schedule_period:'-',schedule_desc:'选择此策略则表示不会自动执行任务脚本。'};
      var ScheduleStrategyItem2={id:'ss01',schedule_time:'07:30',day_of_week:'-',schedule_period:'daily',schedule_desc:'选择此策略则表示每天07:30执行任务脚本。'};
      var ScheduleStrategyItem3={id:'ss02',schedule_time:'22:30',day_of_week:'Sunday',schedule_period:'weekly',schedule_desc:'选择此策略则每周日22：30执行任务。'};
      var ScheduleStrategyItem4={id:'ss03',schedule_time:'21:00',day_of_week:'workday',schedule_period:'weekly',schedule_desc:'选择此策略则表示每周周一到周五21:00执行任务脚。'};

      mongoService.Insert('ScheduleStrategy',ScheduleStrategyItem1,function(records){

      });
      mongoService.Insert('ScheduleStrategy',ScheduleStrategyItem2,function(records){

      });
      mongoService.Insert('ScheduleStrategy',ScheduleStrategyItem3,function(records){

      });

      mongoService.Insert('ScheduleStrategy',ScheduleStrategyItem4,function(records){

      });
       */

    }
  },

  testInsertDocItem:function(req,res){
    var apiDocRow={ name:'测试'+apiDocID+'.md'};
    var apiDoc_output;

    var isExisted=false;
    var foundRecords;
    APIdocServices.findAPIdocByName(APIdocItem.name,function(records){
      foundRecords=records;
    });
    if(isExisted){


    }else{

    }

    APIdocServices.insertAPIdocRecord(apiDocRow,function(records){
      apiDoc_output=records;
    });


    var docItemRow={name:'首页接口'+docItemID,
      url:'http://192.168.103.101:8020/selftaught/home', };
    var output;
    APIdocItemServices.insertAPIdocitemRecord(docItemRow,function(records){
      output=records;
    });


    APIdocServices.findAPIdocByName('',function(records){
      console.log(records);
    })
    //res.send(output);
    res.ok();

  },

};

