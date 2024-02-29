import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./app/header/page";
import LandingPage from "./app/landingPage/page";
import CaptureProcess from "./app/captureCriminal/page";
import Result from "./app/result/page";
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" exact Component={LandingPage} />
          <Route path="/captureCriminal" Component={CaptureProcess} />
          <Route path="/result" Component={Result} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
