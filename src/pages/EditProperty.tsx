import AddProperty from "./AddProperty";
import { AppHeader } from "@/components/AppHeader";

// Edit page reuses the AddProperty form (same UI for now). Header shows "تعديل العقار".
const EditProperty = () => {
  return (
    <div>
      <div className="hidden"><AppHeader title="تعديل العقار" /></div>
      <AddProperty />
    </div>
  );
};

export default EditProperty;
