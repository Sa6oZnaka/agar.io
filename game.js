var myX, myY;
var CubeSize=60;
var Zoom=1;
var CamX=0;
var CamY=0;
var Size;
var Speed=500;
var myID;
var Color;
const PI = 22/7;
var Zoom2=1;
var PlayZone=50*CubeSize;
var BloopCount=300;

// Generate bloops //
var BloopsX=[];
var BloopsY=[];
var BloopSize=10;
for(var b=0;b<BloopCount;b++){
    BloopsX[b] = Math.random() * PlayZone;
    BloopsY[b] = Math.random() * PlayZone;
}
/////////////////////


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function respawn(){
    sharedStorage.setForMe("Size", Math.random() * 25+25);
    myX = Math.random() * 1000 - Size;
    myY = Math.random() * 1000 - Size;
        
    sharedStorage.setForMe("myX", myX);
    sharedStorage.setForMe("myY", myY);
}

function collision (p1x, p1y, r1, p2x, p2y, r2) {
    var a;
    var x;
    var y;

    a = r1 + r2;
    x = p1x - p2x;
    y = p1y - p2y;

    if ( a > Math.sqrt( (x*x) + (y*y) ) ) {
        //when u die
        return true;
    } else {
        return false;
    }   
}  

function initGame(){
    //set initial properties of current user
    sharedStorage.setForMe("myX", Math.random() * 1000);
    sharedStorage.setForMe("myY", Math.random() * 1000);
    
    sharedStorage.setForMe("Size", Math.random() * 25 + 25);
    sharedStorage.setForMe("Color", getRandomColor());
    
    //get properties for current user (no latency for this action)
    myX = sharedStorage.getForMe("myX");
    myY = sharedStorage.getForMe("myX");
    Size = sharedStorage.getForMe("Size");
    Color = sharedStorage.getForMe("Color");
}
mouseX=canvas.width/2;
mouseY=canvas.height/2;

function update() {
    var i;
    Speed = (Size/200)*2000+100;
    Zoom = 60 / Size;
    
    for(i=0;i<sharedStorage.list.length;i++){
        if(sharedStorage.getForMe("myX") == sharedStorage.getForUser(i,"myX")){
            myID=i;
        }
    }
    
    sharedStorage.setForMe("myX", myX);
    sharedStorage.setForMe("myY", myY);
    
    Size = sharedStorage.getForMe("Size"); 
    
    var gg;
    
    /// BLOOPS ///
    for(i=0;i<BloopCount;i++){
        gg = collision(myX, myY, Size-2*BloopSize, BloopsX[i], BloopsY[i], BloopSize);
        if(gg == true){
            var sum = PI * Size * Size + PI * BloopSize * BloopSize;
            BloopsX[i] = Math.random() * PlayZone; 
            BloopsY[i] = Math.random() * PlayZone;
            Size = Math.sqrt(sum / PI);
            sharedStorage.setForMe("Size" , Size);
        }
    }
    //////////////
    
    
    for(i=0;i<sharedStorage.list.length;i++){
        if(sharedStorage.getForUser(i, "Size") > Size){
            if(i != myID){
                gg = collision(sharedStorage.getForUser(i, "myX"), sharedStorage.getForUser(i, "myY"), sharedStorage.getForUser(i, "Size")-Size*2, myX, myY, Size);
                if(gg == true){
                    var sum = PI * Size * Size + PI * sharedStorage.getForUser(i, "Size") * sharedStorage.getForUser(i, "Size");
                    sharedStorage.setForMe("myX", -1000);
                    sharedStorage.setForMe("myY", -1000);
                    sharedStorage.setForUser(i,"Size",Math.sqrt(sum / PI));
                    sharedStorage.setForMe("Size" , 0);
                    Size=0;

                }
            }
        }
    }
    
      
    if(Size > 0){
        if(mouseX>0){
            var CenterX = canvas.width/2;
            if(mouseX < CenterX && myX - (canvas.width-mouseX)/Speed > 0){
                myX -= (canvas.width-mouseX)/Speed;
            }else{
                myX += mouseX/Speed;
            }
        }
        if(mouseY>0){
            var CenterY = canvas.height/2;
            if(mouseY < CenterY && myY - (canvas.width-mouseY)/Speed > 0){
                myY -= (canvas.height-mouseY)/Speed;
            }else{
                myY += mouseY/Speed;
            }
        }

        

        // Restrict Mouse movement
       
        
        CamX = canvas.width/2 - myX*Zoom;
        CamY = canvas.height/2 - myY*Zoom;
        
    } 
}


