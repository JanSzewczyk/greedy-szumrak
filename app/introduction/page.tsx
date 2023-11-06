import { Button } from "@szum-tech/design-system";
import { ArrowRightIcon, DashboardIcon } from "@szum-tech/design-system/icons";
import Link from "next/link";

import { getUserSession } from "~/api";
import { ROUTES } from "~/constants/routes";

async function loadData() {
  const { user } = await getUserSession();

  return { userName: user.name.split(" ")[0] };
}

export default async function IntroductionPage() {
  const { userName } = await loadData();

  return (
    <div>
      <h1 className="mb-10 typography-heading-4 md:typography-heading-3">Hi {userName},</h1>
      <h3 className="mb-4 typography-heading-5">You just logged in for the first time.</h3>
      <p className="typography-subtitle-1">
        Click <strong>Next</strong> to go through the onboarding process, or skip it and go to the dashboard.
      </p>
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button asChild color="neutral" variant="outlined" endIcon={<DashboardIcon />}>
          <Link href="/">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="contained" endIcon={<ArrowRightIcon />}>
          <Link href={ROUTES.INTRODUCTION.SHEET}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
