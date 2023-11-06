"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form
} from "@szum-tech/design-system";
import { ColumnsIcon, PlusIcon } from "@szum-tech/design-system/icons";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { SheetColumnFormFields } from "~/app/introduction/sheet/[sheetId]/components/sheet-column-form-fields";
import { createColumnSchema } from "~/schemas/column";

export const sheetColumnsSchema = z.object({
  columns: z.array(createColumnSchema)
});

export type SheetColumnsSchemaFormType = z.infer<typeof sheetColumnsSchema>;

type CreateSheetCardProps = {
  sheetId: string;
  action: (sheetId: string, data: SheetColumnsSchemaFormType) => Promise<void>;
};

export function CreateSheetColumnsCard({ sheetId, action }: CreateSheetCardProps) {
  const form = useForm<SheetColumnsSchemaFormType>();
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "columns"
  });

  function addColumnHandler() {
    append({ name: `New Column ${fields.length + 1}`, orderIndex: fields.length });
  }
  function removeColumnHandler(index: number) {
    remove(index);
  }

  async function formSubmitHandler(formData: SheetColumnsSchemaFormType) {
    await action(sheetId, formData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Define sheet Columns</CardTitle>
        <CardDescription>Fill out the form below</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitHandler)}>
          <CardContent>
            <div className="flex flex-col divide-y divide-gray-400">
              {fields.map((field, index) => (
                <SheetColumnFormFields
                  register={form.register}
                  key={field.id}
                  control={form.control}
                  index={index}
                  itemsAmount={fields.length}
                  onRemove={() => removeColumnHandler(index)}
                  onMoveDown={() => move(index, index + 1)}
                  onMoveUp={() => move(index, index - 1)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button color="success" variant="contained" endIcon={<PlusIcon />} onClick={addColumnHandler}>
                Add Column
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="contained" type="submit" endIcon={<ColumnsIcon />} loading={form.formState.isSubmitting}>
              Add columns
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
