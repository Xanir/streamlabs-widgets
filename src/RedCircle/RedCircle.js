
var WidgetGoalRedCircle = function(el, initValues) {
  var widget = this;
	widget.update = widget.update.bind(widget);

	var template = `	
		<div class="red-circle">
			<div class="red-circle-text">
				<div class="red-circle-current"></div>
				<div class="red-circle-total"></div>
			</div>
		</div>
	`;

	widget.elValueCurrent = null;
	widget.elValueTotal = null;
	widget.elTextContainer = null;

	window.requestAnimationFrame(function() {
		el.innerHTML = template;
		widget.elTextContainer = el.querySelector('.red-circle-text');
		widget.elValueCurrent = el.querySelector('.red-circle-current');
		widget.elValueTotal = el.querySelector('.red-circle-total');
		widget.update(initValues);
	});
}
WidgetGoalRedCircle.prototype.update = function(data) {
	this.elValueCurrent.innerText = ''+data.amount.current;
	this.elValueTotal.innerText = ''+data.amount.target;
}

var goal = null;
document.addEventListener('goalLoad', (function(obj) {
	var goalContainer = document.querySelector('.goal-container');
	goal = new WidgetGoalRedCircle(goalContainer, obj.detail);
}));

document.addEventListener('goalEvent', function(obj) {
	goal.update(obj.detail);
});