import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  addReport,
  clearSingleReport,
  fetchSingleReport,
  getSingleReport,
  updateReport,
} from "@/redux/slices/reportSlice";
import { fetchSinglePet, getSinglePet } from "@/redux/slices/petSlice";
import { getSingleAppointment } from "@/redux/slices/appointmentSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdateReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const pet = useSelector(getSinglePet);
  const currentAppointment = useSelector(getSingleAppointment);
  const currentReport = useSelector(getSingleReport);

  console.log(id, "id");

  console.log(currentReport, "currentReport");

  useEffect(() => {
    dispatch(fetchSingleReport(id));
  }, [dispatch, id]);

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
    if (currentReport) {
      form.reset({
        petName: currentReport.petProfile?.petName || "",
        ownerName: `${currentReport.user?.firstName || ""} ${
          currentReport.user?.lastName || ""
        }`,
        temperature: currentReport.temperature || "",
        heartRate: currentReport.heartRate || "",
        respiratoryRate: currentReport.respiratoryRate || "",
        symptoms: [currentReport.symptoms?.join(", ") || ""],
        recommendations: [currentReport.recommendations?.join(", ") || ""],
        diseases:
          currentReport.diseases?.map((d) => ({
            diseaseName: d.diseaseName || "",
            cureTrial: d.cureTrial || "",
            effectOfTrial: d.effectOfTrial || "",
            effectiveness: d.effectiveness || "mid",
            diseaseRemarks: d.diseaseRemarks || "",
            treatmentStartDate: d.treatmentStartDate
              ? new Date(d.treatmentStartDate).toISOString().split("T")[0]
              : "",
            treatmentEndDate: d.treatmentEndDate
              ? new Date(d.treatmentEndDate).toISOString().split("T")[0]
              : "",
          })) || [],
        treatments:
          currentReport.treatments?.map((t) => ({
            medicationName: t.medicationName || "",
            dosage: t.dosage || "",
            frequency: t.frequency || "",
            durationDays: t.durationDays || "",
            purpose: t.purpose || "",
          })) || [],
        vetNotes: currentReport.vetNotes || "",
      });
    }
  }, [currentReport, form]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        appointmentId: currentReport?.appointmentId,
        userId: currentReport?.userId,
        petProfileId: currentReport?.petProfileId,
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

      await dispatch(updateReport({ id, payload })).unwrap();

      // form.reset();
      // dispatch(clearSingleReport());

      // navigate("/vet/reports");
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  const onCancel = () => {
    form.reset();
    dispatch(clearSingleReport());
    navigate("/vet/reports");
  };

  return (
    <div className="max-w-full mx-auto px-6 py-2 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Update Report</h2>
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
                    <Input
                      disabled
                      value={currentReport?.petProfile?.petName || ""}
                      {...field}
                    />
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
                      value={`${currentReport?.user?.firstName || ""} ${
                        currentReport?.user?.lastName || ""
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
                <Input
                  disabled
                  value={currentReport?.petProfile?.petType || ""}
                />
              </FormControl>
            </FormItem>

            <FormItem className="gap-2">
              <FormLabel>Pet Breed</FormLabel>
              <FormControl>
                <Input
                  disabled
                  value={currentReport?.petProfile?.petBreed || ""}
                />
              </FormControl>
            </FormItem>

            <FormItem className="gap-2">
              <FormLabel>Pet Age</FormLabel>
              <FormControl>
                <Input
                  disabled
                  value={
                    currentReport?.petProfile?.petAge
                      ? `${currentReport.petProfile.petAge} years`
                      : ""
                  }
                />
              </FormControl>
            </FormItem>

            <FormItem className="gap-2">
              <FormLabel>Pet Gender</FormLabel>
              <FormControl>
                <Input
                  disabled
                  value={currentReport?.petProfile?.petGender || ""}
                />
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
                <FormItem className="gap-2">
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
                <FormItem className="gap-2">
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
                <FormItem className="gap-2">
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
                <FormItem className="gap-2">
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
                <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                    name={`diseases.${index}.diseaseRemarks`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="gap-2">
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
                        <FormItem className="gap-2">
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
                        <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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
                      <FormItem className="gap-2">
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

          {/* Final Vet Notes*/}
          <div className="grid gap-4">
            <FormField
              name="vetNotes"
              control={control}
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Vet Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Final notes for report"
                      className={`h-30`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              className="bg-primary text-white"
              onClick={() => {
                onCancel();
              }}
            >
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

export default UpdateReport;
