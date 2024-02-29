import {Person} from './../../person/person';

export class Store{
	id: string;
	title: string;
	address: string;
	location: {long:number, lat: number};
	cp: String; //Contact Person
	cpe: String; //Contact Person Email
	cpc: String; //Contact Person Mobile
	logo: any;
	upi: string;
	mam: string;
	mdn: string;
	owner: Person;
	taxId: string;
	status: string;
	cats: any;

	constructor(){
		this.status = "DRAFT";
		this.cats = [];
	}

	static fromJSON(data){
		var store = new Store();
		store.id = data['id'];
		store.title = data['title'];
		if(data.location){
			store.location = data['location']
		}
		if(data.owner){
			store.owner = data['owner'];
		}
		if(data.status){
			store.status = data['status'];
		}
		if(data.cp){
			store.cp = data['cp'];	
		}
		if(data.cpe){
			store.cpe = data['cpe'];	
		}
		if(data.cpc){
			store.cpc = data['cpc'];	
		}
		if(data.taxId){
			store.taxId = data['taxId'];	
		}
		if(data.address){
			store.address = data.address;
		}
		if(data.cats){
			store.cats = data.cats;
		}else{
			store.cats = [];
		}
		return store;
	}
}