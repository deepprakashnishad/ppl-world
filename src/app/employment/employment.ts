export class SkillSet{
	selectedSkill: string;
	expYears: number;
	expMonths: number;
	profLevel: number;
	lastUsedDate: Date;

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