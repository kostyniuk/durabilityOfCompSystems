const _ = require('lodash');

const helpers = {
  decrementEveryElement2dArray: arr => arr.map(innerArr => innerArr.map(el => --el)),
  incrementEveryElement: arr => arr.map(el => ++el),
  uniqArrOfArrays: arr => {
    const stringArray = arr.map(JSON.stringify);
    const uniqueStringArray = new Set(stringArray);
    const uniqueArray = Array.from(uniqueStringArray, JSON.parse);
    return uniqueArray;
  },
  reducerMultiplication: (accumulator, currentValue) => accumulator * currentValue,
  reducerSum: (accumulator, currentValue) => accumulator + currentValue
}

const fillWorkPercentage = (nodes, chances) => nodes.map((node, i) => ({id: node, chance: chances[i]})) 

const bfs = (adjacent, offset = 0) => {
  let adjustedToIndexes = helpers.decrementEveryElement2dArray(adjacent);
  let isNotPrepared = offset; 
  while (isNotPrepared) {
    adjustedToIndexes = helpers.decrementEveryElement2dArray(adjacent);
    isNotPrepared--;
  }
  adjustedToIndexes = helpers.decrementEveryElement2dArray(adjustedToIndexes);
  let queue = [{visited:{0:true},path:[0]}]
  const allPathes = [];
  console.log({adjustedToIndexes})
  return () => {
      while(queue.length){
        obj = queue.pop() // get last added path
        node = obj.path[obj.path.length-1] // get last visited node from that path
        visited = obj.visited
        if(node >= adjustedToIndexes.length || adjustedToIndexes[node].length == 0){ // we reached a leaf node
          const path = helpers.incrementEveryElement(obj.path);
          allPathes.push(path)
        } else {
          for(let i=0; i<adjustedToIndexes[node].length; i++){ // we need to add the neighbours not visited
            if(!visited[adjustedToIndexes[node][i]]){
              visited[adjustedToIndexes[node][i]] = true
              arr = obj.path.slice(0);
              arr.push(adjustedToIndexes[node][i]); queue.push({visited:JSON.parse(JSON.stringify(visited)),path:arr}) // deep copy of both
            }
          }
        }
      }
      console.log({allPathes})
      return allPathes.map(path => path.map(el => el + offset))
   }
}

const determineAllWorkableStates = (nodes, pathes) => {
  const fullPathes = []  
  pathes.map((path, k) => {
      let tempPathes = [[]]
      nodes.map(node => {
          if (path.includes(node.id)) {
            tempPathes = tempPathes.map(pathes => [...pathes, 1])
          } else {
              const afterModification = []
              tempPathes.map(cur => {
                const updated0 = [...cur, 0];  
                const updated1 = [...cur, 1];  
                afterModification.push(updated0, updated1)
              });
              tempPathes = afterModification;
          }
      })
      fullPathes.push(...tempPathes);
  })
  return helpers.uniqArrOfArrays(fullPathes);
}

const determineSystemWorkPercentage = (workStates, nodes) => {
    const chanceForEveryState = workStates.map(current => {
        const percentedVersion = current.map((node, i) => node ? nodes[i].chance : 1 - nodes[i].chance);
        return percentedVersion.reduce(helpers.reducerMultiplication)
    })
    return chanceForEveryState.reduce(helpers.reducerSum)
} 

const determineSystemCapability = (chances, adjacent) => {
    const nodesNumbers = _.range(1, _.size(adjacent) + 1);
    const nodes = fillWorkPercentage(nodesNumbers, chances)
    
    const allPathes1 = bfs(adjacent)();
    adjacent.shift()
    const allPathes2 = bfs(adjacent, 1)();
    const allPathes = [...allPathes1, ...allPathes2]
    console.log({allPathes})

    const allStates = determineAllWorkableStates(nodes, [...allPathes])
    const correctWorkPercent = determineSystemWorkPercentage(allStates, nodes)

    return correctWorkPercent
}

// const chancesToWorkCorrectlyExample = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.92, 0.94]
// const adjacentExample = [[2,3],[4, 5],[4,6, 8],[5, 6, 8],[6, 7],[7, 8],[],[]]

const chancesToWorkCorrectly11 = [0.68, 0.46, 0.22, 0.25, 0.96, 0.53, 0.13, 0.94]
const adjacent11 = [[3,4],[3, 5, 7],[4, 5, 7],[5, 6],[6, 7],[],[]]

const systemCapability = determineSystemCapability(chancesToWorkCorrectly11, adjacent11)

console.log({systemCapability})

module.exports = {determineSystemCapability};