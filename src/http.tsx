export const getCharacter = async () => {
  const response = await fetch(
    "https://recruiting.verylongdomaintotestwith.ca/api/dsonic0912/character",
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch character, please try again later.");
  }

  return data.body;
};
