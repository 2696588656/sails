/**
 * InterfaceDocController
 *
 * @description :: Server-side logic for managing Interfacedocs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * 根据入参的name, 来查找mongodb里的符合条件的记录。
   **/
    findRequestItemByName:function(req,res){
      var requestName="newLogin_API";
      DocService.testcallback(requestName,res,function (records) {
        if(records){
          var retres={retcode:0,retdesc:"success",data:records};
          res.send(retres);}
          else
          res.send({retcode:-1,retdesc:"syserror"})
      });

    },

    deleteRecordsByID:function(req,res){
        //var name="";
      RequestItem.destroy({name:"home"}).exec(function(err){
          //console.log("删除，ID："+name);
          //cb(null);
        });

      },

    testRequestService:function(req,res){

    var apiItem={id:"4",dev:"lidehong",disabled:false,name:"HOME3",
      url:"http://192.168.103.101:8020/selftaught/home",
      queryParam:{req:""},
      version:"1.0.0",description:"test !!!",method:"POST",headers:{module:"2",
        clientType:"ios",version:"1.0.0",clientIp:"127.0.0.1",deviceId:"testDeviceId123456",sessionToken:"token123"},
      mode:"urlencoded",response:""};


    //var apiItem = {name: "login", version: "1.0",dev: 'zhang', description: "it's a desc", url: "http://192.168.103.101:8002/user/newLogin", method: "POST", headers: {clientType: 'android',module: '2',version: '1.0',clientIp: '192.168.31.23',deviceId: 'MyTestDeviceID123'},mode:'urlencoded',queryParam:{req:'{\"platform\":\"local\",\"phoneNum\":\"18210191798\",\"pwd\":\"123456\"}'}};
    //if(mongoDb.contains(apiItem.id)) return err.existRecord.
    RequestItem.create(apiItem).exec(function(err,records){
      if(err){
        return res.serverError(err);
      }
      console.log("records.name is: %s",records.name);
      return res.send(JSON.stringify(records));
    });

    //var item=  //JSON.stringify(records);

    //var item= DocService.writeAPItoDB(apiItem);

  },

  testmyservice:function(req,res){
    /**
    var apiItem={id:"1",dev:"李德洪",disabled:false, version:"1.0.0",description:"登录接口newLogin",name:"登录接口newLogin",
      url:'http://192.168.88.242:8002/user/newLogin', queryParam:"req={\"platform\":\"local\",\"phoneNum\":\"13600800800\", " +
      "\"pwd\":\"123456\",\"registrationId\":\"testID123456\"}"};

    console.log("testmyservice:%s",apiItem.id);
    RequestItem.create(apiItem).exec(function createItem(err,records){ */

    var item={name:"Polly222",wingspn:"168.5000"};

    InterfaceDoc.create(item).exec(function(err,records){
      if (err) {
        return res.serverError(err);
      }
      console.log("records.name is: %s",records.name);

      var item=JSON.stringify(records);

      //var item= DocService.writeAPItoDB(apiItem);
      return res.send(item);
    });

  },

  testmydb: function(req,res){
    var item={name:"Polly",wingspn:"168.5"};
    console.log('info.........');

    var req={name:"Polly",wingspn:"168.5"};
    hello(req,res);
    console.log("invoke Interface.hello()function successfully!!");
    //
    InterfaceDoc.create(item).exec(function createCB(err,records){
      if(err){
        //res.send("create item record in mongo db failed!");
        res.send(err);
        //console.log(err);
      }
      else{

        InterfaceDoc.findOne({name:"Polly"}).exec(function (err, records) {
          if (!err) {
            // 刷新下一页
            res.send("success");
          }
          else {
            console.log(err);
            res.view('apidoc'); //输入route.js里的定义的路径名。
          }
        });

      }
    });
  },



};

