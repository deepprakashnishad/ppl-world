export class SkillSet{
	selectedSkill: string;
	expYears: number;
	expMonths: number;
	profLevel: number;
	lastUsedDate: Date;
	skillTag: any;

	constructor(){
		this.selectedSkill = "";
		this.expYears = 1;
		this.expMonths = 0;
		this.profLevel = 3;
	}

	static fromJSON(data: any){
		var skillSet = new SkillSet();

		skillSet.selectedSkill = data['s'];
		skillSet.profLevel = data['p'];
		skillSet.expYears = Math.floor(data['e']/12);
		skillSet.expMonths = data['e']%12;
		if(data['lu']!==null && data['lu']!=="null"){
			skillSet.lastUsedDate = new Date(data['lu']);	
		}
		return skillSet;
	}

	static fromJSONArray(dataSet: any){
		var skills: Array<SkillSet> = [];

		skills = dataSet.map(ele => this.fromJSON(ele));

		return skills;
	}

	static toJSON(skillSet: SkillSet){
		var data = {};
		data['s'] = skillSet.selectedSkill;
		data['p'] = skillSet.profLevel;
		data['e'] = (skillSet.expYears?skillSet.expYears:0)*12+(skillSet.expMonths?skillSet.expMonths:0);
		data['lu'] = skillSet.lastUsedDate?.getTime();
		return data;
	}

	static toJSONArray(skillSets: Array<SkillSet>){
		var data = [];
		data = skillSets.map(ele=> this.toJSON(ele));
		return data;
	}
}

export class WorkSummary{
	t: string; //Title
	r: string; // Role or designation in work
	twe: number; // Total work experience
	rwe: number; // Relevant work experience
	s: boolean;
	p: any; // Profile picture
	wi: any; //Work Images

	constructor(){
		this.s=true;
	}

	static fromJSON(data){
		var workSummary = new WorkSummary();
		if(data){
			workSummary.t = data['t'];
			workSummary.r = data['r'];
			workSummary.twe = data['twe'];
			workSummary.rwe = data['rwe'];
			workSummary.s = data['s']?data['s']:true;
			workSummary.p = data['p'];
			workSummary.wi = data['wi'];
		}

		return workSummary;
	}
}

export class RateList{
	ms: number; // Minimum permanent salary per month
	hr: number; //Minimum hourly rate

	static fromJSON(data){
		var rateList = new RateList();
		if(data){
			rateList.ms = data['ms'];
			rateList.hr = data['hr'];
		}

		return rateList;
	}
}

export class WorkLocation{
	t: string; // Minimum permanent salary per month
	d: number; //Minimum hourly rate
	c: any;

	constructor(){
		this.t = "wfh";
	}

	static fromJSON(data){
		var workLocation = new WorkLocation();
		if(data){
			workLocation.t = data['t'];
			workLocation.d = data['d'];	
			workLocation.c = data['c'];
		}
		return workLocation;
	}
}

export class ServiceRequirement{
	id: string;
	wt: string; //Work Type
	t: string; // Job Title
	jd: string; // Job Description
	mns: number; // Minimum Salary
	mxs: number; // Maximum Salary
	wc: string; // Work Categoy
	ss: any;
	wh: number; //Daily Work hours
	mne: number; // Min experience in years
	mxe: number; // Max Years
	wlt: string; // Work Location Type
	pc: string; // Pincode
	ar: string; // Area
	ci: string; // City
	c: string; // Country
	cn: string; // Contact Name
	cm: string; // Contact Mobile
	ce: string; // Contact Email
	pt: string; //Payment Type
	st: string; // State
	s: boolean; // Status
	lpt: any; //Location Point Coordinates

	constructor(){
		this.mns = 200;
		this.mxs = 10000;
		this.wh = 10;
		this.mne = 0;
		this.mxe = 60;
		this.wlt = "wfh";
		this.s = true;
		this.wt = "st"
		this.pt = "o";
	}

	static fromJSONArray(dataArray: Array<any>){
		return dataArray.map(ele=>ServiceRequirement.fromJSON(ele));
	}

	static fromJSON(data: any){
		var serviceRequirement = new ServiceRequirement();

		serviceRequirement.t = data['t'];
		serviceRequirement.jd = data['jd'];
		serviceRequirement.mns = data['mns'];
		serviceRequirement.mxs = data['mxs'];
		serviceRequirement.wc = data['wc'];
		serviceRequirement.wh = data['wh'];
		serviceRequirement.mne = data['mne'];
		serviceRequirement.mxe = data['mxe'];
		serviceRequirement.wlt = data['wlt'];
		serviceRequirement.pc = data['pc'];
		serviceRequirement.ar = data['ar'];
		serviceRequirement.c = data['c'];
		serviceRequirement.cn = data['cn'];
		serviceRequirement.cm = data['cm'];
		serviceRequirement.ce = data['ce'];
		serviceRequirement.s = data['s'];

		return serviceRequirement;
	}
}