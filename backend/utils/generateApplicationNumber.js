const generateApplicationNumber = (permitType) => {
  const year = new Date().getFullYear();

  const prefixMap = {
    construction: "CON",
    event: "EVT",
    business_license: "BUS",
  };

  const prefix = prefixMap[permitType] || "PER";
  const random = Math.floor(10000 + Math.random() * 90000);

  return `${prefix}-${year}-${random}`;
};

export default generateApplicationNumber;
