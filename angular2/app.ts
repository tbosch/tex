import {bootstrap, ElementRef, Component, Directive, View, Injectable, NgModel, CORE_DIRECTIVES,FORM_DIRECTIVES, Input, ViewChild, QueryList, ContentChildren} from 'angular2/angular2';

@Component({
	selector: 'talk'
})
@View({
	template: `
    <a href="/talks/{{id}}" [class.selected]="selected">
      <ng-content select="short-title"></ng-content> by {{speaker}}
    </a>
    <p><ng-content select="description"></ng-content></p>
  `
})
class Talk {
	@Input() id:string;
	@Input() speaker:string;
	selected: boolean;

	select(state:boolean) {
		this.selected = state;
	}
}

@Component({selector: 'conf-talks'})
@View({
	directives: [FORM_DIRECTIVES],
	template: `
    Speaker filter: <input #speaker="form" ng-model required>
    <ul>
      <ng-content></ng-content>
    </ul>
  `
})
class ConfTalks {
	@ContentChildren(Talk) talks;
	@ViewChild("speaker") speaker;

	afterViewInit() {
		var speakerChanges = this.speaker.control.valueChanges._subject;
		speakerChanges.
    //filter(_ => this.speaker.valid).
		//debounce(500).
		subscribe(value => this.selectFirstTalkMatchingFilters(value));
	}

	selectFirstTalkMatchingFilters(speaker:string) {
		var t = this.talks._results;
		t.forEach(t => t.select(false));

		var matchingTalks = t.filter(t => t.speaker.indexOf(speaker) > -1);
		if (matchingTalks.length > 0) {
			matchingTalks[0].select(true);
		}
	}
}

@Component({selector:'ng-demo'})
@View({
	directives: [ConfTalks, Talk, CORE_DIRECTIVES],
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
  `
})
class App {}
bootstrap(App);