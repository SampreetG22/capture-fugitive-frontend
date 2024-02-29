import styles from "./CityAndVehicle.module.css";
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CityAndVehicle(props) {
  const { selectedCOP, open, setSelectionOn, setSnackbarData } = props;
  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [citiesData, setCitiesData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [copAssignments, setCopAssignments] = useState([]);
  useEffect(() => {
    if (open) {
      getCitiesAndVehicles();
    }
  }, []);

  const getCitiesAndVehicles = () => {
    axios({
      method: "GET",
      url: "http://localhost:5001/getCitiesAndVehicles",
    })
      .then((response) => {
        setCitiesData(response.data.cities);
        setVehiclesData(response.data.vehicles);
        setCopAssignments(response.data.copAssignments);
        const copAssignment = response.data.copAssignments.find(
          (assign) => assign.name === selectedCOP.name
        );
        setCity(copAssignment.city);
        setVehicle(copAssignment.vehicle);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarData({
          show: true,
          color: "error",
          message: error.message,
        });
      });
  };
  const assignCityAndVehicle = () => {
    if (city !== "" && vehicle !== "") {
      axios({
        method: "POST",
        url: "http://localhost:5001/addCityAndVehicle",
        data: {
          name: selectedCOP.name,
          city: city,
          vehicle: vehicle,
        },
      })
        .then((response) => {
          setSelectionOn(false);
          setSnackbarData({
            show: true,
            color: "success",
            message: `Assigned City and Vehicle to ${selectedCOP.name}`,
          });
        })
        .catch((error) => {
          console.error(error);
          setSnackbarData({
            show: true,
            color: "error",
            message: error.message,
          });
        });
    } else {
      alert(city === "" ? "Please choose a city" : "Please choose a vehicle");
    }
  };
  const cityIsAssigned = (cityName) => {
    return copAssignments.some((each) => each.city === cityName);
  };
  const checkVehicleAvailability = (vehicle) => {
    if (city !== "") {
      const cityObject = citiesData.find((each) => each.name === city);
      if (vehicle.count > 0 && vehicle.range >= cityObject.distance * 2) {
        return false;
      }
      return true;
    }
  };
  return (
    <Dialog open={open} fullScreen>
      <DialogContent className={styles.dialogCard}>
        <h1 className={styles.backgroundHeader}>CONFIDENTIAL</h1>
        <h2 className={styles.dialogHeader}>
          Assignment for "{selectedCOP.name}"
        </h2>
        <div className={styles.selectedCOPContainer}>
          <div className={styles.imageAndNameContainer}>
            <img
              src={selectedCOP.image}
              alt={selectedCOP.name}
              className={styles.image}
            />
          </div>
          <div className={styles.selectElementsContainer}>
            <FormControl fullWidth>
              <InputLabel
                id="vehicle"
                sx={{
                  fontSize: "1.1vw",
                  color: "rgb(25, 118, 210)",
                }}
              >
                Select City
              </InputLabel>
              <Select
                labelId="vehicle"
                id="demo-simple-select"
                value={city}
                label="Select City"
                onChange={(event) => {
                  setCity(event.target.value);
                  setVehicle("");
                }}
                className={styles.selectElement}
              >
                {citiesData.map((city, i) => (
                  <MenuItem
                    key={i}
                    value={city.name}
                    disabled={cityIsAssigned(city.name)}
                  >
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                id="vehicle"
                sx={{ fontSize: "1.1vw", color: "rgb(25, 118, 210)" }}
              >
                Select Vehicle
              </InputLabel>
              <Select
                labelId="vehicle"
                id="demo-simple-select"
                value={vehicle}
                label="Select Vehicle"
                onChange={(event) => setVehicle(event.target.value)}
                className={styles.selectElement}
                size="medium"
                disabled={city === ""}
              >
                {vehiclesData.map((vehicle, i) => (
                  <MenuItem
                    key={i}
                    value={vehicle.name}
                    disabled={checkVehicleAvailability(vehicle)}
                  >
                    {vehicle.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <Button
            variant="contained"
            color="primary"
            className={styles.assignButton}
            onClick={assignCityAndVehicle}
          >
            Assign
          </Button>
          <Button
            variant="contained"
            color="error"
            className={styles.assignButton}
            onClick={() => setSelectionOn(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
