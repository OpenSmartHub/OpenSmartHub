/* 
  // Device Type
  "Test":{ 
      "params":["null"],
      "triggers":{
      },
      "actions":{
        "hello":{"null"}
      }
    }
*/
function Test() {
  this.hello = function(inputs){
    console.log("hello was called");
    if(inputs){
      for(var input in inputs)
      {
        console.log(inputs[input]);
      }
    }
  };
};

module.exports = Test;

// Example Usage

/*

var testAction = new Test();
//testAction.hello();
testAction["hello"](["hi","peace"]);

*/