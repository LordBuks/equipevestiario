import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const EmployeeModal = ({ employee, isOpen, onClose }) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{employee.name}</DialogTitle>
          <DialogDescription>
            Detalhes do funcionário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-sm font-medium">Categoria:</p>
            <p className="col-span-3 text-sm">{employee.category || "Não informada"}</p>
          </div>
          {employee.assignments && employee.assignments.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm font-medium">Atribuições:</p>
              <p className="col-span-3 text-sm">{employee.assignments.join(", ")}</p>
            </div>
          )}
          {/* Adicione mais campos conforme necessário */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;


