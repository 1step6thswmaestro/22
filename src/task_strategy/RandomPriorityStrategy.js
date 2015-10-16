function RandomPriorityStrategy(){

}

RandomPriorityStrategy.prototype.ready = function(){}

RandomPriorityStrategy.prototype.calculate = function(task){
	return Math.random() * 10;
}

module.exports = RandomPriorityStrategy;