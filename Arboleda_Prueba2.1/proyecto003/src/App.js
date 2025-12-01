import { useFetch } from './hook/useFetch';
import { getCharacters } from './services/characterService';
import CharacterList from './components/characters/CharacterList';
import Loading from './components/characters/Loading';
import NavBar from './components/ui/NavBar';
import './styles/styles.css';

function App() {
  const { data: characters, loading, error } = useFetch(getCharacters);
  return (
    <>
      <NavBar />
      <div className="container">
        <h1> Personajes de Rick and Morty</h1>
        <p>Explora todos los personajes de la serie</p>
        {loading && <Loading />}
        {error && <p className="error">{error}</p>}
        {!loading && !error && <CharacterList characters={characters} />}
      </div>
    </>
  );
}

export default App;
