import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import image from "@/assets/images/124599.jpeg";
import sign from "@/assets/images/Ryan-Signature.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
  },
  section: {
    margin: 10,
    padding: 10,
  },
});

// Create Document Component

const ReportTemplate = ({ report }) => {
  const {
    reportId,
    vetNotes,
    temperature,
    heartRate,
    respiratoryRate,
    symptoms = [],
    recommendations = [],
    diseases = [],
    treatments = [],
    petProfile,
    user,
    vet,
  } = report || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              columnGap: "20px",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: "20px",
                alignItems: "center",
              }}
            >
              <Image
                src={petProfile?.petAvatar || image}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "100px",
                }}
              />
            </View>
            <View
              style={{
                justifySelf: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "800", fontSize: "28px" }}>
                    PetPulse
                  </Text>
                  <Text style={{ fontSize: "16px" }}>
                    Smart Care for Your Furry Fam.
                  </Text>
                </View>
                <View
                  style={{
                    justifySelf: "start",
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "2px",
                  }}
                >
                  <Text style={{ fontSize: "12px" }}>9800000000</Text>
                  <Text style={{ fontSize: "12px" }}>petpulse@gmail.com</Text>
                </View>
              </View>
              <View style={{ display: "flex", width: "80%", marginTop: "5px" }}>
                <Text style={{ fontSize: "12px" }}>
                  Teku, Kathmandu Metropolitan City, Kathmandu District, Bagmati
                  Province, Central Region, Nepal
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            width: "100%",
            height: "15px",
            backgroundColor: "#A63E4B",
            color: "white",
            fontSize: "11px",
            fontWeight: "500",
            textAlign: "right",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: "20px",
              width: "4px",
              backgroundColor: "white",
              transform: "rotate(145deg)",
              position: "absolute",
              right: "45%",
            }}
          />
          <View
            style={{
              height: "20px",
              width: "4px",
              backgroundColor: "white",
              transform: "rotate(145deg)",
              position: "absolute",
              right: "47%",
            }}
          />
          <View
            style={{
              height: "20px",
              width: "4px",
              backgroundColor: "white",
              transform: "rotate(145deg)",
              position: "absolute",
              right: "49%",
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "20px",
            marginHorizontal: 10,
            paddingHorizontal: 10,
            rowGap: "5px",
            marginTop: "20px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "5px",
              width: "33%",
              borderRight: "2px solid #D3D3D3",
            }}
          >
            <Text
              style={{ fontWeight: "700", fontSize: "20px", width: "100%" }}
            >
              {petProfile?.petName || "N/A"}
            </Text>
            <View style={{ fontSize: "10px", rowGap: "2px" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "20%" }}>Age:</Text>
                <Text style={{ width: "80%" }}>
                  {petProfile?.petAge || "N/A"} Years
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "20%" }}>Type:</Text>
                <Text style={{ width: "80%" }}>
                  {petProfile?.petType || "N/A"}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "20%" }}>Breed:</Text>
                <Text style={{ width: "80%" }}>
                  {petProfile?.petBreed || "N/A"}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "30%" }}>Gender:</Text>
                <Text style={{ width: "80%" }}>
                  {petProfile?.petGender || "N/A"}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "5px",
              width: "33%",
              borderRight: "2px solid #D3D3D3",
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: "20px" }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <View
              style={{
                fontSize: "10px",
                rowGap: "2px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "30%" }}>Email:</Text>
                <Text style={{ width: "70%" }}>{user.email}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "30%" }}>Number:</Text>
                <Text>{user.contactNumber}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "30%" }}>Username:</Text>
                <Text>{user.username}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "5px",
              width: "33%",
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: "10px" }}>
              Report ID:
            </Text>
            <Text style={{ fontSize: "10px" }}>{reportId}</Text>
            <View
              style={{
                fontSize: "10px",
                rowGap: "2px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "50%" }}>Temperature:</Text>
                <Text style={{ width: "50%" }}>{temperature}&deg; C</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "50%" }}>Heart Rate:</Text>
                <Text style={{ width: "50%" }}>{heartRate}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "2px",
                }}
              >
                <Text style={{ width: "50%" }}>Respiratory Rate:</Text>
                <Text>{respiratoryRate}</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            columnGap: "20px",
            marginHorizontal: 20,
            rowGap: "5px",
            marginTop: "20px",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: "16px",
              width: "100%",
              paddingBottom: "5px",
              borderBottom: "2px solid #A63E4B",
            }}
          >
            Symptoms
          </Text>
          <Text
            style={{
              fontSize: "12px",
              width: "100%",
              marginTop: "2px",
            }}
          >
            <Text>{symptoms.length ? symptoms.join(", ") : "N/A"}</Text>
          </Text>
          <Text
            style={{
              fontWeight: "700",
              fontSize: "16px",
              width: "100%",
              paddingBottom: "5px",
              borderBottom: "2px solid #A63E4B",
            }}
          >
            Recommendations
          </Text>
          <Text
            style={{
              fontSize: "12px",
              width: "100%",
              marginTop: "2px",
            }}
          >
            <Text>
              {recommendations.length ? recommendations.join(", ") : "N/A"}
            </Text>
          </Text>
        </View>
        {/* reuse this component for diseases */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginHorizontal: 20,
            marginTop: "20px",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: "16px",
              width: "100%",
              paddingBottom: "5px",
              borderBottom: "2px solid #A63E4B",
            }}
          >
            Treatment
          </Text>

          {treatments.length > 0 ? (
            treatments.map((treatment, idx) => (
              <View key={idx} style={{ marginBottom: 10, fontSize: 12 }}>
                <View
                  style={{
                    width: "50%",
                    fontWeight: "700",
                    padding: "5px",
                  }}
                >
                  <Text>Treatment {idx + 1}</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Medication</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{treatment.medicationName}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Dosage</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{treatment.dosage}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Frequency</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{treatment.frequency}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Duration</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{treatment.durationDays} days</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Purpose</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{treatment.purpose}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No treatments recorded.</Text>
          )}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginHorizontal: 20,
            marginTop: "20px",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: "16px",
              width: "100%",
              paddingBottom: "5px",
              borderBottom: "2px solid #A63E4B",
            }}
          >
            Disease
          </Text>

          {diseases.length > 0 ? (
            diseases.map((disease, idx) => (
              <View key={idx} style={{ marginBottom: 10, fontSize: 12 }}>
                <View
                  style={{
                    width: "50%",
                    fontWeight: "700",
                    padding: "5px",
                  }}
                >
                  <Text>Disease {idx + 1}</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Disease Name</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{disease.diseaseName}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Trial</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{disease.cureTrial}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Effect</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{disease.effectOfTrial}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Effectiveness</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{disease.effectiveness}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Remarks</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>{disease.diseaseRemarks}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>Start Date</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>
                      {new Date(
                        disease.treatmentStartDate
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      fontWeight: "700",
                      padding: "5px",
                    }}
                  >
                    <Text>End Date</Text>
                  </View>
                  <View
                    style={{
                      border: "1px solid gray",
                      width: "50%",
                      padding: "5px",
                    }}
                  >
                    <Text>
                      {disease.treatmentEndDate
                        ? new Date(
                            disease.treatmentEndDate
                          ).toLocaleDateString()
                        : "Ongoing"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No diseases recorded.</Text>
          )}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            columnGap: "20px",
            marginHorizontal: 20,
            rowGap: "5px",
            marginTop: "20px",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: "16px",
              width: "100%",
              paddingBottom: "5px",
              borderBottom: "2px solid #A63E4B",
            }}
          >
            Notes
          </Text>
          <Text
            style={{
              fontSize: "12px",
              width: "100%",
              marginTop: "2px",
            }}
          >
            {vetNotes || "N/A"}
          </Text>
        </View>
        <View
          style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              marginHorizontal: 20,
              fontSize: "12px",
              width: "50%",
            }}
          >
            {/* <Image src={sign} style={{ width: "50%" }} /> */}
            <View>
              <Text style={{ fontWeight: "600" }}>
                Dr. {vet?.user?.firstName} {vet?.user?.lastName}
              </Text>
              <Text>{vet?.specialization}</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              marginHorizontal: 20,
              fontSize: "12px",
              width: "50%",
            }}
          >
            {/* <Image src={sign} style={{ width: "50%" }} /> */}
            <View>
              <Text style={{ fontWeight: "600" }}>Mr. Aadesh Shrestha</Text>
              <Text>Petpulse Representative</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportTemplate;
