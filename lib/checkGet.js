exports.check = function(tags){
    let tag;
    for(let i = 0; i < tags.length; i++){
        tag = Number(tags[i]);
        if(isNaN(tags[i])){
            tags[i] = null;
        }
    }
    return tags;
};
