import { createSheetAction } from "./actions";
import { CreateSheetCard } from "./components/create-sheet-card";

export default async function IntroductionTablePage() {
  return (
    <div className="w-full">
      <h1 className="mb-2 text-center typography-heading-4 md:typography-heading-3">Create Sheet</h1>
      <div className="mb-8 text-center text-gray-300 typography-subtitle-1">Step 1 of 3</div>

      <CreateSheetCard action={createSheetAction} />
    </div>
  );
}
