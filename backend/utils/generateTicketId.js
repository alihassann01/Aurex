export const generateTicketId = (departmentCode) => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);

  return `${departmentCode}-${year}-${random}`;
};

export default generateTicketId;
