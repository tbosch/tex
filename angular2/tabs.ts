import {Component, QueryList, ContentChildren, Inject, forwardRef} from 'angular2/angular2';

@Component({
	selector: 'tab-header',
	host: {
		'(click)': 'updateTabsSelection()',
		'[class.selected]': 'selected'
	},
	template: `<ng-content></ng-content>`
})
export class TabHeader {
	selected:boolean = false;
	constructor(@Inject(forwardRef(() => Tabs)) private tabs) {}

	updateTabsSelection() {
		this.tabs.updateSelection(this);
	}

	updateSelection(selected:boolean) {
		this.selected = selected;
	}
}

@Component({
	selector: 'tab-body',
	host: {
		'[class.selected]': 'selected'
	},
	template: `<ng-content></ng-content>`
})
export class TabBody {
	selected: boolean = false;

	updateSelection(selected:boolean) {
		this.selected = selected;
	}
}

@Component({
	selector: 'tabs',
	template: `
	  <div class="tab-headers">
    	<ng-content select="tab-header"></ng-content>
		</div>
		<div class="tab-bodies">
    	<ng-content select="tab-body"></ng-content>
	  </div>
  `
})
export class Tabs {
	@ContentChildren(TabHeader) headers: QueryList<TabHeader>;
	@ContentChildren(TabBody) bodies: QueryList<TabBody>;

	afterContentInit() {
		this.updateSelection(this.headers.first);
	}

	updateSelection(selectedHeader:TabHeader) {
		var headerArr = toArray(this.headers);
		var bodyArr = toArray(this.bodies);
		headerArr.forEach( (header, index) => {
			var selected = header === selectedHeader;
			header.updateSelection(selected);
			bodyArr[index].updateSelection(selected);
		});
	}
}

function toArray<T>(query:QueryList<T>):T[] {
	var result = [];
	query.map( value => result.push(value) );
	return result;
}