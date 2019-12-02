function data() {
  const originalJson = require('./original.json')
  return JSON.parse(JSON.stringify(originalJson))
}


// function expectDiff(result, { type, left, right, path }) {
// //console.log(result);
// let diffs = []

// diffs.push({type: type, path: path, left: left, right: right})
// expect(diffs[0]).toEqual(result[0])
  

// // const diffs = result.filter(diff =>
// // diff.type == type && diff.path == path && diff.left == left && diff.right == right)
// // expect(diffs.length).toBe(1)
// }

function expectDiff(result, expectArray){
  result.sort(sortByPath);
  let differences = [];

  for(let expectation of expectArray){
    differences.push({
      type: expectation.type,
      path: expectation.path,
      left: expectation.left,
      right: expectation.right})
  }
  differences.sort(sortByPath);
  
  expect(differences).toEqual(result)
}

function sortByPath(a, b){
  let firstObjPath = a.path.toLowerCase();
  let secondObjPath = b.path.toLowerCase();
  let firstObjType = a.type.toLowerCase();
  let secondObjType = b.type.toLowerCase();
  if(firstObjPath > secondObjPath){return -1};
  if(firstObjPath < secondObjPath){return 1};
  if(firstObjType > secondObjType){return -1}
  if(firstObjType < secondObjType){return 1}
}


function expectNoDiffs(result) {
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBe(0);
}

module.exports = {
  data,
  expectNoDiffs,
  expectDiff,
}
