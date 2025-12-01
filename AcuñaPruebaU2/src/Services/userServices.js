const API_URL = 'https://dummyjson.com/users';

export async function getUsers() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Error al cargar los usuarios');
    }
    const data = await response.json();
    return data.users;
}