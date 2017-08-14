 var fib = function (n) {
   if (n < 2) return n;
   return fib(n - 1) + fib(n - 2);
 };
 
 var Obj = function() { };
 Obj.prototype.doSomething = function(arg1_) {
   var callback_ = arguments[arguments.length - 1];
   callback = (typeof(callback_) == 'function' ? callback_ : null);
   var arg1 = typeof arg1_ === 'number' ? arg1_ : null;

   /* We can’t rely on throw...catch in an asynchronous world, so the error handling 
    * must be handled in the Error object in the callback. */
   if (!arg1)
     return callback(new Error('first arg missing or not a number'));
  
   // https://nodejs.org/api/process.html#process_process_nexttick_callback_args
   process.nextTick(() => {
      // block on CPU
      var data = fib(arg1);
      callback(null, data);
   });
 }
 
 var test = new Obj(), 
     number = 10;
 
 test.doSomething(number, (err,value) => {
   if (err)
     console.error(err);
   else
     console.log('fibonacci value for %d is %d', number, value);
 });
 
 console.log('called doSomething');
