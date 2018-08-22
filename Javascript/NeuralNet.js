var iNodes;
var hNodes;
var oNodes;

var whi;
var whh;
var woh;


class NeuralNet {
    constructor(inputs, hiddenNo,  outputNo) {
        this.inputs = inputs;
        this.hiddenNo = hiddenNo;
        this.outputNo = outputNo;
      iNodes = this.inputs;
      oNodes = this.outputNo;
      hNodes = this.hiddenNo;
  
      whi = new Matrix(hNodes, iNodes +1);
      whh = new Matrix(hNodes, hNodes +1);
      woh = new Matrix(oNodes, hNodes +1);  
  
      whi.randomize();
      whh.randomize(); 
      woh.randomize();
    }
} 
  
    function mutate(mr) {
      whi.mutate(mr);
      whh.mutate(mr);
      woh.mutate(mr);
    }
  
  
    function output(inputsArr) {
      var inputs = woh.singleColumnMatrixFromArray(inputsArr); 
      var inputsBias = inputs.addBias();
      var hiddenInputs = whi.dot(inputsBias);
      var hiddenOutputs = hiddenInputs.activate();
      var hiddenOutputsBias = hiddenOutputs.addBias();
      var hiddenInputs2 = whh.dot(hiddenOutputsBias);
      var hiddenOutputs2 = hiddenInputs2.activate();
      var hiddenOutputsBias2 = hiddenOutputs2.addBias();
      var outputInputs = woh.dot(hiddenOutputsBias2);
      var outputs = outputInputs.activate();
      return outputs.toArray();
    }
  
    NeuralNet.prototype.crossover = function(partner) {
      var child = new NeuralNet(iNodes, hNodes, oNodes);
      child.whi = whi.crossover(partner.whi);
      child.whh = whh.crossover(partner.whh);
      child.woh = woh.crossover(partner.woh);
      return child;
    }
  
    NeuralNet.prototype.clone = function() {
      var clone  = new NeuralNet(iNodes, hNodes, oNodes); 
      clone.whi = whi.clone();
      clone.whh = whh.clone();
      clone.woh = woh.clone();
  
      return clone;
    }

   function NetToTable() {
      var t = new Table();
  

      var whiArr = whi.toArray();
      var whhArr = whh.toArray();
      var wohArr = woh.toArray();
  
      for (var i = 0; i< max(whiArr.length, whhArr.length, wohArr.length); i++) {  t.addColumn();  }
      var tr = t.addRow();
      for (var i = 0; i< whiArr.length; i++) {  tr.setFloat(i, whiArr[i]);  }
  
      tr = t.addRow();
  
      for (var i = 0; i< whhArr.length; i++) {    tr.setFloat(i, whhArr[i]);  }
  
      tr = t.addRow();
  
      for (var i = 0; i< wohArr.length; i++) {  tr.setFloat(i, wohArr[i]);  }

      return t;
    }
  
    function TableToNet(t) {
      var whiArr = new float[whi.rows * whi.cols];
      var whhArr = new float[whh.rows * whh.cols];
      var wohArr = new float[woh.rows * woh.cols];
  
      var tr = t.getRow(0);
  
      for (var i = 0; i< whiArr.length; i++) { whiArr[i] = tr.getFloat(i); }
  
      tr = t.getRow(1);
  
      for (var i = 0; i< whhArr.length; i++) { whhArr[i] = tr.getFloat(i); }

      tr = t.getRow(2);
  
      for (var i = 0; i< wohArr.length; i++) {  wohArr[i] = tr.getFloat(i);  }
  
      whi.fromArray(whiArr);
      whh.fromArray(whhArr);
      woh.fromArray(wohArr);
    }