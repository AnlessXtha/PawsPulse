import { Button } from "@/components/shadcn-components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import { Checkbox } from "@/components/shadcn-components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/ui/select";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/shadcn-components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchVets, selectAllVets } from "@/redux/slices/vetSlice";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vets = useSelector(selectAllVets);

  const [isRecurring, setIsRecurring] = useState(false);
  const form = useForm({
    defaultValues: {
      reason: "",
      appointmentDate: "",
      recurring: false,
      recurringRule: "",
      recurringUntil: "",
      vet: "",
    },
  });

  useEffect(() => {
    dispatch(fetchVets());
  }, []);

  const onSubmit = (data) => {
    console.log("Appointment Data:", data);
    // navigate("/appointments");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[1000px] bg-white p-8 rounded-lg shadow-md">
        {/* Updated Heading Size */}
        <h2 className="text-[28px] font-bold mb-6">Book an Appointment</h2>

        {/* Grid Layout for Form Fields and Calendar */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-[2fr_1fr] gap-6"
          >
            {/* Left Column: Form Fields */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">
                      Reason to Visit
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the reason..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">
                      Make it Recurring?
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={isRecurring}
                        onCheckedChange={(checked) => {
                          setIsRecurring(checked);
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isRecurring && (
                <FormField
                  control={form.control}
                  name="recurringRule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Recurring Rule
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annually">Annually</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="bimonthly">
                              Bi-Monthly
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isRecurring && (
                <FormField
                  control={form.control}
                  name="recurringUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[18px]">
                        Recurring Until
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">For a Month</SelectItem>
                            <SelectItem value="year">For a Year</SelectItem>
                            <SelectItem value="date">Pick a Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="vet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">Select a Vet</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {vets.map((vet) => (
                            <SelectItem key={vet.id} value={vet.id}>
                              Dr. {vet.firstName} {vet.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column: Calendar */}
            <div className="flex flex-col justify-start">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[18px]">
                      Appointment Date
                    </FormLabel>
                    <FormControl>
                      <Calendar
                        selected={field.value}
                        onChange={field.onChange}
                        minDate={new Date()}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white">
                Book
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookAppointment;
