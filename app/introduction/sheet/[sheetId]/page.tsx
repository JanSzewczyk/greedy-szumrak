import { createColumnsAction } from "./actions";
import { CreateSheetColumnsCard } from "./components/create-sheet-columns-card";

type IntroductionSheetColumnsPageProps = {
  params: { sheetId: string };
};

export default function IntroductionSheetColumnsPage({ params: { sheetId } }: IntroductionSheetColumnsPageProps) {
  return (
    <div className="w-full">
      <h1 className="mb-2 text-center typography-heading-4 md:typography-heading-3">Define Columns</h1>
      <div className="mb-8 text-center text-gray-300 typography-subtitle-1">Step 2 of 3</div>

      <CreateSheetColumnsCard sheetId={sheetId} action={createColumnsAction} />
    </div>
  );
}
