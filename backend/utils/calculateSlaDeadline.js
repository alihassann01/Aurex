export const calculateSlaDeadline = (priority, department) => {
  const slaHours = department.slaHours?.[priority] || 72;

  const deadline = new Date();
  deadline.setHours(deadline.getHours() + slaHours);

  return deadline;
};

export default calculateSlaDeadline;
