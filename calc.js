function calc() {
// 'fun' represents a hyperbolic function with sensitivity parameters. (see Dallery et al., 2007)
// It takes inputs x and P and returns an array of calculated values based on the task data (defined in each specific task .js file).
	var fun = function(x, P) {
		// dd hyperbolic with sensitivity param (see Dallery et al., 2007)
		return x.map(function(xi){return (taskData.delAmount/(Math.pow((1+P[0]*xi),P[1])))})
	};
    // performs a calculation for each element xi in the input array x (delays) and returns an array of calculated values:
    // x.map(...) is used to iterate over each element xi in the x array and apply a function to it. It creates a new array containing the results of the function for each xi element.
    // function(xi){...} is an anonymous function defined to perform the calculation for each xi element. It takes xi as the input parameter.
    // (1 + P[0] * xi) calculates the value 1 + k * xi, where k is the first element (params[0]) of the params array passed to the fun function.
    // Math.pow((1 + P[0] * xi), P[1]) raises (1 + k * xi) to the power of a, where a is the second element (params[1]) of the params array.
    // taskData.delAmount / (Math.pow((1 + P[0] * xi), P[1])) divides taskData.delAmount by the result of step 4. It calculates the value of taskData.delAmount divided by (1 + k * xi)^a.
    // The resulting value is returned for each xi element, creating an array of calculated values corresponding to each xi element in the x array.
    // In summary, this line of code performs a calculation for each element xi in the x array using the parameters k and a.
    // It calculates taskData.delAmount divided by (1 + k * xi)^a and returns an array of calculated values.
  
// x and y variables are assigned the values of subjectData.delays and subjectData.indiffVals, respectively.
  var x = subjectData.delays; // array of delay values, defined and populated by the task script
  var y = subjectData.indiffVals; // array of indifference values from the specific task javascript file
  // in the calc function, these values are accessed and used for the calculations.

  // These x and y values  (delays and indifference values) are then passed as arguments to the fminsearch function, along with other parameters. 
  // The fminsearch function performs calculations and optimization based on the provided data to determine the optimal parameters params for the fun function.
  // the calc function uses the data stored in subjectData.delays and subjectData.indiffVals from the task script to perform further calculations and obtain the params values.


	var params = fminsearch(fun,[0.5,0.5],x,y);
	// params variable is assigned the result of calling the fminsearch function.
  	// It minimizes the fun function using the provided parameters and data.
	console.log(params);

	document.getElementById("results-k").textContent = "k: " + parseFloat(params[0]).toFixed(3);
	document.getElementById("results-a").textContent = "a: " + parseFloat(params[1]).toFixed(3);

	subjectData.kValue = params[0];
	subjectData.aValue = params[1];

	sendData();
	
	return params;
}


// fminsearch -- https://github.com/jonasalmeida/fminsearch
// fminsearch that appears to be a third-party library for optimizing functions.
// It provides an implementation of the Nelder-Mead optimization algorithm.
// The function takes a target function (fun), an initial parameter vector (Parm0), and input data (x and y).
// It performs the optimization process and returns the optimized parameter vector (P0).

var fminsearch=function(fun,Parm0,x,y,Opt){// fun = function(x,Parm)

	if(!Opt){Opt={}};
	if(!Opt.maxIter){Opt.maxIter=1000};
	if(!Opt.step){// initial step is 1/100 of initial value (remember not to use zero in Parm0)
		Opt.step=Parm0.map(function(p){return p/100});
		Opt.step=Opt.step.map(function(si){if(si==0){return 1}else{ return si}}); // convert null steps into 1's
	};
	if(typeof(Opt.display)=='undefined'){Opt.display=true};
	if(!Opt.objFun){Opt.objFun=function(y,yp){return y.map(function(yi,i){return Math.pow((yi-yp[i]),2)}).reduce(function(a,b){return a+b})}} //SSD

		var cloneVector=function(V){return V.map(function(v){return v})};
	var ya,y0,yb,fP0,fP1;
	var P0=cloneVector(Parm0),P1=cloneVector(Parm0);
	var n = P0.length;
	var step=Opt.step;
	var funParm=function(P){return Opt.objFun(y,fun(x,P))}//function (of Parameters) to minimize
	// silly multi-univariate screening
	for(var i=0;i<Opt.maxIter;i++){
		for(var j=0;j<n;j++){ // take a step for each parameter
			P1=cloneVector(P0);
			P1[j]+=step[j];
			if(funParm(P1)<funParm(P0)){ // if parm value going in the right direction
				step[j]=1.2*step[j]; // then go a little faster
				P0=cloneVector(P1);
			}
			else{
				step[j]=-(0.5*step[j]); // otherwiese reverse and go slower
			}
		}
		if(Opt.display){if(i>(Opt.maxIter-10)){console.log(i+1,funParm(P0),P0)}}
	}
	if (!!document.getElementById('plot')){ // if there is then use it
		fminsearch.plot(x,y,fun(x,P0),P0);
	}
	return P0
};
