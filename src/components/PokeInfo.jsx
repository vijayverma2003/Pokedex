import React, { useEffect, useState, useCallback } from "react";
import Pokedex from "pokedex-promise-v2";
import { useParams } from "react-router-dom";
import { titleCase } from "../services/string";
import {
  getEvolutionIdFromSpecies,
  getEvolutions,
  getFlavorTextEntry,
  pokemonWeakness,
} from "../services/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function PokeInfo(props) {
  const params = useParams();
  const [pokemon, setPokemon] = useState({
    id: Number(params.id),
    name: "Pokémon",
    abilities: [{ ability: { name: "Ability" } }],
    types: [{ type: { name: "normal" } }],
    stats: [{ stat: { name: "" } }],
  });
  const [species, setSpecies] = useState({
    flavor_text_entries: [{ flavor_text: "" }],
  });
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [weakness, setWeakness] = useState([]);
  const [varieties, setVarieties] = useState([]);

  const fetchData = useCallback(async () => {
    const pokedex = new Pokedex();

    try {
      const pokemon = await pokedex.getPokemonByName(params.id);
      setPokemon(pokemon);

      const type1 = await pokedex.getTypeByName(pokemon.types[0].type.name);
      let type2;

      try {
        type2 = await pokedex.getTypeByName(pokemon.types[1].type.name);
      } catch (error) {}

      let weakness = pokemonWeakness(type1, type2);
      setWeakness(weakness);

      const species = await pokedex.getPokemonSpeciesByName(params.id);
      setSpecies(species);

      try {
        const { chain } = await pokedex.getEvolutionChainById(
          getEvolutionIdFromSpecies(species)
        );

        const evolutions = getEvolutions(chain);
        let evolutionChain = [];

        for (let evolution of evolutions) {
          let pokemon = await pokedex.getPokemonByName(evolution);
          evolutionChain.push({
            name: pokemon.name,
            image: pokemon.sprites.other["official-artwork"].front_default,
            types: pokemon.types,
          });
        }

        setEvolutionChain(evolutionChain);
      } catch (error) {
        console.log(error);
      }

      const varieties = [];
      for (let variety of species.varieties) {
        if (variety.pokemon.name !== pokemon.name) {
          const form = await pokedex.getPokemonByName(variety.pokemon.name);
          varieties.push(form);
        }
      }
      setVarieties(varieties);
    } catch (error) {
      console.log("Error getting Pokémon data...");
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleNext() {
    window.location =
      pokemon.id < 905
        ? `/pokemon/${pokemon.id + 1}`
        : `/pokemon/${pokemon.id}`;
  }

  function handlePrevious() {
    window.location =
      pokemon.id > 1 ? `/pokemon/${pokemon.id - 1}` : `/pokemon/${pokemon.id}`;
  }

  function handleNavigate(name) {
    window.location = `/pokemon/${name}`;
  }

  const options = {
    responsive: true,
    animations: {
      animation: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        font: {
          weight: "bold",
          size: 10,
        },
      },
    },
    scales: {
      xAxis: {
        ticks: {
          font: {
            size: 9,
            weight: 900,
          },
        },
        grid: {
          display: false,
        },
      },
      yAxis: {
        display: false,
        suggestedMax:
          pokemon.stats.reduce((a, b) => Math.max(a, b.base_stat), 0) + 20,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: ["HP", "Attack", "Defense", "Spl. Atk", "Spl. Def", "Speed"],
    datasets: [
      {
        label: "Stats",
        data: pokemon.stats.map((s) => s.base_stat),
        backgroundColor: "#FF1B1B9D",
      },
    ],
  };

  return (
    <>
      <section className="pokemon--info">
        <header className="pokemon--info--header">
          <button onClick={handlePrevious} className="btn--simple">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="25" fill="#404040" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M37.5 25C37.5 25.4144 37.3354 25.8118 37.0423 26.1048C36.7493 26.3979 36.3519 26.5625 35.9375 26.5625H17.8344L24.5437 33.2687C24.689 33.414 24.8042 33.5865 24.8829 33.7763C24.9615 33.9661 25.002 34.1695 25.002 34.375C25.002 34.5804 24.9615 34.7839 24.8829 34.9737C24.8042 35.1635 24.689 35.336 24.5437 35.4812C24.3985 35.6265 24.226 35.7418 24.0362 35.8204C23.8464 35.899 23.6429 35.9395 23.4375 35.9395C23.232 35.9395 23.0286 35.899 22.8388 35.8204C22.649 35.7418 22.4765 35.6265 22.3312 35.4812L12.9562 26.1062C12.8107 25.9611 12.6953 25.7887 12.6165 25.5988C12.5377 25.409 12.4972 25.2055 12.4972 25C12.4972 24.7945 12.5377 24.591 12.6165 24.4011C12.6953 24.2113 12.8107 24.0389 12.9562 23.8937L22.3312 14.5187C22.6246 14.2253 23.0226 14.0605 23.4375 14.0605C23.8524 14.0605 24.2503 14.2253 24.5437 14.5187C24.8371 14.8121 25.002 15.2101 25.002 15.625C25.002 16.0399 24.8371 16.4378 24.5437 16.7312L17.8344 23.4375H35.9375C36.3519 23.4375 36.7493 23.6021 37.0423 23.8951C37.3354 24.1882 37.5 24.5856 37.5 25Z"
                fill="#F6F2F2"
              />
            </svg>
          </button>
          <h3 className="pokemon--name">
            #{String(pokemon.id).padStart(3, 0)}
          </h3>
          <button onClick={handleNext} className="btn--simple">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="25" fill="#404040" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.5 25C12.5 24.5856 12.6646 24.1882 12.9576 23.8951C13.2507 23.6021 13.6481 23.4375 14.0625 23.4375H32.1656L25.4562 16.7312C25.1629 16.4378 24.998 16.0399 24.998 15.625C24.998 15.2101 25.1629 14.8121 25.4562 14.5187C25.7496 14.2253 26.1476 14.0605 26.5625 14.0605C26.9774 14.0605 27.3754 14.2253 27.6688 14.5187L37.0438 23.8937C37.1893 24.0389 37.3047 24.2113 37.3835 24.4011C37.4622 24.591 37.5028 24.7945 37.5028 25C37.5028 25.2055 37.4622 25.409 37.3835 25.5988C37.3047 25.7887 37.1893 25.9611 37.0438 26.1062L27.6688 35.4812C27.3754 35.7746 26.9774 35.9395 26.5625 35.9395C26.1476 35.9395 25.7496 35.7746 25.4562 35.4812C25.1629 35.1878 24.998 34.7899 24.998 34.375C24.998 33.9601 25.1629 33.5621 25.4562 33.2687L32.1656 26.5625H14.0625C13.6481 26.5625 13.2507 26.3979 12.9576 26.1048C12.6646 25.8118 12.5 25.4144 12.5 25Z"
                fill="#F6F2F2"
              />
            </svg>
          </button>
        </header>
        <div className="pokemon--info--body">
          <div className="pokemon--info--main">
            <img
              className="pokemon--info--image"
              src={pokemon.sprites?.other["official-artwork"].front_default}
              alt=""
            />
            <div>
              <h3
                className={
                  species.is_legendary || species.is_mythical ? "legendary" : ""
                }
              >
                {titleCase(pokemon.name)}
              </h3>
              <p>{getFlavorTextEntry(species)}</p>
              <h4 className="small--heading">Types</h4>
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
              <div>
                <h3 className="small--heading">Weakness</h3>
                <div className="weakness">
                  {weakness.map((type) => (
                    <span key={type} className={`type ${type}`}>
                      {titleCase(type)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="pokemon--extra--info">
            <div>
              <h3 className="small--heading">Physical</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Height</td>
                    <td>{pokemon.height}</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>{pokemon.weight}</td>
                  </tr>
                  <tr>
                    <td>Base Exp.</td>
                    <td>{pokemon.base_experience}</td>
                  </tr>
                  <tr>
                    <td>Abilities</td>
                    <td>
                      {pokemon?.abilities.map((a) => (
                        <span className="ability" key={a.ability.name}>
                          {titleCase(a?.ability.name)}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="small--heading">Stats</h3>
              <Bar height={200} options={options} data={data} />
            </div>
          </div>
        </div>
        <div>
          <h3 className="small--heading">Evolutions</h3>
          <div className="evolutions">
            {evolutionChain.map((e) => {
              return (
                <div
                  key={e.name}
                  onClick={() => handleNavigate(e.name)}
                  className="evolution"
                >
                  <img src={e.image} alt="" className="evolution--image" />
                  <p className="evolution--name">{titleCase(e.name)}</p>
                  <div className="evolution--type">
                    {e.types.map((t) => (
                      <span key={t.type.name} className={`type ${t.type.name}`}>
                        {titleCase(t.type.name)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {varieties.length > 0 && (
          <div>
            <h3 className="small--heading">Varieties</h3>
            <div className="evolutions">
              {varieties.map((v) => {
                return (
                  <div
                    key={v.name}
                    onClick={() => handleNavigate(v.id)}
                    className="evolution"
                  >
                    <img
                      src={v.sprites?.other["official-artwork"].front_default}
                      alt=""
                      className="evolution--image"
                    />
                    <p className="evolution--name">{titleCase(v.name)}</p>
                    <div className="evolution--type">
                      {v.types.map((t) => (
                        <span
                          key={t.type.name}
                          className={`type ${t.type.name}`}
                        >
                          {titleCase(t.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default PokeInfo;
