import { useState } from "react";
import { InvitationResult } from "../molecules/invitationResult";
import { RegisterAdminForm } from "./registerAdminForm";
import { ReissueActivationForm } from "./reissueActivationForm";

export function AccountInvitations() {
  const [invitation, setInvitation] = useState(null);

  return (
    <section aria-labelledby="invitations-heading">
      <h2 id="invitations-heading">Cuentas e invitaciones</h2>
      {invitation && (
        <InvitationResult
          key={invitation.activationToken}
          invitation={invitation}
        />
      )}
      <div className="invitations">
        <RegisterAdminForm onIssued={setInvitation} />
        <ReissueActivationForm onIssued={setInvitation} />
      </div>
    </section>
  );
}
