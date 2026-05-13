const calculatePermitFee = (permitType) => {
  const fees = {
    construction: 5000,
    event: 2500,
    business_license: 3000,
  };

  return fees[permitType] || 1000;
};

export default calculatePermitFee;
