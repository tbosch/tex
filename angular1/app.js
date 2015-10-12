var m = angular.module("demo", []);

m.directive("templateRef", () => ({
  restrict: 'A',
  multiElement: true,
  transclude: "element",
  require: '^confTalks',
  terminal: true,
  $$tlb: true,
  scope: {
    'name':'@'
  },
  compile: (element, attrs) => {
    return ($scope, el, attrs, ctrl, transclude) => {
      ctrl.addTemplate($scope.name, (talk) => {
        var scope = $scope.$new(true);
        scope.talk = talk;
        transclude(scope, (clone) => {
          el[0].parentNode.appendChild(clone[0]);
        });
      })
    };
  }
}));


class ConfTalks {
  constructor($timeout) {
    this.templates = {};
    this._speakerFilter = null;
    this._titleFilter = null;
    this.filters = null;
    this.timeout = $timeout;
  }

  set talks(talks) {
    this._talks = talks;
  }

  addTemplate(templateName, fn) {
    this.templates[templateName] = fn;
    this.rerender();
  }

  rerender() {
    if (!this.templates['row-template']) {
      throw new Error("Row template must be specified");
    }
    this._talks.forEach(t => this.templates['row-template'](t));
  }

  set speakerFilter(value) {
    this._speakerFilter = value;
    this.selectAfterHalfASecond();
  }

  get speakerFilter() {
    return this._speakerFilter;
  }

  set titleFilter(value) {
    this._titleFilter = value;
    this.selectAfterHalfASecond();
  }

  get titleFilter() {
    return this._titleFilter;
  }

  selectAfterHalfASecond(value) {
    clearTimeout(this.timer);
    if (this.filters.$valid) {
      this.timer = this.timeout(() => {
        this.selectTalk(value);
      }, 500);
    }
  }

  selectTalk() {
    this._talks.forEach(t => t.selected = false);

    var matchingTalks = this._talks.filter(t => {
      var speakerMatched = t.speaker.indexOf(this.speakerFilter) > -1;
      var titleMatched = t.title.indexOf(this.titleFilter) > -1;
      return (speakerMatched || !this.speakerFilter) && (titleMatched || !this.titleFilter);
    });

    if (matchingTalks.length > 0) {
      matchingTalks[0].selected = true;
    }
  }
}

m.directive("confTalks", () => ({
  template: `
    <form name="ctrl.filters">
			Speaker: <input ng-model="ctrl.speakerFilter" minlength="3">
			Title: <input ng-model="ctrl.titleFilter" minlength="3">
		</form>
    <ul>
      <ng-transclude></ng-transclude>
    </ul>
	`,
  restrict: 'E',
  transclude: true,
  controller: ConfTalks,
  controllerAs: 'ctrl',
  scope: {
    talks: '='
  },
  bindToController: true
}));

class App {
  constructor() {
    this.data = [
      {id: 1, title: 'Data Fetching', speaker: 'Jeff Cross', description: 'Data Description'},
      {id: 2, title: 'Meditate', speaker: 'Igor Minar', description: 'Meditation'}
    ]
  }
}

m.directive('content', () => ({
	template: `
		<conf-talks talks="ctrl.data">
			<div template-ref name="row-template">
        <li>
          <a href="/talks/{{talk.id}}" ng-class="{selected: talk.selected}">
            {{talk.title}} by {{talk.speaker}}
          </a>
          <p>{{talk.description}}</p>
        </li>
			</div>
		</conf-talks>
	`,
	scope: {},
	restrict: 'E',
  controller: App,
  controllerAs: 'ctrl'
}));

var el = document.querySelector("#content");
angular.bootstrap(el, ["demo"]);