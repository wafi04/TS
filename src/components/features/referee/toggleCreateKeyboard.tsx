"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import { ButtonFormSchema, ButtonFormValues } from "@/schemas/schema";

export const CreateButtons = ({
  name,
  open,
  onClose,
}: {
  name: string;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Keyboard Score </DialogTitle>
          <DialogDescription>
            Create Keyboard Score For this Championship
          </DialogDescription>
        </DialogHeader>
        <FormButtons name={name} />
      </DialogContent>
    </Dialog>
  );
};

export function FormButtons({ name }: { name: string }) {
  const { toast } = useToast();
  const createButtons = useMutation(api.Keyboard.createButton);
  const form = useForm<ButtonFormValues>({
    resolver: zodResolver(ButtonFormSchema),
    defaultValues: {
      name: "",
      value: 0,
    },
  });
  async function onSubmit(values: ButtonFormValues) {
    try {
      await createButtons({
        title: values.name,
        value: values.value,
        championship: name,
      });
      toast({
        description: "Create Buttons Succes",
      });
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="Terkaman" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>value</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please Input Number..."
                  type="number"
                  inputMode="numeric"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is value of name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full ">
          Submit
        </Button>
      </form>
    </Form>
  );
}
