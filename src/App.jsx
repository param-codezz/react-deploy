import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../src/components/pages/layout/Layout";
import Home from "@/components/pages/home/Home";
import DivisibilityCheck from "@/components/pages/divisibilityCheck/DivisibilityCheck";
import PrimeNumber from "./components/pages/primeNumber/PrimeNumber";
import Factors from "./components/pages/factors/Factors";
import Playground from "./components/pages/playground/Playground";
import Arithmetic from "./components/pages/arithmetic/Arithmetic";
import Quiz from "./components/pages/quiz/Quiz";
import Sort from "./components/pages/sort/Sort";
import NumberNames from "./components/pages/numberNames/NumberNames";
import PlaceValue from "./components/pages/placeValue/PlaceValue";
import PrimeFactorizationTab from "./components/pages/primeFactorization/PrimeFactorization";
import HcfLcm from "./components/pages/hcf-lcm/HCF-LCM";
// import HCF from "./components/pages/hcf/HCF";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hcf-lcm" element={<HcfLcm />} />
            <Route path="divisibility" element={<DivisibilityCheck />} />
            <Route path="prime-number" element={<PrimeNumber />} />
            <Route path="factors" element={<Factors />} />
            <Route path="arithmetic" element={<Arithmetic />} />
            <Route path="sort" element={<Sort />} />
            <Route path="number-name" element={<NumberNames />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="playground" element={<Playground />} />
            <Route
              path="prime-factorization"
              element={<PrimeFactorizationTab />}
            />
            <Route path="place-value" element={<PlaceValue />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
