export class MarriageProfile{
	id: string;
	n: string; // Name
	dob: number; //Date of birth
	gen: string; //Gender
	ht: number; // Height
	mt: number; //Mother Tongue
	ol: any; //Other Languages
	col: string; //Color
	hc: string;  //Hair color
	ec: string; //Eye color
	ms: string; //Marital Status
	h: any; //Hobbies
	
	ft: string; //Veg, Non-veg
	s: number; //Smoke
	d: number; //Drinking Liquor

	m: boolean; //Is Manglik
	v: number; // Varna
	c: any; //Caste, Sub-caste
	g: number; // Gotra
	r: number; //Religion

	// Family Details
	// mn: string; // Mother's Name
	// fn: string; // Father's Name
	// brc: number; //Brothers Count
	// src: number; //Sister's Count
	tfi: number; //Total family income
	fd: any; //Family details - name, occupation, income

	e: any; // Education
	pr: any; // Profession
	ac: any; //Additional Courses
	
	addr: any; //Address
	pref: any; // Mandatory Preferences

	pp: any; //Profile Pic
	ap: any; // Additional Pics
	mf: string; //Meant For

	o: string; //Profile Owner

	constructor(){
		this.ht = 167;
		this.col = "Fair";
		this.e = {};
		this.e['py'] = 2020;
		this.pr = {};
		this.pr['et'] = "emp";
		this.fd = [];
		this.pref={};
		this.c={};
	}

	static fromJSON(data: any){
		var mp = new MarriageProfile();

		mp.id=data['id'];
		mp.n=data['n']; // Name
		mp.dob=data['dob']; //Date of birth
		mp.gen = data['gen'];
		mp.ht=data['ht']; // Height
		mp.mt=data['mt']; //Languages Known
		mp.ol=data['ol']; //Other Languages
		mp.col=data['col']; //Color
		mp.hc=data['hc'];  //Hair color
		mp.ec=data['ec']; //Eye color
		mp.ms=data['ms']; //Marital Status
		mp.h=data['h']; //Hobbies
		
		mp.ft=data['ft']; //Veg, Non-veg
		mp.s=data['s']; //Smoke
		mp.d=data['d']; //Drinking Liquor

		mp.m=data['m']; //Is Manglik
		mp.v=data['v']; // Varna
		mp.c=data['c']; //Caste, Sub-caste
		mp.g=data['g']; // Gotra
		mp.r=data['r']; //Religion

		// Family Details
		// mp.mn=data['mn'];
		// mp.fn=data['fn'];
		mp.tfi = data['tfi'];
		mp.fd=data['fd']; //Family details - name, occupation, income

		mp.e=data['e']; // Education
		mp.pr=data['pr']; // Profession
		mp.ac=data['ac']; //Additional Courses
		
		mp.addr = data['addr']; //Address
		
		mp.pref = data['pref']; // Mandatory Preferences

		mp.pp = data['pp'];
		mp.ap = data['ap'];

		mp.mf = data['mf'];

		mp.o = data['o']; //Profile Owner

		mp.pref = data['pref']?data['pref']:{};

		return mp;
	}
}

export class Caste{
	id: string;
	st: string; //State
	c: string; //Caste
	sc: string; //Sub-caste
}