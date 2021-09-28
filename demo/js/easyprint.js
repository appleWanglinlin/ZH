// https://get.webprinter.cn/default/6.1.1/easyprint.js
/**
 * Make integration of web apps with WebPrinter easy and quick
 * Usage:
 * <code>
 * 
 * </code>
 * @link https://webprinter.cn/
 * @file webprinter-easyprint.js
 * @author Jarez
 */
 ;(function(_global){

    var CONSTANTS={
        TASK_TYPE:{
            URL:"URL",
            HTML:"HTML",
            PDF_URL:"PDFURL",
            PDF_BASE64:"PDF"
        },
        TASK_PDFRENDERTYPE:{
            DIRECT:"DIRECT",
            WEB:"WEB"
        },
        TASK_HTMLRENDERTYPE:{
            CHROMIUM:"CHROMIUM",
            WEBKIT:"WEBKIT"
        },
        TASK_STATUS:{
            PRINTING:"PRINTING",//鎵撳嵃涓�
            SUBMITTED:"SUBMITTED",//宸叉彁浜�
            QUEUED:"QUEUED",//鎺掗槦涓�
            PRINTED:"PRINTED",//宸叉墦鍗�
            PARTIAL_PRINTED:"PARTIAL_PRINTED",//閮ㄥ垎宸叉墦鍗�
            FINISHED:"FINISHED",//瀹屾垚
            CANCELED:"CANCELED",//鐢ㄦ埛鍙栨秷
            ERROR:"ERROR"//鍑洪敊
        },
        CONFIG_ORIENTATION:{
            PORTRAIT:"PORTRAIT",//绾靛悜
            LANDSCAPE:"LANDSCAPE",//妯悜
            REVERSE_PORTRAIT:"REVERSE_PORTRAIT",//绾靛悜鍙嶈浆
            REVERSE_LANDSCAPE:"REVERSE_LANDSCAPE"//妯悜鍙嶈浆
        },
        CONFIG_COLOR:{
            COLOR:"COLOR",//褰╄壊
            MONOCHROME:"MONOCHROME"//榛戠櫧
        },
        CONFIG_SIDE:{
            ONESIDE:"ONESIDE",//鍗曢潰鎵撳嵃
            DUPLEX:"DUPLEX",//鍙岄潰鎵撳嵃
            TUMBLE:"TUMBLE"//缈绘粴(鍙岄潰)鎵撳嵃
        },
        CONFIG_COLLATE:{
            COLLATE:"COLLATE",//閫愪唤鎵撳嵃
            UNCOLLATE:"UNCOLLATE"//闈為€愪唤鎵撳嵃
        },
        CONFIG_SCALE:{
            NOSCALE:"NOSCALE",//鏃犵缉鏀�
            AUTO:"AUTO"//鑷€傚簲
        }
    }
    var dump=function(){
        function log(s){
            if(console){
                console.log(s);
            }
        }
        log("===============Dumping CONSTANTS Start================")
        for(var key in CONSTANTS){
            var values=CONSTANTS[key];
            for(var name in values){
                var value=values[name];
                console.log("webprinter.easy().constants()."+key+"."+name+"="+value);
            }
        }
        log("===============Dumping CONSTANTS End================")
    }

    var __uuid=0;
    function _uuid(){
        return ""+new Date().getTime()+__uuid++;
    }


     var _debug=false;
     if(_global.webprinter){
         return;
     }
     function consolelog(){
        if(_debug&&console&&console.log){
            var args=["easyprint"];
            if(arguments&&arguments.length){
                for(var i=0,len=arguments.length;i<len;i++){
                    args.push(arguments[i])
                }
            }
           console.log.apply(console,args)
        }
    }
    if(!_global.Strato&&!_global.Strato.WebPrinter){
        var message="WebPrinter.js is Required()";
        throw new Error(message)
     }
     function EMPTY_FN(){
         return function(){}
     }

     var wp=_global.Strato.WebPrinter.getInstance();

     var scope=EMPTY_FN();
     function _declareObject(name,props){//making a general js bean with metadata
        var ctor=EMPTY_FN();
        props=props||[];
        var proto=ctor.prototype;
        for(var i=0,len=props.length;i<len;i++){
            (function(i){
                var propName=props[i];
                var methodName="with_"+propName;
                proto[propName]=null;
                proto[methodName]=function(value){
                    this[propName]=value||null;
                    return this;
                }
            })(i)
        }
        scope[name]=ctor;
        return ctor;
     }

     function _extend(ctor,methods){
         var proto=ctor.prototype;
         for(var name in methods){
            (function(name){
                var method=methods[name];
                proto[name]=function(){
                    return method.apply(this,arguments);
                }
            })(name)
         }
     }

     var Paper=_declareObject("Paper",["name","width","height"]);
     var Config=_declareObject("Config",["pagesPerSheet","paper","copies","marginTop","marginBottom","marginLeft","marginRight","orientation","color","side","collate","repeats","pageRanges","scale","labels"]);
     var Task=_declareObject("Task",["id","name","printer","type","html","content","timeout","config","pdfRenderType","htmlRenderType","delay","headers","preview"]);
     _extend(Config,{
        with_zero_margins:function(){
            return this.with_marginTop(0).with_marginBottom(0).with_marginLeft(0).with_marginRight(0);
        }
     })
     _extend(Task,{
        headers:null,
        with_header:function(name,value){
            if(this.headers==null){
                this.headers={}
            }
            this.headers[name]=value;
            return this;
        },
        with_url:function(url){
            return this.with_content(url).with_type(CONSTANTS.TASK_TYPE.URL);
        },
        with_html:function(html){
            return this.with_content(html).with_type(CONSTANTS.TASK_TYPE.HTML);
        },
        with_pdfbase64:function(base64){
            return this.with_content(base64).with_type(CONSTANTS.TASK_TYPE.PDF_BASE64);
        }
     });
     var _queue=[];
     var _callbacks={};
     function _print(task){
        var _easyId=task._easyId=_uuid();
        //鍏堣繘闃熷垪
        consolelog("Enqueue Task",task)
        _queue.push(task);
        var success=EMPTY_FN();
        var fail=EMPTY_FN();
        var callback={
            success:function(fn){
                success=fn;
            },
            fail:function(fn){
                fail=fn;
            }
        }
        _callbacks[_easyId]={
            success:function(taskId){
                success(taskId);
            },
            fail:function(message){
                fail(message);
            }
        }
        return callback;
     }
     function _ready(callback){
         if(!callback){
            return;
         }
         if(wp.isConnected()){
            callback(wp);
         }else{
             wp.on("CONNECTED",function(){
                callback(wp);
             })
         }
     }
     function _observeConnection(callback){
        if(!callback){
            return;
        }
        function _(){
            if(wp.isConnected()){
                wp.getInfo(function(info){
                    callback(true,info);
                })
            }else{
                callback(false);
            }
        }
        _();
        wp.on("CONNECTED",function(){
            _();
        })
        wp.on("DISCONNECTED",function(){
            _();
        })
    }
    function _observeTasks(callback){
        if(!callback){
            return;
        }
        var interval=null;
        var runLock=false;
        function _(){
            if(wp.isConnected()){
                if(!interval){
                    interval=setInterval(function(){
                        if(runLock){
                            return;
                        }
                        runLock=true;
                        wp.listTasks([],function(tasks){
                            runLock=false;
                            callback(tasks);
                        })
                    },2000)
                }
            }else{
                if(interval){
                    var intervalToClear=interval;
                    interval=null;
                    clearInterval(intervalToClear);
                }
                callback([]);
            }
        }
        _();
        wp.on("CONNECTED",function(){
            _();
        })
        wp.on("DISCONNECTED",function(){
            _();
        })
    }
    function _observePrinters(callback){
         if(!callback){
            return;
         }
         function _(){
            wp.listPrinters(function(printers){
                wp.getDefaultPrinter(function(defaultPrinter){
                    callback&&callback(printers,defaultPrinter)
                })
            })
         }
         if(wp.isConnected()){
             _();
         }
         wp.on("CONNECTED",function(){
             _();
         })
         wp.on("DISCONNECTED",function(){
            callback&&callback([]);
        })
    }
     (function(){
        var _printing=false;
        function pollAndPrint(){
            if(_queue.length==0){
                return;
            }
            if(!wp.isConnected()){
                return;
            }
            if(!_printing){
                _printing=true;
            }
            var task=_queue.shift();
            consolelog("Dequeue task",task)
            if(!task.id){
                task.id=task.type+"_"+_uuid();
            }
            if(!task.name){
                task.name=task.id;
            }
            var _easyId=task._easyId;
            wp.newTask(task,function(taskId,status){
                _printing=false;
                var callback=_callbacks[_easyId];
                if(callback){
                    delete _callbacks[_easyId];
                    callback.success&&callback.success(taskId,status);
                }
            },function(message){
                _printing=false;
                var callback=_callbacks[_easyId];
                if(callback){
                    delete _callbacks[_easyId];
                    callback.fail&&callback.fail(message);
                }
            })
        }
        var _interval=null;
        function tryStartInterval(){
            if(!_interval){
                // consolelog("Start polling...")
                _interval=setInterval(function(){
                    pollAndPrint();
                },200)
            }
        }
        function tryStopInterval(){
            if(_interval){
                // consolelog("Stop polling...")
                var _intervalToClear=_interval;
                _interval=null;
                clearInterval(_intervalToClear)
            }
        }
        if(wp.isConnected()){
            tryStartInterval();
        }else{
            tryStopInterval();
        }
        wp.on("CONNECTED",function(){
            consolelog("WebPrinter CONNECTED")
            tryStartInterval();
        })
        wp.on("DISCONNECTED",function(){
            consolelog("WebPrinter DISCONNECTED")
            tryStopInterval();
        })
     })()

     _global.webprinter={
        easy:function(){
            return {
                config:function(){//鍒涘缓鎵撳嵃浠诲姟璁剧疆
                    return new Config();
                },
                paper:function(){//鍒涘缓绾稿紶璁剧疆
                    return new Paper();
                },
                task:function(){//鍒涘缓鎵撳嵃浠诲姟
                    return new Task();
                },
                print:function(task){//椤哄簭鍙戦€佹墦鍗颁换鍔★紝褰�
                    return _print(task);
                },
                enableDebug:function(){//鎵撳紑璋冭瘯鏃ュ織
                    _debug=true;
                },
                disableDebug:function(){//鍏抽棴璋冭瘯鏃ュ織
                    _debug=false;
                },
                wpInstance:function(){//寰楀埌Strato.WebPrinter瀹炰緥
                    return wp;
                },
                constants:function(){//寰楀埌鎵€鏈夌殑甯搁噺
                    var ret={
                        dump:dump
                    }
                    for(var k in CONSTANTS){
                        ret[k]=CONSTANTS[k];
                    }
                    return ret;
                },
                ready:function(callback){//褰揥ebPrinter杩炴帴鎴愬姛鏃舵墽琛屽洖璋�
                    _ready(callback);
                },
                observePrinters:function(callback){//鐩戝惉鎵撳嵃鏈哄垪琛�
                    _observePrinters(callback);
                },
                observeConnection:function(callback){//鐩戝惉涓庢帶浠剁殑杩炴帴鐘舵€�
                    _observeConnection(callback)
                },
                observeTasks:function(callback){//鐩墠閲囩敤杞鏂瑰紡鐩戝惉浠诲姟鍒楄〃
                    _observeTasks(callback);
                }
            }
        }
    };
})(window)
