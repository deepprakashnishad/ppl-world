import {Role} from './../admin/role/role';
import {Permission} from '../admin/permission/permission';

export class Person{
	id: string;
	name: string;
	mobile: string;
	isMobileVerified: boolean;
	email: string;
	isEmailVerified: boolean;
	role: Role;
	permissions: Permission[];
	status: string;
	password: string;
	referrer: any;
	uplines: any[];
	paidAmount: number;
	amtWithdrawable: number;
	totalAmountWithdrawnTillDate: number;
	totalAmountCollected: number;
	directDownlines: any[];
	teamSize: number;
	currOrbit: number;
	projectsInvestedIn: Array<any>;;
	picture: string;
	aadhar_front: string;
	aadhar_back: string;
	pan: string;

	constructor(){
		this.email = "";
		this.mobile = "";
		this.name = "";
		this.permissions = [];
		this.status = "";
		this.role = new Role();
		this.password = "";
  }

  static fromJSON(data) {
    var person = new Person();
    person.id = data['id'];
    person.name = data['n'];
    person.mobile = data['m'];
    person.isMobileVerified = data['mv'];
    person.isEmailVerified = data['ev'];
    person.email = data['e'];
    person.role = data['r'];
    person.permissions = data['permissions'];
    person.status = data['status'];
    person.referrer = data['p'];
    person.uplines = data['ulc'];
    person.paidAmount = data['pamt'];
    person.amtWithdrawable = data[''];
    person.totalAmountWithdrawnTillDate = data[''];
    person.totalAmountCollected = data[''];
    person.teamSize = data[''];
    person.directDownlines = data[''];
    person.currOrbit = data[''];
    person.projectsInvestedIn = data[''];
    person.picture = data[''];
    person.aadhar_front = data[''];
    person.aadhar_back = data[''];
    person.pan = data[''];
    return person;
  }

  static fromJSONArray(arrJson: Array<any>) {
    var persons: Array<Person> = [];
    for (var data of arrJson) {
      persons.push(this.fromJSON(data));
    }

    return persons;
  }
}
