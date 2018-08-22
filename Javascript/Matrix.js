var rows;
var cols;
var matrix;

class Matrix {
    constructor(r, c) {
        this.r = r;
        this.c = c;
      rows = this.r;
      cols = this.c;
      matrix = new float[rows][cols];
    }
    
    constructor(m) {
        this.m = m
      matrix = this.m;
      cols = m.length;
      rows = m[0].length;
    }
}  
    
function output() {
      for (var i =0; i<rows; i++) {
        for (var j = 0; j<cols; j++) {
          prvar(matrix[i][j] + "  ");
        }
        console.log(" ");
      }
      console.log();
    }
    
function multiply(n) {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          matrix[i][j] *= n;
        }
      }
    }
  
  
    Matrix.prototype.dot = function(n) {
      var result = new Matrix(rows, n.cols);
     
      if (cols == n.rows) {
        for (var i =0; i < rows; i++) {
          for (var j = 0; j < n.cols; j++) {
            var sum = 0;
            for (var k = 0; k < cols; k++) {
              sum+= matrix[i][k]*n.matrix[k][j];
            }
            result.matrix[i][j] = sum;
          }
        }
      }
  
      return result;
    }
  
    function randomize() {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          matrix[i][j] = random(-1, 1);
        }
      }
    }
  
    function Add(n) {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          matrix[i][j] += n;
        }
      }
    }
  
    Matrix.prototype.add = function(n) {
      var newMatrix = new Matrix(rows, cols);
      if (cols == n.cols && rows == n.rows) {
        for (var i = 0; i < rows; i++) {
          for (var j = 0; j < cols; j++) {
            newMatrix.matrix[i][j] = matrix[i][j] + n.matrix[i][j];
          }
        }
      }
      return newMatrix;
    }
  

    Matrix.prototype.subtract = function(n) {
      var newMatrix = new Matrix(cols, rows);
      if (cols == n.cols && rows == n.rows) {
        for (var i =0; i < rows; i++) {
          for (var j = 0; j < cols; j++) {
            newMatrix.matrix[i][j] = matrix[i][j] - n.matrix[i][j];
          }
        }
      }
      return newMatrix;
    }
  

    Matrix.prototype.multiply = function(n) {
      var newMatrix = new Matrix(rows, cols);
      if (cols == n.cols && rows == n.rows) {
        for (var i = 0; i < rows; i++) {
          for (var j = 0; j < cols; j++) {
            newMatrix.matrix[i][j] = matrix[i][j] * n.matrix[i][j];
          }
        }
      }
      return newMatrix;
    }
  
    
    Matrix.prototype.transpose = function() {
      var n = new Matrix(cols, rows);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          n.matrix[j][i] = matrix[i][j];
        }
      }
      return n;
    }
  
    
    Matrix.prototype.singleColumnMatrixFromArray = function(arr) {
      var n = new Matrix(arr.length, 1);
      for (var i = 0; i < arr.length; i++) {
        n.matrix[i][0] = arr[i];
      }
      return n;
    }
    
    
    function fromArray(arr) {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          matrix[i][j] =  arr[j+i*cols];
        }
      }
    }
    
    
    function toArray() {
      var arr = new float[rows*cols];
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          arr[j+i*cols] = matrix[i][j];
        }
      }
      return arr;
    }
  
  
    Matrix.prototype.addBias = function() {
      var n = new Matrix(rows+1, 1);
      for (var i =0; i < rows; i++) {
        n.matrix[i][0] = matrix[i][0];
      }
      n.matrix[rows][0] = 1;
      return n;
    }
  
    
    Matrix.prototype.activate = function() {
      var n = new Matrix(rows, cols);
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          n.matrix[i][j] = sigmoid(matrix[i][j]);
        }
      }
      return n;
    }
    
    
    function sigmoid(x) {
      var y = 1 / (1 + pow(Math.E, -x));
      return y;
    }
    
    Matrix.prototype.sigmoidDerived = function() {
      var n = new Matrix(rows, cols);
      for (var  i =0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          n.matrix[i][j] = (matrix[i][j] * (1- matrix[i][j]));
        }
      }
      return n;
    }
  
  
    
    Matrix.prototype.removeBottomLayer = function() {
      var n = new Matrix(rows-1, cols);      
      for (var i =0; i<n.rows; i++) {
        for (var j = 0; j<cols; j++) {
          n.matrix[i][j] = matrix[i][j];
        }
      }
      return n;
    }
  
    
    function mutate(mutationRate) {
      for (var i =0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          var rand = random(1);
          if (rand < mutationRate) {
            matrix[i][j] += randomGaussian()/5;
            
            if (matrix[i][j]>1) {
              matrix[i][j] = 1;
            }
            if (matrix[i][j] <-1) {
              matrix[i][j] = -1;
            }
          }
        }
      }
    }
  
  
    Matrix.prototype.crossover = function(partner) {
      var child = new Matrix(rows, cols);
      var randC = floor(random(cols));
      var randR = floor(random(rows));
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
  
          if ((i< randR)|| (i==randR && j<=randC)) { 
            child.matrix[i][j] = matrix[i][j];
          } else { 
            child.matrix[i][j] = partner.matrix[i][j];
          }
        }
      }
      return child;
    }
  
    
    Matrix.prototype.clone = function() {
      var clone = new  Matrix(rows, cols);
      for (var i =0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          clone.matrix[i][j] = matrix[i][j];
        }
      }
      return clone;
    }