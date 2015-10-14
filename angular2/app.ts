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
    {id: 1, title: 'Data Fetching', speaker: 'Jeff Cross', description: 'Data Description'},
    {id: 2, title: 'Meditate', speaker: 'Igor Minar', description: 'Meditation'}
  ];
}
bootstrap(App);