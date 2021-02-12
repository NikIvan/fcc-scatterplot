export async function getData(url) {
  let data = null;

  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (e) {
    console.error(e);
  }

  return data;
}
