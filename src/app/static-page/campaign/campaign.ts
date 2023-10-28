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
      reqf: string;
      assets: any;
      createdAt: any;
    b: any;

	constructor(){
		this.title = "";
    this.s="Draft";
    this.reqf = "M";
    this.desc="";
  }

  static fromJSON(data) {
    var campaign = new Campaign();
    campaign.id = data['id'];
    campaign.title = data['title'];
    campaign.desc = data['desc'];
    campaign.areqd = data['areqd'];
    campaign.cltd = data['clct'];
    campaign.s = data['s'];
    campaign.owner = data['o'];
    campaign.cat = data['cat'];
    campaign.reqf = data['reqf'];
    campaign.expiryDate = data['expiryDate'];
    campaign.assets = data['assets'];
      campaign.b = data['b'];
    if(data['createdAt']){
      campaign.createdAt = new Date(data['createdAt']);
    }
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
