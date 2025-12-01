import '../../styles/styles.css';

function CharacterCard({ character }) {
  return (
    <div className="card">
      <img src={character.image} alt={character.name} />

      <h2>{character.name}</h2>

      <p>
        <strong>Estado:</strong> {character.status}
      </p>
      <p>
        <strong>Especie:</strong> {character.species}
      </p>
      <p>
        <strong>Género:</strong> {character.gender}
      </p>
    </div>
  );
}

export default CharacterCard;
