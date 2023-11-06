import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@szum-tech/design-system";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "@szum-tech/design-system/icons";
import { type Control, type UseFormRegister } from "react-hook-form";

import { type SheetColumnsSchemaFormType } from "./create-sheet-columns-card";

type SheetColumnFormFieldsProps = {
  index: number;
  itemsAmount: number;
  control: Control<SheetColumnsSchemaFormType>;
  register: UseFormRegister<SheetColumnsSchemaFormType>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function SheetColumnFormFields({
  index,
  control,
  itemsAmount,
  onRemove,
  onMoveUp,
  register,
  onMoveDown
}: SheetColumnFormFieldsProps) {
  return (
    <div className="flex flex-col gap-8 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex-1 space-y-4">
        <FormField
          control={control}
          name={`columns.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Sheet Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`columns.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel caption="Optional">Description</FormLabel>
              <FormControl>
                <Input placeholder="Sheet Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...register(`columns.${index}.orderIndex`)} />
      </div>

      <div>
        <div className="flex flex-col gap-2">
          <Button endIcon={<ChevronUpIcon />} variant="outlined" disabled={index === 0} onClick={onMoveUp}>
            Move UP
          </Button>
          <Button
            endIcon={<ChevronDownIcon />}
            variant="outlined"
            disabled={index + 1 === itemsAmount}
            onClick={onMoveDown}
          >
            Move DOWN
          </Button>
        </div>
        <div className="mt-4">
          <Button endIcon={<TrashIcon />} color="error" variant="contained" fullWidth onClick={onRemove}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
