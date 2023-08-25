import { Pipe, PipeTransform } from '@angular/core';
import { MyIdbService } from 'src/app/my-idb.service';
import { GeneralService } from 'src/app/general.service';

@Pipe({
  name: 'getTagById'
})
export class GetTagByIdPipe implements PipeTransform {

  selectedLanguage: string = "en";

  constructor(
    private idbService: MyIdbService,
    private generalService: GeneralService
  ) {
    this.generalService.selectedLanguage.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  transform(tagId: string): Promise<string> {
    var tag = this.idbService.getTagByIdAndLanguage(tagId, this.selectedLanguage);
    return tag;
  }
}

