"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectItem
} from "@szum-tech/design-system";
import { TableIcon } from "@szum-tech/design-system/icons";
import { useForm } from "react-hook-form";

import { type CreateSheetFormType, createSheetSchema } from "~/schemas/sheet";
import { currencyList } from "~/utils/currency";

type CreateSheetCardProps = {
  action: (data: CreateSheetFormType) => Promise<void>;
};

export function CreateSheetCard({ action }: CreateSheetCardProps) {
  const form = useForm<CreateSheetFormType>({
    resolver: zodResolver(createSheetSchema)
  });

  async function formSubmitHandler(formData: CreateSheetFormType) {
    await action(formData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create first Sheet</CardTitle>
        <CardDescription>Fill out the form below</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitHandler)}>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>This is sheet display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel caption="Optional">Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} placeholder="Currency">
                        {currencyList.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="contained" type="submit" endIcon={<TableIcon />} loading={form.formState.isSubmitting}>
              Create Sheet
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
