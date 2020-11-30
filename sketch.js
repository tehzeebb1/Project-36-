var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState = "Hungry";
var readState; 

function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage("dogImg1.png");

garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png")
bedroom=loadImage("Bed Room.png");

}

function setup() {
  database=firebase.database();
  createCanvas(800,500);

  foodObj = new Food();

  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;


  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


  var readStateRef = database.ref('gameState');
  readStateRef.on("value",function(data){gameState=data.val();})

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
}

function draw() {
 
  
  currentTime=second();
 if(currentTime===(lastFed+1))
 {
  updateState("Playing");
   foodObj.garden();
 }
 else if(currentTime===(lastFed+2))
 {
  updateState("Sleeping");
   foodObj.bedroom();
 }
 else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4))
 {
  updateState("Bathing");
   foodObj.washroom();
 }
  else
  {
    updateState("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry")
 {
   feed.hide();
   addFood.hide();
   dog.remove();
 }
 else
 {
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
 }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function updateState(state)
{
  console.log("Game state is:" +state);
 database.ref('/').update({
     gameState:state
    });
}

