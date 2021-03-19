const {determineSystemCapability} = require('./lab2');

const helpers = {
  factorial: n => n === 0 ? 1 : Array(n).fill(null).map((e,i)=>i+1).reduce((p,c)=>p*c)
}

const calculateT = (P, hours) => -hours / Math.log(P)
const calculateQreserved = (multiplicity, Q) => (1 / helpers.factorial(multiplicity + 1)) * Q
const calculateG = (qOrdinar, qReserved) => qReserved / qOrdinar
const calculatePandQ =(nodes, multiplicity) => {
  const ps = nodes.map(chance => 1 - (Math.pow(1 - chance, multiplicity + 1)))
  const qs = ps.map(p => 1 - p)
  return {qs, ps}
} 
const hours = 1000;
const multiplicity = 1
const chancesToWorkCorrectlyExample = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.92, 0.94]
const adjacentExample = [[2,3],[4, 5],[4,6, 8],[5, 6, 8],[6, 7],[7, 8],[],[]]

const P = determineSystemCapability(chancesToWorkCorrectlyExample, adjacentExample)
const Q = 1 - P;
const T = calculateT(P, hours);
const Qreserved = calculateQreserved(multiplicity, Q);
const Preserved = 1 - Qreserved
const Treserved = calculateT(Preserved, hours);
const Gp = calculateG(P, Preserved);
const Gq = calculateG(Q, Qreserved);
const Gt = calculateG(T, Treserved);
const elementsPandQ = calculatePandQ(chancesToWorkCorrectlyExample, multiplicity)

const PresSystem = determineSystemCapability(elementsPandQ.ps, adjacentExample);
const QresSystem = 1 - PresSystem;
const TresSystem = calculateT(PresSystem, hours);
const GpNew = calculateG(P, PresSystem);
const GqNew = calculateG(Q, QresSystem);
const GtNew = calculateG(T, TresSystem);

console.log({
  P, Q, T,
  Qreserved, Preserved, Treserved, 
  Gp, Gq, Gt, 
  PresSystem, QresSystem, TresSystem, 
  GpNew, GqNew, GtNew
})

console.log({Result: GtNew})