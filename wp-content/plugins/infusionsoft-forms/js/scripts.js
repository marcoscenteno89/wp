
document.addEventListener("DOMContentLoaded", () => {
  var utmString = '';
  let all = document.querySelectorAll(".ifs-form");
  //ASSIGN GOOGLE VARIABLES
  let url = new URLSearchParams(window.location.search);
  let fields = {
    utm_adgroup: [`input[name="utm_adgroup"]`, `input[name="inf_custom_utm_adgroup"]`],
    utm_campaign: [`input[name="utm_campaign"]`, `input[name="inf_custom_utm_campaign"]`],
    utm_source: [`input[name="utm_source"]`],
    utm_medium: [`input[name="utm_medium"]`],
    utm_term: [`input[name="utm_term"]`],
    utm_content: [`input[name="utm_content"]`],
    email: [`input[name="email"]`, `input[name="inf_field_Email"]`],
    given_name: [`input[name="given_name"]`],
    family_name: [`input[name="family_name"]`],
    phone: [`input[name="phone"]`],
		address: [`input[name="line1"]`],
		city: [`input[name="locality"]`],
		state: [`input[name="region"]`],
		zip: [`input[name="postal_code"]`],
      product_line: [`input[name="product_line"]`],
      contact_id: [`input[name="contact_id"]`],
      account_id: [`input[name="account_id"]`],
		lat: [`input[name="lat"]`, `input[name="latitude"]`],
		lng: [`input[name="lng"]`, `input[name="longitude"]`],
    workbook_id: [`input[name="workbook_id"]`],
    ifs_lead_id: [`input[name="ifs_lead_id"]`],
    product_line: [`input[name="product_line"]`]
  }
	const utm = ['utm_adgroup', 'utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content'];
  const formatData = (string) => {
    const chkAgainst = ['+']
    let newArr = '';
    if (string) {
      let arr = string.split('');
      for (let i = 0; i < arr.length; i++) {
        if (chkAgainst.includes(arr[i])) arr[i] = ' ';
      }
      newArr = arr.join("");
    }
    return newArr;
  }
  
  Object.keys(fields).forEach(i => {
    for (let e of fields[i]) {
      let elem = document.querySelectorAll(`${e}`);
      let param = url.get(i);
      if (param != null && elem.length > 0) {
        for (let x of elem) {
          if (utm.includes(i)) utmString += `&${i}=${param}`;
          x.value = formatData(param);
        }
      }
    }
  });

  for (let i of all) {
    form(i, onTabChange).then( data => {
      let values = {}
      data.forEach(i => values[i.field.name] = i.field.value);
      let api = {
        body: `action=fi_submit_contact&data=${JSON.stringify(values)}`,
        url: fi_submit_contact.ajax_url,
        method: 'POST',
        report: true
      }
      ajax(api).then(res => window.location.replace(i.action));
    });
  }

  function onTabChange(data) {
    let values = {}
    data.forEach(i => values[i.field.name] = i.field.value);
    let api = {
      body: `action=fi_submit_contact&data=${JSON.stringify(values)}`,
      url: fi_submit_contact.ajax_url,
      method: 'POST',
      report: true
    }
    ajax(api).then(res => {
      let email = {}
      for (let i of document.querySelectorAll('[name="email"]')) email[i.type] = i;
      email.hidden.value = email.email.value;
    });
  }
});