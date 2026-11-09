import { useState } from "react";
import { Title } from "../atoms/titles";
import { InvitationResult } from "../molecules/invitationResult";
import { RegisterAdminForm } from "./registerAdminForm";
import { ReissueActivationForm } from "./reissueActivationForm";

export function AccountInvitations() {
  const [invitation, setInvitation] = useState(null);

  return (
    <section aria-labelledby="invitations-heading">
      <Title
        level="h2"
        id="invitations-heading"
        text="Cuentas e invitaciones"
        className="mt-10 mb-4"
      />
      {invitation && (
        <InvitationResult
          key={invitation.activationToken}
          invitation={invitation}
        />
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RegisterAdminForm onIssued={setInvitation} />
        <ReissueActivationForm onIssued={setInvitation} />
      </div>
    </section>
  );
}
