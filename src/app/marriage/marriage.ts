export class MarriageProfile{
	n: string; // Name
	mn: string; // Mother's Name
	fn: string; // Father's Name
	e: any; // Education
	ht: number; // Height
	mt: number; //Languages Known
	ol: string; //Other Languages
	pr: any; // Profession
	ac: any; //Additional Courses
	h: string; //Hobbies
	addr: any; //Address
	col: string; //Color
	dob: string; //Date of birth
	fd: any; //Family details - name, occupation, income
	ft: string; //Veg, Non-veg
	s: number; //Smoke
	d: number; //Drinking Liquor
	m: boolean; //Is Manglik
	v: number; // Varna
	c: Caste; //Caste, Sub-caste
	g: number; // Gotra
	r: number; //Religion
	ric: boolean; //Ready for inter-caste
	rir: boolean;	//Ready for inter-religion
	mp: any; // Mandatory Preferences
	op: any; // Optional Preferences
}

export class Caste{
	id: string;
	st: string; //State
	c: string; //Caste
	sc: string; //Sub-caste
}