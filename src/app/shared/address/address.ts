export class Address{
    id: string;
    n: string; //Name
    al: string; //Address Line
    pc: string; // Pincode
    ar: string; //Area
    ci: string; // City
    s: string; // State
    lm: string; // Landmark
    c: string; //Country
    mb: string;
    p: string;
    loc:any;

    constructor(){
        this.c = "India";
    }

    static fromJSON(data): Array<Address>{
        var addresses:Array<Address> = [];

        data.forEach(ele => {
            var address = new Address();
            address.id = ele['id'];
            address.n = ele['n'];
            address.ar = ele['ar'];
            address.c = ele['c'];
            address.al = ele['al'];
            address.lm = ele['lm'];
            address.pc = ele['pc'];
            address.ci = ele['ci'];
            address.s = ele['s'];
            address.mb= ele['mb'];
            address.loc = ele['loc'];
            addresses.push(address);
        });

        return addresses;
    }
}