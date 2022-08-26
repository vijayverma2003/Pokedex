import Pokedex from "pokedex-promise-v2";
import PokeListItem from "./PokeListItem";
import React, { useEffect, useRef, useState } from "react";

function PokemonList(props) {
  const pokedex = new Pokedex();
  const [pokeList, setPokeList] = useState([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef();

  let offset = 0;

  const fetchData = async () => {
    try {
      const pokemons = await pokedex.getPokemonsList({
        limit: 21,
        offset,
      });

      setPokeList((prev) => [
        ...new Set([...prev, ...pokemons.results.map((p) => p.name)]),
      ]);

      offset += 21;
    } catch (error) {
      return;
    }
  };

  const handleScroll = (e) => {
    if (busy) return;
    setBusy(true);
    if (
      e.target.documentElement.scrollTop + window.innerHeight + 10 >=
      e.target.documentElement.scrollHeight
    )
      fetchData();

    setBusy(false);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    console.log(value);
    window.location = "/pokemon/" + value;
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="input--container input--search">
          <span className="input--icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.1459 14.2219C17.4772 12.4049 18.0735 10.1522 17.8155 7.91435C17.5574 5.67652 16.4641 3.61867 14.7541 2.15248C13.0442 0.68629 10.8437 -0.0801007 8.59306 0.0066338C6.34239 0.0933683 4.20746 1.02683 2.61538 2.62027C1.0233 4.21371 0.0915006 6.34961 0.00638874 8.60066C-0.0787231 10.8517 0.689134 13.0519 2.15634 14.761C3.62354 16.4702 5.68189 17.5622 7.91959 17.8187C10.1573 18.0752 12.4093 17.4772 14.2251 16.1444H14.2237C14.2649 16.1994 14.3089 16.2516 14.3584 16.3025L19.652 21.5968C19.9098 21.8548 20.2596 21.9999 20.6243 22C20.989 22.0001 21.3389 21.8553 21.5969 21.5975C21.8549 21.3396 21.9999 20.9899 22 20.6251C22.0001 20.2603 21.8554 19.9104 21.5975 19.6524L16.304 14.3581C16.2548 14.3083 16.202 14.2623 16.1459 14.2205V14.2219ZM16.5006 8.93587C16.5006 9.9291 16.305 10.9126 15.925 11.8302C15.5449 12.7478 14.9879 13.5816 14.2857 14.2839C13.5835 14.9862 12.7498 15.5433 11.8323 15.9234C10.9148 16.3035 9.93148 16.4992 8.9384 16.4992C7.94531 16.4992 6.96195 16.3035 6.04446 15.9234C5.12697 15.5433 4.29332 14.9862 3.5911 14.2839C2.88889 13.5816 2.33186 12.7478 1.95182 11.8302C1.57179 10.9126 1.37618 9.9291 1.37618 8.93587C1.37618 6.92997 2.17291 5.00622 3.5911 3.58783C5.0093 2.16944 6.93277 1.37259 8.9384 1.37259C10.944 1.37259 12.8675 2.16944 14.2857 3.58783C15.7039 5.00622 16.5006 6.92997 16.5006 8.93587V8.93587Z"
                fill="#767676"
              />
            </svg>
          </span>
          <input ref={inputRef} type="text" placeholder="Search Pokemon..." />
        </div>
      </form>
      <section className="pokegrid--container">
        <div className="pokegrid">
          {pokeList.map((pokemon) => (
            <PokeListItem key={pokemon} name={pokemon} />
          ))}
        </div>
      </section>
    </>
  );
}

export default PokemonList;
