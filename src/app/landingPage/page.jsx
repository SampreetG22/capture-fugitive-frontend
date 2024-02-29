import styles from "./page.module.css";
import { Button } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { Link } from "react-router-dom";
export default function LandingPage() {
  const criminalInfo = {
    name: "Charles Robber aka Robby",
    age: 42,
    height: "1.79m",
    placeOfEscape: "United States Penitentiary, Leavenworth",
    charges: ["Aggravated Assault/Battery", "Bank Larceny"],
    lastSeenAt: "Kansas, USA",
    weaponsPossessing: "Glock M17",
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className={styles.landingContainer}>
      <h1 className={styles.mainHeading}>FUGITIVE ON LOOSE</h1>
      <div className={styles.criminalContainer}>
        <img
          src="/assets/people/criminal.png"
          alt="criminal"
          className={styles.criminalImage}
        />
        <div className={styles.criminalInfo}>
          {Object.keys(criminalInfo).map((key, index) => (
            <p key={index} className={styles.info}>
              <span className={styles.selectedTitle}>
                {capitalizeFirstLetter(
                  key
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .toLowerCase()
                )}
                :
              </span>
              &nbsp;
              {Array.isArray(criminalInfo[key])
                ? criminalInfo[key].join(", ")
                : criminalInfo[key]}
            </p>
          ))}
        </div>
      </div>

      <Link to="/captureCriminal" className={styles.linkElement}>
        <Button
          variant="contained"
          color="success"
          className={styles.catchButton}
          endIcon={<EastIcon className={styles.arrowIcon} />}
        >
          Capture Him
        </Button>
      </Link>
    </div>
  );
}
