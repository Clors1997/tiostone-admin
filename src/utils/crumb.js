const crumb_1 = [
    {
      r_name: "home_clientele",
      title: "Client",
    },
    {
      r_name: "home_product",
      title: "Product",
    },
    {
      r_name: "home_invoice",
      title: "P.O.",
    },
    {
      r_name: "home_deliveryNote",
      title: "Delivery"
    },
    {
      r_name: "home_record",
      title: "Invoice"
    },
    {
      r_name: "home_factory",
      title: "Factory"
    },
    {
      r_name: "home_plate",
      title: "Plate"
    }
]

const crumb_2 = [
    {
      r_name: "home_deliveryNoteProduct",
      title: "Delivery Detail"
    }
]

export function getCrumbStatus(from_name, to_name) {
  let from_in_one = crumb_1.find(({ r_name }) => r_name === from_name) != undefined;
  let from_in_two = crumb_2.find(({ r_name }) => r_name === from_name) != undefined;
  let to_in_one = crumb_1.find(({ r_name }) => r_name === to_name) != undefined;
  let to_in_two = crumb_2.find(({ r_name }) => r_name === to_name) != undefined;
  if(from_in_one && to_in_one){
    return {
      status: 0,
      newCrumb: crumb_1.find(({ r_name }) => r_name === to_name)
    };
  }

  if(from_in_one && to_in_two){
    return {
      status: 1,
      newCrumb: crumb_2.find(({ r_name }) => r_name === to_name)
    };
  }

  if(from_in_two && to_in_one){
    return {
      status: -1,
      newCrumb: crumb_1.find(({ r_name }) => r_name === to_name)
    };
  }

  if(from_in_two && to_in_two){
    return {
      status: 0,
      newCrumb: crumb_2.find(({ r_name }) => r_name === to_name)
    };
  }
}
