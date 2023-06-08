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
	donationQuota: number;
	amtWithdrawable: number;
	totalAmountWithdrawnTillDate: number;
	totalAmountCollected: number;
	amountCollectedForNextLevel: number;
	directDownlines: any[];
	teamSize: number;
	currOrbit: number;
	projectsInvestedIn: Array<any>;;
	picture: any;
	aadhar_front: any;
	aadhar_back: any;
	pan: any;
	lwdlc: any;

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
    person.status = data['s'];
    person.referrer = data['p'];
    person.uplines = data['ulc'];
    person.paidAmount = data['pamt'];
    person.amtWithdrawable = data['aw'];
    person.totalAmountWithdrawnTillDate = data['taw'];
    person.totalAmountCollected = data['tac'];
    person.teamSize = data['ts'];
    person.directDownlines = data['ddl'];
    person.currOrbit = data['curr_orbit'];
    // person.projectsInvestedIn = data[''];
    person.picture = data['pic'];
    person.aadhar_front = data['adh_f'];
    person.aadhar_back = data['adh_b'];
    person.pan = data['pan'];
    person.amountCollectedForNextLevel = data['acnl'];
    person.lwdlc = data['lwdlc'];
    person.donationQuota = data['dq'];
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
