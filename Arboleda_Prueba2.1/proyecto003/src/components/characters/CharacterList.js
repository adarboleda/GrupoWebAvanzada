import CharacterCard from './CharacterCard';

function CharacterList({ characters }) {
  return (
    <div className="grid">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}

export default CharacterList;
