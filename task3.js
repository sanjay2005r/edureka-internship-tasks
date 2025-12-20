const fs = require("fs");
let text = fs.readFileSync("data.txt", "utf8");
text = text.replace(
  /(^|[.!?\n]["']?\s*)([a-z])/g,
  (match, p1, p2) => p1 + p2.toUpperCase()
);

const numRegex = /₹\d+(\.\d+)?|\$\d+(\.\d+)?|\d+(\.\d+)?%?/g;
const extractedNum = text.match(numRegex) || [];

const cleanedText = text.replace(numRegex, "");

let output = "";
output += "Extracted Numbers:\n";
output += extractedNum.join(", ");
output += cleanedText.trim();



fs.writeFileSync("output.txt", output, "utf8");
console.log("Task completed. Check output.txt");