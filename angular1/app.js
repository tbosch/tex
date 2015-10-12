var m = angular.module("demo", []);

class Talk {
  select(value) {
		this.selected = value;
	}

  add() {
    this.confTalks.addTalk(this);
  }

  // this is just for sorting
  remove() {
    this.confTalks.removeTalk(this);
  }

  moveTalk(newIndex) {
    this.confTalks.move(this, newIndex);
  }
}

/**
 * Notes to Tobias
 *
 * I do not actually project the light dom properly here. Please update the examples to do that in some form.
 */
m.directive('talk', () => ({
	template: `
    <a href="/talks/{{id}}" ng-class="\{selected: ctrl.selected\}">
       Speaker: {{ctrl.speaker}}
    </a>
    <div ng-transclude></div>
	`,
	require: '^confTalks',
	restrict: 'E',
	transclude: true,
	scope: {
		id: "@",
		speaker: "@"
	},
	controller: Talk,
	controllerAs: 'ctrl',
	link: (scope, element, attrs, confTalksCtrl) => {
		confTalksCtrl.addTalk(scope.ctrl);

    scope.ctrl.confTalks = confTalksCtrl;
		scope.ctrl.id = scope.id;
		scope.ctrl.speaker = scope.speaker;
    scope.ctrl.add();

    scope.$on("destroy", () => {
      scope.ctrl.remove();
    });
	}
}));


class ConfTalks {
	constructor($timeout) {
		this.talks = [];
		this.filters = null;
    this.timeout = $timeout;
		this._speakerFilter = "";
	}

	addTalk(talk) {
		this.talks.push(talk);
	}

  // this is just for sorting
  removeTalk(talk) {
    this.talks.splice(this.talks.indexOf(talk), 1);
  }

  moveTalk(talk, newIndex) {
    this.talks.splice(this.talks.indexOf(talk), 1);
    this.talks.splice(newIndex, 0, talk);
  }

	set speakerFilter(value) {
		this._speakerFilter = value;
		this.debounceSelectFirstTalkMatchingFilters(value);
	}

	get speakerFilter() {
		return this._speakerFilter;
	}

	debounceSelectFirstTalkMatchingFilters(value) {
		if (this.filters.$valid) {
			clearTimeout(this.timer);
			this.timer = this.timeout(() => {
				this.selectFirstTalkMatchingSpeaker(value);
			}, 500);
		}
	}

  selectFirstTalkMatchingSpeaker(speaker) {
    var t = this.talks;
    t.forEach(t => t.select(false));

    var matchingTalks = t.filter(t => t.speaker.indexOf(speaker) > -1);
    if (matchingTalks.length > 0) {
      matchingTalks[0].select(true);
    }
  }
}

m.directive('confTalks', () => ({
	template: `
		<form name="ctrl.filters">
			Speaker filter: <input ng-model="ctrl.speakerFilter" required>
		</form>
    <ul>
      <div ng-transclude></div>
    </ul>
	`,
	restrict: 'E',
	transclude: true,
	controller: ConfTalks,
	controllerAs: 'ctrl'
}));


m.directive('content', () => ({
	template: `
		<conf-talks>
			<talk id="1" speaker="Igor Minar">
				<short-title>Meditation</short-title>
				<description>Meditation <b>Description</b></description>
			</talk>

			<talk id="2" speaker="Jeff Cross">
				<short-title>Data</short-title>
				<description>Super Http</description>
			</talk>
		</conf-talks>
	`,
	scope: {},
	restrict: 'E'
}));

var el = document.querySelector("#content");
angular.bootstrap(el, ["demo"]);