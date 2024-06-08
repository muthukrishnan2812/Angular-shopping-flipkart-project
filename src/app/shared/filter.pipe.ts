import { Pipe, PipeTransform } from '@angular/core';
import { __values } from 'tslib';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  //value -> total getting data in array []   { filterName }  
  //filterString -> enter a value as a string , { enter value on a input }
  //propName -> filter by title                { title object name of api... }
  transform(value: any[], filterString: string, propName: string): any {
    //result -> holding a value...
    // == -> check the value , === -> checks the value and datatype.... || -> or operator , && -> and operator
    const result: any = [];
    if (!value || filterString === '' || propName === '') {
      return value;
    }
    value.forEach((a: any) => {
      if (a[propName].trim().toLowerCase().includes(filterString.toLowerCase())) {
        result.push(a);
      }
    });
    return result;
  }
}
