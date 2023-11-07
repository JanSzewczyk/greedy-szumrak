import { Button } from "@szum-tech/design-system";
import { DashboardIcon, RocketIcon, TableIcon } from "@szum-tech/design-system/icons";
import Link from "next/link";

type IntroductionSheetColumnsPageProps = {
  params: { sheetId: string };
};

export default function IntroductionFinalPage({ params: { sheetId } }: IntroductionSheetColumnsPageProps) {
  return (
    <div className="w-full text-center">
      <h1 className="mb-2 text-center typography-heading-4 md:typography-heading-3">Final Step</h1>
      <div className="mb-8 text-center text-gray-300 typography-subtitle-1">Step 3 of 3</div>
      <p className="typography-heading-5">Congratulations !!!</p>
      <div className="my-8 flex flex-row justify-center gap-4">
        <RocketIcon className="h-8 w-8" />
        <RocketIcon className="h-8 w-8" />
        <RocketIcon className="h-8 w-8" />
      </div>

      <p className="typography-subtitle-1">
        You set up your first Sheet
        <br />
        <br />
        You can now go to the Sheet page and start adding some data, or visit dashboard to see your Sheets
      </p>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button asChild color="neutral" variant="outlined" endIcon={<DashboardIcon />}>
          <Link href="/">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="contained" endIcon={<TableIcon />}>
          <Link href={`/sheets/${sheetId}`}>See Sheet</Link>
        </Button>
      </div>
    </div>
  );
}
