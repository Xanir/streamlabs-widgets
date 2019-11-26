
var WidgetGoalCircle = function(el, initValues) {
  var widget = this;
	widget.update = widget.update.bind(widget);
	widget.transitionBlur = widget.transitionBlur.bind(widget);
	widget.displayPercent = widget.displayPercent.bind(widget);
	widget.displayNumbers = widget.displayNumbers.bind(widget);

	var template = `	
		<div class="goal-circle">
			<div class="goal-circle-text">
				<div class="goal-circle-current"></div>
				<div class="goal-circle-sep"></div>
				<div class="goal-circle-total"></div>
			</div>
		</div>
	`;

	widget.elValueCurrent = null;
	widget.elValueTotal = null;
	widget.elValueSep = null;
	widget.elTextContainer = null;

	var displayPercentTime = 15 * 1000;
	var displayNumberTime = 15 * 1000;

	var fullTransition = null;
	fullTransition = function() {
		window.setTimeout(function() {
		widget.transitionBlur(widget.displayPercent);
			window.setTimeout(function() {
				widget.transitionBlur(widget.displayNumbers);
				fullTransition();
			}, displayPercentTime)
		}, displayNumberTime)
	};

	widget.data = initValues;

	window.requestAnimationFrame(function() {
		el.innerHTML = template;
		displayPercentTime = (+widget.data.settings.custom_json.displayTimePercent.value) * 1000;
		displayNumberTime = (+widget.data.settings.custom_json.displayTimeNumber.value) * 1000;

		widget.elTextContainer = el.querySelector('.goal-circle-text');
		widget.elValueCurrent = el.querySelector('.goal-circle-current');
		widget.elValueTotal = el.querySelector('.goal-circle-total');
		widget.elValueSep = el.querySelector('.goal-circle-sep');

		widget.update(widget.data);

		fullTransition();
	});

}
WidgetGoalCircle.prototype.update = function(data) {
	this.data = data;
	this.displayNumbers();
}
WidgetGoalCircle.prototype.transitionBlur = function(changeDisplayFn) {
  var widget = this;

	widget.elTextContainer.classList.add('blurOut');
	window.setTimeout(function() {	

		window.requestAnimationFrame(function() {
			widget.elTextContainer.classList.add('blurIn');
			widget.elTextContainer.classList.remove('blurOut');
			
			changeDisplayFn()
			
			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					widget.elTextContainer.classList.remove('blurIn');
				})
			}, 0.4*1000)
		})
	}, 0.4*1000)

}	

WidgetGoalCircle.prototype.displayPercent = function() {
	this.elValueCurrent.innerText = ''+'%';
	this.elValueTotal.style.display = 'none';
	this.elValueSep.style.display = 'none';
	var percentComplete = (+this.data.amount.current) / (+this.data.amount.target);
	percentComplete = Math.floor(percentComplete * 100);
	this.elValueCurrent.innerText = ''+percentComplete+'%';
}

WidgetGoalCircle.prototype.displayNumbers = function() {
	this.elValueTotal.style.display = 'block';
	this.elValueSep.style.display = 'block';
	this.elValueCurrent.innerText = ''+this.data.amount.current;
	this.elValueTotal.innerText = ''+this.data.amount.target;
}

var goal = null;
document.addEventListener('goalLoad', (function(obj) {
	var data = obj.detail;
	var goalContainer = document.querySelector('.goal-container');
	goal = new WidgetGoalCircle(goalContainer, data);

    var font =  data.settings.font;
    var background_color =  data.settings.custom_json.colorOfBackground.value;
    var textColor =  data.settings.custom_json.colorOfText.value;
    var bar_color =  data.settings.custom_json.colorOfRing.value;
    var fontSize =   data.settings.custom_json.fontSize.value;
    var styleSheetEl =  document.createElement('link');
		styleSheetEl.setAttribute('rel', 'stylesheet')
		styleSheetEl.setAttribute('href', 'https://fonts.googleapis.com/css?family=Open+Sans&display=swap')
	var customStyles = document.createElement('style');
	customStyles.innerHTML = `
.goal-circle {
	font-family: 'Open Sans', sans-serif;
	font-size: ${(fontSize)/1}px;
	background-color: ${background_color};
	box-shadow: 0px 0px 6px 0px ${bar_color}, 0px 0px 4px 4px ${background_color}, inset 0px 0px 5px 1px ${bar_color};
}
.goal-circle-text {
	color: ${textColor};
}
.goal-circle-sep {
	width: 100%;
	height: 0px;
	box-shadow: 0px 0px 2px 1px ${textColor}, inset 0px 0px 2px 1px ${textColor};
}
`;

	document.querySelector('head').appendChild(styleSheetEl)
	document.querySelector('head').appendChild(customStyles)
}));

document.addEventListener('goalEvent', function(obj) {
	goal.update(obj.detail);
});