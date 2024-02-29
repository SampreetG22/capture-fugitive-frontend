import styles from "./page.module.css";
import {
  Button,
  LinearProgress,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CityAndVehicle from "../../components/CityAndVehicle/CityAndVehicle";
import axios from "axios";
export const copsImages = [
  "/assets/people/COP1.png",
  "/assets/people/COP2.png",
  "/assets/people/COP3.png",
];

export default function CaptureProcess() {
  const navigate = useNavigate();

  const [selectionOn, setSelectionOn] = useState(false);
  const [selectedCOP, setSelectedCOP] = useState({});
  const [missionData, setMissionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copsSearching, setCopsSearching] = useState(true);
  const [snackBarData, setSnackbarData] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopsSearching(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => getMissionData(), [selectionOn]);

  const selectCOP = (COP, i) => {
    const object = { ...COP, image: copsImages[i] };
    setSelectedCOP(object);
    setSelectionOn(true);
  };
  const getMissionData = () => {
    setLoading(true);
    axios({
      method: "GET",
      url: "http://localhost:5001/getCitiesAndVehicles",
    })
      .then((response) => {
        setMissionData(response.data.copAssignments);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setSnackbarData({ show: true, color: "error", message: error.message });
      });
  };
  const startCapturing = () => {
    const allAssigned = missionData.every((cop) => cop.city && cop.vehicle);
    if (!allAssigned) {
      setSnackbarData({
        show: true,
        color: "warning",
        message: "Please assign a vehicle and a city for all cops.",
      });
      return;
    } else {
      setLoading(true);
      axios({
        method: "POST",
        url: "http://localhost:5001/catchFugitive",
        data: missionData,
      })
        .then((response) => {
          setLoading(false);
          setSnackbarData({
            show: true,
            color: "success",
            message: "Mission Started",
          });
          navigate("/result", { state: { data: response.data } });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setSnackbarData({
            show: true,
            color: "error",
            message: error.message,
          });
        });
    }
  };

  return (
    <>
      {copsSearching ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="warning" />
          <p className={styles.officersSearch}>
            Searching for available officers
          </p>
        </Box>
      ) : (
        <>
          <h1 className={styles.assignHeading}>Officers at service</h1>
          {loading ? (
            <CircularProgress size={80} thickness={4} />
          ) : (
            <>
              <div className={styles.captureProcessContainer}>
                {missionData.map((each, i) => {
                  return (
                    <div className={styles.contentAndTickContainer}>
                      <div
                        key={i}
                        className={styles.copSelectionContainer}
                        onClick={() => selectCOP(each, i)}
                      >
                        <img
                          src={copsImages[i]}
                          alt="copImage"
                          className={styles.copImage}
                        />
                        <div className={styles.assignmentsContainer}>
                          <p className={styles.nameCSS}>{each.name}</p>
                          {missionData.length > 0 && (
                            <>
                              <p className={styles.assignments}>
                                <span className={styles.selectedTitle}>
                                  Assigned City:
                                </span>{" "}
                                {missionData[i].city || "---"}
                              </p>
                              <p className={styles.assignments}>
                                <span className={styles.selectedTitle}>
                                  Assigned Vehicle:
                                </span>{" "}
                                {missionData[i].vehicle || "---"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {each.city && each.vehicle ? (
                        <CheckCircleIcon
                          className={styles.assignmentTick}
                          color="info"
                        />
                      ) : (
                        <CheckCircleIcon
                          className={styles.assignmentTick}
                          color="error"
                        />
                      )}
                    </div>
                  );
                })}
                <Button
                  className={styles.captureButton}
                  variant="contained"
                  onClick={startCapturing}
                  disabled={false}
                >
                  Capture
                </Button>
              </div>
              <CityAndVehicle
                selectedCOP={selectedCOP}
                open={selectionOn}
                setSelectionOn={setSelectionOn}
                setSnackbarData={setSnackbarData}
              />
              <Snackbar
                open={snackBarData.show}
                autoHideDuration={3000}
                onClose={() => setSnackbarData({ show: false })}
              >
                <Alert severity={snackBarData.color} sx={{ width: "100%" }}>
                  {snackBarData.message}
                </Alert>
              </Snackbar>
            </>
          )}
        </>
      )}
    </>
  );
}
