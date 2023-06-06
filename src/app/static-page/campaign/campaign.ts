export class Campaign{
	id: string;
	title: string;
	desc: string;
	areqd: number;
	cltd: number;
	s: string;
	owner: any;
	cat: string; //Category
	expiryDate: number;

	constructor(){
		this.title = "";
    this.s="Draft";
  }

  static fromJSON(data) {
    var campaign = new Campaign();
    campaign.id = data['id'];
    campaign.title = data['title'];
    campaign.desc = data['desc'];
    campaign.areqd = data['areqd'];
    campaign.cltd = data['cltd'];
    campaign.s = data['s'];
    campaign.owner = data['owner'];
    campaign.cat = data['cat'];
    campaign.expiryDate = data['expiryDate'];
    return campaign;
  }

  static fromJSONArray(arrJson: Array<any>) {
    var campaigns: Array<Campaign> = [];
    for (var data of arrJson) {
      campaigns.push(this.fromJSON(data));
    }

    return campaigns;
  }
}
