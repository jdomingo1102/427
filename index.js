var keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 !@#$%^&*()-_=+[]{};:,.<>?";
var rep = {
    ";":"SEMICOLON",
    ":":"COLON",
    ",":"COMMA",
    ".":"PERIOD",
    " ":"SPACEBAR"
};
var types = ["press","hold"];
var currentKey = "";
var currentType = "";
var currentSeconds = 0;
var holdTimeout = null;
var holdStarted = false;
$(function(){
    window.onkeypress = function(){
        var x = event.keyCode;
        var y = String.fromCharCode(x);
        if (this.currentType == "press") {
            console.log("Press, key " + y);
            if (y.toUpperCase() == this.currentKey) {
                currentKey = "";
                drawLine(function(){
                    promptKey();
                });
            }
        }
    };
    window.onkeydown = function(){
        var x = event.keyCode;
        var y = String.fromCharCode(x);
        if (this.currentType == "hold") {
            if (y.toUpperCase() == this.currentKey && this.holdStarted != true) {
                this.holdStarted = true;
                this.holdTimeout = setTimeout(function(){
                    currentKey = "";
                    this.holdStarted = false;
                    drawLine(function(){
                        promptKey();
                    });
                }, (currentSeconds-1)*1000);
            }
        }
    };
    window.onkeyup = function(){
        var x = event.keyCode;
        var y = String.fromCharCode(x);
        if (this.currentType == "hold") {
            if (y.toUpperCase() == this.currentKey) {
                this.clearTimeout(this.holdTimeout);
                this.writeText(`You did not hold \u201c${this.currentKey}\u201d for all of ${this.currentSeconds} seconds.`, function(){
                    this.holdStarted = false;
                    drawLine(function(){
                        promptKey();
                    });
                });
                this.currentKey = "";
            }
        }
    };
    drawLine(function(){
        promptKey();
    });
    
});
function promptKey(){
    currentKey = keys.charAt(Math.floor(Math.random()*keys.length));
    //currentType = types[Math.floor(Math.random()*types.length)];
    currentType = "press";
    if (currentType == "afdskfghrdf") {
        writeText(`Please PRESS '${currentKey}' on your KEYBOARD.`);
    }
    if (currentType == "press") {
        currentSeconds = getRnd(0,0.2);
        var keytext = rep[currentKey] ? `<${rep[currentKey]}>` : `'${currentKey}'`;
        writeText(`> Please PRESS ${keytext} on your KEYBOARD for ${Math.round(currentSeconds*1000)}ms.`);
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function getRnd(min, max) {
    return (Math.random() * (max - min)) + min;
}
function drawLine(callback){
    writeText("---", callback);
}
function writeText(text, callback, delay){
    delay = delay || 25;
    var wrap = document.createElement("span");
    var str = "";
    var textsplit = text.split("");
    for (var x = 0; x < textsplit.length; x++) {
        setTimeout((function(x){
            return function(){
                var char = textsplit[x];
                str += char;
                $(wrap).text(str);
                $(".textwrapper")[0].scrollTop = $(".textwrapper")[0].scrollHeight;
            };
        })(x), x*delay);
    }
    setTimeout(function(){
        console.log(`Done typing, took ${textsplit.length*delay} milliseconds`);
        if (callback) callback(textsplit.length*delay);
    }, textsplit.length*delay);
    $(".textwrapper").append(wrap);
}