import { Form, msgError, msgSuccess, msgGeneric, Limiter } from './classes/utilities.js';
import { Agile } from './classes/agile.js';
import '../css/styles.css';
import { startCase } from 'lodash';

// INITIALIZE AGILE 
const agile = new Agile({});

const checkAddressForm = document.querySelector('.check-address');
if (checkAddressForm) {
  const formCallback = (form, val) => {
    const limiter = new Limiter(form.next, form.status);
    if (limiter.disabled) return false; // FORM HAS BEEN DISABLED
    return new Promise( async (resolve) => {
      let status = await agile.widthinZone(val);
      console.log(status);
      let msgE = `
        We could not find your address or you are located outside of our active service area.
      `;
      let stat = form.status;
      if (status.error) {
        stat.innerHTML = msgError(status.detail);
      } else {
        let res = status.result
        if (res.length > 0) {
          stat.innerHTML = msgSuccess(startCase(res[0].properties.Status));
          limiter.add();
        } else {
          stat.innerHTML = msgError(msgE);
        }
      }
      resolve('data from form');
    });
  }
  const checkAddress = new Form(checkAddressForm, formCallback);
}


const checkWoForm = document.querySelector('.check-wo');
if (checkWoForm) {
  const formCallback = (form, val) => {
    let container = document.querySelector('.check-wo-container');
    return new Promise( async (resolve) => {
      let list = await agile.checkList(val);
      if (list.error || list.detail) {
        form.status.innerHTML = msgError(list.detail);
      } else {
        form.status.innerHTML = msgSuccess('Work Order Found');
        let html = '';
        for (let i of list.result.items) {
          let content = '';
          if (typeof i.value === 'boolean') {
            content = i.value ? `&#9989; &nbsp; Complete` : `&#10060; &nbsp; Incomplete`;
          } else {
            content = i.value;
          }
          html += `<div class="group">
            ${msgGeneric(i.name, 35)}${i.value ? msgSuccess(content, 65) : msgError(content, 65)}
          </div>`;
        }
        container.innerHTML = html; 
      }
      resolve('data from form');
    });
  }
  const checkWo = new Form(checkWoForm, formCallback);
}