import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogClose,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectItem
} from "@szum-tech/design-system";
import { ArrowLeftIcon, PlusIcon } from "@szum-tech/design-system/icons";
import { useForm } from "react-hook-form";

import { type Sheet, type SheetColumn } from "~/api";
import { type ExpenseFormType, expenseSchema } from "~/schemas/expense";

import { createExpenseAction } from "../../actions";

type AddExpenseFormProps = {
  onClose: () => void;
  columns: Array<SheetColumn>;
  sheet: Sheet;
};

export function AddExpenseForm({ sheet, columns, onClose }: AddExpenseFormProps) {
  const form = useForm<ExpenseFormType>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0]
    },
    resolver: zodResolver(expenseSchema)
  });

  async function formSubmitHandler(formData: ExpenseFormType) {
    await createExpenseAction(sheet.id, formData);
    onClose();
  }

  const isColumnIdSelected = !!form.watch("columnId");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmitHandler)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="columnId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select column</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value} placeholder="Select column">
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isColumnIdSelected} placeholder="Title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isColumnIdSelected} placeholder="Description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    {...rest}
                    disabled={!isColumnIdSelected}
                    placeholder="Amount"
                    type="number"
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : NaN)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isColumnIdSelected} placeholder="Date" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outlined" color="neutral" startIcon={<ArrowLeftIcon />}>
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="contained" endIcon={<PlusIcon />} loading={form.formState.isSubmitting}>
            Create Expense
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
