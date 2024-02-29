import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import styles from "./page.module.css";
import { copsImages } from "../captureCriminal/page";

export default function Result() {
  const navigate = useNavigate();
  const { data } = useLocation().state;
  const [catching, setCatching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCatching(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getCopImage = () => {
    switch (data.cop) {
      case "Lieutenant Sam":
        return (
          <img src={copsImages[0]} alt="Cop" className={styles.copImage} />
        );
      case "Officer Swetha Iyer":
        return (
          <img src={copsImages[1]} alt="Cop" className={styles.copImage} />
        );
      case "Deputy Chief Lee Phuko":
        return (
          <img src={copsImages[2]} alt="Cop" className={styles.copImage} />
        );
      default:
        return null;
    }
  };

  const renderCaptureInfo = () => {
    const convertedCity = data.city.toLowerCase().replace(/\s/g, "");
    const convertedVehicle = data.vehicle.toLowerCase().replace(/\s/g, "");
    return (
      <>
        <h1 className={styles.mainHeader}>Criminal Captured</h1>
        <div className={styles.captureDetailsContainer}>
          <div className={styles.eachDetailContainer}>
            <h3 className={styles.eachDetailsHeader}>Captured by {data.cop}</h3>
            {getCopImage()}
          </div>
          <div className={styles.eachDetailContainer}>
            <h3 className={styles.eachDetailsHeader}>
              Captured in {data.city}
            </h3>
            <img
              src={`/assets/cities/${convertedCity}.png`}
              alt="City"
              className={styles.capturedCity}
            />
          </div>
          <div className={styles.eachDetailContainer}>
            <h3 className={styles.eachDetailsHeader}>
              Captured using {data.vehicle}
            </h3>
            <img
              src={`/assets/vehicles/${convertedVehicle}.png`}
              alt="Vehicle"
              className={styles.capturedVehicle}
            />
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {catching ? (
        <>
          <img
            src="/assets/thiefRunning.gif"
            alt="thief"
            className={styles.thiefRunning}
          />
          <h2 className={styles.missionText}>Chase in progress....</h2>
        </>
      ) : (
        <div className={styles.resultContainer}>
          {typeof data.result === "string" ? (
            <>
              <p className={styles.notFound}>{data.result}</p>
              <img
                src="/assets/crying.gif"
                className={styles.cryingGif}
                alt="crying"
              />
            </>
          ) : (
            renderCaptureInfo()
          )}
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            className={styles.restartButton}
          >
            Restart
          </Button>
        </div>
      )}
    </>
  );
}
