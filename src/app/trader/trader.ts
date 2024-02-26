export class Entity{
	id: string;
    name: string;
    ltp: number;
    actualPrice: number;
    ltpTimestamp: number;
    apTimestamp: number;
    status: string;

    constructor(){
        this.id = "DS";
        return this;
    }

    static fromJSON(data: any){
    	var entity = new Entity();
    	entity.id = data['id'];
    	entity.name = data['fn'];
    	entity.ltp = data['ltp'];
    	entity.actualPrice = data['ap'];
    	entity.ltpTimestamp = data['ltpts'];
    	entity.apTimestamp = data['apts'];
    	entity.status = data['s'];

    	return entity;
    }

    static fromJSONArray(dataArray: any){
    	return dataArray.map(ele=>this.fromJSON(ele));
    }

    static toJSONData(entity: Entity){
    	var data = {};
    	data['id'] = entity['id'];
    	data['fn'] = entity['name'];
    	data['ltp'] = entity['ltp'];
    	data['ap'] = entity['actualPrice'];
    	data['ltpts'] = entity['ltpTimestamp'];
    	data['apts'] = entity['apTimestamp'];
    	data['s'] = entity['status'];

    	return data;
    }
}