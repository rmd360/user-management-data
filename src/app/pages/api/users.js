// This file will serve as the API proxy, simplifying the client-side requests.
export async function handler(req, res) {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    res.status(200).json(data);
  }
  