import {bootstrap, ElementRef, Component, Directive, View, Injectable, NgModel, CORE_DIRECTIVES,FORM_DIRECTIVES, Input, ViewChild, QueryList, ContentChildren, NgFor} from 'angular2/angular2';

@Component({
	selector: 'tab',
	host: {
		'[class.hidden]': '!selected'
	}
})
@View({
	styles: [
		':host.hidden { display: none; }',
		'.header { background-color: grey}',
	],
	template: `
		<div class="header">
			<ng-content select="tab-header"></ng-content>
		</div>
		<div class="body">
			<ng-content select="tab-body"></ng-content>
		</div>
  `
})
class Tab {
	@Input() title;
	selected = false;

	select(selected) {
		this.selected = selected;
	}
}

@Component({
	selector: 'tabs'
})
@View({
	styles: [
		'.btn { border: 1px solid black; padding: 3px }',
		'.btn.active {background-color: red}',
		'.col { display: inline-block }',
	],
	template: `
	  <div class="col">
    	<div *ng-for="#tab of tabs;#i=index" (click)="selectTabByIndex(i)" class="btn" [class.active]="tab.selected">{{tab.title}}</div>
		</div>
		<div class="col">
			<ng-content></ng-content>
	  </div>
  `,
	directives: [NgFor]
})
class Tabs {
	@ContentChildren(Tab) tabs;

	afterContentInit() {
		this.selectTabByIndex(0);
	}

	selectTabByIndex(selectedIndex:number) {
		var i = 0;
		this.tabs.map( (tab) => {
			tab.select(i === selectedIndex);
			i++;
		});
	}
}

@Component({selector:'ng-demo'})
@View({
	directives: [Tabs, Tab, CORE_DIRECTIVES],
	template: `
    <tabs>
      <tab title="Speakers">
        <tab-header>Speakers</tab-header>
        <tab-body>
					<ul>
					  <li>Jeff Cross</li>
						<li>Igor Minuar</li>
					</ul>
				</tab-body>
      </tab>
      <tab title="Talks">
        <tab-header>Talks</tab-header>
        <tab-body>
					<ul>
					  <li>All about data</li>
						<li>Find your center</li>
					</ul>
				</tab-body>
      </tab>
    </tabs>
  `
})
class App {}
bootstrap(App);
