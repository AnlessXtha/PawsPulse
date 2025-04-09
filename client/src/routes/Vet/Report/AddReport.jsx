import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/ui/form";
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";
import { Textarea } from "@/components/shadcn-components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/shadcn-components/ui/select";

const AddReport = () => {
  const form = useForm({
    defaultValues: {
      petName: "Rocky",
      ownerName: "milan_dove",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      symptoms: [""],
      recommendations: [""],
      diseases: [
        {
          diseaseName: "",
          cureTrial: "",
          effectOfTrial: "",
          effectiveness: "mid",
          vetNotes: "",
          treatmentStartDate: "",
          treatmentEndDate: "",
        },
      ],
      treatments: [
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          durationDays: "",
          purpose: "",
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

  const {
    fields: diseaseFields,
    append: appendDisease,
    remove: removeDisease,
  } = useFieldArray({ control, name: "diseases" });
  const {
    fields: treatmentFields,
    append: appendTreatment,
    remove: removeTreatment,
  } = useFieldArray({ control, name: "treatments" });

  const onSubmit = (data) => {
    console.log("Report Submitted:", data);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create a Report</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="petName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Name</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="ownerName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="temperature"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="heartRate"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Rate</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="respiratoryRate"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Respiratory Rate</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Symptoms & Recommendations */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="symptoms.0"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Comma-separated" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="recommendations.0"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Comma-separated" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Disease & Treatment Sections Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Diseases</h3>
              {diseaseFields.map((item, index) => (
                <div
                  key={item.id}
                  className="border p-4 rounded mb-4 space-y-3"
                >
                  <FormField
                    name={`diseases.${index}.diseaseName`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`diseases.${index}.cureTrial`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cure Trial</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`diseases.${index}.effectOfTrial`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effect of Trial</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`diseases.${index}.effectiveness`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effectiveness</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="mid">Mid</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`diseases.${index}.vetNotes`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vet Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name={`diseases.${index}.treatmentStartDate`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`diseases.${index}.treatmentEndDate`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendDisease({ diseaseName: "", effectiveness: "mid" })
                  }
                >
                  + Add Disease
                </Button>
                {diseaseFields.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeDisease(diseaseFields.length - 1)}
                  >
                    Remove Last
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Treatments</h3>
              {treatmentFields.map((item, index) => (
                <div
                  key={item.id}
                  className="border p-4 rounded mb-4 space-y-3"
                >
                  <FormField
                    name={`treatments.${index}.medicationName`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`treatments.${index}.dosage`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`treatments.${index}.frequency`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`treatments.${index}.durationDays`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`treatments.${index}.purpose`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendTreatment({})}
                >
                  + Add Treatment
                </Button>
                {treatmentFields.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeTreatment(treatmentFields.length - 1)}
                  >
                    Remove Last
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <Button type="submit" className="bg-primary text-white">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddReport;
