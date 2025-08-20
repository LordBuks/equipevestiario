import PlayerModalWithTabs from "./PlayerModalWithTabs";

const EmployeeModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  return (
    <PlayerModalWithTabs 
      player={employee}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default EmployeeModal;

