import { useState, useEffect } from 'react';
import '../App.css';
import Header from './Header';

function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon');
        }
        return response.json();
      })
      .then(data => {
        const results = data.results;
        const pokemonData = [];

        results.forEach(item => {
          fetch(item.url)
            .then(res => res.json())
            .then(details => {
              pokemonData.push({
                id:details.id,
                name: details.name,
                image: details.sprites.front_default,
                types: details.types.map(t => t.type.name)
              });

              if (pokemonData.length === results.length) {
                const sortedData = pokemonData.sort((a, b) => a.id - b.id); // sort by id
                setPokemon(sortedData);
                setLoading(false);
              }
            })
            .catch(err => {
              setError('Error fetching Pokémon details');
              setLoading(false);
            });
        });
      })
      .catch(err => {
        setError('Error fetching Pokémon list');
        setLoading(false);
      });
  }, []);

  const filtered = pokemon.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (type === '' || p.types.includes(type))
  );

  if (loading) {
    return <h2>Loading Pokémon...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
        <Header />
      <div >
        <input
          placeholder="Search..."
          onChange={e => setSearch(e.target.value)}
        />
        <select onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">grass</option>
          <option value="poison">poison</option>
          <option value="steel">steel</option>
        </select>
      </div>

      <div>
        {filtered.length > 0 ? (
          filtered.map((p, i) => (
            <div key={i} className="pokemon">
              <img src={p.image} alt={p.name} />
              <p><strong>Name</strong>:{p.name}</p>
              <p><strong>Type's</strong>:{p.types.join(', ')}</p>
              <p><strong>id number</strong>: {p.id}</p>
            </div>
          ))
        ) : (
          <h2>No Pokémon found.</h2>
        )}
      </div>
    </div>
  );
}

export default Home;
