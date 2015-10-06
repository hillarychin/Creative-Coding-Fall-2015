var melanie; // this is gonna hold the text file
var thechapter; // this is gonna hold the current chapter
var font;
var currentchapter = 0;
var documentfrequency = {}; // initialize JSON

function preload() {
  melanie = loadStrings('./data/melaniemartinezlyrics.txt');
  font = loadFont('./data/Brandon_bld.otf');
}

function setup() {
  createCanvas(800, 600);
  textFont(font);
  thechapter=melanie[currentchapter].split(' '); // individual words
  frameRate(0.00001);
  doDF();
}

function draw() {
  background(255);
}

function doDF() // compute the document frequency
{
  
  for(var i = 0;i<melanie.length;i++) // go thru each chapter
    {
      for(var j = 0;j<thechapter.length;j++) // go thru each word in the chapter
      {
        if(documentfrequency.hasOwnProperty(thechapter[j]))
        {
          // the word is already in the data structure
          documentfrequency[thechapter[j]]++;
        }
        else
        {
          documentfrequency[thechapter[j]]=1;
        }
      }
    }
    
    for(var i = 0;i<melanie.length;i++) // go thru each chapter
    {
      if (thechapter[i] == 'and' || thechapter[i] == 'but' || thechapter[i] == "you're"){ thechapter.remove(i); }
    }
    
    for(i in documentfrequency)
    {
      
      if(documentfrequency[i]<75){
        console.log(i + ": " + documentfrequency[i]);
        fill(0);
        textSize(documentfrequency[i]*2);
        text(i, random(0, width), random(0, height));
      }
    }

}