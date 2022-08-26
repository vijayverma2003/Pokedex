import React, { useEffect, useState } from "react";
import Pokedex from "pokedex-promise-v2";
import { titleCase } from "../services/string";
import { Link } from "react-router-dom";
import { getFlavorTextEntry } from "../services/utils";

function PokeListItem({ name }) {
  const pokedex = new Pokedex();

  const [pokemon, setPokemon] = useState({
    name: "Pokémon",
    types: [{ type: { name: "normal" } }],
  });
  const [species, setSpecies] = useState({
    flavor_text_entries: [{ flavor_text: "" }],
  });

  const fetchData = async () => {
    try {
      const pokemon = await pokedex.getPokemonByName(name);
      setPokemon(pokemon);
      const species = await pokedex.getPokemonSpeciesByName(name);
      setSpecies(species);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Link to={`/pokemon/${pokemon.id}`}>
      {pokemon && species && (
        <div
          className={`pokemon--container bg--${pokemon?.types[0].type.name}`}
        >
          <h3 className="pokemon--id">
            {String(pokemon.id).padStart(3, 0) || "#"}
          </h3>
          <div className="pokemon--image--container">
            <img
              className="pokemon--image"
              src={pokemon.sprites?.other["official-artwork"].front_default}
              alt=""
            />
          </div>
          <div className="pokemon--details">
            <header className="pokemon--details--header">
              <h3 className="pokemon--heading">{titleCase(pokemon.name)}</h3>
              <div>
                {pokemon?.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`type ${type.type?.name}`}
                  >
                    {titleCase(type.type.name)}
                  </span>
                ))}
              </div>
            </header>
            <div className="pokemon--details--body">
              <p className="pokemon--description">
                {getFlavorTextEntry(species)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}

export default PokeListItem;
