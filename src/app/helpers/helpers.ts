import Swal from 'sweetalert2';
import {NgModuleRef, Type} from '@angular/core';
import {environment} from '../../environments/environment';

export function isNullOrEmpty(obj?: string): boolean {
  return obj === null || obj === '';
}

export function showConfirm(onConfirm: any, onCancel?: any) {
  const swall = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-sm btn-primary',
      cancelButton: 'btn btn-light btn-sm'
    }
  });
  swall
    .fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true
    })
    .then(result => {
      if (result.value) {
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      } else {
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }
    });
}

export function showAlert(mesasge: string) {
  const swall = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-sm btn-primary'
    }
  });
  swall
    .fire({
      title: 'Warning',
      text: mesasge,
      icon: 'warning',
      confirmButtonText: 'Close'
    });
}

export function replaceStrDoubleQuote(str: string): string {
  return str.replace(/^"(.*)"$/, '$1');
}

export function componentToString(componentType: Type<any>, moduleRef: NgModuleRef<any>): string {
  const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);
  const injector = moduleRef.injector;
  const componentRef = factory.create(injector);

  const nativeElement = componentRef.location.nativeElement;
  const div = document.createElement('div');
  div.appendChild(nativeElement);

  return div.innerHTML;
}

export function getObjByKey(obj: any, searchKey: string): any {
  try {
    return searchKey.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj || self);
  } catch (e) {
    if (!environment.production) {
      console.log('getObjByKey', e.message);
    }
    return null;
  }
}

export function toOptions(obj: any, idKey: string = 'id', valueKey: string = 'name'): any {
  const rd: any = [];
  obj.forEach(o => {
    rd.push({
      [idKey]: getObjByKey(o, idKey),
      [valueKey]: getObjByKey(o, valueKey)
    });
  });
  return rd;
}

export function toOptionSelected(obj: any, idKey: string = 'id', valueKey: string = 'name'): any {
  return {
    [idKey]: getObjByKey(obj, idKey),
    [valueKey]: getObjByKey(obj, valueKey)
  };
}

