function setTransform(element,value){
    element.style.webkitTransform = value;
    element.style.MozTransform = value;
    element.style.msTransform = value;
    element.style.OTransform = value;
    element.style.transform = value;
}

function rotateFront(){
    var element =  document.querySelector("._3dbox");
    setTransform(element, "rotateY(0deg)");
}

function rotateLeft(){
    var element =  document.querySelector("._3dbox");
    setTransform(element, "rotateY(90deg)");
}

function rotateRight(){
    var element =  document.querySelector("._3dbox");
    setTransform(element, "rotateY(-90deg)");
}

function rotateBack(){
    var element =  document.querySelector("._3dbox");
    setTransform(element, "rotateY(180deg)");
}

function rotateTop(){
    var element =  document.querySelector("._3dbox");
    setTransform(element, "rotateX(-90deg)");
}

function rotateBottom(){
    var element =  document.querySelector("._3dbox");
    setTransform(element, "rotateX(90deg)");
}
;
