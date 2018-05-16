exports.idsFromForm = function (req) { 
    var ids = []

    for(var key in req.body){
        if(req.body[key] == "on"){
            ids.push(key)
        }
    }         
    return ids
}

exports.areEqual = function(){
    var len = arguments.length;
    for (var i = 1; i< len; i++){
       if (arguments[i] === null || arguments[i] !== arguments[i-1])
          return false;
    }
    return true;
 }

