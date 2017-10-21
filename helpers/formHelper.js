exports.idsFromForm = function (req) { 
    var ids = []

    for(var key in req.body){
        if(req.body[key] == "on"){
            ids.push(key)
        }
    }         
    return ids
}

