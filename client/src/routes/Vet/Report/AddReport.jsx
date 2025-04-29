import React, { useContext, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addReport } from "@/redux/slices/reportSlice";
import { AuthContext } from "@/context/AuthContext";
import { fetchSinglePet, getSinglePet } from "@/redux/slices/petSlice";
import { getSingleAppointment } from "@/redux/slices/appointmentSlice";
import { reportSchema } from "@/schema/ReportSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const AddReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const pet = useSelector(getSinglePet);
  const currentAppointment = useSelector(getSingleAppointment);

  useEffect(() => {
    dispatch(fetchSinglePet(currentAppointment?.petProfileId));
  }, [currentAppointment, dispatch]);

  console.log(currentAppointment, "currentAppointment");
  console.log(pet, "pet");

  const form = useForm({
    defaultValues: {
      petName: "",
      ownerName: "",
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
          diseaseRemarks: "",
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
      vetNotes: "",
    },
    resolver: zodResolver(reportSchema),
    mode: "onTouched",
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

  useEffect(() => {
    if (pet) {
      form.reset({
        petName: pet?.petName || "",
        ownerName: `${pet.user?.firstName || ""} ${pet.user?.lastName || ""}`,
      });
    }
  }, [pet, form]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        appointmentId: currentAppointment?.appointmentId,
        userId: pet?.userId,
        petProfileId: currentAppointment?.petProfileId,
        temperature: Number(data.temperature),
        heartRate: Number(data.heartRate),
        respiratoryRate: Number(data.respiratoryRate),
        symptoms: data.symptoms[0]?.split(",").map((s) => s.trim()),
        recommendations: data.recommendations[0]
          ?.split(",")
          .map((s) => s.trim()),
        diseases: data.diseases.map((d) => ({
          diseaseName: d.diseaseName,
          cureTrial: d.cureTrial,
          effectOfTrial: d.effectOfTrial,
          effectiveness: d.effectiveness,
          diseaseRemarks: d.diseaseRemarks,
          treatmentStartDate: d.treatmentStartDate || new Date().toISOString(),
          treatmentEndDate: d.treatmentEndDate || null,
        })),
        treatments: data.treatments.map((t) => ({
          medicationName: t.medicationName,
          dosage: t.dosage,
          frequency: t.frequency,
          durationDays: Number(t.durationDays),
          purpose: t.purpose,
        })),
        vetNotes: data.vetNotes,
      };

      console.log("Payload:", payload);

      await dispatch(addReport(payload)).unwrap();
      console.log("Report successfully submitted!");
      navigate("/vet/appointments");
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  const onCancel = () => {
    form.reset();
    navigate("/vet/appointments");
  };

  return (
    <div className="max-w-full mx-auto px-6 py-2 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create a Report</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Info */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="petName"
              control={control}
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Pet Name</FormLabel>
                  <FormControl>
                    <Input disabled value={pet?.petName || ""} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="ownerName"
              control={control}
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      value={`${pet?.user?.firstName || ""} ${
                        pet?.user?.lastName || ""
                      }`}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem className="gap-2">
              <FormLabel>Pet Type</FormLabel>
              <FormControl>
                <Input disabled value={pet?.petType || ""} />
              </FormControl>
            </FormItem>

            <FormItem className="gap-2">
              <FormLabel>Pet Breed</FormLabel>
              <FormControl>
                <Input disabled value={pet?.petBreed || ""} />
              </FormControl>
            </FormItem>

            <FormItem className="gap-2">
              <FormLabel>Pet Age</FormLabel>
              <FormControl>
                <Input
                  disabled
                  value={pet?.petAge ? `${pet.petAge} years` : ""}
                />
              </FormControl>
            </FormItem>

            <FormItem className="gap-2">
              <FormLabel>Pet Gender</FormLabel>
              <FormControl>
                <Input disabled value={pet?.petGender || ""} />
              </FormControl>
            </FormItem>
          </div>

          <hr className="mb-4 border-gray-300" />

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
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Symptoms and Recommendations */}
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Diseases and Treatments */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Diseases</h3>
              {diseaseFields.map((item, index) => (
                <div key={item.id} className="border p-4 rounded space-y-3">
                  <FormField
                    name={`diseases.${index}.diseaseName`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`diseases.${index}.diseaseRemarks`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease Remarks</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <div className="flex justify-between">
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

            {/* Treatments */}
            <div>
              <h3 className="text-lg font-semibold">Treatments</h3>
              {treatmentFields.map((item, index) => (
                <div key={item.id} className="border p-4 rounded space-y-3">
                  <FormField
                    name={`treatments.${index}.medicationName`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <div className="flex justify-between">
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

          {/* Vet Notes */}
          <div>
            <FormField
              name="vetNotes"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vet Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Final notes for report" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
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