function draw() {
    var i,j;
    
    context.fillStyle = "rgb(92, 92, 92)";
    context.fillRect(0,0,canvas.width,canvas.height);
      
    for(i=Math.floor(CamX/CubeSize)*-1-1;i<Math.floor(CamX/CubeSize)*-1+Math.floor((canvas.width)/CubeSize)+1;i++){
        for(j=Math.floor(CamY/CubeSize)*-1-1;j<Math.floor(CamY/CubeSize)*-1+Math.floor((canvas.height)/CubeSize)+1;j++){
            if(i >= 0 && j >= 0 && i<PlayZone/CubeSize && j<PlayZone/CubeSize){
                context.fillStyle = "rgb(0, 0, 0)";
                context.fillRect(CubeSize*i+CamX,CubeSize*j+CamY,(CubeSize-1),(CubeSize-1));
            }else{
                context.fillStyle = "rgb(62, 62, 62)";
                context.fillRect(CubeSize*i+CamX,CubeSize*j+CamY,(CubeSize-1),(CubeSize-1));
            }
        }
    }
    
    // BLOOPS //
    for(i=0;i<BloopCount;i++){
        context.beginPath();
        context.arc(BloopsX[i]*Zoom+CamX,BloopsY[i]*Zoom+CamY,BloopSize*Zoom,0,2*Math.PI);
        context.closePath();
        context.fillStyle = "#FFF";
        context.fill();
    }
    ///////////
    
    for (i=0; i<sharedStorage.list.length; ++i){
        if (sharedStorage.list[i]){
            context.beginPath();
            context.arc(sharedStorage.getForUser(i, "myX")*Zoom+CamX,sharedStorage.getForUser(i, "myY")*Zoom+CamY,sharedStorage.getForUser(i, "Size")*Zoom,0,2*Math.PI);
            context.closePath();
            context.fillStyle = sharedStorage.getForUser(i, "Color");
            context.fill();
         }
    }
    
    if(Size == 0){
        context.fillStyle = "rgba(0, 0, 0, 0.63)";
        context.fillRect(0,0,canvas.width,canvas.height);

        context.fillStyle = "rgb(255, 255, 255)";
        context.font = "20px Arial";
        context.fillText("YOU ARE DEAD" , canvas.width/2-70, canvas.height/2);
        
        context.fillStyle = "rgb(255, 255, 255)";
        context.font = "16px Arial";
        context.fillText("Click to restart" , canvas.width/2-50, canvas.height/2+30);
    }
    
    context.fillStyle = "rgb(0, 186, 255)";
    context.font = "20px Arial";
    context.fillText("Garlic.io BETA 2.1.2" , 20, 20);
    
    context.fillStyle = "rgb(255, 255, 255)";
    context.font = "20px Arial";
    context.fillText("Score: " + Math.floor(Size) , 20, canvas.height-20);
    
    context.fillStyle = "rgb(255, 255, 255)";
    context.font = "20px Arial";
    context.fillText("Y=" + Math.floor(myY/CubeSize) + " , X=" + + Math.floor(myX/CubeSize) , canvas.width-150, canvas.height-20);
    
    context.beginPath();
    context.arc(mouseX,mouseY,10,0,2*Math.PI);
    context.closePath();
    context.strokeStyle = "rgb(255, 0, 235)";
    context.stroke();
}

function keyup(key) {
	// Show the pressed keycode in the console
	console.log("Pressed", key);
}
function mouseup() {
	// Show coordinates of mouse on click
	console.log("Mouse clicked at", mouseX, mouseY);
    
    if(Size == 0){
        respawn();
    }
    
}

/*
    ROADMAP
+Adding Eating 
+Adding Size
+Adding Grid
+Adding Fixed Camera
+Adding Bloops
+Adding Zoom
+Adding Circular Object
+Adding Score
-Adding Letherboard
+Adding Small Objects for eating
-Limitig Map
-Optimisations
-Bug Fixing

-Relase


*/
