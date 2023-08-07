export class SkillSet{
	selectedSkill: string;
	expYears: number;
	expMonths: number;
	profLevel: number;
	lastUsedDate: Date;

	constructor(){
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
		skillSet.lastUsedDate = new Date(data['lu']);

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