import {bootstrap, Component, CORE_DIRECTIVES, FORM_DIRECTIVES, Input, ViewChild, ContentChild, TemplateRef, NgForm} from 'angular2/angular2';

import * as n from "@reactivex/rxjs/dist/cjs/Rx"; // this should not be needed
var q = n;

@Component({
	selector: 'conf-talks',
	directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
	template: `
	  <form>
      Speaker: <input ng-control="speaker" minlength="3">
      Title: <input ng-control="title" minlength="3">
	  </form>
    <ul>
      <template ng-for [ng-for-of]="talks" [ng-for-template]="itemTmpl"/>
    </ul>
  `
})
class ConfTalks {
  @Input() talks;
	@ContentChild(TemplateRef) itemTmpl; // typing here are not correct
	@ViewChild(NgForm) form;

	afterViewInit() {
		(<any>this.form.control.valueChanges).toRx().
    //filter(_ => this.form.valid).
    //throttle(500).
		subscribe(value => this.selectTalk(value));
	}

	selectTalk(filters) {
		this.talks.forEach(t => t.selected = false);

    var matchingTalks = this.talks.filter(t => {
      var speakerMatched = t.speaker.indexOf(filters.speaker) > -1;
      var titleMatched = t.title.indexOf(filters.title) > -1;
      return (speakerMatched || !filters.speaker) && (titleMatched || !filters.title);
    });

		if (matchingTalks.length > 0) {
			matchingTalks[0].selected = true;
		}
	}
}

@Component({
  selector:'ng-demo',
	directives: [ConfTalks, CORE_DIRECTIVES],
	template: `
    <conf-talks [talks]="data">
      <template var-talk>
        <li>
          <a href="/talks/{{talk.id}}" [class.selected]="talk.selected">
            {{talk.title}} by {{talk.speaker}}
          </a>
          <p>{{talk.description}}</p>
        </li>
			</template>
    </conf-talks>
  `
})
class App {
  data = [
    {id: 1, title: 'Routing in Eleven Dimensions with Component Router', speaker: 'Brian Ford', description: 'Component Router is a futuristic routing system for Angular 1 and 2 that may or may not have been constructed from recovered extraterrestrial technology. We’ll show how it helps organize your application, explain the linking DSL, and show how to make use of lifecycle hooks. Then we’ll talk about advanced features and auxiliary routing.'},

    {id: 2, title: 'Testing strategies with Angular 2', speaker: 'Julie Ralph', description: 'Angular loves testability, and Angular 2 will continue to make it easy to write great test suites so that you’re confident in your site. Learn how to use karma and other tools to set up and debug tests, see how the Angular team creates their test suite, and meet new test helpers just for Angular 2 components.'},

    {id: 3, title: 'Building the Best Components', speaker: 'Jeremy Elbourn', description: 'The component is the new atomic unit of an Angular 2 application. So what makes a good component? This talk will explore how Angular 2 components are different from the directives you’re used to and provide some practical guidance on building them. We’ll also look at different types of tests you can write to guard against all kinds of regressions.'}
  ];
}
bootstrap(App);