
 var sum = 10;

 if(true) {
   let sum = 19;
 }

 console.log(sum);

 function NewObj(name) {
   this.name = name;
 }

 /** Usage of this without arrow function, would lead to 
  * undefined error */
  NewObj.prototype.doLater = function() {
    setTimeout(() => console.log(this.name), 1000);
  };

  var obj = new NewObj('shelley');
  obj.doLater();

