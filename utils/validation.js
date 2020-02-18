
let isValid = function(data){
    if(data == "" || data == null || data == undefined) return false
    return true
}

let isAllValid = function(){
    const len = arguments.length
    for(let i = 0; i < len; i++){
        if( !isValid(arguments[i]) ) return false // if any argument is null or "" or undefined
    }
    return true
}

const validation = {
    isValid,
    isAllValid
}

module.exports = validation