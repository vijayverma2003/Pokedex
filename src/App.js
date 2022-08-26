import "./styles/styles.css";
import Navbar from "./components/Navbar";
import PokemonList from "./components/PokemonList";
import PokeInfo from "./components/PokeInfo";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";

function App() {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/pokemon/:id" element={<PokeInfo />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/" element={<PokemonList />} />
      </Routes>
    </main>
  );
}

export default App;
