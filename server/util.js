var util = {
  setResData: function(status, msg = null, data = null, metadata = null){
    var res = {}
    
    if(status === true){
      res.status = "success"
    }else{
      res.status = "error"
    }

    if(msg)
      res.message = msg;

    if(data)
      res.data = data;

    if(metadata)
      res.metadata = metadata

    return res
  }
}

module.exports = {
  util,
};