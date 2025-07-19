import { useSession } from "next-auth/react";
import { useTipForm } from "./useTipForm";
import { TipFormUI } from "./TipFormUI";

export default function TipForm() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email || "";
    const tipForm = useTipForm(userEmail);
    return (
        <TipFormUI
            {...tipForm}
            setName={tipForm.setName}
            setMessage={tipForm.setMessage}
            setAmount={tipForm.setAmount}
            setCurrency={tipForm.setCurrency}
            setErrors={tipForm.setErrors}
            setShowErrorPopup={tipForm.setShowErrorPopup}
        />
    );
}
