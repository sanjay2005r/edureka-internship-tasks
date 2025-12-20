// QUESTION 1 ==>
// let num = 12641115;
// let str = num.toString();
// let newstring = "";
// function reversestring(str){    
//     for (i=str.length - 1; i>=0; i--){
//         newstring += str[i];
//     }
//     return newstring;
// }
// console.log(num);
// console.log(reversestring(str));

// let strtonum = parseInt(newstring);
// // console.log(strtonum, typeof strtonum);
// if (num === strtonum){
//     console.log("Its a palindrome");
// }
// else{
//     console.log("Not a palindrome");
// }

//========================================================================
// QUESTION 2 ===>

// function Failure(delaytime) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(new Error("Operation failed due to an error"));
//     }, delaytime);
//   });
// }

// Failure(5000)
//   .then(() => {
//     console.log("Success");
//   })
//   .catch((err) => {
//     console.log("Error occurred:", err.message);
//   });
//========================================================================

//QUESTION 3
// function wait1Sec() {
//   // some random unused variable
//   let temp = "just checking";

//   return new Promise((resolve, reject) => {
//     if (temp === "something-else") {
//       resolve("error happened");
//     }
//     setTimeout(() => {
//       console.log("1 second passed...");
//       reject("done"); 
//     }, 1000);
//   });
// }
// wait1Sec()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((err) => {
//     console.log("Caught:", err);
//   });
//========================================================


//QUESTION 4 
// function fetchValue(num) {
//   const delay = Math.floor(Math.random() * 2000);

//   return new Promise((resolve, reject) => {

//     if (num < 0) {
//       reject("Invalid number");
//     }

//     setTimeout(() => {
//       resolve("Value " + num);
//     }, delay);
    
//   });
// }
// let p1 = fetchValue(1);
// let p2 = fetchValue(-5);
// let p3 = fetchValue(3);
// console.log("Fetching values...");

// Promise.all([p1, p2, p3])
//   .then((results) => {
//     console.log("All values:", results);
//   })
//   .catch((err) => {
//     console.log("Error:", err);
//   });
// //=======================================================


// QUESTION 5 
function printNumbers(parameter) {
  let num = 1;

  let interval = setInterval(() => {
    console.log(num);
    num++;

    if (num > 5) {
      clearInterval(interval);
    }

  }, parameter);
}

printNumbers(1000);
