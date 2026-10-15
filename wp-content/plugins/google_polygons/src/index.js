import { Form } from "@marccent/util/form";

new Form(checkAddressForm, (form, val) => {
  console.log("Form submitted");
  console.log(val);
  // Do something with the form data
  // e.g. send it to the server
  // or update the UI
});